import type Database from '@tauri-apps/plugin-sql';
import { getSqliteDatabase } from './db';

export async function withSqliteTransaction<T>(
  operation: (database: Database) => Promise<T>,
): Promise<T> {
  const database = await getSqliteDatabase();

  await database.execute('BEGIN IMMEDIATE TRANSACTION');
  try {
    const result = await operation(database);
    await database.execute('COMMIT');
    return result;
  } catch (error) {
    try {
      await database.execute('ROLLBACK');
    } catch (rollbackError) {
      console.warn('SQLite rollback failed after transaction error.', rollbackError);
    }
    throw error;
  }
}
