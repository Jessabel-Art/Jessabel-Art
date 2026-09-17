import type { MortgageGoal, MortgageReadinessSnapshot, MortgageScenario } from '../../types';
import { hasMortgageSnapshotChanged } from './calculators';
import {
  deleteMortgageGoal,
  deleteMortgageScenario,
  getMortgageGoals,
  getMortgageReadinessSnapshots,
  getMortgageScenarios,
  saveMortgageReadinessSnapshots,
  upsertMortgageGoal,
  upsertMortgageReadinessSnapshot,
  upsertMortgageScenario,
} from '../../services/storage';
import { isValidMoneyAmount, normalizeMoneyAmount } from '../money';

export interface MortgageScenarioRepository {
  list(): Promise<MortgageScenario[]>;
  upsert(scenario: MortgageScenario): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface MortgageGoalRepository {
  list(): Promise<MortgageGoal[]>;
  upsert(goal: MortgageGoal): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface MortgageReadinessSnapshotRepository {
  list(): Promise<MortgageReadinessSnapshot[]>;
  save(snapshot: MortgageReadinessSnapshot): Promise<MortgageReadinessSnapshot>;
}

function validateScenario(scenario: MortgageScenario): MortgageScenario {
  if (!scenario.id.trim()) throw new Error('Mortgage scenario id is required.');
  if (!scenario.name.trim()) throw new Error('Mortgage scenario name is required.');
  if (!isValidMoneyAmount(scenario.grossMonthlyIncome)) throw new Error('Monthly income must be non-negative.');
  if (!isValidMoneyAmount(scenario.grossAnnualIncome)) throw new Error('Annual income must be non-negative.');
  if (!isValidMoneyAmount(scenario.homePrice)) throw new Error('Home price must be non-negative.');
  if (!isValidMoneyAmount(scenario.downPaymentAmount)) throw new Error('Down payment must be non-negative.');
  if (!Number.isFinite(scenario.interestRate) || scenario.interestRate < 0) throw new Error('Interest rate must be non-negative.');
  if (!Number.isFinite(scenario.loanTermYears) || scenario.loanTermYears <= 0) throw new Error('Loan term must be positive.');

  return {
    ...scenario,
    name: scenario.name.trim(),
    grossMonthlyIncome: normalizeMoneyAmount(scenario.grossMonthlyIncome),
    grossAnnualIncome: normalizeMoneyAmount(scenario.grossAnnualIncome),
    monthlyDebts: {
      creditCards: normalizeMoneyAmount(scenario.monthlyDebts.creditCards),
      autoLoans: normalizeMoneyAmount(scenario.monthlyDebts.autoLoans),
      studentLoans: normalizeMoneyAmount(scenario.monthlyDebts.studentLoans),
      personalLoans: normalizeMoneyAmount(scenario.monthlyDebts.personalLoans),
      supportObligations: normalizeMoneyAmount(scenario.monthlyDebts.supportObligations),
      otherDebts: normalizeMoneyAmount(scenario.monthlyDebts.otherDebts),
    },
    homePrice: normalizeMoneyAmount(scenario.homePrice),
    downPaymentAmount: normalizeMoneyAmount(scenario.downPaymentAmount),
    annualTaxes: normalizeMoneyAmount(scenario.annualTaxes),
    monthlyInsurance: normalizeMoneyAmount(scenario.monthlyInsurance),
    monthlyHoa: normalizeMoneyAmount(scenario.monthlyHoa),
    monthlyPmiMip: normalizeMoneyAmount(scenario.monthlyPmiMip),
    emergencyFundMonths: Math.max(0, scenario.emergencyFundMonths),
    updatedAt: scenario.updatedAt || new Date().toISOString(),
  };
}

export const mortgageScenarioRepository: MortgageScenarioRepository = {
  async list() {
    return getMortgageScenarios();
  },
  async upsert(scenario) {
    upsertMortgageScenario(validateScenario(scenario));
  },
  async delete(id) {
    deleteMortgageScenario(id);
  },
};

function validateGoal(goal: MortgageGoal): MortgageGoal {
  if (!goal.id.trim()) throw new Error('Mortgage goal id is required.');
  if (!goal.name.trim()) throw new Error('Mortgage goal name is required.');
  if (!isValidMoneyAmount(goal.targetHomePrice)) throw new Error('Target home price must be non-negative.');
  if (!isValidMoneyAmount(goal.currentSavings)) throw new Error('Current savings must be non-negative.');
  if (!Number.isFinite(goal.downPaymentPercent) || goal.downPaymentPercent < 0) throw new Error('Down payment percent must be non-negative.');
  if (!Number.isFinite(goal.closingCostPercent) || goal.closingCostPercent < 0) throw new Error('Closing cost percent must be non-negative.');

  return {
    ...goal,
    name: goal.name.trim(),
    targetHomePrice: normalizeMoneyAmount(goal.targetHomePrice),
    currentSavings: normalizeMoneyAmount(goal.currentSavings),
    monthlyContribution: goal.monthlyContribution === undefined ? undefined : normalizeMoneyAmount(goal.monthlyContribution),
    linkedAccountId: goal.linkedAccountId?.trim() || undefined,
    linkedSavingsGoalId: goal.linkedSavingsGoalId?.trim() || undefined,
    createdAt: goal.createdAt || new Date().toISOString(),
    updatedAt: goal.updatedAt || new Date().toISOString(),
  };
}

export const mortgageGoalRepository: MortgageGoalRepository = {
  async list() {
    return getMortgageGoals();
  },
  async upsert(goal) {
    upsertMortgageGoal(validateGoal(goal));
  },
  async delete(id) {
    deleteMortgageGoal(id);
  },
};

function validateSnapshot(snapshot: MortgageReadinessSnapshot): MortgageReadinessSnapshot {
  if (!snapshot.id.trim()) throw new Error('Mortgage snapshot id is required.');
  if (!snapshot.date.trim()) throw new Error('Mortgage snapshot date is required.');
  if (!snapshot.scenarioId.trim()) throw new Error('Mortgage snapshot scenario id is required.');
  if (!snapshot.scenarioName.trim()) throw new Error('Mortgage snapshot scenario name is required.');

  return {
    ...snapshot,
    scenarioName: snapshot.scenarioName.trim(),
    grossMonthlyIncome: normalizeMoneyAmount(snapshot.grossMonthlyIncome),
    monthlyDebts: normalizeMoneyAmount(snapshot.monthlyDebts),
    housingPayment: normalizeMoneyAmount(snapshot.housingPayment),
    frontEndDti: Math.max(0, snapshot.frontEndDti),
    backEndDti: Math.max(0, snapshot.backEndDti),
    programTargetDti: Math.max(0, snapshot.programTargetDti),
    dtiUsagePercent: Math.max(0, snapshot.dtiUsagePercent),
    readinessScore: Math.max(0, Math.min(100, Math.round(snapshot.readinessScore))),
    buyingPower: normalizeMoneyAmount(snapshot.buyingPower),
    createdAt: snapshot.createdAt || new Date().toISOString(),
  };
}

export const mortgageReadinessSnapshotRepository: MortgageReadinessSnapshotRepository = {
  async list() {
    return getMortgageReadinessSnapshots();
  },
  async save(snapshot) {
    const validated = validateSnapshot(snapshot);
    const existing = getMortgageReadinessSnapshots();
    const sameDay = existing.find(item => item.date === validated.date && item.scenarioId === validated.scenarioId);

    if (!sameDay) {
      upsertMortgageReadinessSnapshot(validated);
      return validated;
    }

    if (!hasMortgageSnapshotChanged(sameDay, validated)) return sameDay;

    const updated = { ...validated, id: sameDay.id, createdAt: sameDay.createdAt };
    saveMortgageReadinessSnapshots(existing.map(item => item.id === sameDay.id ? updated : item));
    return updated;
  },
};
