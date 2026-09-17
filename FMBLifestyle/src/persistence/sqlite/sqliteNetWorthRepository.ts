import type { NetWorthAsset, NetWorthLiability, NetWorthSnapshot } from '../../types';
import type { NetWorthRepository } from '../../domain/netWorth/repository';
import { isValidMoneyAmount, normalizeMoneyAmount } from '../../domain/money';
import { getSqliteDatabase } from './db';
import { fromSqliteCents, nullableToUndefined, optionalText, toSqliteCents } from './mappers';
import { withSqliteTransaction } from './transaction';

interface AssetRow {
  id: string;
  name: string;
  type: NetWorthAsset['type'];
  value_cents: number;
  account_id: string | null;
  notes: string | null;
  updated_at: string;
}

interface LiabilityRow {
  id: string;
  name: string;
  type: NetWorthLiability['type'];
  balance_cents: number;
  debt_id: string | null;
  account_id: string | null;
  notes: string | null;
  updated_at: string;
}

interface SnapshotRow {
  id: string;
  month: string;
  total_assets_cents: number;
  total_liabilities_cents: number;
  net_worth_cents: number;
  created_at: string;
}

function validateAsset(asset: NetWorthAsset): NetWorthAsset {
  if (!asset.id.trim()) throw new Error('Asset id is required.');
  if (!asset.name.trim()) throw new Error('Asset name is required.');
  if (!isValidMoneyAmount(asset.value)) throw new Error('Asset value must be non-negative.');

  return {
    ...asset,
    id: asset.id.trim(),
    name: asset.name.trim(),
    value: normalizeMoneyAmount(asset.value),
    accountId: asset.accountId?.trim() || undefined,
    notes: asset.notes?.trim() || undefined,
    updatedAt: asset.updatedAt?.trim() || new Date().toISOString(),
  };
}

function validateLiability(liability: NetWorthLiability): NetWorthLiability {
  if (!liability.id.trim()) throw new Error('Liability id is required.');
  if (!liability.name.trim()) throw new Error('Liability name is required.');
  if (!isValidMoneyAmount(liability.balance)) throw new Error('Liability balance must be non-negative.');

  return {
    ...liability,
    id: liability.id.trim(),
    name: liability.name.trim(),
    balance: normalizeMoneyAmount(liability.balance),
    debtId: liability.debtId?.trim() || undefined,
    accountId: liability.accountId?.trim() || undefined,
    notes: liability.notes?.trim() || undefined,
    updatedAt: liability.updatedAt?.trim() || new Date().toISOString(),
  };
}

function validateSnapshot(snapshot: NetWorthSnapshot): NetWorthSnapshot {
  if (!snapshot.id.trim()) throw new Error('Snapshot id is required.');
  if (!snapshot.month.trim()) throw new Error('Snapshot month is required.');

  return {
    ...snapshot,
    id: snapshot.id.trim(),
    month: snapshot.month.trim(),
    totalAssets: normalizeMoneyAmount(snapshot.totalAssets),
    totalLiabilities: normalizeMoneyAmount(snapshot.totalLiabilities),
    netWorth: normalizeMoneyAmount(snapshot.netWorth),
    createdAt: snapshot.createdAt?.trim() || new Date().toISOString(),
  };
}

function rowToAsset(row: AssetRow): NetWorthAsset {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    value: fromSqliteCents(row.value_cents),
    accountId: nullableToUndefined(row.account_id),
    notes: nullableToUndefined(row.notes),
    updatedAt: row.updated_at,
  };
}

function rowToLiability(row: LiabilityRow): NetWorthLiability {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    balance: fromSqliteCents(row.balance_cents),
    debtId: nullableToUndefined(row.debt_id),
    accountId: nullableToUndefined(row.account_id),
    notes: nullableToUndefined(row.notes),
    updatedAt: row.updated_at,
  };
}

function rowToSnapshot(row: SnapshotRow): NetWorthSnapshot {
  return {
    id: row.id,
    month: row.month,
    totalAssets: fromSqliteCents(row.total_assets_cents),
    totalLiabilities: fromSqliteCents(row.total_liabilities_cents),
    netWorth: fromSqliteCents(row.net_worth_cents),
    createdAt: row.created_at,
  };
}

export const sqliteNetWorthRepository: NetWorthRepository = {
  async listAssets() {
    const database = await getSqliteDatabase();
    const rows = await database.select<AssetRow[]>(
      `SELECT id, name, type, value_cents, account_id, notes, updated_at
       FROM net_worth_assets
       ORDER BY name ASC`,
    );

    return rows.map(rowToAsset);
  },

  async upsertAsset(asset) {
    const database = await getSqliteDatabase();
    const normalized = validateAsset(asset);

    await database.execute(
      `INSERT INTO net_worth_assets (id, name, type, value_cents, account_id, notes, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT(id) DO UPDATE SET
         name = excluded.name,
         type = excluded.type,
         value_cents = excluded.value_cents,
         account_id = excluded.account_id,
         notes = excluded.notes,
         updated_at = excluded.updated_at`,
      [
        normalized.id,
        normalized.name,
        normalized.type,
        toSqliteCents(normalized.value),
        optionalText(normalized.accountId),
        optionalText(normalized.notes),
        normalized.updatedAt,
      ],
    );
  },

  async deleteAsset(id) {
    const database = await getSqliteDatabase();
    await database.execute('DELETE FROM net_worth_assets WHERE id = $1', [id]);
  },

  async listLiabilities() {
    const database = await getSqliteDatabase();
    const rows = await database.select<LiabilityRow[]>(
      `SELECT id, name, type, balance_cents, debt_id, account_id, notes, updated_at
       FROM net_worth_liabilities
       ORDER BY name ASC`,
    );

    return rows.map(rowToLiability);
  },

  async upsertLiability(liability) {
    const database = await getSqliteDatabase();
    const normalized = validateLiability(liability);

    await database.execute(
      `INSERT INTO net_worth_liabilities (id, name, type, balance_cents, debt_id, account_id, notes, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT(id) DO UPDATE SET
         name = excluded.name,
         type = excluded.type,
         balance_cents = excluded.balance_cents,
         debt_id = excluded.debt_id,
         account_id = excluded.account_id,
         notes = excluded.notes,
         updated_at = excluded.updated_at`,
      [
        normalized.id,
        normalized.name,
        normalized.type,
        toSqliteCents(normalized.balance),
        optionalText(normalized.debtId),
        optionalText(normalized.accountId),
        optionalText(normalized.notes),
        normalized.updatedAt,
      ],
    );
  },

  async deleteLiability(id) {
    const database = await getSqliteDatabase();
    await database.execute('DELETE FROM net_worth_liabilities WHERE id = $1', [id]);
  },

  async listSnapshots() {
    const database = await getSqliteDatabase();
    const rows = await database.select<SnapshotRow[]>(
      `SELECT id, month, total_assets_cents, total_liabilities_cents, net_worth_cents, created_at
       FROM net_worth_snapshots
       ORDER BY month ASC`,
    );

    return rows.map(rowToSnapshot);
  },

  async saveSnapshot(snapshot) {
    const normalized = validateSnapshot(snapshot);

    await withSqliteTransaction(async database => {
      await database.execute(
        `INSERT INTO net_worth_snapshots (
           id, month, total_assets_cents, total_liabilities_cents, net_worth_cents, created_at
         )
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT(month) DO UPDATE SET
           id = excluded.id,
           total_assets_cents = excluded.total_assets_cents,
           total_liabilities_cents = excluded.total_liabilities_cents,
           net_worth_cents = excluded.net_worth_cents,
           created_at = excluded.created_at`,
        [
          normalized.id,
          normalized.month,
          toSqliteCents(normalized.totalAssets),
          toSqliteCents(normalized.totalLiabilities),
          toSqliteCents(normalized.netWorth),
          normalized.createdAt,
        ],
      );
    });
  },
};
