import Database from '@tauri-apps/plugin-sql';

export const SQLITE_DATABASE_URL = 'sqlite:personal-finance.db';

let databasePromise: Promise<Database> | null = null;

export async function getSqliteDatabase(): Promise<Database> {
  if (!databasePromise) {
    databasePromise = Database.load(SQLITE_DATABASE_URL).then(async database => {
      await database.execute('PRAGMA foreign_keys = ON');
      return database;
    });
  }

  return databasePromise;
}

export function getDeferredSqliteDatabase(): Database {
  return Database.get(SQLITE_DATABASE_URL);
}

export async function closeSqliteDatabase(): Promise<boolean> {
  if (!databasePromise) return true;

  const database = await databasePromise;
  databasePromise = null;
  return database.close(SQLITE_DATABASE_URL);
}
