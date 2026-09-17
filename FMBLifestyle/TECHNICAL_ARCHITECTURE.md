# Personal Finance App Technical Architecture

## Purpose

This document describes the current repository architecture and a maintainable development plan for the next finance modules. It is intentionally limited to analysis and planning; it does not define or introduce new runtime features.

## Current Stack

- Runtime: React 19 with TypeScript.
- Build tooling: Vite.
- Routing: `react-router-dom`.
- Charts: Recharts.
- Icons: `lucide-react`.
- Persistence: browser `localStorage` through a small storage service.
- Desktop-ready dependency: `@tauri-apps/api` is installed, but no Tauri APIs are currently used in source.
- Styling: global CSS design system in `src/index.css`.

## Repository Modules

### App Shell

- `src/main.tsx`
  - Mounts the React tree into `#root`.
  - Wraps the app in `StrictMode`.
- `src/App.tsx`
  - Seeds local mock data once through `seedIfNeeded()`.
  - Defines all routes inside a shared layout.
- `src/components/layout/Layout.tsx`
  - Provides the fixed sidebar and main content outlet.
- `src/components/layout/Sidebar.tsx`
  - Defines navigation groups for overview, tracking, planning, and settings.

### Domain Types

- `src/types/index.ts`
  - Defines the current application entities:
    - `Transaction`
    - `BudgetCategory`
    - `Debt`
    - `AppSettings`
    - `Account`
    - `NetWorthAsset`
    - `NetWorthLiability`
    - `NetWorthSnapshot`
    - `Envelope`
    - `SavingsBucket`
    - `DebtPayoffPlan`
  - Defines shared enum-like unions for transaction, account, asset, liability, and risk types.
  - Defines category lists and category colors.

### Persistence

- `src/services/storage.ts`
  - Central localStorage adapter.
  - Owns storage keys under the `pfa_*` namespace.
  - Provides typed getters and write helpers per aggregate:
    - Transactions: `getTransactions`, `saveTransactions`, `addTransaction`, `updateTransaction`, `deleteTransaction`
    - Budgets: `getBudgets`, `saveBudgets`, `upsertBudget`, `deleteBudget`
    - Debts: `getDebts`, `saveDebts`, `upsertDebt`, `deleteDebt`
    - Settings: `getSettings`, `saveSettings`
    - Accounts: `getAccounts`, `upsertAccount`, `deleteAccount`
    - Net worth assets: `getAssets`, `upsertAsset`, `deleteAsset`
    - Net worth liabilities: `getLiabilities`, `upsertLiability`, `deleteLiability`
    - Net worth snapshots: `getSnapshots`, `saveSnapshot`
    - Envelopes: `getEnvelopes`, `upsertEnvelope`, `deleteEnvelope`
    - Savings buckets: `getBuckets`, `upsertBucket`, `deleteBucket`
    - Debt payoff plans: `getDebtPlans`, `upsertDebtPlan`
  - Seeds mock data once with `seedIfNeeded()`.

### Mock Data

- `src/data/mockData.ts`
  - Provides seeded records for transactions, budgets, debts, settings, accounts, assets, liabilities, net worth snapshots, envelopes, and savings buckets.
  - Uses the current date to generate transaction dates and month keys.
  - Currently contains mock relationships by ID, such as bucket/account and asset/account links.

### Utilities

- `src/utils/format.ts`
  - Currency formatting.
  - Date formatting.
  - Current month label/key helpers.
  - ID generation.

### Shared UI Components

- `src/components/ui/Charts.tsx`
  - `NetWorthChart`
  - `SpendingBarChart`
  - `DonutChart`
  - `AccountBarChart`
  - `DebtProgressChart`
- `src/components/ui/ProgressBar.tsx`
  - Generic progress bar with safe/warning/danger styling.
- `src/components/ui/RiskBadge.tsx`
  - Risk badge display.
  - Shared risk helper functions.

### Pages

- `src/pages/Dashboard.tsx`
  - Reads transactions, budgets, debts, assets, liabilities, snapshots, accounts, and buckets.
  - Computes overview metrics in component scope.
- `src/pages/Transactions.tsx`
  - CRUD screen for income and expense records.
  - Uses page-local form state and storage helpers.
- `src/pages/MonthlyBudget.tsx`
  - CRUD screen for monthly category budgets.
  - Tracks `budgeted` and `spent` as manually stored values.
- `src/pages/DebtTracker.tsx`
  - CRUD screen for debts.
  - Tracks balance, original balance, APR, minimum payment, due date, and notes.
- `src/pages/Reports.tsx`
  - Read-only charts/tables based on transactions.
- `src/pages/Settings.tsx`
  - Saves profile and currency settings.
  - Clears all localStorage data through a browser confirm flow.
- `src/pages/Accounts.tsx`
  - CRUD screen for financial accounts.
  - Currently independent from transactions except by future-facing IDs in other models.
- `src/pages/NetWorth.tsx`
  - CRUD screen for net worth assets and liabilities.
  - Saves monthly snapshots.
  - Current account links in seeded assets are not edited in the page form.
- `src/pages/Buckets.tsx`
  - CRUD screen for savings goals.
  - Can link a bucket to an account ID.
  - Allocations are virtual and do not update account balances or transactions.
- `src/pages/Envelopes.tsx`
  - CRUD screen for monthly spending allocations.
  - Can link an envelope to a source account ID.
  - Spending is stored on the envelope and is not currently derived from transactions.
- `src/pages/DebtPayoff.tsx`
  - Planning screen for snowball or avalanche payoff strategy.
  - Reads debts and persists a single plan record.
  - Payoff calculations live in the component.

## Current Data Flow

1. Application startup calls `seedIfNeeded()` in `App.tsx`.
2. `seedIfNeeded()` writes mock data into localStorage if `pfa_seeded` is absent.
3. Each page loads data once in `useEffect()`.
4. Page components hold local UI and domain arrays in `useState()`.
5. User actions call storage helper functions directly.
6. Pages call a local `reload()` function after writes to refresh component state.
7. Derived metrics are computed inside page render/component scope.
8. Shared charts and badges receive already-shaped view data from pages.

There is no global app state store, query/cache layer, event bus, server API, or database abstraction beyond `src/services/storage.ts`.

## State Management Approach

The current approach is page-local React state backed by synchronous localStorage reads and writes.

Strengths:

- Easy to understand.
- Small surface area.
- No external state management dependency.
- The central storage service gives the app a clear first abstraction point for a future database.

Current limitations:

- Data does not automatically refresh across pages.
- Derived values are duplicated in page components.
- Storage calls are synchronous and browser-specific.
- Relationships are not enforced.
- IDs are string timestamps rather than database-friendly generated identifiers.
- Writes are not transactional.
- There is no schema versioning or migration runner.
- There are no tests around persistence or financial calculations.

Recommended near-term direction:

- Keep React page-local UI state for forms, filters, and modals.
- Move domain reads/writes behind repository interfaces before adding more behavior.
- Move calculations into pure selector/domain functions.
- Avoid adopting a large global state library unless cross-page reactive updates become a frequent problem.
- For SQLite, make persistence methods asynchronous now, or add async-compatible repository wrappers before migration.

## Reusable Components And Helpers

Reusable today:

- Layout shell: `Layout`, `Sidebar`.
- Visual primitives: `.card`, `.stat-card`, `.badge`, `.risk-badge`, `.progress-bar`, tables, modals, buttons, form controls.
- Charts: net worth, spending, donut, accounts, and debt progress chart components.
- Risk display and helper functions.
- Formatting helpers for currency, date, month keys, and IDs.
- Domain type definitions.
- Storage CRUD helpers.

High-value extraction candidates:

- A generic modal form shell.
- Reusable stat card component instead of repeated markup.
- Reusable table action cell for edit/delete buttons.
- Domain selectors:
  - monthly income/expenses/savings rate
  - budget totals and over-budget detection
  - net worth totals and month-over-month change
  - bucket progress and risk
  - envelope progress and risk
  - debt payoff projection
- Repository contracts, for example `AccountRepository`, `TransactionRepository`, and `BudgetRepository`.

## Current Domain Relationships

Existing explicit links:

- `NetWorthAsset.accountId` can link an asset to an account.
- `SavingsBucket.accountId` can link a bucket to an account.
- `Envelope.fromAccountId` can link an envelope to an account.
- `DebtPayoffPlan.id` is documented as matching `Debt.id`, but the current planner treats plans as a single global plan by reading `plans[0]`.

Missing or weak links:

- `Transaction` has no `accountId`.
- `Transaction` has no `envelopeId`.
- `Transaction` has no transfer model.
- `BudgetCategory.spent` is stored manually rather than derived from transactions.
- `Envelope.spent` is stored manually rather than derived from transactions.
- Debts are separate from net worth liabilities.
- Credit accounts and debts are conceptually overlapping but stored independently.
- Accounts are not the source of truth for net worth assets.

## Database Migration Requirements

SQLite migration should be treated as an architectural change, not a direct replacement of localStorage calls inside components.

### Required Preparation

1. Define repository interfaces.
   - Keep components dependent on domain-level methods, not localStorage.
   - Example capabilities: list, get by ID, create, update, delete, bulk seed, and domain-specific queries.

2. Add schema versioning.
   - Store a database/user data version.
   - Add ordered migrations.
   - Make migrations idempotent where practical.

3. Normalize entities.
   - Use tables for accounts, transactions, categories, budgets, envelopes, savings buckets, debts, payoff plans, net worth snapshots, and settings.
   - Prefer stable IDs and foreign keys.

4. Decide money representation.
   - Store money as integer cents in SQLite.
   - Convert to display numbers at the UI boundary.
   - This avoids floating point drift in budgets, balances, and payoff math.

5. Separate source-of-truth data from derived data.
   - Store transactions, accounts, debts, allocations, and snapshots.
   - Derive current budget spending, envelope spending, account totals, and net worth where possible.
   - Store snapshots only when historical point-in-time values are intentional.

6. Add import/export or one-time migration from localStorage.
   - Read existing `pfa_*` keys.
   - Validate shape.
   - Transform into normalized SQLite rows.
   - Mark migrated data version.
   - Preserve localStorage until migration succeeds.

### Proposed Initial SQLite Tables

- `settings`
  - `key`, `value`
- `accounts`
  - `id`, `name`, `type`, `institution`, `opening_balance_cents`, `current_balance_cents`, `color`, `notes`, `created_at`, `updated_at`, `archived_at`
- `transactions`
  - `id`, `account_id`, `date`, `description`, `amount_cents`, `type`, `category_id`, `envelope_id`, `notes`, `created_at`, `updated_at`
- `categories`
  - `id`, `name`, `kind`, `color`, `is_system`
- `monthly_budgets`
  - `id`, `month`, `category_id`, `budgeted_cents`, `created_at`, `updated_at`
- `envelopes`
  - `id`, `month`, `name`, `category_id`, `allocated_cents`, `from_account_id`, `color`, `created_at`, `updated_at`
- `savings_buckets`
  - `id`, `name`, `goal_amount_cents`, `allocated_amount_cents`, `target_date`, `account_id`, `color`, `notes`, `created_at`, `updated_at`
- `debts`
  - `id`, `name`, `balance_cents`, `original_balance_cents`, `interest_rate_bps`, `minimum_payment_cents`, `due_day`, `account_id`, `liability_id`, `color`, `notes`, `created_at`, `updated_at`
- `debt_payoff_plans`
  - `id`, `method`, `extra_payment_cents`, `created_at`, `updated_at`
- `debt_payoff_plan_items`
  - `plan_id`, `debt_id`, `priority_order`, `extra_payment_cents`
- `net_worth_assets`
  - `id`, `name`, `type`, `value_cents`, `account_id`, `notes`, `updated_at`
- `net_worth_liabilities`
  - `id`, `name`, `type`, `balance_cents`, `debt_id`, `notes`, `updated_at`
- `net_worth_snapshots`
  - `id`, `month`, `total_assets_cents`, `total_liabilities_cents`, `net_worth_cents`, `created_at`

### Foreign Key Expectations

- `transactions.account_id -> accounts.id`
- `transactions.category_id -> categories.id`
- `transactions.envelope_id -> envelopes.id`
- `monthly_budgets.category_id -> categories.id`
- `envelopes.category_id -> categories.id`
- `envelopes.from_account_id -> accounts.id`
- `savings_buckets.account_id -> accounts.id`
- `debts.account_id -> accounts.id`
- `debts.liability_id -> net_worth_liabilities.id`
- `net_worth_assets.account_id -> accounts.id`
- `net_worth_liabilities.debt_id -> debts.id`
- `debt_payoff_plan_items.plan_id -> debt_payoff_plans.id`
- `debt_payoff_plan_items.debt_id -> debts.id`

### Migration Risks

- Existing localStorage records use floating point dollars.
- Several seeded records use relationships that are not enforced.
- Current page forms allow records to be deleted without cascade checks.
- Existing `DebtPayoffPlan` semantics need clarification before schema freeze.
- Some display strings/comments appear mojibake-encoded and should be cleaned before broad UI work.

## Development Plan

### Phase 0: Architecture Hardening

Goal: prepare the app for deeper finance features and future SQLite without changing user-facing behavior.

Tasks:

- Create domain folders by bounded context, for example `src/domain/accounts`, `src/domain/budgeting`, `src/domain/debt`, `src/domain/netWorth`.
- Introduce repository interfaces and a localStorage implementation behind those interfaces.
- Move calculation logic from pages into pure selector/service functions.
- Add test coverage for selectors and repository behavior.
- Add schema/version constants for localStorage data.
- Add validation at persistence boundaries.
- Standardize IDs and timestamps.
- Convert money handling plan to integer cents for future persistence, even if UI continues to display dollars.

Acceptance criteria:

- Pages no longer import localStorage-specific helpers directly.
- Existing screens behave the same.
- Core calculations are testable without rendering React.
- A SQLite repository can be added without rewriting every page.

### Phase 1: Accounts

Goal: make accounts the foundation for financial balances and future transaction flow.

Recommended scope:

- Treat accounts as first-class records with clear types and lifecycle.
- Add account repository methods and selectors.
- Add account balance rules:
  - manual balance for initial migration compatibility
  - later derived balance from opening balance plus transactions
- Add `accountId` to transactions before building account-driven workflows.
- Define whether credit accounts are accounts, debts, liabilities, or linked records.
- Add safeguards for deleting accounts referenced by buckets, envelopes, assets, debts, or transactions.

SQLite preparation:

- Use `accounts` as the parent table for transactions and optional links.
- Store `opening_balance_cents` and optionally cached `current_balance_cents`.
- Add `archived_at` instead of hard-deleting accounts with dependencies.

Suggested order:

1. Repository and selectors.
2. Transaction account linking.
3. Delete/archive dependency handling.
4. Balance derivation.
5. UI refinements.

### Phase 2: Net Worth

Goal: make net worth a reliable aggregate rather than a parallel manual model.

Recommended scope:

- Decide source of truth:
  - account-backed assets should be derived from accounts
  - manually entered assets remain in `net_worth_assets`
  - debts can optionally link to liabilities
- Add selectors for total assets, total liabilities, net worth, and trend.
- Preserve explicit monthly snapshots for history.
- Add reconciliation rules for account-linked assets and debt-linked liabilities.

SQLite preparation:

- Keep snapshots as immutable historical rows.
- Add nullable links from assets to accounts and liabilities to debts.
- Avoid overwriting manual asset/liability values unless the record is explicitly linked.

Suggested order:

1. Extract net worth selectors.
2. Add account-backed asset mapping.
3. Add debt-backed liability mapping.
4. Harden snapshot creation.
5. Add migration from current assets/liabilities.

### Phase 3: Savings Buckets

Goal: support virtual allocations against real savings accounts without corrupting account balances.

Recommended scope:

- Keep buckets as virtual allocations, not separate accounts.
- Validate that total allocated bucket amounts do not exceed linked account balance unless explicitly allowed.
- Add selectors for account available-to-allocate amounts.
- Track allocation changes as domain events later if auditability is needed.
- Decide if bucket funding should create transfer transactions.

SQLite preparation:

- Store bucket amounts in cents.
- Link buckets to accounts with nullable `account_id`.
- Consider a future `bucket_allocations` ledger if users need allocation history.

Suggested order:

1. Extract bucket progress/risk selectors.
2. Add account allocation validation.
3. Add repository methods for bucket updates.
4. Add optional allocation history design.
5. Integrate with dashboard summaries.

### Phase 4: Envelope Budgeting

Goal: make envelopes a transaction-aware monthly allocation system.

Recommended scope:

- Add `envelopeId` to transactions.
- Derive envelope `spent` from assigned transactions instead of storing it manually.
- Keep `allocated` as the planned monthly amount.
- Decide whether category budgets and envelopes are separate concepts or whether envelopes replace category budgets.
- Add rollover policy:
  - no rollover
  - rollover positive balances
  - rollover positive and negative balances
- Add month-copy behavior after schema is stable.

SQLite preparation:

- Store envelopes by month.
- Link transactions to envelopes.
- Add indexes on `transactions.date`, `transactions.envelope_id`, and `envelopes.month`.
- Avoid storing derived `spent_cents` unless using a deliberate cached value.

Suggested order:

1. Extract envelope selectors.
2. Add transaction-envelope relationship.
3. Derive spending from transactions.
4. Define rollover policy.
5. Decide relationship with monthly category budgets.

### Phase 5: Debt Snowball

Goal: turn the payoff planner into a reliable projection engine.

Recommended scope:

- Move payoff math out of `DebtPayoff.tsx` into a pure domain service.
- Clarify plan model:
  - one active global payoff plan
  - per-debt plan items
  - saved scenarios
- Implement snowball correctly:
  - pay minimums on all debts
  - apply extra payment to the target debt
  - when a debt is paid, roll its minimum payment into the next target
- Implement avalanche with the same payment rollover behavior but different ordering.
- Add tests for zero interest, high APR, underpayment, paid-off debts, and extra payment behavior.

SQLite preparation:

- Store plan header separately from plan items.
- Store interest rates as basis points.
- Store payments as cents.
- Keep generated schedules derivable unless users need to save scenario snapshots.

Suggested order:

1. Extract debt payoff calculation service.
2. Add unit tests for projection math.
3. Normalize plan persistence.
4. Add plan item ordering.
5. Integrate planner with debt tracker records.

## Recommended Implementation Sequence

1. Phase 0 architecture hardening.
2. Accounts.
3. Net Worth.
4. Savings Buckets.
5. Envelope Budgeting.
6. Debt Snowball.
7. SQLite repository implementation and localStorage migration.

This order keeps maintainability high because accounts become the base ledger, net worth can then derive from accounts/debts, buckets can safely allocate from accounts, envelopes can connect to account transactions, and debt payoff can build on stabilized debt/liability data.

## Non-Feature Cleanup To Consider

- Remove unused `src/App.css` template styles or confirm they are intentionally retained.
- Clean mojibake characters in comments and UI strings.
- Add a `docs/` directory if architecture documents are expected to grow.
- Add type-aware ESLint once the codebase stabilizes.
- Add tests before changing financial calculations.
