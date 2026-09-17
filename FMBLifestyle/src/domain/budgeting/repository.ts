import type { AppSettings, BudgetCategory, Envelope, Transaction } from '../../types';
import {
  addTransaction,
  deleteBudget,
  deleteEnvelope,
  deleteTransaction,
  getBudgets,
  getAccounts,
  getEnvelopes,
  getSettings,
  getTransactions,
  saveSettings,
  saveTransactions,
  updateTransaction,
  upsertBudget,
  upsertEnvelope,
} from '../../services/storage';
import { isValidMoneyAmount, normalizeMoneyAmount } from '../money';
import { calculateAvailableEnvelopeAllocationByAccount } from './selectors';
import { getActiveAccounts } from '../accounts/selectors';

export interface TransactionRepository {
  list(): Promise<Transaction[]>;
  saveAll(transactions: Transaction[]): Promise<void>;
  add(transaction: Transaction): Promise<void>;
  update(transaction: Transaction): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface BudgetRepository {
  list(): Promise<BudgetCategory[]>;
  upsert(budget: BudgetCategory): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface EnvelopeRepository {
  list(): Promise<Envelope[]>;
  upsert(envelope: Envelope): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface SettingsRepository {
  get(): Promise<AppSettings>;
  save(settings: AppSettings): Promise<void>;
}

function validateTransaction(transaction: Transaction): Transaction {
  if (!transaction.id.trim()) throw new Error('Transaction id is required.');
  if (!transaction.date.trim()) throw new Error('Transaction date is required.');
  if (!transaction.description.trim()) throw new Error('Transaction description is required.');
  if (!isValidMoneyAmount(transaction.amount)) throw new Error('Transaction amount must be a non-negative amount.');

  return {
    ...transaction,
    description: transaction.description.trim(),
    category: transaction.category.trim(),
    amount: normalizeMoneyAmount(transaction.amount),
    accountId: transaction.accountId?.trim() || undefined,
    envelopeId: transaction.type === 'expense' ? transaction.envelopeId?.trim() || undefined : undefined,
    notes: transaction.notes?.trim() || undefined,
  };
}

function validateBudget(budget: BudgetCategory): BudgetCategory {
  if (!budget.id.trim()) throw new Error('Budget id is required.');
  if (!budget.category.trim()) throw new Error('Budget category is required.');
  if (!budget.month.trim()) throw new Error('Budget month is required.');
  if (!isValidMoneyAmount(budget.budgeted)) throw new Error('Budgeted amount must be non-negative.');
  if (!isValidMoneyAmount(budget.spent)) throw new Error('Spent amount must be non-negative.');

  return {
    ...budget,
    category: budget.category.trim(),
    budgeted: normalizeMoneyAmount(budget.budgeted),
    spent: normalizeMoneyAmount(budget.spent),
  };
}

function validateEnvelope(envelope: Envelope): Envelope {
  if (!envelope.id.trim()) throw new Error('Envelope id is required.');
  if (!envelope.name.trim()) throw new Error('Envelope name is required.');
  if (!envelope.month.trim()) throw new Error('Envelope month is required.');
  if (!isValidMoneyAmount(envelope.allocated)) throw new Error('Envelope allocation must be non-negative.');
  if (!isValidMoneyAmount(envelope.spent)) throw new Error('Envelope spent amount must be non-negative.');

  const normalized = {
    ...envelope,
    name: envelope.name.trim(),
    category: envelope.category?.trim() || undefined,
    allocated: normalizeMoneyAmount(envelope.allocated),
    spent: normalizeMoneyAmount(envelope.spent),
    fromAccountId: envelope.fromAccountId?.trim() || undefined,
  };

  if (normalized.fromAccountId) {
    const accounts = getAccounts();
    const isActiveAccount = getActiveAccounts(accounts).some(account => account.id === normalized.fromAccountId);

    if (isActiveAccount) {
      const available = calculateAvailableEnvelopeAllocationByAccount({
        accounts,
        transactions: getTransactions(),
        envelopes: getEnvelopes(),
        accountId: normalized.fromAccountId,
        month: normalized.month,
        excludeEnvelopeId: normalized.id,
      });

      if (normalized.allocated > available) {
        throw new Error('Envelope allocation exceeds available source account balance.');
      }
    }
  }

  return normalized;
}

function validateSettings(settings: AppSettings): AppSettings {
  return {
    userName: settings.userName.trim(),
    currency: settings.currency.trim() || 'USD',
    currencySymbol: settings.currencySymbol.trim() || '$',
  };
}

export const transactionRepository: TransactionRepository = {
  async list() {
    return getTransactions();
  },
  async saveAll(transactions) {
    saveTransactions(transactions.map(validateTransaction));
  },
  async add(transaction) {
    addTransaction(validateTransaction(transaction));
  },
  async update(transaction) {
    updateTransaction(validateTransaction(transaction));
  },
  async delete(id) {
    deleteTransaction(id);
  },
};

export const budgetRepository: BudgetRepository = {
  async list() {
    return getBudgets();
  },
  async upsert(budget) {
    upsertBudget(validateBudget(budget));
  },
  async delete(id) {
    deleteBudget(id);
  },
};

export const envelopeRepository: EnvelopeRepository = {
  async list() {
    return getEnvelopes();
  },
  async upsert(envelope) {
    upsertEnvelope(validateEnvelope(envelope));
  },
  async delete(id) {
    deleteEnvelope(id);
  },
};

export const settingsRepository: SettingsRepository = {
  async get() {
    return getSettings();
  },
  async save(settings) {
    saveSettings(validateSettings(settings));
  },
};
