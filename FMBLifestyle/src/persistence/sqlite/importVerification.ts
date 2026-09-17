import type Database from '@tauri-apps/plugin-sql';
import type {
  Account,
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
import { calculateNetWorthSummary } from '../../domain/netWorth/selectors';
import { toSqliteCents } from './mappers';

export interface NormalizedLocalStorageImportData {
  accounts: Account[];
  envelopes: Envelope[];
  budgets: BudgetCategory[];
  savingsBuckets: SavingsBucket[];
  debts: Debt[];
  transactions: Transaction[];
  debtPayoffPlans: DebtPayoffPlan[];
  netWorthAssets: NetWorthAsset[];
  netWorthLiabilities: NetWorthLiability[];
  netWorthSnapshots: NetWorthSnapshot[];
}

export interface ImportVerificationSummary {
  recordCounts: Record<string, number>;
  totals: {
    accountsBalanceCents: number;
    accountsOpeningBalanceCents: number;
    dashboardIncomeCents: number;
    dashboardExpenseCents: number;
    dashboardNetCashFlowCents: number;
    netWorthAssetsCents: number;
    netWorthLiabilitiesCents: number;
    netWorthCents: number;
    savingsGoalCents: number;
    savingsAllocatedCents: number;
    envelopeAllocatedCents: number;
    envelopeSpentCents: number;
    debtBalanceCents: number;
    debtOriginalBalanceCents: number;
    debtMinimumPaymentCents: number;
    debtPayoffExtraPaymentCents: number;
    snapshotAssetsCents: number;
    snapshotLiabilitiesCents: number;
    snapshotNetWorthCents: number;
  };
}

interface CountRow {
  count: number;
}

interface SumRow {
  value: number | null;
}

function sumCents(values: number[]): number {
  return values.reduce((sum, value) => sum + toSqliteCents(value), 0);
}

async function countRows(database: Database, tableName: string): Promise<number> {
  const rows = await database.select<CountRow[]>(`SELECT COUNT(*) AS count FROM ${tableName}`);
  return rows[0]?.count ?? 0;
}

async function sumColumn(database: Database, tableName: string, columnName: string): Promise<number> {
  const rows = await database.select<SumRow[]>(`SELECT COALESCE(SUM(${columnName}), 0) AS value FROM ${tableName}`);
  return rows[0]?.value ?? 0;
}

function assertEqual(label: string, expected: number, actual: number): void {
  if (expected !== actual) {
    throw new Error(`${label} verification failed. Expected ${expected}, got ${actual}.`);
  }
}

export function summarizeLocalStorageImportData(data: NormalizedLocalStorageImportData): ImportVerificationSummary {
  const incomeCents = sumCents(data.transactions.filter(t => t.type === 'income').map(t => t.amount));
  const expenseCents = sumCents(data.transactions.filter(t => t.type === 'expense').map(t => t.amount));
  const netWorth = calculateNetWorthSummary({
    accounts: data.accounts,
    transactions: data.transactions,
    assets: data.netWorthAssets,
    liabilities: data.netWorthLiabilities,
    debts: data.debts,
  });

  return {
    recordCounts: {
      accounts: data.accounts.length,
      envelopes: data.envelopes.length,
      budgets: data.budgets.length,
      savingsBuckets: data.savingsBuckets.length,
      debts: data.debts.length,
      transactions: data.transactions.length,
      debtPayoffPlans: data.debtPayoffPlans.length,
      netWorthAssets: data.netWorthAssets.length,
      netWorthLiabilities: data.netWorthLiabilities.length,
      netWorthSnapshots: data.netWorthSnapshots.length,
    },
    totals: {
      accountsBalanceCents: sumCents(data.accounts.map(account => account.balance)),
      accountsOpeningBalanceCents: sumCents(data.accounts.map(account => account.openingBalance ?? account.balance)),
      dashboardIncomeCents: incomeCents,
      dashboardExpenseCents: expenseCents,
      dashboardNetCashFlowCents: incomeCents - expenseCents,
      netWorthAssetsCents: toSqliteCents(netWorth.totalAssets),
      netWorthLiabilitiesCents: toSqliteCents(netWorth.totalLiabilities),
      netWorthCents: toSqliteCents(netWorth.netWorth),
      savingsGoalCents: sumCents(data.savingsBuckets.map(bucket => bucket.goalAmount)),
      savingsAllocatedCents: sumCents(data.savingsBuckets.map(bucket => bucket.allocatedAmount)),
      envelopeAllocatedCents: sumCents(data.envelopes.map(envelope => envelope.allocated)),
      envelopeSpentCents: sumCents(data.envelopes.map(envelope => envelope.spent)),
      debtBalanceCents: sumCents(data.debts.map(debt => debt.balance)),
      debtOriginalBalanceCents: sumCents(data.debts.map(debt => debt.originalBalance)),
      debtMinimumPaymentCents: sumCents(data.debts.map(debt => debt.minimumPayment)),
      debtPayoffExtraPaymentCents: sumCents(data.debtPayoffPlans.map(plan => plan.extraPayment)),
      snapshotAssetsCents: sumCents(data.netWorthSnapshots.map(snapshot => snapshot.totalAssets)),
      snapshotLiabilitiesCents: sumCents(data.netWorthSnapshots.map(snapshot => snapshot.totalLiabilities)),
      snapshotNetWorthCents: sumCents(data.netWorthSnapshots.map(snapshot => snapshot.netWorth)),
    },
  };
}

export async function verifyLocalStorageImport(
  database: Database,
  data: NormalizedLocalStorageImportData,
): Promise<ImportVerificationSummary> {
  const expected = summarizeLocalStorageImportData(data);

  assertEqual('Account count', expected.recordCounts.accounts, await countRows(database, 'accounts'));
  assertEqual('Envelope count', expected.recordCounts.envelopes, await countRows(database, 'envelopes'));
  assertEqual('Budget count', expected.recordCounts.budgets, await countRows(database, 'budget_categories'));
  assertEqual('Savings bucket count', expected.recordCounts.savingsBuckets, await countRows(database, 'savings_buckets'));
  assertEqual('Debt count', expected.recordCounts.debts, await countRows(database, 'debts'));
  assertEqual('Transaction count', expected.recordCounts.transactions, await countRows(database, 'transactions'));
  assertEqual('Debt payoff plan count', expected.recordCounts.debtPayoffPlans, await countRows(database, 'debt_payoff_plans'));
  assertEqual('Net worth asset count', expected.recordCounts.netWorthAssets, await countRows(database, 'net_worth_assets'));
  assertEqual('Net worth liability count', expected.recordCounts.netWorthLiabilities, await countRows(database, 'net_worth_liabilities'));
  assertEqual('Net worth snapshot count', expected.recordCounts.netWorthSnapshots, await countRows(database, 'net_worth_snapshots'));

  assertEqual('Account balance total', expected.totals.accountsBalanceCents, await sumColumn(database, 'accounts', 'manual_balance_cents'));
  assertEqual('Account opening balance total', expected.totals.accountsOpeningBalanceCents, await sumColumn(database, 'accounts', 'opening_balance_cents'));
  assertEqual('Dashboard income total', expected.totals.dashboardIncomeCents, await sumColumn(database, "transactions WHERE type = 'income'", 'amount_cents'));
  assertEqual('Dashboard expense total', expected.totals.dashboardExpenseCents, await sumColumn(database, "transactions WHERE type = 'expense'", 'amount_cents'));
  assertEqual('Savings goal total', expected.totals.savingsGoalCents, await sumColumn(database, 'savings_buckets', 'goal_amount_cents'));
  assertEqual('Savings allocation total', expected.totals.savingsAllocatedCents, await sumColumn(database, 'savings_buckets', 'allocated_amount_cents'));
  assertEqual('Envelope allocation total', expected.totals.envelopeAllocatedCents, await sumColumn(database, 'envelopes', 'allocated_cents'));
  assertEqual('Envelope spent total', expected.totals.envelopeSpentCents, await sumColumn(database, 'envelopes', 'spent_fallback_cents'));
  assertEqual('Debt balance total', expected.totals.debtBalanceCents, await sumColumn(database, 'debts', 'balance_cents'));
  assertEqual('Debt original balance total', expected.totals.debtOriginalBalanceCents, await sumColumn(database, 'debts', 'original_balance_cents'));
  assertEqual('Debt minimum payment total', expected.totals.debtMinimumPaymentCents, await sumColumn(database, 'debts', 'minimum_payment_cents'));
  assertEqual('Debt payoff extra payment total', expected.totals.debtPayoffExtraPaymentCents, await sumColumn(database, 'debt_payoff_plans', 'extra_payment_cents'));
  assertEqual('Snapshot asset total', expected.totals.snapshotAssetsCents, await sumColumn(database, 'net_worth_snapshots', 'total_assets_cents'));
  assertEqual('Snapshot liability total', expected.totals.snapshotLiabilitiesCents, await sumColumn(database, 'net_worth_snapshots', 'total_liabilities_cents'));
  assertEqual('Snapshot net worth total', expected.totals.snapshotNetWorthCents, await sumColumn(database, 'net_worth_snapshots', 'net_worth_cents'));

  return expected;
}
