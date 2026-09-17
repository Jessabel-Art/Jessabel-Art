import type { Debt, DebtPayoffPlan } from '../../types';
import { deleteDebt, getDebtPlans, getDebts, saveDebts, upsertDebt, upsertDebtPlan } from '../../services/storage';
import { isValidMoneyAmount, normalizeMoneyAmount } from '../money';

export interface DebtRepository {
  list(): Promise<Debt[]>;
  saveAll(debts: Debt[]): Promise<void>;
  upsert(debt: Debt): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface DebtPayoffPlanRepository {
  list(): Promise<DebtPayoffPlan[]>;
  upsert(plan: DebtPayoffPlan): Promise<void>;
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
    name: debt.name.trim(),
    balance: normalizeMoneyAmount(debt.balance),
    originalBalance: normalizeMoneyAmount(debt.originalBalance),
    minimumPayment: normalizeMoneyAmount(debt.minimumPayment),
    accountId: debt.accountId?.trim() || undefined,
    notes: debt.notes?.trim() || undefined,
  };
}

function validatePlan(plan: DebtPayoffPlan): DebtPayoffPlan {
  if (!plan.id.trim()) throw new Error('Debt plan id is required.');
  if (!isValidMoneyAmount(plan.extraPayment)) throw new Error('Debt plan extra payment must be non-negative.');

  return {
    ...plan,
    extraPayment: normalizeMoneyAmount(plan.extraPayment),
  };
}

export const debtRepository: DebtRepository = {
  async list() {
    return getDebts();
  },
  async saveAll(debts) {
    saveDebts(debts.map(validateDebt));
  },
  async upsert(debt) {
    upsertDebt(validateDebt(debt));
  },
  async delete(id) {
    deleteDebt(id);
  },
};

export const debtPayoffPlanRepository: DebtPayoffPlanRepository = {
  async list() {
    return getDebtPlans();
  },
  async upsert(plan) {
    upsertDebtPlan(validatePlan(plan));
  },
};
