import type { Debt, RiskLevel } from '../../types';
import { normalizeMoneyAmount } from '../money';

export interface DebtPayoffScheduleItem {
  debtId: string;
  debtName: string;
  startingBalance: number;
  interestRate: number;
  minimumPayment: number;
  payoffMonth: number | null;
  payoffDate: string;
  totalInterest: number;
  totalPaid: number;
  firstMonthPayment: number;
}

export interface DebtPayoffSchedule {
  method: 'snowball' | 'avalanche';
  debts: DebtPayoffScheduleItem[];
  monthsToDebtFree: number | null;
  debtFreeDate: string;
  totalInterest: number;
  totalPaid: number;
  totalMinimumPayment: number;
  monthlyPayment: number;
  canPayoff: boolean;
}

const MAX_PAYOFF_MONTHS = 1200;

function cleanMoney(value: number): number {
  return normalizeMoneyAmount(Math.max(0, Number.isFinite(value) ? value : 0));
}

function cleanRate(value: number): number {
  return Math.max(0, Number.isFinite(value) ? value : 0);
}

function activeDebts(debts: Debt[]): Debt[] {
  return debts
    .filter(debt => cleanMoney(debt.balance) > 0)
    .map(debt => ({
      ...debt,
      balance: cleanMoney(debt.balance),
      originalBalance: cleanMoney(debt.originalBalance),
      minimumPayment: cleanMoney(debt.minimumPayment),
      interestRate: cleanRate(debt.interestRate),
    }));
}

function monthLabelFromOffset(months: number | null): string {
  if (months === null) return 'Never (payment too low)';
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function getDebtTotals(debts: Debt[]) {
  const totalDebt = debts.reduce((sum, debt) => sum + cleanMoney(debt.balance), 0);
  const totalMinimumPayment = debts.reduce((sum, debt) => sum + cleanMoney(debt.minimumPayment), 0);
  const totalOriginal = debts.reduce((sum, debt) => sum + cleanMoney(debt.originalBalance), 0);

  return {
    totalDebt,
    totalMinimumPayment,
    totalOriginal,
    overallProgress: totalOriginal > 0 ? ((totalOriginal - totalDebt) / totalOriginal) * 100 : 0,
  };
}

export function getDebtRisk(debt: Debt): RiskLevel {
  const apr = cleanRate(debt.interestRate);
  const balance = cleanMoney(debt.balance);
  if (apr >= 20 || balance >= 10000) return 'red';
  if (apr >= 12 || balance >= 4000) return 'yellow';
  return 'green';
}

export function sortDebtsForSnowball(debts: Debt[]): Debt[] {
  return activeDebts(debts).sort((a, b) => a.balance - b.balance || b.interestRate - a.interestRate);
}

export function sortDebtsForAvalanche(debts: Debt[]): Debt[] {
  return activeDebts(debts).sort((a, b) => b.interestRate - a.interestRate || a.balance - b.balance);
}

export function calculateMonthlyInterest(balance: number, apr: number): number {
  return normalizeMoneyAmount(cleanMoney(balance) * (cleanRate(apr) / 100 / 12));
}

function sortedDebts(debts: Debt[], method: 'snowball' | 'avalanche'): Debt[] {
  return method === 'snowball' ? sortDebtsForSnowball(debts) : sortDebtsForAvalanche(debts);
}

export function calculateDebtPayoffSchedule(params: {
  debts: Debt[];
  method: 'snowball' | 'avalanche';
  extraPayment: number;
}): DebtPayoffSchedule {
  const orderedDebts = sortedDebts(params.debts, params.method);
  const extraPayment = cleanMoney(params.extraPayment);
  const totalMinimumPayment = orderedDebts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  const monthlyPayment = normalizeMoneyAmount(totalMinimumPayment + extraPayment);

  const scheduleItems = new Map<string, DebtPayoffScheduleItem>();
  orderedDebts.forEach(debt => {
    scheduleItems.set(debt.id, {
      debtId: debt.id,
      debtName: debt.name,
      startingBalance: debt.balance,
      interestRate: debt.interestRate,
      minimumPayment: debt.minimumPayment,
      payoffMonth: debt.balance <= 0 ? 0 : null,
      payoffDate: debt.balance <= 0 ? monthLabelFromOffset(0) : 'Never (payment too low)',
      totalInterest: 0,
      totalPaid: 0,
      firstMonthPayment: 0,
    });
  });

  if (orderedDebts.length === 0 || monthlyPayment <= 0) {
    return {
      method: params.method,
      debts: orderedDebts.map(debt => scheduleItems.get(debt.id)!),
      monthsToDebtFree: orderedDebts.length === 0 ? 0 : null,
      debtFreeDate: orderedDebts.length === 0 ? monthLabelFromOffset(0) : 'Never (payment too low)',
      totalInterest: 0,
      totalPaid: 0,
      totalMinimumPayment,
      monthlyPayment,
      canPayoff: orderedDebts.length === 0,
    };
  }

  const balances = new Map(orderedDebts.map(debt => [debt.id, debt.balance]));
  let month = 0;
  let canPayoff = true;

  while (month < MAX_PAYOFF_MONTHS && orderedDebts.some(debt => (balances.get(debt.id) ?? 0) > 0)) {
    month += 1;

    for (const debt of orderedDebts) {
      const balance = balances.get(debt.id) ?? 0;
      if (balance <= 0) continue;

      const interest = calculateMonthlyInterest(balance, debt.interestRate);
      balances.set(debt.id, normalizeMoneyAmount(balance + interest));
      const item = scheduleItems.get(debt.id)!;
      item.totalInterest = normalizeMoneyAmount(item.totalInterest + interest);
    }

    let availablePayment = monthlyPayment;

    for (const debt of orderedDebts) {
      const balance = balances.get(debt.id) ?? 0;
      if (balance <= 0) continue;

      const payment = Math.min(balance, debt.minimumPayment, availablePayment);
      balances.set(debt.id, normalizeMoneyAmount(balance - payment));
      availablePayment = normalizeMoneyAmount(availablePayment - payment);

      const item = scheduleItems.get(debt.id)!;
      item.totalPaid = normalizeMoneyAmount(item.totalPaid + payment);
      if (month === 1) item.firstMonthPayment = normalizeMoneyAmount(item.firstMonthPayment + payment);
    }

    const target = orderedDebts.find(debt => (balances.get(debt.id) ?? 0) > 0);
    if (target && availablePayment > 0) {
      const balance = balances.get(target.id) ?? 0;
      const payment = Math.min(balance, availablePayment);
      balances.set(target.id, normalizeMoneyAmount(balance - payment));

      const item = scheduleItems.get(target.id)!;
      item.totalPaid = normalizeMoneyAmount(item.totalPaid + payment);
      if (month === 1) item.firstMonthPayment = normalizeMoneyAmount(item.firstMonthPayment + payment);
    }

    for (const debt of orderedDebts) {
      const item = scheduleItems.get(debt.id)!;
      if (item.payoffMonth !== null) continue;
      if ((balances.get(debt.id) ?? 0) <= 0) {
        item.payoffMonth = month;
        item.payoffDate = monthLabelFromOffset(month);
      }
    }

  }

  if (orderedDebts.some(debt => (balances.get(debt.id) ?? 0) > 0)) {
    canPayoff = false;
  }

  const debts = orderedDebts.map(debt => {
    const item = scheduleItems.get(debt.id)!;
    if (!canPayoff && item.payoffMonth === null) {
      return { ...item, payoffDate: 'Never (payment too low)' };
    }
    return item;
  });

  const monthsToDebtFree = canPayoff
    ? Math.max(0, ...debts.map(debt => debt.payoffMonth ?? 0))
    : null;

  return {
    method: params.method,
    debts,
    monthsToDebtFree,
    debtFreeDate: estimateDebtFreeDate(monthsToDebtFree),
    totalInterest: normalizeMoneyAmount(debts.reduce((sum, debt) => sum + debt.totalInterest, 0)),
    totalPaid: normalizeMoneyAmount(debts.reduce((sum, debt) => sum + debt.totalPaid, 0)),
    totalMinimumPayment,
    monthlyPayment,
    canPayoff,
  };
}

export function calculateDebtPayoffSummary(params: {
  debts: Debt[];
  method: 'snowball' | 'avalanche';
  extraPayment: number;
}) {
  const schedule = calculateDebtPayoffSchedule(params);
  const { totalDebt } = getDebtTotals(params.debts);

  return {
    totalDebt,
    totalMinimumPayment: schedule.totalMinimumPayment,
    monthlyPayment: schedule.monthlyPayment,
    totalInterest: schedule.totalInterest,
    totalPaid: schedule.totalPaid,
    monthsToDebtFree: schedule.monthsToDebtFree,
    debtFreeDate: schedule.debtFreeDate,
    canPayoff: schedule.canPayoff,
  };
}

export function estimateDebtFreeDate(months: number | null): string {
  return monthLabelFromOffset(months);
}

export function sortDebtsByPayoffMethod(debts: Debt[], method: 'snowball' | 'avalanche'): Debt[] {
  return sortedDebts(debts, method);
}

export function monthsToPayoff(balance: number, apr: number, monthlyPayment: number): number {
  const cleanBalance = cleanMoney(balance);
  const cleanPayment = cleanMoney(monthlyPayment);
  if (cleanBalance <= 0) return 0;
  if (cleanPayment <= 0) return 9999;

  const monthlyInterest = calculateMonthlyInterest(cleanBalance, apr);
  if (monthlyInterest >= cleanPayment) return 9999;

  const schedule = calculateDebtPayoffSchedule({
    debts: [{
      id: 'single',
      name: 'Debt',
      balance: cleanBalance,
      originalBalance: cleanBalance,
      interestRate: cleanRate(apr),
      minimumPayment: cleanPayment,
      dueDate: 1,
      color: '#071F4D',
    }],
    method: 'snowball',
    extraPayment: 0,
  });

  return schedule.monthsToDebtFree ?? 9999;
}

export function payoffDate(months: number): string {
  return monthLabelFromOffset(months >= 9999 ? null : months);
}

export function estimateTotalInterest(debts: Debt[], extraPayment: number): number {
  return calculateDebtPayoffSchedule({ debts, method: 'snowball', extraPayment }).totalInterest;
}

