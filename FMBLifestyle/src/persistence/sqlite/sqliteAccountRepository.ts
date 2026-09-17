import type { Account } from '../../types';
import type { AccountRepository } from '../../domain/accounts/repository';
import { isValidMoneyAmount, normalizeMoneyAmount } from '../../domain/money';
import type Database from '@tauri-apps/plugin-sql';
import {
  getAssets,
  getBuckets,
  getDebts,
  getEnvelopes,
  getLiabilities,
} from '../../services/storage';
import { getSqliteDatabase } from './db';
import { fromSqliteCents, nullableToUndefined, optionalText, toSqliteCents } from './mappers';
import { withSqliteTransaction } from './transaction';

interface AccountRow {
  id: string;
  name: string;
  type: Account['type'];
  opening_balance_cents: number;
  manual_balance_cents: number;
  color: string | null;
  institution: string | null;
  notes: string | null;
  updated_at: string | null;
  archived_at: string | null;
}

interface CountRow {
  count: number;
}

function validateAccount(account: Account): Account {
  if (!account.id.trim()) throw new Error('Account id is required.');
  if (!account.name.trim()) throw new Error('Account name is required.');
  if (!isValidMoneyAmount(account.balance, { allowNegative: true })) {
    throw new Error('Account balance must be a valid amount.');
  }
  if (account.openingBalance !== undefined && !isValidMoneyAmount(account.openingBalance, { allowNegative: true })) {
    throw new Error('Account opening balance must be a valid amount.');
  }

  return {
    ...account,
    id: account.id.trim(),
    name: account.name.trim(),
    balance: normalizeMoneyAmount(account.balance),
    openingBalance: account.openingBalance === undefined ? undefined : normalizeMoneyAmount(account.openingBalance),
    institution: account.institution?.trim() || undefined,
    notes: account.notes?.trim() || undefined,
  };
}

function rowToAccount(row: AccountRow): Account {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    balance: fromSqliteCents(row.manual_balance_cents),
    openingBalance: fromSqliteCents(row.opening_balance_cents),
    color: nullableToUndefined(row.color),
    institution: nullableToUndefined(row.institution),
    notes: nullableToUndefined(row.notes),
    updatedAt: nullableToUndefined(row.updated_at),
    archivedAt: nullableToUndefined(row.archived_at),
  };
}

async function getAccountById(id: string, database?: Database): Promise<Account | null> {
  const activeDatabase = database ?? await getSqliteDatabase();
  const rows = await activeDatabase.select<AccountRow[]>(
    `SELECT id, name, type, opening_balance_cents, manual_balance_cents, color, institution, notes, updated_at, archived_at
     FROM accounts
     WHERE id = $1
     LIMIT 1`,
    [id],
  );

  return rows[0] ? rowToAccount(rows[0]) : null;
}

async function upsertValidatedAccount(account: Account, database?: Database): Promise<void> {
  const activeDatabase = database ?? await getSqliteDatabase();
  const normalized = validateAccount(account);
  const openingBalance = normalized.openingBalance ?? normalized.balance;
  const updatedAt = new Date().toISOString();

  await activeDatabase.execute(
    `INSERT INTO accounts (
       id, name, type, opening_balance_cents, manual_balance_cents, color, institution, notes, updated_at, archived_at
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     ON CONFLICT(id) DO UPDATE SET
       name = excluded.name,
       type = excluded.type,
       opening_balance_cents = excluded.opening_balance_cents,
       manual_balance_cents = excluded.manual_balance_cents,
       color = excluded.color,
       institution = excluded.institution,
       notes = excluded.notes,
       updated_at = excluded.updated_at,
       archived_at = excluded.archived_at`,
    [
      normalized.id,
      normalized.name,
      normalized.type,
      toSqliteCents(openingBalance),
      toSqliteCents(normalized.balance),
      optionalText(normalized.color),
      optionalText(normalized.institution),
      optionalText(normalized.notes),
      updatedAt,
      optionalText(normalized.archivedAt),
    ],
  );
}

function hasLocalStorageOnlyDependencies(id: string): boolean {
  return (
    getBuckets().some(bucket => bucket.accountId === id) ||
    getEnvelopes().some(envelope => envelope.fromAccountId === id) ||
    getAssets().some(asset => asset.accountId === id) ||
    getDebts().some(debt => debt.accountId === id) ||
    getLiabilities().some(liability => liability.accountId === id)
  );
}

export const sqliteAccountRepository: AccountRepository = {
  async list() {
    const database = await getSqliteDatabase();
    const rows = await database.select<AccountRow[]>(
      `SELECT id, name, type, opening_balance_cents, manual_balance_cents, color, institution, notes, updated_at, archived_at
       FROM accounts
       ORDER BY name ASC`,
    );

    return rows.map(rowToAccount);
  },

  async upsert(account) {
    await upsertValidatedAccount(account);
  },

  async delete(id) {
    await withSqliteTransaction(async database => {
      const rows = await database.select<CountRow[]>(
        'SELECT COUNT(*) AS count FROM transactions WHERE account_id = $1',
        [id],
      );
      const hasDependencies = (rows[0]?.count ?? 0) > 0 || hasLocalStorageOnlyDependencies(id);

      if (hasDependencies) {
        const account = await getAccountById(id, database);
        if (!account) return;

        await upsertValidatedAccount({
          ...account,
          archivedAt: account.archivedAt ?? new Date().toISOString(),
        }, database);
        return;
      }

      await database.execute('DELETE FROM accounts WHERE id = $1', [id]);
    });
  },

  async hasDependencies(id) {
    const database = await getSqliteDatabase();
    const rows = await database.select<CountRow[]>(
      'SELECT COUNT(*) AS count FROM transactions WHERE account_id = $1',
      [id],
    );
    const hasSqliteTransactions = (rows[0]?.count ?? 0) > 0;

    return hasSqliteTransactions || hasLocalStorageOnlyDependencies(id);
  },
};
