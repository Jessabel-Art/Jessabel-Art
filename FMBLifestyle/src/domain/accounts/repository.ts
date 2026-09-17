import type { Account } from '../../types';
import {
  deleteAccount,
  getAccounts,
  getAssets,
  getBuckets,
  getDebts,
  getEnvelopes,
  getLiabilities,
  getTransactions,
  upsertAccount,
} from '../../services/storage';
import { isValidMoneyAmount, normalizeMoneyAmount } from '../money';

export interface AccountRepository {
  list(): Promise<Account[]>;
  upsert(account: Account): Promise<void>;
  delete(id: string): Promise<void>;
  hasDependencies(id: string): Promise<boolean>;
}

function validateAccount(account: Account): Account {
  if (!account.id.trim()) throw new Error('Account id is required.');
  if (!account.name.trim()) throw new Error('Account name is required.');
  if (!isValidMoneyAmount(account.balance, { allowNegative: true })) {
    throw new Error('Account balance must be a valid amount.');
  }
  if (account.openingBalance !== undefined && !isValidMoneyAmount(account.openingBalance, { allowNegative: true })) {
    throw new Error('Account opening balance must be a valid amount.');
  }

  return {
    ...account,
    name: account.name.trim(),
    balance: normalizeMoneyAmount(account.balance),
    openingBalance: account.openingBalance === undefined ? undefined : normalizeMoneyAmount(account.openingBalance),
    institution: account.institution?.trim() || undefined,
    notes: account.notes?.trim() || undefined,
  };
}

function accountHasDependencies(id: string): boolean {
  return (
    getTransactions().some(transaction => transaction.accountId === id) ||
    getBuckets().some(bucket => bucket.accountId === id) ||
    getEnvelopes().some(envelope => envelope.fromAccountId === id) ||
    getAssets().some(asset => asset.accountId === id) ||
    getDebts().some(debt => debt.accountId === id) ||
    getLiabilities().some(liability => liability.accountId === id)
  );
}

function archiveAccount(id: string): void {
  const account = getAccounts().find(item => item.id === id);
  if (!account) return;

  upsertAccount(validateAccount({
    ...account,
    archivedAt: account.archivedAt ?? new Date().toISOString(),
  }));
}

export const accountRepository: AccountRepository = {
  async list() {
    return getAccounts();
  },
  async upsert(account) {
    const normalized = validateAccount(account);
    upsertAccount({
      ...normalized,
      openingBalance: normalized.openingBalance ?? normalized.balance,
      updatedAt: new Date().toISOString(),
    });
  },
  async delete(id) {
    if (accountHasDependencies(id)) {
      archiveAccount(id);
      return;
    }
    deleteAccount(id);
  },
  async hasDependencies(id) {
    return accountHasDependencies(id);
  },
};
