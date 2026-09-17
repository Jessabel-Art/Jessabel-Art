import type { MortgageGoal, MortgageProgramKey, MortgageReadinessSnapshot, MortgageScenario } from '../../types';

export interface MortgageProgramPreset {
  key: MortgageProgramKey;
  label: string;
  downPaymentPercent: number;
  targetBackEndDti: number;
  maxBackEndDti: number;
  targetFrontEndDti?: number;
  maxFrontEndDti?: number;
}

export const MORTGAGE_PROGRAM_PRESETS: Record<MortgageProgramKey, MortgageProgramPreset> = {
  fha: { key: 'fha', label: 'FHA', downPaymentPercent: 3.5, targetBackEndDti: 43, maxBackEndDti: 50 },
  va: { key: 'va', label: 'VA', downPaymentPercent: 0, targetBackEndDti: 41, maxBackEndDti: 50 },
  usda: { key: 'usda', label: 'USDA', downPaymentPercent: 0, targetFrontEndDti: 29, targetBackEndDti: 41, maxBackEndDti: 41 },
  conventional: { key: 'conventional', label: 'Conventional', downPaymentPercent: 5, targetBackEndDti: 36, maxBackEndDti: 50 },
};

export type BuyingPowerBand = 'conservative' | 'target' | 'stretch';

export interface MortgageCalculation {
  program: MortgageProgramPreset;
  totalMonthlyDebts: number;
  loanAmount: number;
  principalInterest: number;
  monthlyTaxes: number;
  monthlyInsurance: number;
  monthlyHoa: number;
  monthlyPmiMip: number;
  totalHousingPayment: number;
  frontEndDti: number;
  backEndDti: number;
  cashToClose: number;
  dtiUsage: number;
  buyingPower: Record<BuyingPowerBand, number>;
  readinessScore: number;
  readinessCategory: string;
  insights: string[];
}

export interface MortgageGoalCalculation {
  requiredDownPayment: number;
  estimatedClosingCosts: number;
  totalCashNeeded: number;
  remainingAmount: number;
  progressPercent: number;
  monthsRemaining: number | null;
  requiredMonthlySavings: number | null;
  projectedGoalDate: string | null;
  monthlyShortfall: number;
  insights: string[];
}

export interface MortgageTrendSummary {
  current?: MortgageReadinessSnapshot;
  previous?: MortgageReadinessSnapshot;
  best?: MortgageReadinessSnapshot;
  worst?: MortgageReadinessSnapshot;
  snapshotCount: number;
  dtiChange: number | null;
  buyingPowerChange: number | null;
  insights: string[];
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function money(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function getTotalMonthlyMortgageDebts(scenario: MortgageScenario): number {
  return Object.values(scenario.monthlyDebts).reduce((sum, value) => sum + money(value), 0);
}

export function calculatePrincipalInterest(loanAmount: number, annualRate: number, termYears: number): number {
  const principal = money(loanAmount);
  const months = Math.max(1, termYears * 12);
  const monthlyRate = Math.max(0, annualRate) / 100 / 12;
  if (monthlyRate === 0) return principal / months;
  const factor = Math.pow(1 + monthlyRate, months);
  return principal * ((monthlyRate * factor) / (factor - 1));
}

function estimateHomePriceForPayment(scenario: MortgageScenario, housingBudget: number): number {
  const downPct = clamp(scenario.downPaymentPercent, 0, 100) / 100;
  const financedPct = Math.max(0.01, 1 - downPct);
  const monthlyRate = Math.max(0, scenario.interestRate) / 100 / 12;
  const months = Math.max(1, scenario.loanTermYears * 12);
  const paymentFactor = monthlyRate === 0
    ? 1 / months
    : (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  const variableMonthlyRate = (scenario.annualTaxes / 12 / Math.max(1, scenario.homePrice)) +
    (scenario.monthlyInsurance / Math.max(1, scenario.homePrice)) +
    (scenario.monthlyPmiMip / Math.max(1, scenario.homePrice)) +
    (financedPct * paymentFactor);
  const fixedMonthlyCosts = scenario.monthlyHoa;
  return money((housingBudget - fixedMonthlyCosts) / Math.max(0.0001, variableMonthlyRate));
}

export function calculateMortgageReadiness(scenario: MortgageScenario): MortgageCalculation {
  const program = MORTGAGE_PROGRAM_PRESETS[scenario.program];
  const grossMonthlyIncome = money(scenario.grossMonthlyIncome || scenario.grossAnnualIncome / 12);
  const downPayment = money(scenario.downPaymentAmount || scenario.homePrice * (scenario.downPaymentPercent / 100));
  const loanAmount = money(scenario.homePrice - downPayment);
  const principalInterest = calculatePrincipalInterest(loanAmount, scenario.interestRate, scenario.loanTermYears);
  const monthlyTaxes = money(scenario.annualTaxes / 12);
  const monthlyInsurance = money(scenario.monthlyInsurance);
  const monthlyHoa = money(scenario.monthlyHoa);
  const monthlyPmiMip = money(scenario.monthlyPmiMip);
  const totalHousingPayment = principalInterest + monthlyTaxes + monthlyInsurance + monthlyHoa + monthlyPmiMip;
  const totalMonthlyDebts = getTotalMonthlyMortgageDebts(scenario);
  const frontEndDti = grossMonthlyIncome > 0 ? (totalHousingPayment / grossMonthlyIncome) * 100 : 0;
  const backEndDti = grossMonthlyIncome > 0 ? ((totalHousingPayment + totalMonthlyDebts) / grossMonthlyIncome) * 100 : 0;
  const dtiUsage = program.targetBackEndDti > 0 ? backEndDti / program.targetBackEndDti : 0;
  const cashToClose = downPayment + Math.max(2500, scenario.homePrice * 0.025);

  const conservativeDti = Math.max(20, program.targetBackEndDti - 8);
  const availableAt = (dti: number) => Math.max(0, grossMonthlyIncome * (dti / 100) - totalMonthlyDebts);
  const buyingPower = {
    conservative: estimateHomePriceForPayment(scenario, availableAt(conservativeDti)),
    target: estimateHomePriceForPayment(scenario, availableAt(program.targetBackEndDti)),
    stretch: estimateHomePriceForPayment(scenario, availableAt(program.maxBackEndDti)),
  };

  const downPaymentScore = clamp((scenario.downPaymentPercent / Math.max(1, program.downPaymentPercent || 3)) * 18, 0, 18);
  const dtiScore = clamp(34 - Math.max(0, backEndDti - program.targetBackEndDti) * 2.1, 0, 34);
  const creditScores = { under_580: 4, '580_619': 10, '620_679': 16, '680_739': 21, '740_plus': 24 };
  const emergencyScore = clamp(scenario.emergencyFundMonths * 4, 0, 16);
  const debtLoad = grossMonthlyIncome > 0 ? (totalMonthlyDebts / grossMonthlyIncome) * 100 : 0;
  const debtScore = clamp(8 - Math.max(0, debtLoad - 10) * 0.45, 0, 8);
  const readinessScore = Math.round(clamp(dtiScore + downPaymentScore + creditScores[scenario.creditScoreRange] + emergencyScore + debtScore, 0, 100));
  const readinessCategory = readinessScore >= 90 ? 'Excellent' : readinessScore >= 75 ? 'Strong' : readinessScore >= 60 ? 'Needs Improvement' : 'Not Ready Yet';

  const insights = [
    backEndDti > program.targetBackEndDti ? 'Reduce debt or lower the target payment to bring back-end DTI closer to the selected program target.' : 'Back-end DTI is within the selected program target for planning purposes.',
    scenario.downPaymentPercent < program.downPaymentPercent ? `Increasing down payment toward the ${program.label} preset can lower payment pressure and cash-to-close uncertainty.` : 'Down payment meets or exceeds the selected preset.',
    debtLoad > 15 ? 'Monthly debts are materially reducing buying power; debt payoff may create more room than changing loan terms.' : 'Current monthly debt load leaves more room for housing payment planning.',
    scenario.program === 'va' && !scenario.vaEligible ? 'VA benefits require eligibility; compare another program unless eligibility is confirmed.' : '',
    scenario.program === 'usda' && !scenario.usdaEligible ? 'USDA planning depends on eligibility and property/location fit; keep a backup program in comparison.' : '',
    frontEndDti > (program.targetFrontEndDti ?? program.targetBackEndDti) ? 'Front-end DTI is above the program planning target; taxes, insurance, HOA, or price may need adjustment.' : '',
    `Best-fit planning lane today: ${program.label}, based on the selected scenario assumptions.`,
  ].filter(Boolean);

  return {
    program,
    totalMonthlyDebts,
    loanAmount,
    principalInterest,
    monthlyTaxes,
    monthlyInsurance,
    monthlyHoa,
    monthlyPmiMip,
    totalHousingPayment,
    frontEndDti,
    backEndDti,
    cashToClose,
    dtiUsage,
    buyingPower,
    readinessScore,
    readinessCategory,
    insights,
  };
}

export function createMortgageReadinessSnapshot(scenario: MortgageScenario, date = new Date()): MortgageReadinessSnapshot {
  const calc = calculateMortgageReadiness(scenario);
  const snapshotDate = date.toISOString().slice(0, 10);
  const createdAt = date.toISOString();

  return {
    id: `${scenario.id}-${snapshotDate}`,
    date: snapshotDate,
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    loanProgram: scenario.program,
    grossMonthlyIncome: money(scenario.grossMonthlyIncome || scenario.grossAnnualIncome / 12),
    monthlyDebts: calc.totalMonthlyDebts,
    housingPayment: calc.totalHousingPayment,
    frontEndDti: calc.frontEndDti,
    backEndDti: calc.backEndDti,
    programTargetDti: calc.program.targetBackEndDti,
    dtiUsagePercent: calc.dtiUsage * 100,
    readinessScore: calc.readinessScore,
    buyingPower: calc.buyingPower.target,
    createdAt,
  };
}

export function hasMortgageSnapshotChanged(a: MortgageReadinessSnapshot, b: MortgageReadinessSnapshot): boolean {
  return [
    'grossMonthlyIncome',
    'monthlyDebts',
    'housingPayment',
    'frontEndDti',
    'backEndDti',
    'programTargetDti',
    'dtiUsagePercent',
    'readinessScore',
    'buyingPower',
  ].some(key => Math.abs((a[key as keyof MortgageReadinessSnapshot] as number) - (b[key as keyof MortgageReadinessSnapshot] as number)) > 0.01) ||
    a.scenarioName !== b.scenarioName ||
    a.loanProgram !== b.loanProgram;
}

export function calculateMortgageTrendSummary(snapshots: MortgageReadinessSnapshot[], scenarioId?: string): MortgageTrendSummary {
  const filtered = (scenarioId ? snapshots.filter(snapshot => snapshot.scenarioId === scenarioId) : snapshots)
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt));
  const current = filtered[filtered.length - 1];
  const previous = filtered.length > 1 ? filtered[filtered.length - 2] : undefined;
  const best = filtered.reduce<MortgageReadinessSnapshot | undefined>((winner, item) => !winner || item.backEndDti < winner.backEndDti ? item : winner, undefined);
  const worst = filtered.reduce<MortgageReadinessSnapshot | undefined>((winner, item) => !winner || item.backEndDti > winner.backEndDti ? item : winner, undefined);
  const dtiChange = current && previous ? current.backEndDti - previous.backEndDti : null;
  const buyingPowerChange = current && previous ? current.buyingPower - previous.buyingPower : null;
  const bestScore = filtered.reduce((score, item) => Math.max(score, item.readinessScore), 0);

  const insights = [
    dtiChange !== null && dtiChange < 0 ? `Your DTI improved by ${Math.abs(dtiChange).toFixed(1)}% since your last snapshot.` : '',
    dtiChange !== null && dtiChange > 0 ? `Your DTI increased by ${dtiChange.toFixed(1)}%; review new debts or housing assumptions.` : '',
    current && current.readinessScore >= bestScore ? 'This is your best mortgage readiness score so far.' : '',
    buyingPowerChange !== null && buyingPowerChange > 0 ? `Your buying power increased by approximately $${buyingPowerChange.toLocaleString('en-US', { maximumFractionDigits: 0 })}.` : '',
  ].filter(Boolean);

  return {
    current,
    previous,
    best,
    worst,
    snapshotCount: filtered.length,
    dtiChange,
    buyingPowerChange,
    insights,
  };
}

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function getWholeMonthsUntil(targetDate?: string): number | null {
  if (!targetDate) return null;
  const target = new Date(`${targetDate}T00:00:00`);
  if (Number.isNaN(target.getTime())) return null;
  const today = new Date();
  const months = (target.getFullYear() - today.getFullYear()) * 12 + (target.getMonth() - today.getMonth());
  return Math.max(0, months + (target.getDate() >= today.getDate() ? 0 : -1));
}

function getProjectedGoalDate(remainingAmount: number, monthlyContribution?: number): string | null {
  const contribution = money(monthlyContribution ?? 0);
  if (remainingAmount <= 0 || contribution <= 0) return null;
  const monthsNeeded = Math.ceil(remainingAmount / contribution);
  const projected = new Date();
  projected.setMonth(projected.getMonth() + monthsNeeded);
  return projected.toISOString().slice(0, 10);
}

export function calculateMortgageGoal(goal: MortgageGoal): MortgageGoalCalculation {
  const requiredDownPayment = money(goal.targetHomePrice * (goal.downPaymentPercent / 100));
  const estimatedClosingCosts = money(goal.targetHomePrice * (goal.closingCostPercent / 100));
  const totalCashNeeded = requiredDownPayment + estimatedClosingCosts;
  const currentSavings = money(goal.currentSavings);
  const remainingAmount = Math.max(0, totalCashNeeded - currentSavings);
  const progressPercent = totalCashNeeded > 0 ? clamp((currentSavings / totalCashNeeded) * 100, 0, 100) : 0;
  const monthsRemaining = getWholeMonthsUntil(goal.targetPurchaseDate);
  const requiredMonthlySavings = monthsRemaining !== null && monthsRemaining > 0
    ? remainingAmount / monthsRemaining
    : null;
  const projectedGoalDate = getProjectedGoalDate(remainingAmount, goal.monthlyContribution);
  const monthlyShortfall = requiredMonthlySavings !== null
    ? Math.max(0, requiredMonthlySavings - money(goal.monthlyContribution ?? 0))
    : 0;
  const projectedLabel = projectedGoalDate ? formatMonthYear(new Date(`${projectedGoalDate}T00:00:00`)) : null;
  const targetLabel = goal.targetPurchaseDate ? formatMonthYear(new Date(`${goal.targetPurchaseDate}T00:00:00`)) : null;

  const insights = [
    `You have saved ${progressPercent.toFixed(0)}% of your estimated cash-to-close.`,
    remainingAmount > 0 ? `You need $${remainingAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })} more to reach your down payment and closing cost goal.` : 'Your current savings meets or exceeds the estimated cash needed.',
    requiredMonthlySavings !== null && targetLabel ? `You need to save about $${requiredMonthlySavings.toLocaleString('en-US', { maximumFractionDigits: 0 })}/month to reach this goal by ${targetLabel}.` : '',
    projectedLabel ? `At your current pace, you may reach this goal by ${projectedLabel}.` : '',
    monthlyShortfall > 0 ? `You are $${monthlyShortfall.toLocaleString('en-US', { maximumFractionDigits: 0 })}/month short based on your current target date.` : '',
    monthlyShortfall > 0 ? `Increasing your monthly contribution by $${monthlyShortfall.toLocaleString('en-US', { maximumFractionDigits: 0 })} could keep the current target date on track.` : '',
    `Your selected loan program requires an estimated $${requiredDownPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })} down payment.`,
  ].filter(Boolean);

  return {
    requiredDownPayment,
    estimatedClosingCosts,
    totalCashNeeded,
    remainingAmount,
    progressPercent,
    monthsRemaining,
    requiredMonthlySavings,
    projectedGoalDate,
    monthlyShortfall,
    insights,
  };
}
