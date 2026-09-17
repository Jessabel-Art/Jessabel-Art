import type { Account, BudgetCategory, Envelope, RiskLevel, Transaction } from '../../types';
import { getActiveAccounts, getDerivedCurrentBalance } from '../accounts/selectors';

export interface MonthlyCashFlow {
  income: number;
  expenses: number;
  savings: number;
  savingsRate: number;
}

export function filterTransactionsByMonth(transactions: Transaction[], month: string): Transaction[] {
  return transactions.filter(transaction => transaction.date.startsWith(month));
}

export function getRecentTransactions(transactions: Transaction[], count: number): Transaction[] {
  return [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, count);
}

export function getMonthlyCashFlow(transactions: Transaction[], month: string): MonthlyCashFlow {
  const monthTransactions = filterTransactionsByMonth(transactions, month);
  const income = monthTransactions.filter(transaction => transaction.type === 'income').reduce((sum, transaction) => sum + transaction.amount, 0);
  const expenses = monthTransactions.filter(transaction => transaction.type === 'expense').reduce((sum, transaction) => sum + transaction.amount, 0);
  const savings = income - expenses;

  return {
    income,
    expenses,
    savings,
    savingsRate: income > 0 ? (savings / income) * 100 : 0,
  };
}

export function filterBudgetsByMonth(budgets: BudgetCategory[], month: string): BudgetCategory[] {
  return budgets.filter(budget => budget.month === month);
}

export function getBudgetTotals(budgets: BudgetCategory[]) {
  const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.budgeted, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);

  return {
    totalBudgeted,
    totalSpent,
    remaining: totalBudgeted - totalSpent,
    overBudget: budgets.filter(budget => budget.spent > budget.budgeted),
  };
}

export function getSpendingByCategory(transactions: Transaction[], month: string): Record<string, number> {
  return transactions
    .filter(transaction => transaction.date.startsWith(month) && transaction.type === 'expense')
    .reduce<Record<string, number>>((spending, transaction) => {
      spending[transaction.category] = (spending[transaction.category] ?? 0) + transaction.amount;
      return spending;
    }, {});
}

export function getSortedCategorySpendingEntries(spendingByCategory: Record<string, number>): [string, number][] {
  return Object.entries(spendingByCategory).sort((a, b) => b[1] - a[1]);
}

export function getTotalCategorySpending(categoryEntries: [string, number][]): number {
  return categoryEntries.reduce((sum, [, amount]) => sum + amount, 0);
}

export function getEnvelopesByMonth(envelopes: Envelope[], month: string): Envelope[] {
  return envelopes.filter(envelope => envelope.month === month);
}

export function calculateEnvelopeSpentFromTransactions(envelope: Envelope, transactions: Transaction[]): number {
  const linkedExpenseTransactions = transactions.filter(transaction => (
    transaction.envelopeId === envelope.id &&
    transaction.type === 'expense'
  ));

  if (linkedExpenseTransactions.length === 0) return envelope.spent;

  return linkedExpenseTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
}

export function calculateEnvelopeRemaining(envelope: Envelope, transactions: Transaction[]): number {
  return envelope.allocated - calculateEnvelopeSpentFromTransactions(envelope, transactions);
}

export function calculateEnvelopeRisk(envelope: Envelope, transactions: Transaction[] = []): RiskLevel {
  if (envelope.allocated <= 0) return 'yellow';
  const pct = (calculateEnvelopeSpentFromTransactions(envelope, transactions) / envelope.allocated) * 100;
  if (pct >= 100) return 'red';
  if (pct >= 80) return 'yellow';
  return 'green';
}

export function filterEnvelopesByMonth(envelopes: Envelope[], month: string): Envelope[] {
  return getEnvelopesByMonth(envelopes, month);
}

export function calculateEnvelopeSummary(envelopes: Envelope[], transactions: Transaction[] = []) {
  const totalAllocated = envelopes.reduce((sum, envelope) => sum + envelope.allocated, 0);
  const totalSpent = envelopes.reduce((sum, envelope) => sum + calculateEnvelopeSpentFromTransactions(envelope, transactions), 0);

  return {
    totalAllocated,
    totalSpent,
    totalRemaining: totalAllocated - totalSpent,
  };
}

export function calculateAllocatedEnvelopesByAccount(
  envelopes: Envelope[],
  accountId: string,
  options: { month?: string; excludeEnvelopeId?: string } = {},
): number {
  return envelopes
    .filter(envelope => envelope.fromAccountId === accountId)
    .filter(envelope => !options.month || envelope.month === options.month)
    .filter(envelope => envelope.id !== options.excludeEnvelopeId)
    .reduce((sum, envelope) => sum + envelope.allocated, 0);
}

export function calculateAvailableEnvelopeAllocationByAccount(params: {
  accounts: Account[];
  transactions: Transaction[];
  envelopes: Envelope[];
  accountId: string;
  month: string;
  excludeEnvelopeId?: string;
}): number {
  const account = getActiveAccounts(params.accounts).find(item => item.id === params.accountId);
  if (!account) return 0;

  return getDerivedCurrentBalance(account, params.transactions) - calculateAllocatedEnvelopesByAccount(
    params.envelopes,
    params.accountId,
    { month: params.month, excludeEnvelopeId: params.excludeEnvelopeId },
  );
}

export const getEnvelopeRisk = calculateEnvelopeRisk;
export const getEnvelopeTotals = calculateEnvelopeSummary;
