import { getSqliteDatabase } from './db';

export const EXPECTED_SQLITE_SCHEMA_VERSION = 2;

interface MetadataRow {
  value: string;
}

export async function getSqliteSchemaVersion(): Promise<number | null> {
  const database = await getSqliteDatabase();
  const rows = await database.select<MetadataRow[]>(
    'SELECT value FROM app_metadata WHERE key = $1',
    ['schema_version'],
  );
  const value = rows[0]?.value;
  if (!value) return null;

  const version = Number(value);
  return Number.isFinite(version) ? version : null;
}

export async function setSqliteSchemaVersion(version = EXPECTED_SQLITE_SCHEMA_VERSION): Promise<void> {
  const database = await getSqliteDatabase();
  await database.execute(
    'INSERT INTO app_metadata (key, value) VALUES ($1, $2) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    ['schema_version', String(version)],
  );
}

export async function isExpectedSqliteSchemaVersion(): Promise<boolean> {
  return (await getSqliteSchemaVersion()) === EXPECTED_SQLITE_SCHEMA_VERSION;
}
