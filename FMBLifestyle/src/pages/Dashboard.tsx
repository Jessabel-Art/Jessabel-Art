import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Transaction, BudgetCategory, Debt, NetWorthAsset, NetWorthLiability, Account, SavingsBucket, MortgageScenario, MortgageGoal, MortgageReadinessSnapshot } from '../types';
import { formatCurrency, formatDate, currentMonthLabel, currentMonthKey } from '../utils/format';
import { CATEGORY_COLORS } from '../types';
import { NetWorthChart, DonutChart, SpendingBarChart } from '../components/ui/Charts';
import { getActiveAccounts, getDerivedCurrentBalance, getTotalAccountBalance } from '../domain/accounts/selectors';
import { filterBudgetsByMonth, getMonthlyCashFlow, getRecentTransactions } from '../domain/budgeting/selectors';
import { getDebtTotals } from '../domain/debt/selectors';
import { calculateNetWorthSummary, calculateNetWorthTrend, getPreviousNetWorth } from '../domain/netWorth/selectors';
import { getSavingsBucketTotals } from '../domain/savings/selectors';
import { calculateMortgageGoal, calculateMortgageReadiness } from '../domain/mortgage/calculators';
import { repositories } from '../persistence';
import writtenLogo from '../assets/logo/written-logo.png';

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<BudgetCategory[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [assets, setAssets] = useState<NetWorthAsset[]>([]);
  const [liabilities, setLiabilities] = useState<NetWorthLiability[]>([]);
  const [snapshots, setSnapshots] = useState<{ month: string; netWorth: number; totalAssets: number; totalLiabilities: number }[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [buckets, setBuckets] = useState<SavingsBucket[]>([]);
  const [mortgageScenarios, setMortgageScenarios] = useState<MortgageScenario[]>([]);
  const [mortgageGoals, setMortgageGoals] = useState<MortgageGoal[]>([]);
  const [mortgageReadinessSnapshots, setMortgageReadinessSnapshots] = useState<MortgageReadinessSnapshot[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      const [
        nextTransactions,
        nextBudgets,
        nextDebts,
        nextAssets,
        nextLiabilities,
        nextSnapshots,
        nextAccounts,
        nextBuckets,
        nextMortgageScenarios,
        nextMortgageGoals,
        nextMortgageReadinessSnapshots,
      ] = await Promise.all([
        repositories.transactions.list(),
        repositories.budgets.list(),
        repositories.debts.list(),
        repositories.netWorth.listAssets(),
        repositories.netWorth.listLiabilities(),
        repositories.netWorth.listSnapshots(),
        repositories.accounts.list(),
        repositories.savingsBuckets.list(),
        repositories.mortgageScenarios.list(),
        repositories.mortgageGoals.list(),
        repositories.mortgageReadinessSnapshots.list(),
      ]);

      setTransactions(nextTransactions);
      setBudgets(nextBudgets);
      setDebts(nextDebts);
      setAssets(nextAssets);
      setLiabilities(nextLiabilities);
      setSnapshots(nextSnapshots);
      setAccounts(getActiveAccounts(nextAccounts));
      setBuckets(nextBuckets);
      setMortgageScenarios(nextMortgageScenarios);
      setMortgageGoals(nextMortgageGoals);
      setMortgageReadinessSnapshots(nextMortgageReadinessSnapshots);
    }

    void loadDashboardData();
  }, []);

  const thisMonth = currentMonthKey();
  const { income, expenses, savings, savingsRate } = getMonthlyCashFlow(transactions, thisMonth);

  const { netWorth } = calculateNetWorthSummary({
    accounts,
    transactions,
    assets,
    liabilities,
    debts,
  });
  const prevNetWorth = getPreviousNetWorth(snapshots, netWorth);
  const nwChange = netWorth - prevNetWorth;

  const chartNW = calculateNetWorthTrend(snapshots).slice(-8);

  const thisMonthBudgets = filterBudgetsByMonth(budgets, thisMonth);
  const spendingData = thisMonthBudgets.map(b => ({
    category: b.category.length > 9 ? b.category.slice(0, 9) + 'â€¦' : b.category,
    amount: b.spent,
    budget: b.budgeted,
    color: (CATEGORY_COLORS as Record<string, string>)[b.category] ?? '#0A2A66',
  }));

  const donutData = thisMonthBudgets
    .filter(b => b.spent > 0)
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 6)
    .map(b => ({
      name: b.category,
      value: b.spent,
      color: (CATEGORY_COLORS as Record<string, string>)[b.category] ?? '#0A2A66',
    }));

  const recentTx = getRecentTransactions(transactions, 5);
  const { totalDebt } = getDebtTotals(debts);
  const { totalAllocated: totalSaved, totalGoal: totalGoals } = getSavingsBucketTotals(buckets);
  const totalAccountBalance = getTotalAccountBalance(accounts, transactions);
  const mortgageScenario = mortgageScenarios[0];
  const mortgageGoal = mortgageGoals[0];
  const mortgageReadiness = mortgageScenario ? calculateMortgageReadiness(mortgageScenario) : null;
  const mortgageGoalProgress = mortgageGoal ? calculateMortgageGoal(mortgageGoal) : null;
  const mortgageUsage = mortgageReadiness ? mortgageReadiness.dtiUsage * 100 : 0;
  const scenarioReadinessSnapshots = mortgageScenario
    ? mortgageReadinessSnapshots
      .filter(snapshot => snapshot.scenarioId === mortgageScenario.id)
      .sort((a, b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt))
    : [];
  const previousMortgageSnapshot = scenarioReadinessSnapshots.length > 1
    ? scenarioReadinessSnapshots[scenarioReadinessSnapshots.length - 2]
    : undefined;
  const mortgageDtiChange = mortgageReadiness && previousMortgageSnapshot
    ? mortgageReadiness.backEndDti - previousMortgageSnapshot.backEndDti
    : null;
  const mortgageDtiChangeLabel = mortgageDtiChange === null
    ? 'No prior snapshot yet'
    : mortgageDtiChange < 0
      ? `DTI down ${Math.abs(mortgageDtiChange).toFixed(1)}% since last snapshot`
      : mortgageDtiChange > 0
        ? `DTI up ${mortgageDtiChange.toFixed(1)}% since last snapshot`
        : 'DTI unchanged since last snapshot';
  const mortgageUsageColor = mortgageUsage <= 70
    ? 'var(--color-success)'
    : mortgageUsage <= 90
      ? 'var(--color-warning)'
      : mortgageUsage <= 100
        ? 'var(--color-orange)'
        : 'var(--color-danger)';
  const mortgageGoalDate = mortgageGoal?.targetPurchaseDate
    ? new Date(`${mortgageGoal.targetPurchaseDate}T00:00:00`).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Not set';

  return (
    <>
      <div className="page-header">
        <div className="page-brand-lockup">
          <img src={writtenLogo} alt="FMBLifestyle" className="page-brand-logo" />
          <h1>Dashboard</h1>
          <p>{currentMonthLabel()} · Financial Overview</p>
        </div>
      </div>

      {/* Stat Row */}
      <div className="stat-grid">
        <div className="stat-card" style={{ '--stat-accent': '#16A34A' } as React.CSSProperties}>
          <div className="stat-card-label">Net Worth</div>
          <div className={`stat-card-value tabular ${netWorth >= 0 ? 'text-success' : 'text-danger'}`}>{formatCurrency(netWorth)}</div>
          <div className="stat-card-sub" style={{ color: nwChange >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
            {nwChange >= 0 ? '+' : ''}{formatCurrency(nwChange)} vs last month
          </div>
        </div>
        <div className="stat-card" style={{ '--stat-accent': '#2563EB' } as React.CSSProperties}>
          <div className="stat-card-label">Monthly Income</div>
          <div className="stat-card-value text-success tabular">{formatCurrency(income)}</div>
          <div className="stat-card-sub">this month</div>
        </div>
        <div className="stat-card" style={{ '--stat-accent': '#DC2626' } as React.CSSProperties}>
          <div className="stat-card-label">Monthly Expenses</div>
          <div className="stat-card-value text-danger tabular">{formatCurrency(expenses)}</div>
          <div className="stat-card-sub">this month</div>
        </div>
        <div className="stat-card" style={{ '--stat-accent': '#0A2A66' } as React.CSSProperties}>
          <div className="stat-card-label">Savings Rate</div>
          <div className={`stat-card-value tabular ${savingsRate >= 20 ? 'text-success' : savingsRate >= 5 ? '' : 'text-danger'}`}>{savingsRate.toFixed(0)}%</div>
          <div className="stat-card-sub">{formatCurrency(savings)} saved</div>
        </div>
        <div className="stat-card" style={{ '--stat-accent': '#DC2626' } as React.CSSProperties}>
          <div className="stat-card-label">Total Debt</div>
          <div className="stat-card-value text-danger tabular">{formatCurrency(totalDebt)}</div>
          <div className="stat-card-sub">{debts.length} account{debts.length !== 1 ? 's' : ''}</div>
        </div>
        <div className="stat-card" style={{ '--stat-accent': '#16A34A' } as React.CSSProperties}>
          <div className="stat-card-label">Savings Goals</div>
          <div className="stat-card-value text-success tabular">{formatCurrency(totalSaved)}</div>
          <div className="stat-card-sub">{totalGoals > 0 ? `${((totalSaved / totalGoals) * 100).toFixed(0)}% of ${formatCurrency(totalGoals)}` : 'No goals set'}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12 }}>
          <div className="card-title" style={{ margin: 0 }}>Mortgage Readiness</div>
          <Link to="/mortgage-readiness" style={{ fontSize: 12, color: 'var(--color-primary)' }}>Plan mortgage &gt;</Link>
        </div>
        {mortgageReadiness && mortgageScenario ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: 14, marginBottom: 14 }}>
              <div><div className="stat-card-label">Readiness Score</div><div className="fw-bold tabular">{mortgageReadiness.readinessScore}</div></div>
              <div><div className="stat-card-label">DTI Usage</div><div className="fw-bold tabular" style={{ color: mortgageUsageColor }}>{mortgageUsage.toFixed(0)}%</div></div>
              <div><div className="stat-card-label">Back-End DTI</div><div className="fw-bold tabular">{mortgageReadiness.backEndDti.toFixed(1)}%</div></div>
              <div><div className="stat-card-label">Buying Power</div><div className="fw-bold tabular">{formatCurrency(mortgageReadiness.buyingPower.target)}</div></div>
              <div><div className="stat-card-label">Down Payment Goal</div><div className="fw-bold tabular">{mortgageGoalProgress ? `${mortgageGoalProgress.progressPercent.toFixed(0)}%` : 'No goal'}</div></div>
              <div><div className="stat-card-label">Cash Needed</div><div className="fw-bold tabular">{mortgageGoalProgress ? formatCurrency(mortgageGoalProgress.remainingAmount) : 'No goal'}</div></div>
              <div><div className="stat-card-label">Target Date</div><div className="fw-bold">{mortgageGoalDate}</div></div>
            </div>
            <div style={{ fontSize: 13, color: mortgageDtiChange !== null && mortgageDtiChange > 0 ? 'var(--color-danger)' : mortgageDtiChange !== null && mortgageDtiChange < 0 ? 'var(--color-success)' : 'var(--text-secondary)', marginBottom: 12, fontWeight: 700 }}>
              {mortgageDtiChangeLabel}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  <span>DTI usage</span><span>{mortgageUsage.toFixed(0)}%</span>
                </div>
                <div className="progress-bar" style={{ height: 9 }}>
                  <div className="progress-fill safe" style={{ width: `${Math.min(mortgageUsage, 100)}%`, background: mortgageUsageColor }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  <span>Down payment progress</span><span>{mortgageGoalProgress ? `${mortgageGoalProgress.progressPercent.toFixed(0)}%` : '0%'}</span>
                </div>
                <div className="progress-bar" style={{ height: 9 }}>
                  <div className="progress-fill safe" style={{ width: `${mortgageGoalProgress ? mortgageGoalProgress.progressPercent : 0}%`, background: 'var(--color-gold)' }} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state" style={{ padding: '24px 12px' }}><p>No mortgage scenarios saved yet.</p></div>
        )}
      </div>

      {/* Net Worth Chart */}
      {chartNW.length > 1 && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div className="card-title" style={{ margin: 0 }}>Net Worth Trend</div>
            <Link to="/networth" style={{ fontSize: 12, color: 'var(--color-primary)' }}>View tracker â†’</Link>
          </div>
          <div className="chart-container-lg">
            <NetWorthChart data={chartNW} />
          </div>
        </div>
      )}

      <div className="section-grid" style={{ marginBottom: 20 }}>
        {/* Spending Bar */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div className="card-title" style={{ margin: 0 }}>Spending This Month</div>
            <Link to="/budget" style={{ fontSize: 12, color: 'var(--color-primary)' }}>View budget â†’</Link>
          </div>
          {spendingData.length > 0 ? (
            <div className="chart-container"><SpendingBarChart data={spendingData} /></div>
          ) : (
            <div className="empty-state"><p>No spending data this month</p></div>
          )}
        </div>
        {/* Donut */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div className="card-title" style={{ margin: 0 }}>Spending Breakdown</div>
            <Link to="/reports" style={{ fontSize: 12, color: 'var(--color-primary)' }}>Reports â†’</Link>
          </div>
          {donutData.length > 0 ? (
            <div className="chart-container"><DonutChart data={donutData} /></div>
          ) : (
            <div className="empty-state"><p>No data yet</p></div>
          )}
        </div>
      </div>

      <div className="section-grid">
        {/* Recent Transactions */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div className="card-title" style={{ margin: 0 }}>Recent Transactions</div>
            <Link to="/transactions" style={{ fontSize: 12, color: 'var(--color-primary)' }}>View all â†’</Link>
          </div>
          {recentTx.length === 0 ? (
            <div className="empty-state"><p>No transactions yet</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {recentTx.map(t => (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{t.description}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.category} Â· {formatDate(t.date)}</div>
                  </div>
                  <div className={`${t.type === 'income' ? 'text-success' : 'text-danger'} fw-bold tabular`} style={{ fontSize: 14 }}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Accounts */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div className="card-title" style={{ margin: 0 }}>Accounts</div>
            <Link to="/accounts" style={{ fontSize: 12, color: 'var(--color-primary)' }}>Manage â†’</Link>
          </div>
          {accounts.length === 0 ? (
            <div className="empty-state"><p>No accounts added</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {accounts.map(a => (
                <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{a.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{a.type.replace('_', ' ')}</div>
                  </div>
                  <div className={`${getDerivedCurrentBalance(a, transactions) >= 0 ? 'text-success' : 'text-danger'} fw-bold tabular`} style={{ fontSize: 14 }}>{formatCurrency(getDerivedCurrentBalance(a, transactions))}</div>
                </div>
              ))}
              <div style={{ paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700 }}>
                <span style={{ color: 'var(--text-muted)' }}>Total</span>
                <span className="tabular">{formatCurrency(totalAccountBalance)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}



