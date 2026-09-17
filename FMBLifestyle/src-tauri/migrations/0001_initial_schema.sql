PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS app_metadata (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY,
  user_name TEXT NOT NULL,
  currency TEXT NOT NULL,
  currency_symbol TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  opening_balance_cents INTEGER NOT NULL,
  manual_balance_cents INTEGER NOT NULL,
  color TEXT,
  institution TEXT,
  notes TEXT,
  updated_at TEXT,
  archived_at TEXT
);

CREATE TABLE IF NOT EXISTS budget_categories (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  budgeted_cents INTEGER NOT NULL CHECK (budgeted_cents >= 0),
  spent_cents INTEGER NOT NULL CHECK (spent_cents >= 0),
  month TEXT NOT NULL,
  color TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS envelopes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  allocated_cents INTEGER NOT NULL CHECK (allocated_cents >= 0),
  spent_fallback_cents INTEGER NOT NULL DEFAULT 0 CHECK (spent_fallback_cents >= 0),
  month TEXT NOT NULL,
  color TEXT,
  from_account_id TEXT,
  FOREIGN KEY (from_account_id) REFERENCES accounts(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS savings_buckets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  goal_amount_cents INTEGER NOT NULL CHECK (goal_amount_cents >= 0),
  allocated_amount_cents INTEGER NOT NULL CHECK (allocated_amount_cents >= 0),
  target_date TEXT,
  account_id TEXT,
  color TEXT NOT NULL,
  notes TEXT,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS debts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  balance_cents INTEGER NOT NULL CHECK (balance_cents >= 0),
  original_balance_cents INTEGER NOT NULL CHECK (original_balance_cents >= 0),
  interest_rate_basis_points INTEGER NOT NULL CHECK (interest_rate_basis_points >= 0),
  minimum_payment_cents INTEGER NOT NULL CHECK (minimum_payment_cents >= 0),
  due_date INTEGER NOT NULL CHECK (due_date BETWEEN 1 AND 31),
  color TEXT NOT NULL,
  account_id TEXT,
  notes TEXT,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS debt_payoff_plans (
  id TEXT PRIMARY KEY,
  method TEXT NOT NULL CHECK (method IN ('snowball', 'avalanche')),
  extra_payment_cents INTEGER NOT NULL CHECK (extra_payment_cents >= 0),
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0),
  category TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  account_id TEXT,
  envelope_id TEXT,
  notes TEXT,
  created_at TEXT,
  updated_at TEXT,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL,
  FOREIGN KEY (envelope_id) REFERENCES envelopes(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS net_worth_assets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  value_cents INTEGER NOT NULL CHECK (value_cents >= 0),
  account_id TEXT,
  notes TEXT,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS net_worth_liabilities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  balance_cents INTEGER NOT NULL CHECK (balance_cents >= 0),
  debt_id TEXT,
  account_id TEXT,
  notes TEXT,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (debt_id) REFERENCES debts(id) ON DELETE SET NULL,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS net_worth_snapshots (
  id TEXT PRIMARY KEY,
  month TEXT NOT NULL UNIQUE,
  total_assets_cents INTEGER NOT NULL,
  total_liabilities_cents INTEGER NOT NULL,
  net_worth_cents INTEGER NOT NULL,
  created_at TEXT NOT NULL
);
