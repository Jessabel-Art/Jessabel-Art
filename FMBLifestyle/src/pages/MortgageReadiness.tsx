import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { Camera, Copy, Pencil, Plus, Save, Trash2 } from 'lucide-react';
import type { Account, MortgageGoal, MortgageProgramKey, MortgageReadinessSnapshot, MortgageScenario, SavingsBucket } from '../types';
import { formatCurrency, generateId } from '../utils/format';
import { parseMoneyInput } from '../domain/money';
import {
  calculateMortgageGoal,
  calculateMortgageReadiness,
  calculateMortgageTrendSummary,
  createMortgageReadinessSnapshot,
  MORTGAGE_PROGRAM_PRESETS,
} from '../domain/mortgage/calculators';
import { MortgageTrendChart } from '../components/ui/Charts';
import { repositories } from '../persistence';

const programs = Object.values(MORTGAGE_PROGRAM_PRESETS);
const creditRanges = [
  ['under_580', 'Under 580'],
  ['580_619', '580-619'],
  ['620_679', '620-679'],
  ['680_739', '680-739'],
  ['740_plus', '740+'],
] as const;

function createScenario(name = 'New Scenario', program: MortgageProgramKey = 'conventional'): MortgageScenario {
  const preset = MORTGAGE_PROGRAM_PRESETS[program];
  const homePrice = 350000;
  return {
    id: generateId(),
    name,
    program,
    grossMonthlyIncome: 8500,
    grossAnnualIncome: 102000,
    creditScoreRange: '680_739',
    monthlyDebts: {
      creditCards: 150,
      autoLoans: 425,
      studentLoans: 250,
      personalLoans: 0,
      supportObligations: 0,
      otherDebts: 0,
    },
    homePrice,
    downPaymentPercent: preset.downPaymentPercent,
    downPaymentAmount: homePrice * (preset.downPaymentPercent / 100),
    interestRate: 6.75,
    loanTermYears: 30,
    annualTaxes: 4200,
    monthlyInsurance: 160,
    monthlyHoa: 0,
    monthlyPmiMip: program === 'conventional' ? 125 : program === 'va' || program === 'usda' ? 0 : 185,
    emergencyFundMonths: 3,
    firstTimeBuyer: true,
    vaEligible: false,
    usdaEligible: false,
    updatedAt: new Date().toISOString(),
  };
}

function createGoalFromScenario(scenario: MortgageScenario, name = 'Home Purchase Goal'): MortgageGoal {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    name,
    targetHomePrice: scenario.homePrice,
    targetPurchaseDate: '',
    loanProgram: scenario.program,
    downPaymentPercent: scenario.downPaymentPercent,
    closingCostPercent: 2.5,
    currentSavings: 0,
    monthlyContribution: 0,
    createdAt: now,
    updatedAt: now,
  };
}

function pct(value: number) {
  return `${value.toFixed(1)}%`;
}

function readinessClass(score: number) {
  if (score >= 75) return 'badge-success';
  if (score >= 60) return 'badge-warning';
  return 'badge-danger';
}

function dtiStatusColor(usage: number) {
  if (usage <= 0.7) return 'var(--color-success)';
  if (usage <= 0.9) return 'var(--color-warning)';
  if (usage <= 1) return 'var(--color-orange)';
  return 'var(--color-danger)';
}

function formatGoalDate(value?: string | null) {
  if (!value) return 'Not set';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return 'Not set';
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export default function MortgageReadiness() {
  const [scenarios, setScenarios] = useState<MortgageScenario[]>([]);
  const [scenario, setScenario] = useState<MortgageScenario>(() => createScenario());
  const [goal, setGoal] = useState<MortgageGoal | null>(null);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [buckets, setBuckets] = useState<SavingsBucket[]>([]);
  const [snapshots, setSnapshots] = useState<MortgageReadinessSnapshot[]>([]);

  async function reload() {
    const [saved, savedGoals, nextAccounts, nextBuckets, nextSnapshots] = await Promise.all([
      repositories.mortgageScenarios.list(),
      repositories.mortgageGoals.list(),
      repositories.accounts.list(),
      repositories.savingsBuckets.list(),
      repositories.mortgageReadinessSnapshots.list(),
    ]);
    setScenarios(saved);
    setAccounts(nextAccounts);
    setBuckets(nextBuckets);
    setSnapshots(nextSnapshots);
    if (saved.length > 0) setScenario(saved[0]);
    if (savedGoals.length > 0) setGoal(savedGoals[0]);
  }

  useEffect(() => { void reload(); }, []);

  const calc = useMemo(() => calculateMortgageReadiness(scenario), [scenario]);
  const goalCalc = useMemo(() => goal ? calculateMortgageGoal(goal) : null, [goal]);
  const comparison = useMemo(() => scenarios.length > 0 ? scenarios : [scenario], [scenario, scenarios]);
  const scenarioSnapshots = useMemo(() => snapshots.filter(snapshot => snapshot.scenarioId === scenario.id), [scenario.id, snapshots]);
  const trend = useMemo(() => calculateMortgageTrendSummary(snapshots, scenario.id), [scenario.id, snapshots]);
  const chartData = useMemo(() => scenarioSnapshots.map(snapshot => ({
    date: new Date(`${snapshot.date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    backEndDti: snapshot.backEndDti,
    dtiUsagePercent: snapshot.dtiUsagePercent,
    readinessScore: snapshot.readinessScore,
  })), [scenarioSnapshots]);
  const previousDtiChange = trend.previous ? calc.backEndDti - trend.previous.backEndDti : null;

  function updateMoney(key: keyof MortgageScenario, value: string) {
    const amount = parseMoneyInput(value);
    setScenario(current => {
      const next = { ...current, [key]: amount };
      if (key === 'grossMonthlyIncome') next.grossAnnualIncome = amount * 12;
      if (key === 'grossAnnualIncome') next.grossMonthlyIncome = amount / 12;
      if (key === 'homePrice') next.downPaymentAmount = amount * (next.downPaymentPercent / 100);
      return next;
    });
  }

  function updateDebt(key: keyof MortgageScenario['monthlyDebts'], value: string) {
    setScenario(current => ({
      ...current,
      monthlyDebts: { ...current.monthlyDebts, [key]: parseMoneyInput(value) },
    }));
  }

  function updateProgram(program: MortgageProgramKey) {
    const preset = MORTGAGE_PROGRAM_PRESETS[program];
    setScenario(current => ({
      ...current,
      program,
      downPaymentPercent: preset.downPaymentPercent,
      downPaymentAmount: current.homePrice * (preset.downPaymentPercent / 100),
      monthlyPmiMip: program === 'fha' ? 185 : program === 'conventional' ? current.monthlyPmiMip : 0,
    }));
  }

  async function saveScenario() {
    const updated = { ...scenario, updatedAt: new Date().toISOString() };
    await repositories.mortgageScenarios.upsert(updated);
    await repositories.mortgageReadinessSnapshots.save(createMortgageReadinessSnapshot(updated));
    await reload();
  }

  async function duplicateScenario() {
    const copy = { ...scenario, id: generateId(), name: `${scenario.name} Copy`, updatedAt: new Date().toISOString() };
    await repositories.mortgageScenarios.upsert(copy);
    await repositories.mortgageReadinessSnapshots.save(createMortgageReadinessSnapshot(copy));
    await reload();
    setScenario(copy);
  }

  async function deleteScenario(id: string) {
    if (!confirm('Delete this mortgage scenario?')) return;
    await repositories.mortgageScenarios.delete(id);
    const remaining = (await repositories.mortgageScenarios.list());
    setScenarios(remaining);
    setScenario(remaining[0] ?? createScenario());
  }

  async function saveGoal() {
    const nextGoal = goal ?? createGoalFromScenario(scenario);
    await repositories.mortgageGoals.upsert({ ...nextGoal, updatedAt: new Date().toISOString() });
    setShowGoalForm(false);
    await reload();
  }

  async function createGoalFromCurrentScenario(source: MortgageScenario = scenario) {
    const nextGoal = createGoalFromScenario(source, `${source.name} Goal`);
    await repositories.mortgageGoals.upsert(nextGoal);
    setGoal(nextGoal);
    setShowGoalForm(true);
    await reload();
  }

  async function deleteGoal() {
    if (!goal || !confirm('Reset this mortgage goal?')) return;
    await repositories.mortgageGoals.delete(goal.id);
    setGoal(null);
    setShowGoalForm(false);
    await reload();
  }

  async function saveReadinessSnapshot() {
    await repositories.mortgageReadinessSnapshots.save(createMortgageReadinessSnapshot(scenario));
    await reload();
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Mortgage Readiness</h1>
          <p>Affordability, DTI, buying power, and readiness planning</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={() => setScenario(createScenario())}><Plus size={16} />Create</button>
          <button className="btn btn-ghost" onClick={duplicateScenario}><Copy size={16} />Duplicate</button>
          <button className="btn btn-ghost" onClick={saveReadinessSnapshot}><Camera size={16} />Save Readiness Snapshot</button>
          <button className="btn btn-primary" onClick={saveScenario}><Save size={16} />Save</button>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card" style={{ '--stat-accent': dtiStatusColor(calc.dtiUsage) } as CSSProperties}>
          <div className="stat-card-label">Current Back-End DTI</div>
          <div className="stat-card-value tabular">{pct(calc.backEndDti)}</div>
          <div className="stat-card-sub">{pct(calc.dtiUsage * 100)} of {calc.program.label} target</div>
        </div>
        <div className="stat-card" style={{ '--stat-accent': 'var(--color-gold)' } as CSSProperties}>
          <div className="stat-card-label">Buying Power Target</div>
          <div className="stat-card-value tabular">{formatCurrency(calc.buyingPower.target)}</div>
          <div className="stat-card-sub">using selected program target DTI</div>
        </div>
        <div className="stat-card" style={{ '--stat-accent': 'var(--color-primary)' } as CSSProperties}>
          <div className="stat-card-label">Readiness Score</div>
          <div className="stat-card-value tabular">{calc.readinessScore}/100</div>
          <div className="stat-card-sub">{calc.readinessCategory}</div>
        </div>
        <div className="stat-card" style={{ '--stat-accent': 'var(--color-info)' } as CSSProperties}>
          <div className="stat-card-label">Total Payment</div>
          <div className="stat-card-value tabular">{formatCurrency(calc.totalHousingPayment)}</div>
          <div className="stat-card-sub">PITI, HOA, and PMI/MIP</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
          <div>
            <div className="card-title" style={{ marginBottom: 4 }}>DTI Trend</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Historical back-end DTI, DTI usage, and readiness movement for the selected scenario.
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={saveReadinessSnapshot}><Camera size={14} />Save Snapshot</button>
        </div>

        <div className="stat-grid" style={{ marginBottom: 18 }}>
          <div className="stat-card" style={{ '--stat-accent': 'var(--color-primary)' } as CSSProperties}>
            <div className="stat-card-label">Current Back-End DTI</div>
            <div className="stat-card-value tabular">{pct(calc.backEndDti)}</div>
          </div>
          <div className="stat-card" style={{ '--stat-accent': 'var(--color-gold)' } as CSSProperties}>
            <div className="stat-card-label">Previous Snapshot DTI</div>
            <div className="stat-card-value tabular">{trend.previous ? pct(trend.previous.backEndDti) : 'None'}</div>
          </div>
          <div className="stat-card" style={{ '--stat-accent': previousDtiChange === null ? 'var(--text-muted)' : previousDtiChange <= 0 ? 'var(--color-success)' : 'var(--color-danger)' } as CSSProperties}>
            <div className="stat-card-label">Change Amount</div>
            <div className={`stat-card-value tabular ${previousDtiChange !== null && previousDtiChange < 0 ? 'text-success' : previousDtiChange !== null && previousDtiChange > 0 ? 'text-danger' : ''}`}>
              {previousDtiChange === null ? 'No prior' : `${previousDtiChange > 0 ? '+' : ''}${previousDtiChange.toFixed(1)}%`}
            </div>
          </div>
          <div className="stat-card" style={{ '--stat-accent': 'var(--color-success)' } as CSSProperties}>
            <div className="stat-card-label">Best Historical DTI</div>
            <div className="stat-card-value tabular">{trend.best ? pct(trend.best.backEndDti) : 'None'}</div>
          </div>
          <div className="stat-card" style={{ '--stat-accent': 'var(--color-danger)' } as CSSProperties}>
            <div className="stat-card-label">Worst Historical DTI</div>
            <div className="stat-card-value tabular">{trend.worst ? pct(trend.worst.backEndDti) : 'None'}</div>
          </div>
          <div className="stat-card" style={{ '--stat-accent': 'var(--color-info)' } as CSSProperties}>
            <div className="stat-card-label">Snapshot Count</div>
            <div className="stat-card-value tabular">{trend.snapshotCount}</div>
          </div>
        </div>

        {chartData.length > 0 ? (
          <div className="chart-container-lg" style={{ marginBottom: 16 }}>
            <MortgageTrendChart data={chartData} />
          </div>
        ) : (
          <div className="empty-state" style={{ padding: '28px 12px' }}><p>No DTI snapshots yet. Save a readiness snapshot to start tracking your trend.</p></div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
          {trend.insights.length > 0
            ? trend.insights.map(item => <div key={item} style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item}</div>)
            : <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>No prior snapshot yet.</div>}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
          <div>
            <div className="card-title" style={{ marginBottom: 4 }}>Home Purchase Goal</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Track the down payment and estimated cash-to-close needed for homeownership.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => createGoalFromCurrentScenario()}><Plus size={14} />Create Goal From Scenario</button>
            {goal && <button className="btn btn-ghost btn-sm" onClick={() => setShowGoalForm(value => !value)}><Pencil size={14} />Edit Goal</button>}
            {goal && <button className="btn btn-danger btn-sm" onClick={deleteGoal}><Trash2 size={14} />Reset</button>}
          </div>
        </div>

        {goal && goalCalc ? (
          <>
            <div className="section-grid" style={{ alignItems: 'start' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 850 }}>{goal.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      {MORTGAGE_PROGRAM_PRESETS[goal.loanProgram].label} - {formatCurrency(goal.targetHomePrice)} target
                    </div>
                  </div>
                  <span className="badge badge-info">{formatGoalDate(goal.targetPurchaseDate)}</span>
                </div>
                <div className="progress-bar" style={{ height: 10, margin: '14px 0 8px' }}>
                  <div className="progress-fill safe" style={{ width: `${goalCalc.progressPercent}%`, background: 'var(--color-gold)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>
                  <span>Down payment goal: {goalCalc.progressPercent.toFixed(0)}%</span>
                  <span>{formatCurrency(goal.currentSavings)} saved</span>
                </div>
                <div className="section-grid-3">
                  <div><div className="stat-card-label">Cash Needed</div><div className="fw-bold tabular">{formatCurrency(goalCalc.remainingAmount)}</div></div>
                  <div><div className="stat-card-label">Total Target</div><div className="fw-bold tabular">{formatCurrency(goalCalc.totalCashNeeded)}</div></div>
                  <div><div className="stat-card-label">Required / Month</div><div className="fw-bold tabular">{goalCalc.requiredMonthlySavings === null ? 'Set date' : formatCurrency(goalCalc.requiredMonthlySavings)}</div></div>
                </div>
              </div>
              <div>
                <div className="card-title" style={{ marginBottom: 10 }}>Cash-to-Close Breakdown</div>
                {[
                  ['Required down payment', goalCalc.requiredDownPayment],
                  ['Estimated closing costs', goalCalc.estimatedClosingCosts],
                  ['Total cash needed', goalCalc.totalCashNeeded],
                  ['Remaining amount', goalCalc.remainingAmount],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border-soft)' }}>
                    <span>{label}</span><span className="fw-bold tabular">{formatCurrency(value as number)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="divider" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
              {goalCalc.insights.map(item => <div key={item} style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item}</div>)}
            </div>
          </>
        ) : (
          <div className="empty-state" style={{ padding: '28px 12px' }}>
            <p>No home purchase goal saved yet. Create one from the current scenario to start tracking down payment progress.</p>
          </div>
        )}

        {showGoalForm && goal && (
          <div style={{ marginTop: 20, borderTop: '1px solid var(--border-soft)', paddingTop: 18 }}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Goal Name</label>
                <input className="form-input" value={goal.name} onChange={e => setGoal(g => g ? ({ ...g, name: e.target.value }) : g)} />
              </div>
              <div className="form-group">
                <label className="form-label">Target Purchase Date</label>
                <input className="form-input" type="date" value={goal.targetPurchaseDate ?? ''} onChange={e => setGoal(g => g ? ({ ...g, targetPurchaseDate: e.target.value }) : g)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Target Home Price</label><input className="form-input" type="number" min="0" step="0.01" value={goal.targetHomePrice} onChange={e => setGoal(g => g ? ({ ...g, targetHomePrice: parseMoneyInput(e.target.value) }) : g)} /></div>
              <div className="form-group">
                <label className="form-label">Loan Program</label>
                <select className="form-select" value={goal.loanProgram} onChange={e => setGoal(g => g ? ({ ...g, loanProgram: e.target.value as MortgageProgramKey }) : g)}>
                  {programs.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Down Payment %</label><input className="form-input" type="number" min="0" step="0.1" value={goal.downPaymentPercent} onChange={e => setGoal(g => g ? ({ ...g, downPaymentPercent: parseFloat(e.target.value) || 0 }) : g)} /></div>
              <div className="form-group"><label className="form-label">Closing Cost %</label><input className="form-input" type="number" min="0" step="0.1" value={goal.closingCostPercent} onChange={e => setGoal(g => g ? ({ ...g, closingCostPercent: parseFloat(e.target.value) || 0 }) : g)} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Current Savings</label><input className="form-input" type="number" min="0" step="0.01" value={goal.currentSavings} onChange={e => setGoal(g => g ? ({ ...g, currentSavings: parseMoneyInput(e.target.value) }) : g)} /></div>
              <div className="form-group"><label className="form-label">Monthly Contribution</label><input className="form-input" type="number" min="0" step="0.01" value={goal.monthlyContribution ?? 0} onChange={e => setGoal(g => g ? ({ ...g, monthlyContribution: parseMoneyInput(e.target.value) }) : g)} /></div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Linked Savings Account</label>
                <select className="form-select" value={goal.linkedAccountId ?? ''} onChange={e => setGoal(g => g ? ({ ...g, linkedAccountId: e.target.value || undefined }) : g)}>
                  <option value="">None</option>
                  {accounts.filter(account => account.type === 'savings' || account.type === 'checking' || account.type === 'cash').map(account => <option key={account.id} value={account.id}>{account.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Linked Savings Goal</label>
                <select className="form-select" value={goal.linkedSavingsGoalId ?? ''} onChange={e => setGoal(g => g ? ({ ...g, linkedSavingsGoalId: e.target.value || undefined }) : g)}>
                  <option value="">None</option>
                  {buckets.map(bucket => <option key={bucket.id} value={bucket.id}>{bucket.name}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn btn-ghost" onClick={() => setShowGoalForm(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveGoal}><Save size={16} />Save Goal</button>
            </div>
          </div>
        )}
      </div>

      <div className="section-grid" style={{ alignItems: 'start', marginBottom: 20 }}>
        <div className="card">
          <div className="card-title">Scenario Inputs</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Scenario Name</label>
              <input className="form-input" value={scenario.name} onChange={e => setScenario(s => ({ ...s, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Loan Program</label>
              <select className="form-select" value={scenario.program} onChange={e => updateProgram(e.target.value as MortgageProgramKey)}>
                {programs.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Gross Monthly Income</label>
              <input className="form-input" type="number" min="0" step="0.01" value={scenario.grossMonthlyIncome} onChange={e => updateMoney('grossMonthlyIncome', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Gross Annual Income</label>
              <input className="form-input" type="number" min="0" step="0.01" value={scenario.grossAnnualIncome} onChange={e => updateMoney('grossAnnualIncome', e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Home Price</label>
              <input className="form-input" type="number" min="0" step="0.01" value={scenario.homePrice} onChange={e => updateMoney('homePrice', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Credit Score Range</label>
              <select className="form-select" value={scenario.creditScoreRange} onChange={e => setScenario(s => ({ ...s, creditScoreRange: e.target.value as MortgageScenario['creditScoreRange'] }))}>
                {creditRanges.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Down Payment</label>
              <input className="form-input" type="number" min="0" step="0.01" value={scenario.downPaymentAmount} onChange={e => {
                const amount = parseMoneyInput(e.target.value);
                setScenario(s => ({ ...s, downPaymentAmount: amount, downPaymentPercent: s.homePrice > 0 ? (amount / s.homePrice) * 100 : 0 }));
              }} />
            </div>
            <div className="form-group">
              <label className="form-label">Down Payment %</label>
              <input className="form-input" type="number" min="0" max="100" step="0.1" value={scenario.downPaymentPercent} onChange={e => {
                const percent = parseFloat(e.target.value) || 0;
                setScenario(s => ({ ...s, downPaymentPercent: percent, downPaymentAmount: s.homePrice * (percent / 100) }));
              }} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Interest Rate %</label>
              <input className="form-input" type="number" min="0" step="0.01" value={scenario.interestRate} onChange={e => setScenario(s => ({ ...s, interestRate: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Loan Term Years</label>
              <input className="form-input" type="number" min="1" step="1" value={scenario.loanTermYears} onChange={e => setScenario(s => ({ ...s, loanTermYears: parseInt(e.target.value) || 30 }))} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group"><label className="form-label">Annual Taxes</label><input className="form-input" type="number" min="0" step="0.01" value={scenario.annualTaxes} onChange={e => updateMoney('annualTaxes', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Insurance / Month</label><input className="form-input" type="number" min="0" step="0.01" value={scenario.monthlyInsurance} onChange={e => updateMoney('monthlyInsurance', e.target.value)} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">HOA / Month</label><input className="form-input" type="number" min="0" step="0.01" value={scenario.monthlyHoa} onChange={e => updateMoney('monthlyHoa', e.target.value)} /></div>
            <div className="form-group"><label className="form-label">PMI / MIP / Month</label><input className="form-input" type="number" min="0" step="0.01" value={scenario.monthlyPmiMip} onChange={e => updateMoney('monthlyPmiMip', e.target.value)} /></div>
          </div>
          <div className="form-row">
            <label className="account-pill"><input type="checkbox" checked={scenario.firstTimeBuyer} onChange={e => setScenario(s => ({ ...s, firstTimeBuyer: e.target.checked }))} /> First-time buyer</label>
            <label className="account-pill"><input type="checkbox" checked={scenario.vaEligible} onChange={e => setScenario(s => ({ ...s, vaEligible: e.target.checked }))} /> VA eligible</label>
            <label className="account-pill"><input type="checkbox" checked={scenario.usdaEligible} onChange={e => setScenario(s => ({ ...s, usdaEligible: e.target.checked }))} /> USDA eligible</label>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="card-title">Monthly Debts</div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Credit Cards</label><input className="form-input" type="number" min="0" value={scenario.monthlyDebts.creditCards} onChange={e => updateDebt('creditCards', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Auto Loans</label><input className="form-input" type="number" min="0" value={scenario.monthlyDebts.autoLoans} onChange={e => updateDebt('autoLoans', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Student Loans</label><input className="form-input" type="number" min="0" value={scenario.monthlyDebts.studentLoans} onChange={e => updateDebt('studentLoans', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Personal Loans</label><input className="form-input" type="number" min="0" value={scenario.monthlyDebts.personalLoans} onChange={e => updateDebt('personalLoans', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Support Obligations</label><input className="form-input" type="number" min="0" value={scenario.monthlyDebts.supportObligations} onChange={e => updateDebt('supportObligations', e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Other Debts</label><input className="form-input" type="number" min="0" value={scenario.monthlyDebts.otherDebts} onChange={e => updateDebt('otherDebts', e.target.value)} /></div>
            </div>
            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
              <span>Total monthly debts</span><span>{formatCurrency(calc.totalMonthlyDebts)}</span>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
              <div className="card-title" style={{ margin: 0 }}>Readiness Snapshot</div>
              <span className={`badge ${readinessClass(calc.readinessScore)}`}>{calc.readinessCategory}</span>
            </div>
            <div className="progress-bar" style={{ height: 9, marginBottom: 16 }}><div className="progress-fill safe" style={{ width: `${calc.readinessScore}%`, background: dtiStatusColor(calc.dtiUsage) }} /></div>
            <div className="section-grid-3">
              <div><div className="stat-card-label">Front-End DTI</div><div className="fw-bold tabular">{pct(calc.frontEndDti)}</div></div>
              <div><div className="stat-card-label">Back-End DTI</div><div className="fw-bold tabular">{pct(calc.backEndDti)}</div></div>
              <div><div className="stat-card-label">Cash to Close</div><div className="fw-bold tabular">{formatCurrency(calc.cashToClose)}</div></div>
            </div>
            <div className="divider" />
            {calc.insights.map(item => <div key={item} style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>{item}</div>)}
          </div>
        </div>
      </div>

      <div className="section-grid" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="card-title">Buying Power</div>
          {(['conservative', 'target', 'stretch'] as const).map(band => (
            <div key={band} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-soft)' }}>
              <span style={{ textTransform: 'capitalize', fontWeight: 700 }}>{band}</span>
              <span className="tabular fw-bold">{formatCurrency(calc.buyingPower[band])}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title">Payment Breakdown</div>
          {[
            ['Principal & Interest', calc.principalInterest],
            ['Taxes', calc.monthlyTaxes],
            ['Insurance', calc.monthlyInsurance],
            ['HOA', calc.monthlyHoa],
            ['PMI/MIP', calc.monthlyPmiMip],
          ].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
              <span>{label}</span><span className="tabular fw-bold">{formatCurrency(value as number)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">Saved Scenarios</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {scenarios.length === 0 ? <div className="empty-state"><p>No saved scenarios yet.</p></div> : scenarios.map(saved => (
            <div key={saved.id} style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between', borderBottom: '1px solid var(--border-soft)', paddingBottom: 8 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setScenario(saved)}>{saved.name}</button>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setScenario(saved)}>Compare</button>
                <button className="btn btn-ghost btn-sm" onClick={() => createGoalFromCurrentScenario(saved)}>Create Goal</button>
                <button className="btn btn-danger btn-sm btn-icon" onClick={() => deleteScenario(saved.id)}><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">Comparison Table</div>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Program</th><th>Home Price</th><th>Loan Amount</th><th>Monthly Payment</th><th>Front-End DTI</th><th>Back-End DTI</th><th>Cash to Close</th><th>Readiness</th></tr></thead>
            <tbody>
              {comparison.map(item => {
                const itemCalc = calculateMortgageReadiness(item);
                return (
                  <tr key={item.id}>
                    <td>{MORTGAGE_PROGRAM_PRESETS[item.program].label}</td>
                    <td>{formatCurrency(item.homePrice)}</td>
                    <td>{formatCurrency(itemCalc.loanAmount)}</td>
                    <td>{formatCurrency(itemCalc.totalHousingPayment)}</td>
                    <td>{pct(itemCalc.frontEndDti)}</td>
                    <td>{pct(itemCalc.backEndDti)}</td>
                    <td>{formatCurrency(itemCalc.cashToClose)}</td>
                    <td>{itemCalc.readinessScore}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">Education</div>
        {[
          ['What is DTI?', 'Debt-to-income compares monthly debt obligations to gross monthly income. It helps frame affordability planning.'],
          ['Front-End vs Back-End DTI', 'Front-end DTI looks at housing payment only. Back-end DTI includes housing plus other monthly debts.'],
          ['FHA vs Conventional', 'FHA planning commonly assumes lower down payment flexibility, while conventional planning often rewards stronger credit and larger down payments.'],
          ['VA Benefits', 'VA scenarios can model zero down payment for eligible borrowers, but this tool does not verify eligibility or entitlement.'],
          ['USDA Requirements', 'USDA planning depends on eligibility, property location, and income rules that should be verified outside this calculator.'],
          ['Down Payment Effects', 'A larger down payment can reduce loan amount, payment, PMI/MIP pressure, and cash needed beyond closing reserves.'],
        ].map(([title, body]) => (
          <details key={title} style={{ padding: '10px 0', borderBottom: '1px solid var(--border-soft)' }}>
            <summary style={{ fontWeight: 800, cursor: 'pointer' }}>{title}</summary>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 8 }}>{body}</p>
          </details>
        ))}
      </div>

      <div className="card" style={{ borderColor: 'var(--color-gold)', color: 'var(--text-secondary)', fontSize: 13 }}>
        This calculator provides planning estimates only and does not constitute mortgage approval, prequalification, underwriting, lending advice, or a commitment to lend.
      </div>
    </>
  );
}
