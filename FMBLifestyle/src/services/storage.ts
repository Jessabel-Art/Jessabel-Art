import type {
  Transaction, BudgetCategory, Debt, AppSettings,
  NetWorthAsset, NetWorthLiability, NetWorthSnapshot,
  Account, Envelope, SavingsBucket, DebtPayoffPlan,
  MortgageScenario, MortgageGoal, MortgageReadinessSnapshot,
} from '../types';
import {
  mockTransactions,
  mockBudgetCategories,
  mockDebts,
  mockSettings,
  mockAssets,
  mockLiabilities,
  mockAccounts,
  mockEnvelopes,
  mockSavingsBuckets,
  mockNetWorthSnapshots,
} from '../data/mockData';

const KEYS = {
  transactions: 'pfa_transactions',
  budgets: 'pfa_budgets',
  debts: 'pfa_debts',
  settings: 'pfa_settings',
  assets: 'pfa_assets',
  liabilities: 'pfa_liabilities',
  snapshots: 'pfa_nw_snapshots',
  accounts: 'pfa_accounts',
  envelopes: 'pfa_envelopes',
  buckets: 'pfa_buckets',
  debtPlans: 'pfa_debt_plans',
  mortgageScenarios: 'pfa_mortgage_scenarios',
  mortgageGoals: 'pfa_mortgage_goals',
  mortgageReadinessSnapshots: 'pfa_mortgage_readiness_snapshots',
  seeded: 'pfa_seeded',
} as const;

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

/** Seed mock data once on first run */
export function seedIfNeeded(): void {
  if (localStorage.getItem(KEYS.seeded)) return;
  save(KEYS.transactions, mockTransactions);
  save(KEYS.budgets, mockBudgetCategories);
  save(KEYS.debts, mockDebts);
  save(KEYS.settings, mockSettings);
  save(KEYS.assets, mockAssets);
  save(KEYS.liabilities, mockLiabilities);
  save(KEYS.accounts, mockAccounts);
  save(KEYS.envelopes, mockEnvelopes);
  save(KEYS.buckets, mockSavingsBuckets);
  save(KEYS.snapshots, mockNetWorthSnapshots);
  localStorage.setItem(KEYS.seeded, 'true');
}

// ── Transactions ──────────────────────────────────────────────
export function getTransactions(): Transaction[] {
  return load<Transaction[]>(KEYS.transactions, []);
}

export function saveTransactions(txns: Transaction[]): void {
  save(KEYS.transactions, txns);
}

export function addTransaction(txn: Transaction): void {
  const list = getTransactions();
  save(KEYS.transactions, [txn, ...list]);
}

export function updateTransaction(updated: Transaction): void {
  const list = getTransactions().map(t => (t.id === updated.id ? updated : t));
  save(KEYS.transactions, list);
}

export function deleteTransaction(id: string): void {
  const list = getTransactions().filter(t => t.id !== id);
  save(KEYS.transactions, list);
}

// ── Budget ────────────────────────────────────────────────────
export function getBudgets(): BudgetCategory[] {
  return load<BudgetCategory[]>(KEYS.budgets, []);
}

export function saveBudgets(budgets: BudgetCategory[]): void {
  save(KEYS.budgets, budgets);
}

export function upsertBudget(budget: BudgetCategory): void {
  const list = getBudgets();
  const idx = list.findIndex(b => b.id === budget.id);
  if (idx >= 0) {
    list[idx] = budget;
  } else {
    list.push(budget);
  }
  save(KEYS.budgets, list);
}

export function deleteBudget(id: string): void {
  save(KEYS.budgets, getBudgets().filter(b => b.id !== id));
}

// ── Debts ─────────────────────────────────────────────────────
export function getDebts(): Debt[] {
  return load<Debt[]>(KEYS.debts, []);
}

export function saveDebts(debts: Debt[]): void {
  save(KEYS.debts, debts);
}

export function upsertDebt(debt: Debt): void {
  const list = getDebts();
  const idx = list.findIndex(d => d.id === debt.id);
  if (idx >= 0) {
    list[idx] = debt;
  } else {
    list.push(debt);
  }
  save(KEYS.debts, list);
}

export function deleteDebt(id: string): void {
  save(KEYS.debts, getDebts().filter(d => d.id !== id));
}

// ── Settings ──────────────────────────────────────────────────
export function getSettings(): AppSettings {
  return load<AppSettings>(KEYS.settings, mockSettings);
}

export function saveSettings(settings: AppSettings): void {
  save(KEYS.settings, settings);
}

// ── Accounts ─────────────────────────────────────────────────
export function getAccounts(): Account[] {
  return load<Account[]>(KEYS.accounts, []);
}
export function upsertAccount(a: Account): void {
  const list = getAccounts();
  const idx = list.findIndex(x => x.id === a.id);
  idx >= 0 ? list[idx] = a : list.push(a);
  save(KEYS.accounts, list);
}
export function deleteAccount(id: string): void {
  save(KEYS.accounts, getAccounts().filter(a => a.id !== id));
}

// ── Net Worth Assets ─────────────────────────────────────────
export function getAssets(): NetWorthAsset[] {
  return load<NetWorthAsset[]>(KEYS.assets, []);
}
export function upsertAsset(a: NetWorthAsset): void {
  const list = getAssets();
  const idx = list.findIndex(x => x.id === a.id);
  idx >= 0 ? list[idx] = a : list.push(a);
  save(KEYS.assets, list);
}
export function deleteAsset(id: string): void {
  save(KEYS.assets, getAssets().filter(a => a.id !== id));
}

// ── Net Worth Liabilities ─────────────────────────────────────
export function getLiabilities(): NetWorthLiability[] {
  return load<NetWorthLiability[]>(KEYS.liabilities, []);
}
export function upsertLiability(l: NetWorthLiability): void {
  const list = getLiabilities();
  const idx = list.findIndex(x => x.id === l.id);
  idx >= 0 ? list[idx] = l : list.push(l);
  save(KEYS.liabilities, list);
}
export function deleteLiability(id: string): void {
  save(KEYS.liabilities, getLiabilities().filter(l => l.id !== id));
}

// ── Net Worth Snapshots ───────────────────────────────────────
export function getSnapshots(): NetWorthSnapshot[] {
  return load<NetWorthSnapshot[]>(KEYS.snapshots, []);
}
export function saveSnapshot(s: NetWorthSnapshot): void {
  const list = getSnapshots();
  const idx = list.findIndex(x => x.month === s.month);
  idx >= 0 ? list[idx] = s : list.push(s);
  save(KEYS.snapshots, list.sort((a, b) => a.month.localeCompare(b.month)));
}

// ── Envelopes ─────────────────────────────────────────────────
export function getEnvelopes(): Envelope[] {
  return load<Envelope[]>(KEYS.envelopes, []);
}
export function upsertEnvelope(e: Envelope): void {
  const list = getEnvelopes();
  const idx = list.findIndex(x => x.id === e.id);
  idx >= 0 ? list[idx] = e : list.push(e);
  save(KEYS.envelopes, list);
}
export function deleteEnvelope(id: string): void {
  save(KEYS.envelopes, getEnvelopes().filter(e => e.id !== id));
}

// ── Savings Buckets ───────────────────────────────────────────
export function getBuckets(): SavingsBucket[] {
  return load<SavingsBucket[]>(KEYS.buckets, []);
}
export function upsertBucket(b: SavingsBucket): void {
  const list = getBuckets();
  const idx = list.findIndex(x => x.id === b.id);
  idx >= 0 ? list[idx] = b : list.push(b);
  save(KEYS.buckets, list);
}
export function deleteBucket(id: string): void {
  save(KEYS.buckets, getBuckets().filter(b => b.id !== id));
}

// ── Debt Payoff Plans ─────────────────────────────────────────
export function getDebtPlans(): DebtPayoffPlan[] {
  return load<DebtPayoffPlan[]>(KEYS.debtPlans, []);
}
export function upsertDebtPlan(p: DebtPayoffPlan): void {
  const list = getDebtPlans();
  const idx = list.findIndex(x => x.id === p.id);
  idx >= 0 ? list[idx] = p : list.push(p);
  save(KEYS.debtPlans, list);
}

// Mortgage Readiness
export function getMortgageScenarios(): MortgageScenario[] {
  return load<MortgageScenario[]>(KEYS.mortgageScenarios, []);
}

export function upsertMortgageScenario(scenario: MortgageScenario): void {
  const list = getMortgageScenarios();
  const idx = list.findIndex(x => x.id === scenario.id);
  idx >= 0 ? list[idx] = scenario : list.push(scenario);
  save(KEYS.mortgageScenarios, list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
}

export function deleteMortgageScenario(id: string): void {
  save(KEYS.mortgageScenarios, getMortgageScenarios().filter(s => s.id !== id));
}

export function getMortgageGoals(): MortgageGoal[] {
  return load<MortgageGoal[]>(KEYS.mortgageGoals, []);
}

export function upsertMortgageGoal(goal: MortgageGoal): void {
  const list = getMortgageGoals();
  const idx = list.findIndex(x => x.id === goal.id);
  idx >= 0 ? list[idx] = goal : list.push(goal);
  save(KEYS.mortgageGoals, list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
}

export function deleteMortgageGoal(id: string): void {
  save(KEYS.mortgageGoals, getMortgageGoals().filter(goal => goal.id !== id));
}

export function getMortgageReadinessSnapshots(): MortgageReadinessSnapshot[] {
  return load<MortgageReadinessSnapshot[]>(KEYS.mortgageReadinessSnapshots, []);
}

export function saveMortgageReadinessSnapshots(snapshots: MortgageReadinessSnapshot[]): void {
  save(KEYS.mortgageReadinessSnapshots, snapshots.sort((a, b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt)));
}

export function upsertMortgageReadinessSnapshot(snapshot: MortgageReadinessSnapshot): void {
  const list = getMortgageReadinessSnapshots();
  const idx = list.findIndex(item => item.id === snapshot.id);
  idx >= 0 ? list[idx] = snapshot : list.push(snapshot);
  saveMortgageReadinessSnapshots(list);
}

