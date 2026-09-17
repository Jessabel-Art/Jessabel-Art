import type { Account, RiskLevel, SavingsBucket, Transaction } from '../../types';
import { getActiveAccounts, getDerivedCurrentBalance } from '../accounts/selectors';

export function getBucketsByAccount(buckets: SavingsBucket[], accountId: string): SavingsBucket[] {
  return buckets.filter(bucket => bucket.accountId === accountId);
}

export function calculateAllocatedByAccount(
  buckets: SavingsBucket[],
  accountId: string,
  options: { excludeBucketId?: string } = {},
): number {
  return getBucketsByAccount(buckets, accountId)
    .filter(bucket => bucket.id !== options.excludeBucketId)
    .reduce((sum, bucket) => sum + bucket.allocatedAmount, 0);
}

export function calculateAvailableToAllocateByAccount(params: {
  accounts: Account[];
  transactions: Transaction[];
  buckets: SavingsBucket[];
  accountId: string;
  excludeBucketId?: string;
}): number {
  const account = getActiveAccounts(params.accounts).find(item => item.id === params.accountId);
  if (!account) return 0;

  return getDerivedCurrentBalance(account, params.transactions) - calculateAllocatedByAccount(
    params.buckets,
    params.accountId,
    { excludeBucketId: params.excludeBucketId },
  );
}

export function calculateBucketProgress(bucket: SavingsBucket) {
  const percent = bucket.goalAmount > 0 ? Math.min(100, (bucket.allocatedAmount / bucket.goalAmount) * 100) : 0;

  return {
    percent,
    remaining: bucket.goalAmount - bucket.allocatedAmount,
    fillClass: percent >= 80 ? 'safe' : percent >= 40 ? 'warning' : 'danger',
  };
}

export function calculateSavingsSummary(buckets: SavingsBucket[]) {
  const totalGoal = buckets.reduce((sum, bucket) => sum + bucket.goalAmount, 0);
  const totalAllocated = buckets.reduce((sum, bucket) => sum + bucket.allocatedAmount, 0);

  return {
    totalGoal,
    totalAllocated,
    totalRemaining: totalGoal - totalAllocated,
  };
}

export function calculateBucketRisk(bucket: SavingsBucket): RiskLevel {
  const pct = bucket.goalAmount > 0 ? (bucket.allocatedAmount / bucket.goalAmount) * 100 : 0;
  if (!bucket.targetDate) return pct >= 100 ? 'green' : 'yellow';

  const daysLeft = (new Date(bucket.targetDate).getTime() - Date.now()) / 86400000;
  if (pct >= 100) return 'green';
  if (daysLeft < 30 && pct < 80) return 'red';
  if (pct < 50 && daysLeft < 90) return 'yellow';
  return pct >= 80 ? 'green' : 'yellow';
}

export const getSavingsBucketTotals = calculateSavingsSummary;
export const getBucketRisk = calculateBucketRisk;

export function getBucketDaysLeft(bucket: SavingsBucket): number | null {
  return bucket.targetDate ? Math.ceil((new Date(bucket.targetDate).getTime() - Date.now()) / 86400000) : null;
}
