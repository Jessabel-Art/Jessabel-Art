import { useEffect, useRef, useState } from 'react';
import { Target } from 'lucide-react';
import type { Debt, DebtPayoffPlan } from '../types';
import { formatCurrency, generateId } from '../utils/format';
import RiskBadge from '../components/ui/RiskBadge';
import {
  calculateDebtPayoffSchedule,
  calculateDebtPayoffSummary,
  getDebtRisk,
  sortDebtsByPayoffMethod,
} from '../domain/debt/selectors';
import { parseMoneyInput } from '../domain/money';
import { repositories } from '../persistence';

export default function DebtPayoff() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [plans, setPlans] = useState<DebtPayoffPlan[]>([]);
  const [method, setMethod] = useState<'snowball' | 'avalanche'>('snowball');
  const [extraPayment, setExtraPayment] = useState(100);
  const [planId, setPlanId] = useState(generateId);
  const [initialized, setInitialized] = useState(false);
  const lastSavedPlanKey = useRef('');

  async function reload() {
    const [nextDebts, nextPlans] = await Promise.all([
      repositories.debts.list(),
      repositories.debtPayoffPlans.list(),
    ]);
    setDebts(nextDebts);
    setPlans(nextPlans);
    return nextPlans;
  }

  useEffect(() => {
    async function loadPayoffPlan() {
      const nextPlans = await reload();
      const savedPlan = nextPlans[0];

      if (savedPlan) {
        setMethod(savedPlan.method);
        setExtraPayment(savedPlan.extraPayment);
        setPlanId(savedPlan.id);
        lastSavedPlanKey.current = `${savedPlan.id}:${savedPlan.method}:${savedPlan.extraPayment}`;
      }

      setInitialized(true);
    }

    void loadPayoffPlan();
  }, []);

  useEffect(() => {
    if (!initialized) return;
    const existing = plans[0];
    const nextPlan = {
      id: existing?.id ?? planId,
      method,
      extraPayment,
    };
    const nextPlanKey = `${nextPlan.id}:${nextPlan.method}:${nextPlan.extraPayment}`;
    if (lastSavedPlanKey.current === nextPlanKey) return;

    void repositories.debtPayoffPlans.upsert(nextPlan).then(async () => {
      lastSavedPlanKey.current = nextPlanKey;
      setPlans(await repositories.debtPayoffPlans.list());
    });
  }, [method, extraPayment, planId, plans, initialized]);

  const summary = calculateDebtPayoffSummary({ debts, method, extraPayment });
  const sorted = sortDebtsByPayoffMethod(debts, method);
  const schedule = calculateDebtPayoffSchedule({ debts, method, extraPayment });
  const scheduleByDebtId = new Map(schedule.debts.map(item => [item.debtId, item]));

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Debt Payoff Planner</h1>
          <p>Snowball &amp; avalanche strategies with payoff timeline</p>
        </div>
      </div>

      {/* Summary Row */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card" style={{ '--stat-accent': '#DC2626' } as React.CSSProperties}>
          <div className="stat-card-label">Total Debt</div>
          <div className="stat-card-value text-danger tabular">{formatCurrency(summary.totalDebt)}</div>
          <div className="stat-card-sub">{debts.length} account{debts.length !== 1 ? 's' : ''}</div>
        </div>
        <div className="stat-card" style={{ '--stat-accent': '#D4A62A' } as React.CSSProperties}>
          <div className="stat-card-label">Monthly Minimum</div>
          <div className="stat-card-value tabular">{formatCurrency(summary.totalMinimumPayment)}</div>
          <div className="stat-card-sub">required payments</div>
        </div>
        <div className="stat-card" style={{ '--stat-accent': '#0A2A66' } as React.CSSProperties}>
          <div className="stat-card-label">With Extra Payment</div>
          <div className="stat-card-value text-primary-color tabular">{formatCurrency(summary.monthlyPayment)}</div>
          <div className="stat-card-sub">+{formatCurrency(extraPayment)} extra/month</div>
        </div>
        <div className="stat-card" style={{ '--stat-accent': '#2563EB' } as React.CSSProperties}>
          <div className="stat-card-label">Est. Total Interest</div>
          <div className="stat-card-value tabular">{formatCurrency(summary.totalInterest)}</div>
          <div className="stat-card-sub">{summary.canPayoff ? `Debt-free ${summary.debtFreeDate}` : summary.debtFreeDate}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="card" style={{ marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-muted)', marginBottom: 8 }}>Strategy</div>
          <div className="toggle-group" style={{ width: 260 }}>
            <button className={`toggle-btn${method === 'snowball' ? ' active' : ''}`} onClick={() => setMethod('snowball')}>
              â›„ Snowball (lowest balance)
            </button>
            <button className={`toggle-btn${method === 'avalanche' ? ' active' : ''}`} onClick={() => setMethod('avalanche')}>
              ðŸ”ï¸ Avalanche (highest APR)
            </button>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-muted)', marginBottom: 8 }}>Extra Monthly Payment</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: 18 }}>$</span>
            <input
              className="form-input"
              type="number"
              min="0"
              step="25"
              value={extraPayment}
              onChange={e => setExtraPayment(parseMoneyInput(e.target.value) || 0)}
              style={{ width: 120 }}
            />
          </div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', maxWidth: 300 }}>
          {method === 'snowball'
            ? 'âœ“ Pay minimums on all debts, then attack the smallest balance first for quick wins.'
            : 'âœ“ Pay minimums on all debts, then attack the highest interest rate first to minimize total interest.'}
        </div>
      </div>

      {/* Debt cards */}
      {debts.length === 0 ? (
        <div className="card"><div className="empty-state"><Target size={32} style={{ opacity: .2 }} /><p>No debts tracked. Add debts in the Debt Tracker page.</p></div></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sorted.map((d, idx) => {
            const risk = getDebtRisk(d);
            const apr = d.interestRate ?? 0;
            const scheduleItem = scheduleByDebtId.get(d.id);
            const allotted = scheduleItem?.firstMonthPayment ?? ((d.minimumPayment ?? 0) + (idx === 0 ? extraPayment : 0));
            const paidPct = d.originalBalance && d.originalBalance > 0
              ? Math.min(100, ((d.originalBalance - d.balance) / d.originalBalance) * 100)
              : 0;

            return (
              <div key={d.id} className="debt-card">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                      <span style={{
                        width: 22, height: 22, borderRadius: '50%',
                        background: 'var(--bg-surface-3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 800, color: 'var(--color-primary)'
                      }}>{idx + 1}</span>
                      <span style={{ fontWeight: 700, fontSize: 15 }}>{d.name}</span>
                      <RiskBadge level={risk} label={risk === 'red' ? 'High Priority' : risk === 'yellow' ? 'Medium' : 'Low'} />
                    </div>
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 10 }}>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-muted)' }}>Balance</div>
                        <div style={{ fontSize: 18, fontWeight: 800 }} className="text-danger tabular">{formatCurrency(d.balance)}</div>
                      </div>
                      {apr > 0 && (
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-muted)' }}>APR</div>
                          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-warning)' }} className="tabular">{apr}%</div>
                        </div>
                      )}
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-muted)' }}>Monthly Payment</div>
                        <div style={{ fontSize: 18, fontWeight: 800 }} className="tabular">
                          {formatCurrency(allotted)}
                          {idx === 0 && extraPayment > 0 && (
                            <span style={{ fontSize: 11, color: 'var(--color-primary)', marginLeft: 4 }}>+{formatCurrency(extraPayment)} extra</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-muted)' }}>Payoff Date</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: scheduleItem?.payoffMonth === null ? 'var(--color-danger)' : 'var(--color-success)' }}>{scheduleItem?.payoffDate ?? 'Never (payment too low)'}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{scheduleItem?.payoffMonth !== null && scheduleItem?.payoffMonth !== undefined ? `${scheduleItem.payoffMonth} months` : ''}</div>
                      </div>
                    </div>
                    {paidPct > 0 && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
                          <span>Payoff Progress</span><span>{paidPct.toFixed(0)}%</span>
                        </div>
                        <div className="progress-bar">
                          <div className={`progress-fill ${paidPct >= 100 ? 'safe' : 'warning'}`} style={{ width: `${Math.min(100, paidPct)}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

