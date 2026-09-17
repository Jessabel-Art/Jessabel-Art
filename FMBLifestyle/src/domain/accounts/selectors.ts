import type { Account, Transaction } from '../../types';

export function getActiveAccounts(accounts: Account[]): Account[] {
  return accounts.filter(account => !account.archivedAt);
}

export function getAccountOpeningBalance(account: Account): number {
  return account.openingBalance ?? account.balance;
}

export function getAccountTransactionTotal(account: Account, transactions: Transaction[]): number {
  return transactions
    .filter(transaction => transaction.accountId === account.id)
    .reduce((sum, transaction) => sum + (transaction.type === 'income' ? transaction.amount : -transaction.amount), 0);
}

export function getManualCurrentBalanceFallback(account: Account): number {
  return account.balance;
}

export function getDerivedCurrentBalance(account: Account, transactions: Transaction[]): number {
  const transactionTotal = getAccountTransactionTotal(account, transactions);
  const hasLinkedTransactions = transactions.some(transaction => transaction.accountId === account.id);

  if (account.openingBalance === undefined && !hasLinkedTransactions) {
    return getManualCurrentBalanceFallback(account);
  }

  return getAccountOpeningBalance(account) + transactionTotal;
}

export function getTotalAccountBalance(accounts: Account[], transactions: Transaction[] = []): number {
  return getActiveAccounts(accounts).reduce((sum, account) => sum + getDerivedCurrentBalance(account, transactions), 0);
}

export function getAccountBalanceByType(accounts: Account[], type: Account['type'], transactions: Transaction[] = []): number {
  return getActiveAccounts(accounts)
    .filter(account => account.type === type)
    .reduce((sum, account) => sum + getDerivedCurrentBalance(account, transactions), 0);
}

export function getAccountCountByType(accounts: Account[], type: Account['type']): number {
  return getActiveAccounts(accounts).filter(account => account.type === type).length;
}
