import { localStorageRepositories } from './localStorage/localStorageRepositories';
import { sqliteAccountRepository } from './sqlite/sqliteAccountRepository';
import { sqliteBudgetRepository } from './sqlite/sqliteBudgetRepository';
import { sqliteDebtPayoffPlanRepository } from './sqlite/sqliteDebtPayoffPlanRepository';
import { sqliteDebtRepository } from './sqlite/sqliteDebtRepository';
import { sqliteEnvelopeRepository } from './sqlite/sqliteEnvelopeRepository';
import { sqliteNetWorthRepository } from './sqlite/sqliteNetWorthRepository';
import { sqliteSavingsBucketRepository } from './sqlite/sqliteSavingsBucketRepository';
import { sqliteSettingsRepository } from './sqlite/sqliteSettingsRepository';
import { sqliteTransactionRepository } from './sqlite/sqliteTransactionRepository';

export type RepositoryProvider = typeof localStorageRepositories;
export type RepositoryBackend =
  | 'localStorage'
  | 'sqliteSettingsPreview'
  | 'sqliteAccountsPreview'
  | 'sqliteBudgetingPreview'
  | 'sqliteSavingsPreview'
  | 'sqliteDebtPreview'
  | 'sqliteFullPreview';

const sqliteSettingsPreviewEnabled =
  import.meta.env.DEV && import.meta.env.VITE_PFA_SQLITE_SETTINGS_PREVIEW === 'true';
const sqliteAccountsPreviewEnabled =
  import.meta.env.DEV && import.meta.env.VITE_PFA_SQLITE_ACCOUNTS_PREVIEW === 'true';
const sqliteBudgetingPreviewEnabled =
  import.meta.env.DEV && import.meta.env.VITE_PFA_SQLITE_BUDGETING_PREVIEW === 'true';
const sqliteSavingsPreviewEnabled =
  import.meta.env.DEV && import.meta.env.VITE_PFA_SQLITE_SAVINGS_PREVIEW === 'true';
const sqliteDebtPreviewEnabled =
  import.meta.env.DEV && import.meta.env.VITE_PFA_SQLITE_DEBT_PREVIEW === 'true';
const sqliteFullPreviewEnabled =
  import.meta.env.DEV && import.meta.env.VITE_PFA_SQLITE_FULL_PREVIEW === 'true';

// Temporary verification adapter for SQLite Phase 4A. This lets developers test
// only settings against SQLite without changing the production/default backend.
const safeSqliteSettingsRepository: RepositoryProvider['settings'] = {
  async get() {
    try {
      return await sqliteSettingsRepository.get();
    } catch (error) {
      console.warn('SQLite settings preview read failed; falling back to localStorage settings.', error);
      return localStorageRepositories.settings.get();
    }
  },
  async save(settings) {
    try {
      await sqliteSettingsRepository.save(settings);
    } catch (error) {
      console.warn('SQLite settings preview save failed; falling back to localStorage settings.', error);
      await localStorageRepositories.settings.save(settings);
    }
  },
};

// Temporary verification adapter for SQLite Phase 4B. This lets developers test
// only accounts and transactions against SQLite while every other domain stays
// on localStorage and production/default behavior remains unchanged.
const safeSqliteAccountRepository: RepositoryProvider['accounts'] = {
  async list() {
    try {
      return await sqliteAccountRepository.list();
    } catch (error) {
      console.warn('SQLite accounts preview list failed; falling back to localStorage accounts.', error);
      return localStorageRepositories.accounts.list();
    }
  },
  async upsert(account) {
    try {
      await sqliteAccountRepository.upsert(account);
    } catch (error) {
      console.warn('SQLite accounts preview save failed; falling back to localStorage accounts.', error);
      await localStorageRepositories.accounts.upsert(account);
    }
  },
  async delete(id) {
    try {
      await sqliteAccountRepository.delete(id);
    } catch (error) {
      console.warn('SQLite accounts preview delete failed; falling back to localStorage accounts.', error);
      await localStorageRepositories.accounts.delete(id);
    }
  },
  async hasDependencies(id) {
    try {
      return await sqliteAccountRepository.hasDependencies(id);
    } catch (error) {
      console.warn('SQLite accounts preview dependency check failed; falling back to localStorage accounts.', error);
      return localStorageRepositories.accounts.hasDependencies(id);
    }
  },
};

const safeSqliteTransactionRepository: RepositoryProvider['transactions'] = {
  async list() {
    try {
      return await sqliteTransactionRepository.list();
    } catch (error) {
      console.warn('SQLite transactions preview list failed; falling back to localStorage transactions.', error);
      return localStorageRepositories.transactions.list();
    }
  },
  async saveAll(transactions) {
    try {
      await sqliteTransactionRepository.saveAll(transactions);
    } catch (error) {
      console.warn('SQLite transactions preview saveAll failed; falling back to localStorage transactions.', error);
      await localStorageRepositories.transactions.saveAll(transactions);
    }
  },
  async add(transaction) {
    try {
      await sqliteTransactionRepository.add(transaction);
    } catch (error) {
      console.warn('SQLite transactions preview add failed; falling back to localStorage transactions.', error);
      await localStorageRepositories.transactions.add(transaction);
    }
  },
  async update(transaction) {
    try {
      await sqliteTransactionRepository.update(transaction);
    } catch (error) {
      console.warn('SQLite transactions preview update failed; falling back to localStorage transactions.', error);
      await localStorageRepositories.transactions.update(transaction);
    }
  },
  async delete(id) {
    try {
      await sqliteTransactionRepository.delete(id);
    } catch (error) {
      console.warn('SQLite transactions preview delete failed; falling back to localStorage transactions.', error);
      await localStorageRepositories.transactions.delete(id);
    }
  },
};

// Temporary verification adapter for SQLite Phase 4C. This adds budgets and
// envelopes to the SQLite preview set while localStorage remains the default.
const safeSqliteBudgetRepository: RepositoryProvider['budgets'] = {
  async list() {
    try {
      return await sqliteBudgetRepository.list();
    } catch (error) {
      console.warn('SQLite budgets preview list failed; falling back to localStorage budgets.', error);
      return localStorageRepositories.budgets.list();
    }
  },
  async upsert(budget) {
    try {
      await sqliteBudgetRepository.upsert(budget);
    } catch (error) {
      console.warn('SQLite budgets preview save failed; falling back to localStorage budgets.', error);
      await localStorageRepositories.budgets.upsert(budget);
    }
  },
  async delete(id) {
    try {
      await sqliteBudgetRepository.delete(id);
    } catch (error) {
      console.warn('SQLite budgets preview delete failed; falling back to localStorage budgets.', error);
      await localStorageRepositories.budgets.delete(id);
    }
  },
};

const safeSqliteEnvelopeRepository: RepositoryProvider['envelopes'] = {
  async list() {
    try {
      return await sqliteEnvelopeRepository.list();
    } catch (error) {
      console.warn('SQLite envelopes preview list failed; falling back to localStorage envelopes.', error);
      return localStorageRepositories.envelopes.list();
    }
  },
  async upsert(envelope) {
    try {
      await sqliteEnvelopeRepository.upsert(envelope);
    } catch (error) {
      console.warn('SQLite envelopes preview save failed; falling back to localStorage envelopes.', error);
      await localStorageRepositories.envelopes.upsert(envelope);
    }
  },
  async delete(id) {
    try {
      await sqliteEnvelopeRepository.delete(id);
    } catch (error) {
      console.warn('SQLite envelopes preview delete failed; falling back to localStorage envelopes.', error);
      await localStorageRepositories.envelopes.delete(id);
    }
  },
};

// Temporary verification adapter for SQLite Phase 4D. This adds savings buckets
// to the SQLite preview set while localStorage remains the default backend.
const safeSqliteSavingsBucketRepository: RepositoryProvider['savingsBuckets'] = {
  async list() {
    try {
      return await sqliteSavingsBucketRepository.list();
    } catch (error) {
      console.warn('SQLite savings buckets preview list failed; falling back to localStorage buckets.', error);
      return localStorageRepositories.savingsBuckets.list();
    }
  },
  async upsert(bucket) {
    try {
      await sqliteSavingsBucketRepository.upsert(bucket);
    } catch (error) {
      console.warn('SQLite savings buckets preview save failed; falling back to localStorage buckets.', error);
      await localStorageRepositories.savingsBuckets.upsert(bucket);
    }
  },
  async delete(id) {
    try {
      await sqliteSavingsBucketRepository.delete(id);
    } catch (error) {
      console.warn('SQLite savings buckets preview delete failed; falling back to localStorage buckets.', error);
      await localStorageRepositories.savingsBuckets.delete(id);
    }
  },
};

// Temporary verification adapter for SQLite Phase 4E. Debt payoff schedules are
// still derived by domain services; this preview stores only debts and plan headers.
const safeSqliteDebtRepository: RepositoryProvider['debts'] = {
  async list() {
    try {
      return await sqliteDebtRepository.list();
    } catch (error) {
      console.warn('SQLite debts preview list failed; falling back to localStorage debts.', error);
      return localStorageRepositories.debts.list();
    }
  },
  async saveAll(debts) {
    try {
      await sqliteDebtRepository.saveAll(debts);
    } catch (error) {
      console.warn('SQLite debts preview saveAll failed; falling back to localStorage debts.', error);
      await localStorageRepositories.debts.saveAll(debts);
    }
  },
  async upsert(debt) {
    try {
      await sqliteDebtRepository.upsert(debt);
    } catch (error) {
      console.warn('SQLite debts preview save failed; falling back to localStorage debts.', error);
      await localStorageRepositories.debts.upsert(debt);
    }
  },
  async delete(id) {
    try {
      await sqliteDebtRepository.delete(id);
    } catch (error) {
      console.warn('SQLite debts preview delete failed; falling back to localStorage debts.', error);
      await localStorageRepositories.debts.delete(id);
    }
  },
};

const safeSqliteDebtPayoffPlanRepository: RepositoryProvider['debtPayoffPlans'] = {
  async list() {
    try {
      return await sqliteDebtPayoffPlanRepository.list();
    } catch (error) {
      console.warn('SQLite debt payoff plans preview list failed; falling back to localStorage plans.', error);
      return localStorageRepositories.debtPayoffPlans.list();
    }
  },
  async upsert(plan) {
    try {
      await sqliteDebtPayoffPlanRepository.upsert(plan);
    } catch (error) {
      console.warn('SQLite debt payoff plans preview save failed; falling back to localStorage plans.', error);
      await localStorageRepositories.debtPayoffPlans.upsert(plan);
    }
  },
};

// Temporary verification adapter for SQLite Phase 4F. This completes the
// preview repository set, but only when the explicit full-preview dev flag is enabled.
const safeSqliteNetWorthRepository: RepositoryProvider['netWorth'] = {
  async listAssets() {
    try {
      return await sqliteNetWorthRepository.listAssets();
    } catch (error) {
      console.warn('SQLite net worth assets preview list failed; falling back to localStorage assets.', error);
      return localStorageRepositories.netWorth.listAssets();
    }
  },
  async upsertAsset(asset) {
    try {
      await sqliteNetWorthRepository.upsertAsset(asset);
    } catch (error) {
      console.warn('SQLite net worth asset preview save failed; falling back to localStorage assets.', error);
      await localStorageRepositories.netWorth.upsertAsset(asset);
    }
  },
  async deleteAsset(id) {
    try {
      await sqliteNetWorthRepository.deleteAsset(id);
    } catch (error) {
      console.warn('SQLite net worth asset preview delete failed; falling back to localStorage assets.', error);
      await localStorageRepositories.netWorth.deleteAsset(id);
    }
  },
  async listLiabilities() {
    try {
      return await sqliteNetWorthRepository.listLiabilities();
    } catch (error) {
      console.warn('SQLite net worth liabilities preview list failed; falling back to localStorage liabilities.', error);
      return localStorageRepositories.netWorth.listLiabilities();
    }
  },
  async upsertLiability(liability) {
    try {
      await sqliteNetWorthRepository.upsertLiability(liability);
    } catch (error) {
      console.warn('SQLite net worth liability preview save failed; falling back to localStorage liabilities.', error);
      await localStorageRepositories.netWorth.upsertLiability(liability);
    }
  },
  async deleteLiability(id) {
    try {
      await sqliteNetWorthRepository.deleteLiability(id);
    } catch (error) {
      console.warn('SQLite net worth liability preview delete failed; falling back to localStorage liabilities.', error);
      await localStorageRepositories.netWorth.deleteLiability(id);
    }
  },
  async listSnapshots() {
    try {
      return await sqliteNetWorthRepository.listSnapshots();
    } catch (error) {
      console.warn('SQLite net worth snapshots preview list failed; falling back to localStorage snapshots.', error);
      return localStorageRepositories.netWorth.listSnapshots();
    }
  },
  async saveSnapshot(snapshot) {
    try {
      await sqliteNetWorthRepository.saveSnapshot(snapshot);
    } catch (error) {
      console.warn('SQLite net worth snapshot preview save failed; falling back to localStorage snapshots.', error);
      await localStorageRepositories.netWorth.saveSnapshot(snapshot);
    }
  },
};

export const sqliteSettingsPreviewRepositories: RepositoryProvider = {
  ...localStorageRepositories,
  settings: safeSqliteSettingsRepository,
};

export const sqliteAccountsPreviewRepositories: RepositoryProvider = {
  ...localStorageRepositories,
  accounts: safeSqliteAccountRepository,
  transactions: safeSqliteTransactionRepository,
  settings: sqliteSettingsPreviewEnabled ? safeSqliteSettingsRepository : localStorageRepositories.settings,
};

export const sqliteBudgetingPreviewRepositories: RepositoryProvider = {
  ...sqliteAccountsPreviewRepositories,
  budgets: safeSqliteBudgetRepository,
  envelopes: safeSqliteEnvelopeRepository,
};

export const sqliteSavingsPreviewRepositories: RepositoryProvider = {
  ...sqliteBudgetingPreviewRepositories,
  savingsBuckets: safeSqliteSavingsBucketRepository,
};

export const sqliteDebtPreviewRepositories: RepositoryProvider = {
  ...sqliteSavingsPreviewRepositories,
  debts: safeSqliteDebtRepository,
  debtPayoffPlans: safeSqliteDebtPayoffPlanRepository,
};

export const sqliteFullPreviewRepositories: RepositoryProvider = {
  ...sqliteDebtPreviewRepositories,
  settings: safeSqliteSettingsRepository,
  netWorth: safeSqliteNetWorthRepository,
};

export function getRepositoryProviderForBackend(backend: RepositoryBackend): RepositoryProvider {
  if (backend === 'sqliteFullPreview') return sqliteFullPreviewRepositories;
  if (backend === 'sqliteDebtPreview') return sqliteDebtPreviewRepositories;
  if (backend === 'sqliteSavingsPreview') return sqliteSavingsPreviewRepositories;
  if (backend === 'sqliteBudgetingPreview') return sqliteBudgetingPreviewRepositories;
  if (backend === 'sqliteAccountsPreview') return sqliteAccountsPreviewRepositories;
  if (backend === 'sqliteSettingsPreview') return sqliteSettingsPreviewRepositories;
  return localStorageRepositories;
}

export function getRepositoryProvider(): RepositoryProvider {
  if (sqliteFullPreviewEnabled) return sqliteFullPreviewRepositories;
  if (sqliteDebtPreviewEnabled) return sqliteDebtPreviewRepositories;
  if (sqliteSavingsPreviewEnabled) return sqliteSavingsPreviewRepositories;
  if (sqliteBudgetingPreviewEnabled) return sqliteBudgetingPreviewRepositories;
  if (sqliteAccountsPreviewEnabled) return sqliteAccountsPreviewRepositories;
  if (sqliteSettingsPreviewEnabled) return sqliteSettingsPreviewRepositories;
  return localStorageRepositories;
}

export const repositories = getRepositoryProvider();
