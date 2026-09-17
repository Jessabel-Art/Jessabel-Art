export interface LocalStorageBackupEntry {
  rawValue: string;
  parsedValue?: unknown;
  parseError?: string;
}

export interface LocalStorageBackup {
  version: 1;
  createdAt: string;
  keyPrefix: 'pfa_';
  keys: Record<string, LocalStorageBackupEntry>;
  checksum: string;
}

function getLocalStorage(): Storage {
  if (typeof localStorage === 'undefined') {
    throw new Error('localStorage is not available in this environment.');
  }

  return localStorage;
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;

  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map(key => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
    .join(',')}}`;
}

function checksum(value: string): string {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

export function createLocalStorageBackup(): LocalStorageBackup {
  const storage = getLocalStorage();
  const keys: Record<string, LocalStorageBackupEntry> = {};

  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (!key?.startsWith('pfa_')) continue;

    const rawValue = storage.getItem(key);
    if (rawValue === null) continue;

    const entry: LocalStorageBackupEntry = { rawValue };
    try {
      entry.parsedValue = JSON.parse(rawValue);
    } catch (error) {
      entry.parseError = error instanceof Error ? error.message : String(error);
    }

    keys[key] = entry;
  }

  const backupWithoutChecksum = {
    version: 1 as const,
    createdAt: new Date().toISOString(),
    keyPrefix: 'pfa_' as const,
    keys,
  };

  return {
    ...backupWithoutChecksum,
    checksum: checksum(stableStringify(backupWithoutChecksum)),
  };
}

export function serializeLocalStorageBackup(backup: LocalStorageBackup): string {
  return JSON.stringify(backup, null, 2);
}
