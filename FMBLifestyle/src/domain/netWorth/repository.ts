import type { NetWorthAsset, NetWorthLiability, NetWorthSnapshot } from '../../types';
import {
  deleteAsset,
  deleteLiability,
  getAssets,
  getLiabilities,
  getSnapshots,
  saveSnapshot,
  upsertAsset,
  upsertLiability,
} from '../../services/storage';
import { isValidMoneyAmount, normalizeMoneyAmount } from '../money';

export interface NetWorthRepository {
  listAssets(): Promise<NetWorthAsset[]>;
  upsertAsset(asset: NetWorthAsset): Promise<void>;
  deleteAsset(id: string): Promise<void>;
  listLiabilities(): Promise<NetWorthLiability[]>;
  upsertLiability(liability: NetWorthLiability): Promise<void>;
  deleteLiability(id: string): Promise<void>;
  listSnapshots(): Promise<NetWorthSnapshot[]>;
  saveSnapshot(snapshot: NetWorthSnapshot): Promise<void>;
}

function validateAsset(asset: NetWorthAsset): NetWorthAsset {
  if (!asset.id.trim()) throw new Error('Asset id is required.');
  if (!asset.name.trim()) throw new Error('Asset name is required.');
  if (!isValidMoneyAmount(asset.value)) throw new Error('Asset value must be non-negative.');

  return {
    ...asset,
    name: asset.name.trim(),
    value: normalizeMoneyAmount(asset.value),
    notes: asset.notes?.trim() || undefined,
  };
}

function validateLiability(liability: NetWorthLiability): NetWorthLiability {
  if (!liability.id.trim()) throw new Error('Liability id is required.');
  if (!liability.name.trim()) throw new Error('Liability name is required.');
  if (!isValidMoneyAmount(liability.balance)) throw new Error('Liability balance must be non-negative.');

  return {
    ...liability,
    name: liability.name.trim(),
    balance: normalizeMoneyAmount(liability.balance),
    debtId: liability.debtId?.trim() || undefined,
    accountId: liability.accountId?.trim() || undefined,
    notes: liability.notes?.trim() || undefined,
  };
}

function validateSnapshot(snapshot: NetWorthSnapshot): NetWorthSnapshot {
  if (!snapshot.id.trim()) throw new Error('Snapshot id is required.');
  if (!snapshot.month.trim()) throw new Error('Snapshot month is required.');

  return {
    ...snapshot,
    totalAssets: normalizeMoneyAmount(snapshot.totalAssets),
    totalLiabilities: normalizeMoneyAmount(snapshot.totalLiabilities),
    netWorth: normalizeMoneyAmount(snapshot.netWorth),
  };
}

export const netWorthRepository: NetWorthRepository = {
  async listAssets() {
    return getAssets();
  },
  async upsertAsset(asset) {
    upsertAsset(validateAsset(asset));
  },
  async deleteAsset(id) {
    deleteAsset(id);
  },
  async listLiabilities() {
    return getLiabilities();
  },
  async upsertLiability(liability) {
    upsertLiability(validateLiability(liability));
  },
  async deleteLiability(id) {
    deleteLiability(id);
  },
  async listSnapshots() {
    return getSnapshots();
  },
  async saveSnapshot(snapshot) {
    saveSnapshot(validateSnapshot(snapshot));
  },
};
