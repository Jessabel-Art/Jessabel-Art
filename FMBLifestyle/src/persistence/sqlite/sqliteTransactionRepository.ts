import type { Transaction } from '../../types';
import type { TransactionRepository } from '../../domain/budgeting/repository';
import { isValidMoneyAmount, normalizeMoneyAmount } from '../../domain/money';
import type Database from '@tauri-apps/plugin-sql';
import { getSqliteDatabase } from './db';
import { fromSqliteCents, nullableToUndefined, optionalText, toSqliteCents } from './mappers';
import { withSqliteTransaction } from './transaction';

interface TransactionRow {
  id: string;
  date: string;
  description: string;
  amount_cents: number;
  category: string;
  type: Transaction['type'];
  account_id: string | null;
  envelope_id: string | null;
  notes: string | null;
}

function validateTransaction(transaction: Transaction): Transaction {
  if (!transaction.id.trim()) throw new Error('Transaction id is required.');
  if (!transaction.date.trim()) throw new Error('Transaction date is required.');
  if (!transaction.description.trim()) throw new Error('Transaction description is required.');
  if (!isValidMoneyAmount(transaction.amount)) throw new Error('Transaction amount must be a non-negative amount.');

  return {
    ...transaction,
    id: transaction.id.trim(),
    date: transaction.date.trim(),
    description: transaction.description.trim(),
    category: transaction.category.trim(),
    amount: normalizeMoneyAmount(transaction.amount),
    accountId: transaction.accountId?.trim() || undefined,
    envelopeId: transaction.type === 'expense' ? transaction.envelopeId?.trim() || undefined : undefined,
    notes: transaction.notes?.trim() || undefined,
  };
}

function rowToTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    date: row.date,
    description: row.description,
    amount: fromSqliteCents(row.amount_cents),
    category: row.category,
    type: row.type,
    accountId: nullableToUndefined(row.account_id),
    envelopeId: row.type === 'expense' ? nullableToUndefined(row.envelope_id) : undefined,
    notes: nullableToUndefined(row.notes),
  };
}

async function upsertValidatedTransaction(transaction: Transaction, database?: Database): Promise<void> {
  const activeDatabase = database ?? await getSqliteDatabase();
  const normalized = validateTransaction(transaction);
  const now = new Date().toISOString();

  await activeDatabase.execute(
    `INSERT INTO transactions (
       id, date, description, amount_cents, category, type, account_id, envelope_id, notes, created_at, updated_at
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $10)
     ON CONFLICT(id) DO UPDATE SET
       date = excluded.date,
       description = excluded.description,
       amount_cents = excluded.amount_cents,
       category = excluded.category,
       type = excluded.type,
       account_id = excluded.account_id,
       envelope_id = excluded.envelope_id,
       notes = excluded.notes,
       updated_at = excluded.updated_at`,
    [
      normalized.id,
      normalized.date,
      normalized.description,
      toSqliteCents(normalized.amount),
      normalized.category,
      normalized.type,
      optionalText(normalized.accountId),
      optionalText(normalized.envelopeId),
      optionalText(normalized.notes),
      now,
    ],
  );
}

export const sqliteTransactionRepository: TransactionRepository = {
  async list() {
    const database = await getSqliteDatabase();
    const rows = await database.select<TransactionRow[]>(
      `SELECT id, date, description, amount_cents, category, type, account_id, envelope_id, notes
       FROM transactions
       ORDER BY date DESC, updated_at DESC, created_at DESC`,
    );

    return rows.map(rowToTransaction);
  },

  async saveAll(transactions) {
    await withSqliteTransaction(async database => {
      await database.execute('DELETE FROM transactions');

      for (const transaction of transactions) {
        await upsertValidatedTransaction(transaction, database);
      }
    });
  },

  async add(transaction) {
    await upsertValidatedTransaction(transaction);
  },

  async update(transaction) {
    await upsertValidatedTransaction(transaction);
  },

  async delete(id) {
    const database = await getSqliteDatabase();
    await database.execute('DELETE FROM transactions WHERE id = $1', [id]);
  },
};
