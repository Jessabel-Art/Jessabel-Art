import type { AppSettings } from '../../types';
import type { SettingsRepository } from '../../domain/budgeting/repository';
import { getSqliteDatabase } from './db';
import { optionalText } from './mappers';

const SETTINGS_ID = 'default';
const DEFAULT_SETTINGS: AppSettings = {
  userName: 'Jessa',
  currency: 'USD',
  currencySymbol: '$',
};

interface SettingsRow {
  user_name: string;
  currency: string;
  currency_symbol: string;
}

function validateSettings(settings: AppSettings): AppSettings {
  return {
    userName: settings.userName.trim(),
    currency: settings.currency.trim() || 'USD',
    currencySymbol: settings.currencySymbol.trim() || '$',
  };
}

function rowToSettings(row: SettingsRow): AppSettings {
  return {
    userName: row.user_name,
    currency: row.currency,
    currencySymbol: row.currency_symbol,
  };
}

export const sqliteSettingsRepository: SettingsRepository = {
  async get() {
    const database = await getSqliteDatabase();
    const rows = await database.select<SettingsRow[]>(
      'SELECT user_name, currency, currency_symbol FROM settings WHERE id = $1 LIMIT 1',
      [SETTINGS_ID],
    );

    return rows[0] ? rowToSettings(rows[0]) : DEFAULT_SETTINGS;
  },

  async save(settings) {
    const normalized = validateSettings(settings);
    const database = await getSqliteDatabase();

    await database.execute(
      `INSERT INTO settings (id, user_name, currency, currency_symbol, updated_at)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT(id) DO UPDATE SET
         user_name = excluded.user_name,
         currency = excluded.currency,
         currency_symbol = excluded.currency_symbol,
         updated_at = excluded.updated_at`,
      [
        SETTINGS_ID,
        optionalText(normalized.userName) ?? '',
        normalized.currency,
        normalized.currencySymbol,
        new Date().toISOString(),
      ],
    );
  },
};
