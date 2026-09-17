import type {
  Transaction, BudgetCategory, Debt, AppSettings,
  NetWorthAsset, NetWorthLiability, NetWorthSnapshot,
  Account, Envelope, SavingsBucket,
} from '../types';

const today = new Date();
const thisMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
const lastMonth = (() => {
  const d = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
})();

function d(offset: number) {
  const dt = new Date(today);
  dt.setDate(dt.getDate() - offset);
  return dt.toISOString().split('T')[0];
}

export const mockTransactions: Transaction[] = [
  { id: 't1',  date: d(0),  description: 'Paycheck',           amount: 3200,  category: 'Salary',        type: 'income' },
  { id: 't2',  date: d(1),  description: 'Whole Foods',        amount: 87.43, category: 'Food & Dining',  type: 'expense' },
  { id: 't3',  date: d(2),  description: 'Rent',               amount: 1250,  category: 'Housing',       type: 'expense' },
  { id: 't4',  date: d(3),  description: 'Netflix',            amount: 15.99, category: 'Entertainment', type: 'expense' },
  { id: 't5',  date: d(4),  description: 'Gas Station',        amount: 52.10, category: 'Transportation',type: 'expense' },
  { id: 't6',  date: d(5),  description: 'Freelance Project',  amount: 750,   category: 'Freelance',     type: 'income' },
  { id: 't7',  date: d(6),  description: 'Pharmacy',           amount: 28.75, category: 'Health',        type: 'expense' },
  { id: 't8',  date: d(7),  description: 'Amazon',             amount: 64.99, category: 'Shopping',      type: 'expense' },
  { id: 't9',  date: d(8),  description: 'Electric Bill',      amount: 95.00, category: 'Utilities',     type: 'expense' },
  { id: 't10', date: d(9),  description: 'Coffee Shop',        amount: 12.50, category: 'Food & Dining', type: 'expense' },
  { id: 't11', date: d(10), description: 'Gym Membership',     amount: 45.00, category: 'Health',        type: 'expense' },
  { id: 't12', date: d(11), description: 'Spotify',            amount: 9.99,  category: 'Entertainment', type: 'expense' },
  { id: 't13', date: d(12), description: 'Car Insurance',      amount: 130,   category: 'Insurance',     type: 'expense' },
  { id: 't14', date: d(13), description: 'Restaurant',         amount: 43.20, category: 'Food & Dining', type: 'expense' },
  { id: 't15', date: d(14), description: 'Internet Bill',      amount: 60.00, category: 'Utilities',     type: 'expense' },
  { id: 't16', date: d(15), description: 'Savings Transfer',   amount: 300,   category: 'Savings',       type: 'expense' },
  { id: 't17', date: d(16), description: 'Bonus',              amount: 500,   category: 'Salary',        type: 'income' },
  { id: 't18', date: d(18), description: 'Haircut',            amount: 35.00, category: 'Personal Care', type: 'expense' },
  { id: 't19', date: d(20), description: 'Online Course',      amount: 29.99, category: 'Education',     type: 'expense' },
  { id: 't20', date: d(22), description: 'Grocery Store',      amount: 102.34,category: 'Food & Dining', type: 'expense' },
];

export const mockBudgetCategories: BudgetCategory[] = [
  { id: 'b1', category: 'Housing',       budgeted: 1300, spent: 1250,  month: thisMonth, color: '#0A2A66' },
  { id: 'b2', category: 'Food & Dining', budgeted: 400,  spent: 245.47,month: thisMonth, color: '#D4A62A' },
  { id: 'b3', category: 'Transportation',budgeted: 200,  spent: 52.10, month: thisMonth, color: '#2563EB' },
  { id: 'b4', category: 'Entertainment', budgeted: 80,   spent: 25.98, month: thisMonth, color: '#7C3AED' },
  { id: 'b5', category: 'Health',        budgeted: 150,  spent: 73.75, month: thisMonth, color: '#16A34A' },
  { id: 'b6', category: 'Shopping',      budgeted: 150,  spent: 64.99, month: thisMonth, color: '#F97316' },
  { id: 'b7', category: 'Utilities',     budgeted: 180,  spent: 155.00,month: thisMonth, color: '#64748b' },
  { id: 'b8', category: 'Insurance',     budgeted: 130,  spent: 130.00,month: thisMonth, color: '#2563EB' },
  { id: 'b9', category: 'Savings',       budgeted: 300,  spent: 300.00,month: thisMonth, color: '#7C3AED' },
];

export const mockBudgetCategoriesLastMonth: BudgetCategory[] = mockBudgetCategories.map(b => ({
  ...b,
  id: b.id + '_lm',
  month: lastMonth,
  spent: b.budgeted * (0.7 + Math.random() * 0.5),
}));

export const mockDebts: Debt[] = [
  {
    id: 'd1',
    name: 'Student Loan',
    balance: 14200,
    originalBalance: 22000,
    interestRate: 5.5,
    minimumPayment: 220,
    dueDate: 15,
    color: '#0A2A66',
    notes: 'Federal loan â€” PSLF eligible',
  },
  {
    id: 'd2',
    name: 'Credit Card',
    balance: 2340,
    originalBalance: 3000,
    interestRate: 22.99,
    minimumPayment: 75,
    dueDate: 22,
    color: '#DC2626',
    notes: 'Chase Sapphire',
  },
  {
    id: 'd3',
    name: 'Car Loan',
    balance: 8900,
    originalBalance: 15000,
    interestRate: 6.9,
    minimumPayment: 310,
    dueDate: 5,
    color: '#2563EB',
  },
];

export const mockSettings: AppSettings = {
  userName: 'Jessa',
  currency: 'USD',
  currencySymbol: '$',
};

const now = new Date().toISOString();

// â”€â”€ Accounts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const mockAccounts: Account[] = [
  { id: 'acc1', name: 'Chase Checking',      type: 'checking',   balance: 4320.50, color: '#2563EB', updatedAt: now },
  { id: 'acc2', name: 'Marcus Savings',      type: 'savings',    balance: 12800.00, color: '#16A34A', updatedAt: now },
  { id: 'acc3', name: 'Fidelity 401k',       type: 'investment', balance: 48500.00, color: '#0A2A66', updatedAt: now },
  { id: 'acc4', name: 'Robinhood Brokerage', type: 'investment', balance: 9200.00,  color: '#2563EB', updatedAt: now },
  { id: 'acc5', name: 'Cash Wallet',         type: 'cash',       balance: 180.00,   color: '#64748b', updatedAt: now },
];

// â”€â”€ Net Worth Assets â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const mockAssets: NetWorthAsset[] = [
  { id: 'a1', name: 'Chase Checking',       type: 'checking',    value: 4320.50,  accountId: 'acc1', updatedAt: now },
  { id: 'a2', name: 'Marcus Savings',       type: 'savings',     value: 12800.00, accountId: 'acc2', updatedAt: now },
  { id: 'a3', name: 'Fidelity 401k',        type: '401k',        value: 48500.00, accountId: 'acc3', updatedAt: now },
  { id: 'a4', name: 'Robinhood Brokerage',  type: 'investment',  value: 9200.00,  accountId: 'acc4', updatedAt: now },
  { id: 'a5', name: 'Cash',                 type: 'cash',        value: 180.00,   accountId: 'acc5', updatedAt: now },
  { id: 'a6', name: '2022 Honda Civic',     type: 'vehicle',     value: 18500.00, updatedAt: now },
  { id: 'a7', name: 'Home (estimated)',     type: 'real_estate', value: 285000.00, updatedAt: now, notes: 'Zillow estimate' },
];

// â”€â”€ Net Worth Liabilities â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const mockLiabilities: NetWorthLiability[] = [
  { id: 'l1', name: 'Student Loan',     type: 'loan',          balance: 14200.00, updatedAt: now },
  { id: 'l2', name: 'Chase Sapphire',   type: 'credit_card',   balance: 2340.00,  updatedAt: now },
  { id: 'l3', name: 'Car Loan',         type: 'auto_loan',     balance: 8900.00,  updatedAt: now },
  { id: 'l4', name: 'Mortgage',         type: 'mortgage',      balance: 228000.00, updatedAt: now },
];

// â”€â”€ Historical Net Worth Snapshots (last 12 months) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function monthKey(offsetMonths: number): string {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - offsetMonths);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

const snapshotBase = [
  { assets: 330000, liabilities: 259000 },
  { assets: 334000, liabilities: 257500 },
  { assets: 337000, liabilities: 256000 },
  { assets: 341000, liabilities: 254500 },
  { assets: 345000, liabilities: 253000 },
  { assets: 349000, liabilities: 251500 },
  { assets: 352000, liabilities: 250000 },
  { assets: 354000, liabilities: 255000 }, // dip due to credit card
  { assets: 358000, liabilities: 254000 },
  { assets: 362000, liabilities: 253440 },
  { assets: 366000, liabilities: 253440 },
  { assets: 378500, liabilities: 253440 }, // current
];

export const mockNetWorthSnapshots: NetWorthSnapshot[] = snapshotBase.map((s, i) => ({
  id: `snap${i}`,
  month: monthKey(11 - i),
  totalAssets: s.assets,
  totalLiabilities: s.liabilities,
  netWorth: s.assets - s.liabilities,
  createdAt: now,
}));

// â”€â”€ Envelope Budgets â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const envelopeMonth = (() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
})();

export const mockEnvelopes: Envelope[] = [
  { id: 'env1', name: 'Rent',           category: 'Housing',       allocated: 1300, spent: 1250,  month: envelopeMonth, color: '#0A2A66', fromAccountId: 'acc1' },
  { id: 'env2', name: 'Groceries',      category: 'Food & Dining', allocated: 300,  spent: 189,   month: envelopeMonth, color: '#D4A62A', fromAccountId: 'acc1' },
  { id: 'env3', name: 'Eating Out',     category: 'Food & Dining', allocated: 150,  spent: 98.47, month: envelopeMonth, color: '#F97316', fromAccountId: 'acc1' },
  { id: 'env4', name: 'Gas & Transit',  category: 'Transportation',allocated: 120,  spent: 52.10, month: envelopeMonth, color: '#2563EB', fromAccountId: 'acc1' },
  { id: 'env5', name: 'Entertainment',  category: 'Entertainment', allocated: 80,   spent: 25.98, month: thisMonth, color: '#7C3AED', fromAccountId: 'acc1' },
  { id: 'env6', name: 'Utilities',      category: 'Utilities',     allocated: 180,  spent: 155,   month: thisMonth, color: '#64748b', fromAccountId: 'acc1' },
  { id: 'env7', name: 'Emergency Fund', category: 'Savings',       allocated: 200,  spent: 0,     month: thisMonth, color: '#16A34A', fromAccountId: 'acc2' },
];

// â”€â”€ Savings Buckets â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const mockSavingsBuckets: SavingsBucket[] = [
  { id: 'bkt1', name: 'Emergency Fund',  goalAmount: 15000, allocatedAmount: 5000,  accountId: 'acc2', color: '#16A34A', notes: '3-6 months expenses' },
  { id: 'bkt2', name: 'Vacation Fund',   goalAmount: 3000,  allocatedAmount: 1200,  accountId: 'acc2', color: '#0A2A66', targetDate: '2026-12-01' },
  { id: 'bkt3', name: 'New Car Fund',    goalAmount: 8000,  allocatedAmount: 2500,  accountId: 'acc2', color: '#D4A62A', targetDate: '2027-06-01' },
  { id: 'bkt4', name: 'Home Repairs',    goalAmount: 5000,  allocatedAmount: 4100,  accountId: 'acc2', color: '#2563EB' },
];


