import type { DebtPayoffPlan } from '../../types';
import type { DebtPayoffPlanRepository } from '../../domain/debt/repository';
import { isValidMoneyAmount, normalizeMoneyAmount } from '../../domain/money';
import { getSqliteDatabase } from './db';
import { fromSqliteCents, toSqliteCents } from './mappers';

interface DebtPayoffPlanRow {
  id: string;
  method: DebtPayoffPlan['method'];
  extra_payment_cents: number;
}

function validatePlan(plan: DebtPayoffPlan): DebtPayoffPlan {
  if (!plan.id.trim()) throw new Error('Debt plan id is required.');
  if (plan.method !== 'snowball' && plan.method !== 'avalanche') {
    throw new Error('Debt plan method must be snowball or avalanche.');
  }
  if (!isValidMoneyAmount(plan.extraPayment)) {
    throw new Error('Debt plan extra payment must be non-negative.');
  }

  return {
    ...plan,
    id: plan.id.trim(),
    extraPayment: normalizeMoneyAmount(plan.extraPayment),
  };
}

function rowToPlan(row: DebtPayoffPlanRow): DebtPayoffPlan {
  return {
    id: row.id,
    method: row.method,
    extraPayment: fromSqliteCents(row.extra_payment_cents),
  };
}

export const sqliteDebtPayoffPlanRepository: DebtPayoffPlanRepository = {
  async list() {
    const database = await getSqliteDatabase();
    const rows = await database.select<DebtPayoffPlanRow[]>(
      `SELECT id, method, extra_payment_cents
       FROM debt_payoff_plans
       ORDER BY updated_at DESC`,
    );

    return rows.map(rowToPlan);
  },

  async upsert(plan) {
    const database = await getSqliteDatabase();
    const normalized = validatePlan(plan);

    await database.execute(
      `INSERT INTO debt_payoff_plans (id, method, extra_payment_cents, updated_at)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT(id) DO UPDATE SET
         method = excluded.method,
         extra_payment_cents = excluded.extra_payment_cents,
         updated_at = excluded.updated_at`,
      [
        normalized.id,
        normalized.method,
        toSqliteCents(normalized.extraPayment),
        new Date().toISOString(),
      ],
    );
  },
};
