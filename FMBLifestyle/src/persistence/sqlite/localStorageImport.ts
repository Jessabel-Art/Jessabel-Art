import type Database from '@tauri-apps/plugin-sql';
import type {
  Account,
  AppSettings,
  BudgetCategory,
  Debt,
  DebtPayoffPlan,
  Envelope,
  NetWorthAsset,
  NetWorthLiability,
  NetWorthSnapshot,
  SavingsBucket,
  Transaction,
} from '../../types';
import { isValidMoneyAmount, normalizeMoneyAmount } from '../../domain/money';
import { createLocalStorageBackup, type LocalStorageBackup } from './localStorageBackup';
import { getSqliteDatabase } from './db';
import { optionalText, toBasisPoints, toSqliteCents } from './mappers';
import { withSqliteTransaction } from './transaction';
import {
  type ImportVerificationSummary,
  type NormalizedLocalStorageImportData,
  summarizeLocalStorageImportData,
  verifyLocalStorageImport,
} from './importVerification';

const IMPORT_METADATA_KEY = 'localStorageImport';
const SETTINGS_ID = 'default';
const DEFAULT_SETTINGS: AppSettings = {
  userName: 'Jessa',
  currency: 'USD',
  currencySymbol: '$',
};

const LOCAL_STORAGE_KEYS = {
  settings: 'pfa_settings',
  accounts: 'pfa_accounts',
  envelopes: 'pfa_envelopes',
  budgets: 'pfa_budgets',
  savingsBuckets: 'pfa_buckets',
  debts: 'pfa_debts',
  transactions: 'pfa_transactions',
  debtPayoffPlans: 'pfa_debt_plans',
  netWorthAssets: 'pfa_assets',
  netWorthLiabilities: 'pfa_liabilities',
  netWorthSnapshots: 'pfa_nw_snapshots',
} as const;

const DOMAIN_TABLES = [
  'settings',
  'accounts',
  'envelopes',
  'budget_categories',
  'savings_buckets',
  'debts',
  'transactions',
  'debt_payoff_plans',
  'net_worth_assets',
  'net_worth_liabilities',
  'net_worth_snapshots',
] as const;

const ACCOUNT_TYPES = new Set(['checking', 'savings', 'investment', 'cash', 'credit', '401k', 'other']);
const TRANSACTION_TYPES = new Set(['income', 'expense']);
const PAYOFF_METHODS = new Set(['snowball', 'avalanche']);
const ASSET_TYPES = new Set([
  'cash',
  'checking',
  'savings',
  'investment',
  '401k',
  'real_estate',
  'vehicle',
  'business',
  'other_asset',
]);
const LIABILITY_TYPES = new Set([
  'credit_card',
  'loan',
  'auto_loan',
  'mortgage',
  'personal_loan',
  'collections',
  'other_debt',
]);

export interface LocalStorageImportWarning {
  code: string;
  message: string;
  key: string;
  id?: string;
}

export interface LocalStorageImportOptions {
  dryRun?: boolean;
}

export interface LocalStorageImportReport {
  dryRun: boolean;
  status: 'validated' | 'completed' | 'failed';
  backup: LocalStorageBackup;
  backupChecksum: string;
  warnings: LocalStorageImportWarning[];
  errors: string[];
  counts: ImportVerificationSummary['recordCounts'];
  totals: ImportVerificationSummary['totals'] | null;
  verification: ImportVerificationSummary | null;
  metadata: {
    key: typeof IMPORT_METADATA_KEY;
    completedAt: string;
    backupChecksum: string;
  } | null;
}

export class LocalStorageImportError extends Error {
  backup?: LocalStorageBackup;
  warnings: LocalStorageImportWarning[];
  cause?: unknown;

  constructor(message: string, options: {
    backup?: LocalStorageBackup;
    warnings?: LocalStorageImportWarning[];
    cause?: unknown;
  } = {}) {
    super(message);
    this.name = 'LocalStorageImportError';
    this.backup = options.backup;
    this.warnings = options.warnings ?? [];
    this.cause = options.cause;
  }
}

interface CountRow {
  count: number;
}

interface MetadataRow {
  value: string;
}

function getLocalStorage(): Storage {
  if (typeof localStorage === 'undefined') {
    throw new Error('localStorage is not available in this environment.');
  }

  return localStorage;
}

function readJson<T>(key: string, fallback: T): T {
  const raw = getLocalStorage().getItem(key);
  if (raw === null) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    throw new Error(`${key} contains invalid JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function asArray<T>(key: string, value: T[]): T[] {
  if (!Array.isArray(value)) throw new Error(`${key} must contain an array.`);
  return value;
}

function requiredString(value: unknown, label: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} is required.`);
  return value.trim();
}

function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function requiredMoney(value: unknown, label: string, options: { allowNegative?: boolean } = {}): number {
  if (typeof value !== 'number' || !isValidMoneyAmount(value, options)) {
    throw new Error(`${label} must be a valid${options.allowNegative ? '' : ' non-negative'} amount.`);
  }

  return normalizeMoneyAmount(value);
}

function optionalMoney(value: unknown, fallback: number, label: string, options: { allowNegative?: boolean } = {}): number {
  if (value === undefined || value === null) return fallback;
  return requiredMoney(value, label, options);
}

function requireEnum<T extends string>(value: unknown, allowed: Set<string>, label: string): T {
  if (typeof value !== 'string' || !allowed.has(value)) throw new Error(`${label} is invalid.`);
  return value as T;
}

function requireNoDuplicateIds(key: string, records: { id: string }[]): void {
  const seen = new Set<string>();

  for (const record of records) {
    if (seen.has(record.id)) throw new Error(`${key} contains duplicate id "${record.id}".`);
    seen.add(record.id);
  }
}

function requireNoDuplicateSnapshotMonths(snapshots: NetWorthSnapshot[]): void {
  const seen = new Set<string>();

  for (const snapshot of snapshots) {
    if (seen.has(snapshot.month)) throw new Error(`${LOCAL_STORAGE_KEYS.netWorthSnapshots} contains duplicate month "${snapshot.month}".`);
    seen.add(snapshot.month);
  }
}

function warnMissingLink(
  warnings: LocalStorageImportWarning[],
  key: string,
  id: string,
  fieldName: string,
  linkedId: string,
): void {
  warnings.push({
    code: 'missing_optional_link',
    key,
    id,
    message: `${key} record "${id}" references missing ${fieldName} "${linkedId}". The link will be imported as null.`,
  });
}

function normalizeSettings(): AppSettings {
  const value = readJson<Partial<AppSettings>>(LOCAL_STORAGE_KEYS.settings, DEFAULT_SETTINGS);

  return {
    userName: typeof value.userName === 'string' ? value.userName.trim() : '',
    currency: typeof value.currency === 'string' && value.currency.trim() ? value.currency.trim() : 'USD',
    currencySymbol: typeof value.currencySymbol === 'string' && value.currencySymbol.trim() ? value.currencySymbol.trim() : '$',
  };
}

function normalizeAccounts(): Account[] {
  const records = asArray(LOCAL_STORAGE_KEYS.accounts, readJson<Partial<Account>[]>(LOCAL_STORAGE_KEYS.accounts, []));
  const accounts = records.map((record, index): Account => {
    const id = requiredString(record.id, `${LOCAL_STORAGE_KEYS.accounts}[${index}].id`);
    const balance = requiredMoney(record.balance, `${LOCAL_STORAGE_KEYS.accounts}[${index}].balance`, { allowNegative: true });

    return {
      id,
      name: requiredString(record.name, `${LOCAL_STORAGE_KEYS.accounts}[${index}].name`),
      type: requireEnum<Account['type']>(record.type, ACCOUNT_TYPES, `${LOCAL_STORAGE_KEYS.accounts}[${index}].type`),
      balance,
      openingBalance: optionalMoney(record.openingBalance, balance, `${LOCAL_STORAGE_KEYS.accounts}[${index}].openingBalance`, { allowNegative: true }),
      color: optionalString(record.color),
      institution: optionalString(record.institution),
      notes: optionalString(record.notes),
      updatedAt: optionalString(record.updatedAt),
      archivedAt: optionalString(record.archivedAt),
    };
  });

  requireNoDuplicateIds(LOCAL_STORAGE_KEYS.accounts, accounts);
  return accounts;
}

function normalizeEnvelopes(accountIds: Set<string>, warnings: LocalStorageImportWarning[]): Envelope[] {
  const records = asArray(LOCAL_STORAGE_KEYS.envelopes, readJson<Partial<Envelope>[]>(LOCAL_STORAGE_KEYS.envelopes, []));
  const envelopes = records.map((record, index): Envelope => {
    const id = requiredString(record.id, `${LOCAL_STORAGE_KEYS.envelopes}[${index}].id`);
    let fromAccountId = optionalString(record.fromAccountId);
    if (fromAccountId && !accountIds.has(fromAccountId)) {
      warnMissingLink(warnings, LOCAL_STORAGE_KEYS.envelopes, id, 'accountId', fromAccountId);
      fromAccountId = undefined;
    }

    return {
      id,
      name: requiredString(record.name, `${LOCAL_STORAGE_KEYS.envelopes}[${index}].name`),
      category: optionalString(record.category),
      allocated: requiredMoney(record.allocated, `${LOCAL_STORAGE_KEYS.envelopes}[${index}].allocated`),
      spent: requiredMoney(record.spent, `${LOCAL_STORAGE_KEYS.envelopes}[${index}].spent`),
      month: requiredString(record.month, `${LOCAL_STORAGE_KEYS.envelopes}[${index}].month`),
      color: optionalString(record.color),
      fromAccountId,
    };
  });

  requireNoDuplicateIds(LOCAL_STORAGE_KEYS.envelopes, envelopes);
  return envelopes;
}

function normalizeBudgets(): BudgetCategory[] {
  const records = asArray(LOCAL_STORAGE_KEYS.budgets, readJson<Partial<BudgetCategory>[]>(LOCAL_STORAGE_KEYS.budgets, []));
  const budgets = records.map((record, index): BudgetCategory => ({
    id: requiredString(record.id, `${LOCAL_STORAGE_KEYS.budgets}[${index}].id`),
    category: requiredString(record.category, `${LOCAL_STORAGE_KEYS.budgets}[${index}].category`),
    budgeted: requiredMoney(record.budgeted, `${LOCAL_STORAGE_KEYS.budgets}[${index}].budgeted`),
    spent: requiredMoney(record.spent, `${LOCAL_STORAGE_KEYS.budgets}[${index}].spent`),
    month: requiredString(record.month, `${LOCAL_STORAGE_KEYS.budgets}[${index}].month`),
    color: requiredString(record.color, `${LOCAL_STORAGE_KEYS.budgets}[${index}].color`),
  }));

  requireNoDuplicateIds(LOCAL_STORAGE_KEYS.budgets, budgets);
  return budgets;
}

function normalizeSavingsBuckets(accountIds: Set<string>, warnings: LocalStorageImportWarning[]): SavingsBucket[] {
  const records = asArray(LOCAL_STORAGE_KEYS.savingsBuckets, readJson<Partial<SavingsBucket>[]>(LOCAL_STORAGE_KEYS.savingsBuckets, []));
  const buckets = records.map((record, index): SavingsBucket => {
    const id = requiredString(record.id, `${LOCAL_STORAGE_KEYS.savingsBuckets}[${index}].id`);
    let accountId = optionalString(record.accountId);
    if (accountId && !accountIds.has(accountId)) {
      warnMissingLink(warnings, LOCAL_STORAGE_KEYS.savingsBuckets, id, 'accountId', accountId);
      accountId = undefined;
    }

    return {
      id,
      name: requiredString(record.name, `${LOCAL_STORAGE_KEYS.savingsBuckets}[${index}].name`),
      goalAmount: requiredMoney(record.goalAmount, `${LOCAL_STORAGE_KEYS.savingsBuckets}[${index}].goalAmount`),
      allocatedAmount: requiredMoney(record.allocatedAmount, `${LOCAL_STORAGE_KEYS.savingsBuckets}[${index}].allocatedAmount`),
      targetDate: optionalString(record.targetDate),
      accountId,
      color: optionalString(record.color) ?? '#0A2A66',
      notes: optionalString(record.notes),
    };
  });

  requireNoDuplicateIds(LOCAL_STORAGE_KEYS.savingsBuckets, buckets);
  return buckets;
}

function normalizeDebts(accountIds: Set<string>, warnings: LocalStorageImportWarning[]): Debt[] {
  const records = asArray(LOCAL_STORAGE_KEYS.debts, readJson<Partial<Debt>[]>(LOCAL_STORAGE_KEYS.debts, []));
  const debts = records.map((record, index): Debt => {
    const id = requiredString(record.id, `${LOCAL_STORAGE_KEYS.debts}[${index}].id`);
    const dueDate = record.dueDate;
    let accountId = optionalString(record.accountId);
    if (accountId && !accountIds.has(accountId)) {
      warnMissingLink(warnings, LOCAL_STORAGE_KEYS.debts, id, 'accountId', accountId);
      accountId = undefined;
    }
    if (typeof record.interestRate !== 'number' || !Number.isFinite(record.interestRate) || record.interestRate < 0) {
      throw new Error(`${LOCAL_STORAGE_KEYS.debts}[${index}].interestRate must be non-negative.`);
    }
    if (!Number.isInteger(dueDate) || dueDate === undefined || dueDate < 1 || dueDate > 31) {
      throw new Error(`${LOCAL_STORAGE_KEYS.debts}[${index}].dueDate must be 1-31.`);
    }

    return {
      id,
      name: requiredString(record.name, `${LOCAL_STORAGE_KEYS.debts}[${index}].name`),
      balance: requiredMoney(record.balance, `${LOCAL_STORAGE_KEYS.debts}[${index}].balance`),
      originalBalance: requiredMoney(record.originalBalance, `${LOCAL_STORAGE_KEYS.debts}[${index}].originalBalance`),
      interestRate: record.interestRate,
      minimumPayment: requiredMoney(record.minimumPayment, `${LOCAL_STORAGE_KEYS.debts}[${index}].minimumPayment`),
      dueDate,
      color: optionalString(record.color) ?? '#0A2A66',
      accountId,
      notes: optionalString(record.notes),
    };
  });

  requireNoDuplicateIds(LOCAL_STORAGE_KEYS.debts, debts);
  return debts;
}

function normalizeTransactions(
  accountIds: Set<string>,
  envelopeIds: Set<string>,
  warnings: LocalStorageImportWarning[],
): Transaction[] {
  const records = asArray(LOCAL_STORAGE_KEYS.transactions, readJson<Partial<Transaction>[]>(LOCAL_STORAGE_KEYS.transactions, []));
  const transactions = records.map((record, index): Transaction => {
    const id = requiredString(record.id, `${LOCAL_STORAGE_KEYS.transactions}[${index}].id`);
    const type = requireEnum<Transaction['type']>(record.type, TRANSACTION_TYPES, `${LOCAL_STORAGE_KEYS.transactions}[${index}].type`);
    let accountId = optionalString(record.accountId);
    let envelopeId = type === 'expense' ? optionalString(record.envelopeId) : undefined;

    if (accountId && !accountIds.has(accountId)) {
      warnMissingLink(warnings, LOCAL_STORAGE_KEYS.transactions, id, 'accountId', accountId);
      accountId = undefined;
    }
    if (envelopeId && !envelopeIds.has(envelopeId)) {
      warnMissingLink(warnings, LOCAL_STORAGE_KEYS.transactions, id, 'envelopeId', envelopeId);
      envelopeId = undefined;
    }

    return {
      id,
      date: requiredString(record.date, `${LOCAL_STORAGE_KEYS.transactions}[${index}].date`),
      description: requiredString(record.description, `${LOCAL_STORAGE_KEYS.transactions}[${index}].description`),
      amount: requiredMoney(record.amount, `${LOCAL_STORAGE_KEYS.transactions}[${index}].amount`),
      category: requiredString(record.category, `${LOCAL_STORAGE_KEYS.transactions}[${index}].category`),
      type,
      accountId,
      envelopeId,
      notes: optionalString(record.notes),
    };
  });

  requireNoDuplicateIds(LOCAL_STORAGE_KEYS.transactions, transactions);
  return transactions;
}

function normalizeDebtPayoffPlans(): DebtPayoffPlan[] {
  const records = asArray(LOCAL_STORAGE_KEYS.debtPayoffPlans, readJson<Partial<DebtPayoffPlan>[]>(LOCAL_STORAGE_KEYS.debtPayoffPlans, []));
  const plans = records.map((record, index): DebtPayoffPlan => ({
    id: requiredString(record.id, `${LOCAL_STORAGE_KEYS.debtPayoffPlans}[${index}].id`),
    method: requireEnum<DebtPayoffPlan['method']>(record.method, PAYOFF_METHODS, `${LOCAL_STORAGE_KEYS.debtPayoffPlans}[${index}].method`),
    extraPayment: requiredMoney(record.extraPayment, `${LOCAL_STORAGE_KEYS.debtPayoffPlans}[${index}].extraPayment`),
  }));

  requireNoDuplicateIds(LOCAL_STORAGE_KEYS.debtPayoffPlans, plans);
  return plans;
}

function normalizeNetWorthAssets(accountIds: Set<string>, warnings: LocalStorageImportWarning[]): NetWorthAsset[] {
  const records = asArray(LOCAL_STORAGE_KEYS.netWorthAssets, readJson<Partial<NetWorthAsset>[]>(LOCAL_STORAGE_KEYS.netWorthAssets, []));
  const assets = records.map((record, index): NetWorthAsset => {
    const id = requiredString(record.id, `${LOCAL_STORAGE_KEYS.netWorthAssets}[${index}].id`);
    let accountId = optionalString(record.accountId);
    if (accountId && !accountIds.has(accountId)) {
      warnMissingLink(warnings, LOCAL_STORAGE_KEYS.netWorthAssets, id, 'accountId', accountId);
      accountId = undefined;
    }

    return {
      id,
      name: requiredString(record.name, `${LOCAL_STORAGE_KEYS.netWorthAssets}[${index}].name`),
      type: requireEnum<NetWorthAsset['type']>(record.type, ASSET_TYPES, `${LOCAL_STORAGE_KEYS.netWorthAssets}[${index}].type`),
      value: requiredMoney(record.value, `${LOCAL_STORAGE_KEYS.netWorthAssets}[${index}].value`),
      accountId,
      notes: optionalString(record.notes),
      updatedAt: optionalString(record.updatedAt) ?? new Date().toISOString(),
    };
  });

  requireNoDuplicateIds(LOCAL_STORAGE_KEYS.netWorthAssets, assets);
  return assets;
}

function normalizeNetWorthLiabilities(
  accountIds: Set<string>,
  debtIds: Set<string>,
  warnings: LocalStorageImportWarning[],
): NetWorthLiability[] {
  const records = asArray(LOCAL_STORAGE_KEYS.netWorthLiabilities, readJson<Partial<NetWorthLiability>[]>(LOCAL_STORAGE_KEYS.netWorthLiabilities, []));
  const liabilities = records.map((record, index): NetWorthLiability => {
    const id = requiredString(record.id, `${LOCAL_STORAGE_KEYS.netWorthLiabilities}[${index}].id`);
    let accountId = optionalString(record.accountId);
    let debtId = optionalString(record.debtId);
    if (accountId && !accountIds.has(accountId)) {
      warnMissingLink(warnings, LOCAL_STORAGE_KEYS.netWorthLiabilities, id, 'accountId', accountId);
      accountId = undefined;
    }
    if (debtId && !debtIds.has(debtId)) {
      warnMissingLink(warnings, LOCAL_STORAGE_KEYS.netWorthLiabilities, id, 'debtId', debtId);
      debtId = undefined;
    }

    return {
      id,
      name: requiredString(record.name, `${LOCAL_STORAGE_KEYS.netWorthLiabilities}[${index}].name`),
      type: requireEnum<NetWorthLiability['type']>(record.type, LIABILITY_TYPES, `${LOCAL_STORAGE_KEYS.netWorthLiabilities}[${index}].type`),
      balance: requiredMoney(record.balance, `${LOCAL_STORAGE_KEYS.netWorthLiabilities}[${index}].balance`),
      debtId,
      accountId,
      notes: optionalString(record.notes),
      updatedAt: optionalString(record.updatedAt) ?? new Date().toISOString(),
    };
  });

  requireNoDuplicateIds(LOCAL_STORAGE_KEYS.netWorthLiabilities, liabilities);
  return liabilities;
}

function normalizeNetWorthSnapshots(): NetWorthSnapshot[] {
  const records = asArray(LOCAL_STORAGE_KEYS.netWorthSnapshots, readJson<Partial<NetWorthSnapshot>[]>(LOCAL_STORAGE_KEYS.netWorthSnapshots, []));
  const snapshots = records.map((record, index): NetWorthSnapshot => ({
    id: requiredString(record.id, `${LOCAL_STORAGE_KEYS.netWorthSnapshots}[${index}].id`),
    month: requiredString(record.month, `${LOCAL_STORAGE_KEYS.netWorthSnapshots}[${index}].month`),
    totalAssets: requiredMoney(record.totalAssets, `${LOCAL_STORAGE_KEYS.netWorthSnapshots}[${index}].totalAssets`, { allowNegative: true }),
    totalLiabilities: requiredMoney(record.totalLiabilities, `${LOCAL_STORAGE_KEYS.netWorthSnapshots}[${index}].totalLiabilities`, { allowNegative: true }),
    netWorth: requiredMoney(record.netWorth, `${LOCAL_STORAGE_KEYS.netWorthSnapshots}[${index}].netWorth`, { allowNegative: true }),
    createdAt: optionalString(record.createdAt) ?? new Date().toISOString(),
  }));

  requireNoDuplicateIds(LOCAL_STORAGE_KEYS.netWorthSnapshots, snapshots);
  requireNoDuplicateSnapshotMonths(snapshots);
  return snapshots;
}

function normalizeImportData(warnings: LocalStorageImportWarning[]): { settings: AppSettings } & NormalizedLocalStorageImportData {
  const settings = normalizeSettings();
  const accounts = normalizeAccounts();
  const accountIds = new Set(accounts.map(account => account.id));
  const envelopes = normalizeEnvelopes(accountIds, warnings);
  const envelopeIds = new Set(envelopes.map(envelope => envelope.id));
  const budgets = normalizeBudgets();
  const savingsBuckets = normalizeSavingsBuckets(accountIds, warnings);
  const debts = normalizeDebts(accountIds, warnings);
  const debtIds = new Set(debts.map(debt => debt.id));
  const transactions = normalizeTransactions(accountIds, envelopeIds, warnings);
  const debtPayoffPlans = normalizeDebtPayoffPlans();
  const netWorthAssets = normalizeNetWorthAssets(accountIds, warnings);
  const netWorthLiabilities = normalizeNetWorthLiabilities(accountIds, debtIds, warnings);
  const netWorthSnapshots = normalizeNetWorthSnapshots();

  return {
    settings,
    accounts,
    envelopes,
    budgets,
    savingsBuckets,
    debts,
    transactions,
    debtPayoffPlans,
    netWorthAssets,
    netWorthLiabilities,
    netWorthSnapshots,
  };
}

function emptyCounts(): ImportVerificationSummary['recordCounts'] {
  return {
    accounts: 0,
    envelopes: 0,
    budgets: 0,
    savingsBuckets: 0,
    debts: 0,
    transactions: 0,
    debtPayoffPlans: 0,
    netWorthAssets: 0,
    netWorthLiabilities: 0,
    netWorthSnapshots: 0,
  };
}

function validationErrorReport(
  backup: LocalStorageBackup,
  warnings: LocalStorageImportWarning[],
  error: unknown,
): LocalStorageImportReport {
  return {
    dryRun: true,
    status: 'failed',
    backup,
    backupChecksum: backup.checksum,
    warnings,
    errors: [error instanceof Error ? error.message : String(error)],
    counts: emptyCounts(),
    totals: null,
    verification: null,
    metadata: null,
  };
}

async function assertImportNotCompleted(database: Database): Promise<void> {
  const rows = await database.select<MetadataRow[]>(
    'SELECT value FROM app_metadata WHERE key = $1 LIMIT 1',
    [IMPORT_METADATA_KEY],
  );

  if (!rows[0]) return;

  try {
    const value = JSON.parse(rows[0].value) as { status?: string };
    if (value.status === 'completed') throw new Error('localStorage import has already completed.');
  } catch (error) {
    if (error instanceof SyntaxError) return;
    throw error;
  }
}

async function assertDomainTablesEmpty(database: Database): Promise<void> {
  for (const table of DOMAIN_TABLES) {
    const rows = await database.select<CountRow[]>(`SELECT COUNT(*) AS count FROM ${table}`);
    const count = rows[0]?.count ?? 0;
    if (count > 0) throw new Error(`SQLite import requires empty tables. Table "${table}" has ${count} row(s).`);
  }
}

async function writeSettings(database: Database, settings: AppSettings, now: string): Promise<void> {
  await database.execute(
    `INSERT INTO settings (id, user_name, currency, currency_symbol, updated_at)
     VALUES ($1, $2, $3, $4, $5)`,
    [SETTINGS_ID, settings.userName, settings.currency, settings.currencySymbol, now],
  );
}

async function writeImportData(database: Database, data: { settings: AppSettings } & NormalizedLocalStorageImportData, now: string): Promise<void> {
  await writeSettings(database, data.settings, now);

  for (const account of data.accounts) {
    await database.execute(
      `INSERT INTO accounts (
         id, name, type, opening_balance_cents, manual_balance_cents, color, institution, notes, updated_at, archived_at
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        account.id,
        account.name,
        account.type,
        toSqliteCents(account.openingBalance ?? account.balance),
        toSqliteCents(account.balance),
        optionalText(account.color),
        optionalText(account.institution),
        optionalText(account.notes),
        optionalText(account.updatedAt) ?? now,
        optionalText(account.archivedAt),
      ],
    );
  }

  for (const envelope of data.envelopes) {
    await database.execute(
      `INSERT INTO envelopes (
         id, name, category, allocated_cents, spent_fallback_cents, month, color, from_account_id
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        envelope.id,
        envelope.name,
        optionalText(envelope.category),
        toSqliteCents(envelope.allocated),
        toSqliteCents(envelope.spent),
        envelope.month,
        optionalText(envelope.color),
        optionalText(envelope.fromAccountId),
      ],
    );
  }

  for (const budget of data.budgets) {
    await database.execute(
      `INSERT INTO budget_categories (id, category, budgeted_cents, spent_cents, month, color)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [budget.id, budget.category, toSqliteCents(budget.budgeted), toSqliteCents(budget.spent), budget.month, budget.color],
    );
  }

  for (const bucket of data.savingsBuckets) {
    await database.execute(
      `INSERT INTO savings_buckets (
         id, name, goal_amount_cents, allocated_amount_cents, target_date, account_id, color, notes
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        bucket.id,
        bucket.name,
        toSqliteCents(bucket.goalAmount),
        toSqliteCents(bucket.allocatedAmount),
        optionalText(bucket.targetDate),
        optionalText(bucket.accountId),
        bucket.color,
        optionalText(bucket.notes),
      ],
    );
  }

  for (const debt of data.debts) {
    await database.execute(
      `INSERT INTO debts (
         id, name, balance_cents, original_balance_cents, interest_rate_basis_points,
         minimum_payment_cents, due_date, color, account_id, notes
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        debt.id,
        debt.name,
        toSqliteCents(debt.balance),
        toSqliteCents(debt.originalBalance),
        toBasisPoints(debt.interestRate),
        toSqliteCents(debt.minimumPayment),
        debt.dueDate,
        debt.color,
        optionalText(debt.accountId),
        optionalText(debt.notes),
      ],
    );
  }

  for (const transaction of data.transactions) {
    await database.execute(
      `INSERT INTO transactions (
         id, date, description, amount_cents, category, type, account_id, envelope_id, notes, created_at, updated_at
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $10)`,
      [
        transaction.id,
        transaction.date,
        transaction.description,
        toSqliteCents(transaction.amount),
        transaction.category,
        transaction.type,
        optionalText(transaction.accountId),
        optionalText(transaction.envelopeId),
        optionalText(transaction.notes),
        now,
      ],
    );
  }

  for (const plan of data.debtPayoffPlans) {
    await database.execute(
      `INSERT INTO debt_payoff_plans (id, method, extra_payment_cents, updated_at)
       VALUES ($1, $2, $3, $4)`,
      [plan.id, plan.method, toSqliteCents(plan.extraPayment), now],
    );
  }

  for (const asset of data.netWorthAssets) {
    await database.execute(
      `INSERT INTO net_worth_assets (id, name, type, value_cents, account_id, notes, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [asset.id, asset.name, asset.type, toSqliteCents(asset.value), optionalText(asset.accountId), optionalText(asset.notes), asset.updatedAt],
    );
  }

  for (const liability of data.netWorthLiabilities) {
    await database.execute(
      `INSERT INTO net_worth_liabilities (id, name, type, balance_cents, debt_id, account_id, notes, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        liability.id,
        liability.name,
        liability.type,
        toSqliteCents(liability.balance),
        optionalText(liability.debtId),
        optionalText(liability.accountId),
        optionalText(liability.notes),
        liability.updatedAt,
      ],
    );
  }

  for (const snapshot of data.netWorthSnapshots) {
    await database.execute(
      `INSERT INTO net_worth_snapshots (
         id, month, total_assets_cents, total_liabilities_cents, net_worth_cents, created_at
       )
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        snapshot.id,
        snapshot.month,
        toSqliteCents(snapshot.totalAssets),
        toSqliteCents(snapshot.totalLiabilities),
        toSqliteCents(snapshot.netWorth),
        snapshot.createdAt,
      ],
    );
  }
}

async function markImportComplete(
  database: Database,
  backup: LocalStorageBackup,
  warnings: LocalStorageImportWarning[],
  verification: ImportVerificationSummary,
  completedAt: string,
): Promise<void> {
  await database.execute(
    `INSERT INTO app_metadata (key, value)
     VALUES ($1, $2)`,
    [
      IMPORT_METADATA_KEY,
      JSON.stringify({
        status: 'completed',
        source: 'localStorage',
        completedAt,
        backupChecksum: backup.checksum,
        backupCreatedAt: backup.createdAt,
        warningCount: warnings.length,
        recordCounts: verification.recordCounts,
      }),
    ],
  );
}

export async function importLocalStorageToSqlite(options: LocalStorageImportOptions = {}): Promise<LocalStorageImportReport> {
  if (options.dryRun) {
    const backup = createLocalStorageBackup();
    const warnings: LocalStorageImportWarning[] = [];

    try {
      const data = normalizeImportData(warnings);
      const summary = summarizeLocalStorageImportData(data);

      return {
        dryRun: true,
        status: 'validated',
        backup,
        backupChecksum: backup.checksum,
        warnings,
        errors: [],
        counts: summary.recordCounts,
        totals: summary.totals,
        verification: summary,
        metadata: null,
      };
    } catch (error) {
      return validationErrorReport(backup, warnings, error);
    }
  }

  const database = await getSqliteDatabase();
  await assertImportNotCompleted(database);
  await assertDomainTablesEmpty(database);

  const backup = createLocalStorageBackup();
  const warnings: LocalStorageImportWarning[] = [];
  const completedAt = new Date().toISOString();
  let verification: ImportVerificationSummary | undefined;

  try {
    const data = normalizeImportData(warnings);

    await withSqliteTransaction(async transactionDatabase => {
      await assertImportNotCompleted(transactionDatabase);
      await assertDomainTablesEmpty(transactionDatabase);
      await writeImportData(transactionDatabase, data, completedAt);
      verification = await verifyLocalStorageImport(transactionDatabase, data);
      await markImportComplete(transactionDatabase, backup, warnings, verification, completedAt);
    });
  } catch (error) {
    throw new LocalStorageImportError(
      error instanceof Error ? error.message : String(error),
      { backup, warnings, cause: error },
    );
  }

  if (!verification) throw new Error('Import verification did not run.');

  return {
    dryRun: false,
    status: 'completed',
    backup,
    backupChecksum: backup.checksum,
    warnings,
    errors: [],
    counts: verification.recordCounts,
    totals: verification.totals,
    verification,
    metadata: {
      key: IMPORT_METADATA_KEY,
      completedAt,
      backupChecksum: backup.checksum,
    },
  };
}

export function dryRunLocalStorageToSqliteImport(): Promise<LocalStorageImportReport> {
  return importLocalStorageToSqlite({ dryRun: true });
}

