import { useEffect, useState } from 'react';
import type { AppSettings } from '../types';
import { repositories, storageResetService } from '../persistence';
import { setCurrencySymbol } from '../utils/format';

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'CAD', symbol: 'CA$', label: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'MXN', symbol: 'MX$', label: 'Mexican Peso' },
  { code: 'BRL', symbol: 'R$', label: 'Brazilian Real' },
];

const DEFAULT_SETTINGS: AppSettings = {
  userName: '',
  currency: 'USD',
  currencySymbol: '$',
};

export default function Settings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void repositories.settings.get().then(setSettings);
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    await repositories.settings.save(settings);
    setCurrencySymbol(settings.currencySymbol);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleCurrencyChange(code: string) {
    const found = CURRENCIES.find(c => c.code === code);
    if (found) {
      setSettings(s => ({ ...s, currency: found.code, currencySymbol: found.symbol }));
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Personalize your app</p>
        </div>
      </div>

      <div style={{ maxWidth: 560 }}>
        <form onSubmit={handleSave}>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-title">Profile</div>
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input
                className="form-input"
                value={settings.userName}
                onChange={e => setSettings(s => ({ ...s, userName: e.target.value }))}
                placeholder="Your name"
              />
            </div>
          </div>

          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-title">Currency</div>
            <div className="form-group">
              <label className="form-label">Display Currency</label>
              <select
                className="form-select"
                value={settings.currency}
                onChange={e => handleCurrencyChange(e.target.value)}
              >
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} — {c.label} ({c.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-title">Data Management</div>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
              All data is stored locally in your browser's localStorage. Nothing leaves your device.
            </p>
            <button
              type="button"
              className="btn btn-danger"
              onClick={async () => {
                if (confirm('This will permanently delete ALL your data. Are you sure?')) {
                  await storageResetService.resetAllData();
                  window.location.reload();
                }
              }}
            >
              Clear All Data
            </button>
          </div>

          <button type="submit" className="btn btn-primary" style={{ minWidth: 160 }}>
            {saved ? '✓ Saved!' : 'Save Settings'}
          </button>
        </form>
      </div>
    </>
  );
}
