import type { Envelope } from '../../types';
import type { EnvelopeRepository } from '../../domain/budgeting/repository';
import { calculateAvailableEnvelopeAllocationByAccount } from '../../domain/budgeting/selectors';
import { getActiveAccounts } from '../../domain/accounts/selectors';
import { isValidMoneyAmount, normalizeMoneyAmount } from '../../domain/money';
import type Database from '@tauri-apps/plugin-sql';
import { getSqliteDatabase } from './db';
import { fromSqliteCents, nullableToUndefined, optionalText, toSqliteCents } from './mappers';
import { sqliteAccountRepository } from './sqliteAccountRepository';
import { sqliteTransactionRepository } from './sqliteTransactionRepository';
import { withSqliteTransaction } from './transaction';

interface EnvelopeRow {
  id: string;
  name: string;
  category: string | null;
  allocated_cents: number;
  spent_fallback_cents: number;
  month: string;
  color: string | null;
  from_account_id: string | null;
}

function validateEnvelopeShape(envelope: Envelope): Envelope {
  if (!envelope.id.trim()) throw new Error('Envelope id is required.');
  if (!envelope.name.trim()) throw new Error('Envelope name is required.');
  if (!envelope.month.trim()) throw new Error('Envelope month is required.');
  if (!isValidMoneyAmount(envelope.allocated)) throw new Error('Envelope allocation must be non-negative.');
  if (!isValidMoneyAmount(envelope.spent)) throw new Error('Envelope spent amount must be non-negative.');

  return {
    ...envelope,
    id: envelope.id.trim(),
    name: envelope.name.trim(),
    category: envelope.category?.trim() || undefined,
    allocated: normalizeMoneyAmount(envelope.allocated),
    spent: normalizeMoneyAmount(envelope.spent),
    month: envelope.month.trim(),
    fromAccountId: envelope.fromAccountId?.trim() || undefined,
  };
}

function rowToEnvelope(row: EnvelopeRow): Envelope {
  return {
    id: row.id,
    name: row.name,
    category: nullableToUndefined(row.category),
    allocated: fromSqliteCents(row.allocated_cents),
    spent: fromSqliteCents(row.spent_fallback_cents),
    month: row.month,
    color: nullableToUndefined(row.color),
    fromAccountId: nullableToUndefined(row.from_account_id),
  };
}

async function listEnvelopes(database?: Database): Promise<Envelope[]> {
  const activeDatabase = database ?? await getSqliteDatabase();
  const rows = await activeDatabase.select<EnvelopeRow[]>(
    `SELECT id, name, category, allocated_cents, spent_fallback_cents, month, color, from_account_id
     FROM envelopes
     ORDER BY month DESC, name ASC`,
  );

  return rows.map(rowToEnvelope);
}

async function validateEnvelope(envelope: Envelope, database?: Database): Promise<Envelope> {
  const normalized = validateEnvelopeShape(envelope);

  if (normalized.fromAccountId) {
    const accounts = await sqliteAccountRepository.list();
    const isActiveAccount = getActiveAccounts(accounts).some(account => account.id === normalized.fromAccountId);

    if (isActiveAccount) {
      const [transactions, envelopes] = await Promise.all([
        sqliteTransactionRepository.list(),
        listEnvelopes(database),
      ]);
      const available = calculateAvailableEnvelopeAllocationByAccount({
        accounts,
        transactions,
        envelopes,
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

export const sqliteEnvelopeRepository: EnvelopeRepository = {
  async list() {
    return listEnvelopes();
  },

  async upsert(envelope) {
    await withSqliteTransaction(async database => {
      const normalized = await validateEnvelope(envelope, database);

      await database.execute(
        `INSERT INTO envelopes (
           id, name, category, allocated_cents, spent_fallback_cents, month, color, from_account_id
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT(id) DO UPDATE SET
           name = excluded.name,
           category = excluded.category,
           allocated_cents = excluded.allocated_cents,
           spent_fallback_cents = excluded.spent_fallback_cents,
           month = excluded.month,
           color = excluded.color,
           from_account_id = excluded.from_account_id`,
        [
          normalized.id,
          normalized.name,
          optionalText(normalized.category),
          toSqliteCents(normalized.allocated),
          toSqliteCents(normalized.spent),
          normalized.month,
          optionalText(normalized.color),
          optionalText(normalized.fromAccountId),
        ],
      );
    });
  },

  async delete(id) {
    const database = await getSqliteDatabase();
    await database.execute('DELETE FROM envelopes WHERE id = $1', [id]);
  },
};
