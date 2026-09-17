import type { Debt } from '../../types';
import type { DebtRepository } from '../../domain/debt/repository';
import { isValidMoneyAmount, normalizeMoneyAmount } from '../../domain/money';
import type Database from '@tauri-apps/plugin-sql';
import { getSqliteDatabase } from './db';
import {
  fromBasisPoints,
  fromSqliteCents,
  nullableToUndefined,
  optionalText,
  toBasisPoints,
  toSqliteCents,
} from './mappers';
import { withSqliteTransaction } from './transaction';

interface DebtRow {
  id: string;
  name: string;
  balance_cents: number;
  original_balance_cents: number;
  interest_rate_basis_points: number;
  minimum_payment_cents: number;
  due_date: number;
  color: string;
  account_id: string | null;
  notes: string | null;
}

function validateDebt(debt: Debt): Debt {
  if (!debt.id.trim()) throw new Error('Debt id is required.');
  if (!debt.name.trim()) throw new Error('Debt name is required.');
  if (!isValidMoneyAmount(debt.balance)) throw new Error('Debt balance must be non-negative.');
  if (!isValidMoneyAmount(debt.originalBalance)) throw new Error('Original debt balance must be non-negative.');
  if (!isValidMoneyAmount(debt.minimumPayment)) throw new Error('Debt minimum payment must be non-negative.');
  if (!Number.isFinite(debt.interestRate) || debt.interestRate < 0) throw new Error('Debt interest rate must be non-negative.');
  if (!Number.isInteger(debt.dueDate) || debt.dueDate < 1 || debt.dueDate > 31) throw new Error('Debt due date must be 1-31.');

  return {
    ...debt,
    id: debt.id.trim(),
    name: debt.name.trim(),
    balance: normalizeMoneyAmount(debt.balance),
    originalBalance: normalizeMoneyAmount(debt.originalBalance),
    minimumPayment: normalizeMoneyAmount(debt.minimumPayment),
    accountId: debt.accountId?.trim() || undefined,
    color: debt.color.trim() || '#0A2A66',
    notes: debt.notes?.trim() || undefined,
  };
}

function rowToDebt(row: DebtRow): Debt {
  return {
    id: row.id,
    name: row.name,
    balance: fromSqliteCents(row.balance_cents),
    originalBalance: fromSqliteCents(row.original_balance_cents),
    interestRate: fromBasisPoints(row.interest_rate_basis_points),
    minimumPayment: fromSqliteCents(row.minimum_payment_cents),
    dueDate: row.due_date,
    color: row.color,
    accountId: nullableToUndefined(row.account_id),
    notes: nullableToUndefined(row.notes),
  };
}

async function upsertValidatedDebt(debt: Debt, database?: Database): Promise<void> {
  const activeDatabase = database ?? await getSqliteDatabase();
  const normalized = validateDebt(debt);

  await activeDatabase.execute(
    `INSERT INTO debts (
       id, name, balance_cents, original_balance_cents, interest_rate_basis_points,
       minimum_payment_cents, due_date, color, account_id, notes
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     ON CONFLICT(id) DO UPDATE SET
       name = excluded.name,
       balance_cents = excluded.balance_cents,
       original_balance_cents = excluded.original_balance_cents,
       interest_rate_basis_points = excluded.interest_rate_basis_points,
       minimum_payment_cents = excluded.minimum_payment_cents,
       due_date = excluded.due_date,
       color = excluded.color,
       account_id = excluded.account_id,
       notes = excluded.notes`,
    [
      normalized.id,
      normalized.name,
      toSqliteCents(normalized.balance),
      toSqliteCents(normalized.originalBalance),
      toBasisPoints(normalized.interestRate),
      toSqliteCents(normalized.minimumPayment),
      normalized.dueDate,
      normalized.color,
      optionalText(normalized.accountId),
      optionalText(normalized.notes),
    ],
  );
}

export const sqliteDebtRepository: DebtRepository = {
  async list() {
    const database = await getSqliteDatabase();
    const rows = await database.select<DebtRow[]>(
      `SELECT id, name, balance_cents, original_balance_cents, interest_rate_basis_points,
              minimum_payment_cents, due_date, color, account_id, notes
       FROM debts
       ORDER BY name ASC`,
    );

    return rows.map(rowToDebt);
  },

  async saveAll(debts) {
    await withSqliteTransaction(async database => {
      await database.execute('DELETE FROM debts');

      for (const debt of debts) {
        await upsertValidatedDebt(debt, database);
      }
    });
  },

  async upsert(debt) {
    await upsertValidatedDebt(debt);
  },

  async delete(id) {
    const database = await getSqliteDatabase();
    await database.execute('DELETE FROM debts WHERE id = $1', [id]);
  },
};

