import type { BudgetCategory } from '../../types';
import type { BudgetRepository } from '../../domain/budgeting/repository';
import { isValidMoneyAmount, normalizeMoneyAmount } from '../../domain/money';
import { getSqliteDatabase } from './db';
import { fromSqliteCents, toSqliteCents } from './mappers';

interface BudgetRow {
  id: string;
  category: string;
  budgeted_cents: number;
  spent_cents: number;
  month: string;
  color: string;
}

function validateBudget(budget: BudgetCategory): BudgetCategory {
  if (!budget.id.trim()) throw new Error('Budget id is required.');
  if (!budget.category.trim()) throw new Error('Budget category is required.');
  if (!budget.month.trim()) throw new Error('Budget month is required.');
  if (!isValidMoneyAmount(budget.budgeted)) throw new Error('Budgeted amount must be non-negative.');
  if (!isValidMoneyAmount(budget.spent)) throw new Error('Spent amount must be non-negative.');

  return {
    ...budget,
    id: budget.id.trim(),
    category: budget.category.trim(),
    month: budget.month.trim(),
    budgeted: normalizeMoneyAmount(budget.budgeted),
    spent: normalizeMoneyAmount(budget.spent),
  };
}

function rowToBudget(row: BudgetRow): BudgetCategory {
  return {
    id: row.id,
    category: row.category,
    budgeted: fromSqliteCents(row.budgeted_cents),
    spent: fromSqliteCents(row.spent_cents),
    month: row.month,
    color: row.color,
  };
}

export const sqliteBudgetRepository: BudgetRepository = {
  async list() {
    const database = await getSqliteDatabase();
    const rows = await database.select<BudgetRow[]>(
      `SELECT id, category, budgeted_cents, spent_cents, month, color
       FROM budget_categories
       ORDER BY month DESC, category ASC`,
    );

    return rows.map(rowToBudget);
  },

  async upsert(budget) {
    const database = await getSqliteDatabase();
    const normalized = validateBudget(budget);

    await database.execute(
      `INSERT INTO budget_categories (id, category, budgeted_cents, spent_cents, month, color)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT(id) DO UPDATE SET
         category = excluded.category,
         budgeted_cents = excluded.budgeted_cents,
         spent_cents = excluded.spent_cents,
         month = excluded.month,
         color = excluded.color`,
      [
        normalized.id,
        normalized.category,
        toSqliteCents(normalized.budgeted),
        toSqliteCents(normalized.spent),
        normalized.month,
        normalized.color,
      ],
    );
  },

  async delete(id) {
    const database = await getSqliteDatabase();
    await database.execute('DELETE FROM budget_categories WHERE id = $1', [id]);
  },
};
