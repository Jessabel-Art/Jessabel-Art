import type { SavingsBucket } from '../../types';
import { deleteBucket, getAccounts, getBuckets, getTransactions, upsertBucket } from '../../services/storage';
import { isValidMoneyAmount, normalizeMoneyAmount } from '../money';
import { calculateAvailableToAllocateByAccount } from './selectors';
import { getActiveAccounts } from '../accounts/selectors';

export interface SavingsBucketRepository {
  list(): Promise<SavingsBucket[]>;
  upsert(bucket: SavingsBucket): Promise<void>;
  delete(id: string): Promise<void>;
}

function validateBucket(bucket: SavingsBucket): SavingsBucket {
  if (!bucket.id.trim()) throw new Error('Bucket id is required.');
  if (!bucket.name.trim()) throw new Error('Bucket name is required.');
  if (!isValidMoneyAmount(bucket.goalAmount)) throw new Error('Bucket goal amount must be non-negative.');
  if (!isValidMoneyAmount(bucket.allocatedAmount)) throw new Error('Bucket allocated amount must be non-negative.');

  const normalized = {
    ...bucket,
    name: bucket.name.trim(),
    goalAmount: normalizeMoneyAmount(bucket.goalAmount),
    allocatedAmount: normalizeMoneyAmount(bucket.allocatedAmount),
    accountId: bucket.accountId?.trim() || undefined,
    notes: bucket.notes?.trim() || undefined,
  };

  if (normalized.accountId) {
    const accounts = getAccounts();
    const isActiveAccount = getActiveAccounts(accounts).some(account => account.id === normalized.accountId);

    if (isActiveAccount) {
      const available = calculateAvailableToAllocateByAccount({
        accounts,
        transactions: getTransactions(),
        buckets: getBuckets(),
        accountId: normalized.accountId,
        excludeBucketId: normalized.id,
      });

      if (normalized.allocatedAmount > available) {
        throw new Error('Bucket allocation exceeds available account balance.');
      }
    }
  }

  return normalized;
}

export const savingsBucketRepository: SavingsBucketRepository = {
  async list() {
    return getBuckets();
  },
  async upsert(bucket) {
    upsertBucket(validateBucket(bucket));
  },
  async delete(id) {
    deleteBucket(id);
  },
};
