import type { SavingsBucket } from '../../types';
import type { SavingsBucketRepository } from '../../domain/savings/repository';
import { getActiveAccounts } from '../../domain/accounts/selectors';
import { calculateAvailableToAllocateByAccount } from '../../domain/savings/selectors';
import { isValidMoneyAmount, normalizeMoneyAmount } from '../../domain/money';
import { getSqliteDatabase } from './db';
import { fromSqliteCents, nullableToUndefined, optionalText, toSqliteCents } from './mappers';
import { sqliteAccountRepository } from './sqliteAccountRepository';
import { sqliteTransactionRepository } from './sqliteTransactionRepository';
import { withSqliteTransaction } from './transaction';

interface SavingsBucketRow {
  id: string;
  name: string;
  goal_amount_cents: number;
  allocated_amount_cents: number;
  target_date: string | null;
  account_id: string | null;
  color: string;
  notes: string | null;
}

function validateBucketShape(bucket: SavingsBucket): SavingsBucket {
  if (!bucket.id.trim()) throw new Error('Bucket id is required.');
  if (!bucket.name.trim()) throw new Error('Bucket name is required.');
  if (!isValidMoneyAmount(bucket.goalAmount)) throw new Error('Bucket goal amount must be non-negative.');
  if (!isValidMoneyAmount(bucket.allocatedAmount)) throw new Error('Bucket allocated amount must be non-negative.');

  return {
    ...bucket,
    id: bucket.id.trim(),
    name: bucket.name.trim(),
    goalAmount: normalizeMoneyAmount(bucket.goalAmount),
    allocatedAmount: normalizeMoneyAmount(bucket.allocatedAmount),
    targetDate: bucket.targetDate?.trim() || undefined,
    accountId: bucket.accountId?.trim() || undefined,
    color: bucket.color.trim() || '#0A2A66',
    notes: bucket.notes?.trim() || undefined,
  };
}

function rowToBucket(row: SavingsBucketRow): SavingsBucket {
  return {
    id: row.id,
    name: row.name,
    goalAmount: fromSqliteCents(row.goal_amount_cents),
    allocatedAmount: fromSqliteCents(row.allocated_amount_cents),
    targetDate: nullableToUndefined(row.target_date),
    accountId: nullableToUndefined(row.account_id),
    color: row.color,
    notes: nullableToUndefined(row.notes),
  };
}

async function listBuckets(): Promise<SavingsBucket[]> {
  const database = await getSqliteDatabase();
  const rows = await database.select<SavingsBucketRow[]>(
    `SELECT id, name, goal_amount_cents, allocated_amount_cents, target_date, account_id, color, notes
     FROM savings_buckets
     ORDER BY name ASC`,
  );

  return rows.map(rowToBucket);
}

async function validateBucket(bucket: SavingsBucket): Promise<SavingsBucket> {
  const normalized = validateBucketShape(bucket);

  if (normalized.accountId) {
    const accounts = await sqliteAccountRepository.list();
    const isActiveAccount = getActiveAccounts(accounts).some(account => account.id === normalized.accountId);

    if (isActiveAccount) {
      const [transactions, buckets] = await Promise.all([
        sqliteTransactionRepository.list(),
        listBuckets(),
      ]);
      const available = calculateAvailableToAllocateByAccount({
        accounts,
        transactions,
        buckets,
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

export const sqliteSavingsBucketRepository: SavingsBucketRepository = {
  async list() {
    return listBuckets();
  },

  async upsert(bucket) {
    const normalized = await validateBucket(bucket);

    await withSqliteTransaction(async database => {
      await database.execute(
        `INSERT INTO savings_buckets (
           id, name, goal_amount_cents, allocated_amount_cents, target_date, account_id, color, notes
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT(id) DO UPDATE SET
           name = excluded.name,
           goal_amount_cents = excluded.goal_amount_cents,
           allocated_amount_cents = excluded.allocated_amount_cents,
           target_date = excluded.target_date,
           account_id = excluded.account_id,
           color = excluded.color,
           notes = excluded.notes`,
        [
          normalized.id,
          normalized.name,
          toSqliteCents(normalized.goalAmount),
          toSqliteCents(normalized.allocatedAmount),
          optionalText(normalized.targetDate),
          optionalText(normalized.accountId),
          normalized.color,
          optionalText(normalized.notes),
        ],
      );
    });
  },

  async delete(id) {
    const database = await getSqliteDatabase();
    await database.execute('DELETE FROM savings_buckets WHERE id = $1', [id]);
  },
};

