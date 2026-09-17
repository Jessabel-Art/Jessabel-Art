import { accountRepository } from '../../domain/accounts/repository';
import {
  budgetRepository,
  envelopeRepository,
  settingsRepository,
  transactionRepository,
} from '../../domain/budgeting/repository';
import { debtPayoffPlanRepository, debtRepository } from '../../domain/debt/repository';
import { netWorthRepository } from '../../domain/netWorth/repository';
import { savingsBucketRepository } from '../../domain/savings/repository';
import { mortgageGoalRepository, mortgageReadinessSnapshotRepository, mortgageScenarioRepository } from '../../domain/mortgage/repository';

export const localStorageRepositories = {
  accounts: accountRepository,
  budgets: budgetRepository,
  debtPayoffPlans: debtPayoffPlanRepository,
  debts: debtRepository,
  envelopes: envelopeRepository,
  netWorth: netWorthRepository,
  mortgageScenarios: mortgageScenarioRepository,
  mortgageGoals: mortgageGoalRepository,
  mortgageReadinessSnapshots: mortgageReadinessSnapshotRepository,
  savingsBuckets: savingsBucketRepository,
  settings: settingsRepository,
  transactions: transactionRepository,
};
