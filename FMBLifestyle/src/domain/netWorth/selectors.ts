import type {
  Account,
  Debt,
  NetWorthAsset,
  NetWorthLiability,
  NetWorthSnapshot,
  RiskLevel,
  Transaction,
} from '../../types';
import { getActiveAccounts, getDerivedCurrentBalance } from '../accounts/selectors';

type NetWorthChartSnapshot = Pick<NetWorthSnapshot, 'month' | 'netWorth' | 'totalAssets' | 'totalLiabilities'>;

export interface AccountBackedNetWorthItem {
  id: string;
  name: string;
  value: number;
  account: Account;
}

export interface DebtBackedNetWorthItem {
  id: string;
  name: string;
  balance: number;
  debt: Debt;
}

export interface NetWorthSummary {
  accountBackedAssets: AccountBackedNetWorthItem[];
  manualAssets: NetWorthAsset[];
  accountBackedLiabilities: AccountBackedNetWorthItem[];
  debtBackedLiabilities: DebtBackedNetWorthItem[];
  manualLiabilities: NetWorthLiability[];
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
}

const LIABILITY_ACCOUNT_TYPES: Account['type'][] = ['credit'];
const DEBT_LIABILITY_TYPES: NetWorthLiability['type'][] = [
  'credit_card',
  'loan',
  'auto_loan',
  'mortgage',
  'personal_loan',
  'collections',
  'other_debt',
];

function normalizeName(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function nearlyEqualMoney(a: number, b: number): boolean {
  return Math.abs(a - b) < 0.01;
}

function liabilityRepresentsDebt(liability: NetWorthLiability, debt: Debt): boolean {
  if (liability.debtId === debt.id) return true;
  if (normalizeName(liability.name) === normalizeName(debt.name)) return true;
  return DEBT_LIABILITY_TYPES.includes(liability.type) && nearlyEqualMoney(liability.balance, debt.balance);
}

export function getAccountBackedAssets(accounts: Account[], transactions: Transaction[]): AccountBackedNetWorthItem[] {
  return getActiveAccounts(accounts)
    .map(account => ({
      id: account.id,
      name: account.name,
      value: getDerivedCurrentBalance(account, transactions),
      account,
    }))
    .filter(item => !LIABILITY_ACCOUNT_TYPES.includes(item.account.type) && item.value > 0);
}

export function getManualAssets(assets: NetWorthAsset[]): NetWorthAsset[] {
  return assets.filter(asset => !asset.accountId);
}

export function getAccountBackedLiabilities(accounts: Account[], transactions: Transaction[]): AccountBackedNetWorthItem[] {
  return getActiveAccounts(accounts)
    .map(account => ({
      id: account.id,
      name: account.name,
      value: getDerivedCurrentBalance(account, transactions),
      account,
    }))
    .filter(item => LIABILITY_ACCOUNT_TYPES.includes(item.account.type) || item.value < 0)
    .map(item => ({ ...item, value: Math.abs(item.value) }))
    .filter(item => item.value > 0);
}

export function getDebtBackedLiabilities(
  debts: Debt[],
  liabilities: NetWorthLiability[],
  accounts: Account[],
): DebtBackedNetWorthItem[] {
  const activeAccountIds = new Set(getActiveAccounts(accounts).map(account => account.id));

  return debts
    .filter(debt => !debt.accountId || !activeAccountIds.has(debt.accountId))
    .filter(debt => !liabilities.some(liability => liabilityRepresentsDebt(liability, debt)))
    .map(debt => ({
      id: debt.id,
      name: debt.name,
      balance: debt.balance,
      debt,
    }));
}

export function getManualLiabilities(liabilities: NetWorthLiability[], debts: Debt[]): NetWorthLiability[] {
  return liabilities.filter(liability => (
    !liability.accountId &&
    !liability.debtId &&
    !debts.some(debt => liabilityRepresentsDebt(liability, debt))
  ));
}

export function calculateNetWorthSummary(params: {
  accounts: Account[];
  transactions: Transaction[];
  assets: NetWorthAsset[];
  liabilities: NetWorthLiability[];
  debts: Debt[];
}): NetWorthSummary {
  const accountBackedAssets = getAccountBackedAssets(params.accounts, params.transactions);
  const manualAssets = getManualAssets(params.assets);
  const accountBackedLiabilities = getAccountBackedLiabilities(params.accounts, params.transactions);
  const debtBackedLiabilities = getDebtBackedLiabilities(params.debts, params.liabilities, params.accounts);
  const manualLiabilities = getManualLiabilities(params.liabilities, params.debts);

  const totalAssets =
    accountBackedAssets.reduce((sum, item) => sum + item.value, 0) +
    manualAssets.reduce((sum, asset) => sum + asset.value, 0);

  const totalLiabilities =
    accountBackedLiabilities.reduce((sum, item) => sum + item.value, 0) +
    debtBackedLiabilities.reduce((sum, item) => sum + item.balance, 0) +
    manualLiabilities.reduce((sum, liability) => sum + liability.balance, 0);

  return {
    accountBackedAssets,
    manualAssets,
    accountBackedLiabilities,
    debtBackedLiabilities,
    manualLiabilities,
    totalAssets,
    totalLiabilities,
    netWorth: totalAssets - totalLiabilities,
  };
}

export function calculateNetWorthTrend(snapshots: NetWorthChartSnapshot[]) {
  return snapshots.map(snapshot => ({
    month: snapshot.month.slice(5),
    netWorth: snapshot.netWorth,
    assets: snapshot.totalAssets,
    liabilities: snapshot.totalLiabilities,
  }));
}

export function getPreviousNetWorth(snapshots: Pick<NetWorthSnapshot, 'netWorth'>[], fallback: number): number {
  return snapshots.length >= 2 ? snapshots[snapshots.length - 2].netWorth : fallback;
}

export function getNetWorthRisk(netWorth: number, previousNetWorth: number): RiskLevel {
  if (netWorth <= 0) return 'red';
  if (netWorth < previousNetWorth) return 'yellow';
  return 'green';
}

export const getNetWorthTotals = calculateNetWorthSummary;
export const toNetWorthChartData = calculateNetWorthTrend;
