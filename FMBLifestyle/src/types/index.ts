// â”€â”€ Risk / Status â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export type RiskLevel = 'green' | 'yellow' | 'red';

// â”€â”€ Transactions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  description: string;
  amount: number;
  category: string;
  type: TransactionType;
  accountId?: string;
  envelopeId?: string;
  notes?: string;
}

export interface BudgetCategory {
  id: string;
  category: string;
  budgeted: number;
  spent: number;
  month: string; // YYYY-MM
  color: string;
}

export interface Debt {
  id: string;
  name: string;
  balance: number;
  originalBalance: number;
  interestRate: number;
  minimumPayment: number;
  dueDate: number; // day of month 1-31
  color: string;
  accountId?: string;
  notes?: string;
}

export interface AppSettings {
  userName: string;
  currency: string;
  currencySymbol: string;
}

export const EXPENSE_CATEGORIES = [
  'Housing',
  'Food & Dining',
  'Transportation',
  'Entertainment',
  'Health',
  'Shopping',
  'Utilities',
  'Insurance',
  'Savings',
  'Education',
  'Personal Care',
  'Other',
] as const;

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Gift',
  'Other Income',
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  Housing: '#0A2A66',
  'Food & Dining': '#D4A62A',
  Transportation: '#2563EB',
  Entertainment: '#7C3AED',
  Health: '#16A34A',
  Shopping: '#F97316',
  Utilities: '#64748b',
  Insurance: '#2563EB',
  Savings: '#7C3AED',
  Education: '#16A34A',
  'Personal Care': '#F97316',
  Other: '#94a3b8',
  Salary: '#16A34A',
  Freelance: '#0A2A66',
  Investment: '#D4A62A',
  Gift: '#7C3AED',
  'Other Income': '#94a3b8',
};

// â”€â”€ Net Worth â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export type AssetType =
  | 'cash'
  | 'checking'
  | 'savings'
  | 'investment'
  | '401k'
  | 'real_estate'
  | 'vehicle'
  | 'business'
  | 'other_asset';

export type LiabilityType =
  | 'credit_card'
  | 'loan'
  | 'auto_loan'
  | 'mortgage'
  | 'personal_loan'
  | 'collections'
  | 'other_debt';

export interface NetWorthAsset {
  id: string;
  name: string;
  type: AssetType;
  value: number;
  accountId?: string; // optional link to a real account
  notes?: string;
  updatedAt: string; // ISO date
}

export interface NetWorthLiability {
  id: string;
  name: string;
  type: LiabilityType;
  balance: number;
  debtId?: string;
  accountId?: string;
  notes?: string;
  updatedAt: string;
}

export interface NetWorthSnapshot {
  id: string;
  month: string; // YYYY-MM
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  createdAt: string;
}

// â”€â”€ Accounts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export type AccountType = 'checking' | 'savings' | 'investment' | 'cash' | 'credit' | '401k' | 'other';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  openingBalance?: number;
  color?: string;
  institution?: string;
  notes?: string;
  updatedAt?: string;
  archivedAt?: string;
}

// â”€â”€ Envelope Budget â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface Envelope {
  id: string;
  name: string;
  category?: string;
  allocated: number;
  spent: number;
  month: string;
  color?: string;
  fromAccountId?: string;
}

// â”€â”€ Savings Buckets â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface SavingsBucket {
  id: string;
  name: string;
  goalAmount: number;
  allocatedAmount: number;  // virtually allocated from linked account
  targetDate?: string;      // ISO date YYYY-MM-DD
  accountId?: string;
  color: string;
  notes?: string;
}

// â”€â”€ Debt Payoff â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface DebtPayoffPlan {
  id: string;             // same as Debt.id
  extraPayment: number;   // extra monthly payment on top of minimum
  method: 'snowball' | 'avalanche';
}

// Mortgage Readiness
export type MortgageProgramKey = 'fha' | 'va' | 'usda' | 'conventional';
export type CreditScoreRange = 'under_580' | '580_619' | '620_679' | '680_739' | '740_plus';

export interface MortgageDebtInputs {
  creditCards: number;
  autoLoans: number;
  studentLoans: number;
  personalLoans: number;
  supportObligations: number;
  otherDebts: number;
}

export interface MortgageScenario {
  id: string;
  name: string;
  program: MortgageProgramKey;
  grossMonthlyIncome: number;
  grossAnnualIncome: number;
  creditScoreRange: CreditScoreRange;
  monthlyDebts: MortgageDebtInputs;
  homePrice: number;
  downPaymentAmount: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTermYears: number;
  annualTaxes: number;
  monthlyInsurance: number;
  monthlyHoa: number;
  monthlyPmiMip: number;
  emergencyFundMonths: number;
  firstTimeBuyer: boolean;
  vaEligible: boolean;
  usdaEligible: boolean;
  updatedAt: string;
}

export interface MortgageGoal {
  id: string;
  name: string;
  targetHomePrice: number;
  targetPurchaseDate?: string;
  loanProgram: MortgageProgramKey;
  downPaymentPercent: number;
  closingCostPercent: number;
  currentSavings: number;
  monthlyContribution?: number;
  linkedSavingsGoalId?: string;
  linkedAccountId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MortgageReadinessSnapshot {
  id: string;
  date: string;
  scenarioId: string;
  scenarioName: string;
  loanProgram: MortgageProgramKey;
  grossMonthlyIncome: number;
  monthlyDebts: number;
  housingPayment: number;
  frontEndDti: number;
  backEndDti: number;
  programTargetDti: number;
  dtiUsagePercent: number;
  readinessScore: number;
  buyingPower: number;
  createdAt: string;
}


