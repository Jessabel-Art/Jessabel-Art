CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_envelope_id ON transactions(envelope_id);
CREATE INDEX IF NOT EXISTS idx_budget_categories_month ON budget_categories(month);
CREATE INDEX IF NOT EXISTS idx_envelopes_month ON envelopes(month);
CREATE INDEX IF NOT EXISTS idx_envelopes_from_account_id ON envelopes(from_account_id);
CREATE INDEX IF NOT EXISTS idx_savings_buckets_account_id ON savings_buckets(account_id);
CREATE INDEX IF NOT EXISTS idx_debts_account_id ON debts(account_id);
CREATE INDEX IF NOT EXISTS idx_net_worth_snapshots_month ON net_worth_snapshots(month);

INSERT INTO app_metadata (key, value)
VALUES ('schema_version', '2')
ON CONFLICT(key) DO UPDATE SET value = excluded.value;
