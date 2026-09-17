import { useEffect, useState } from 'react';
import type { Transaction } from '../types';
import { CATEGORY_COLORS } from '../types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { formatCurrency, currentMonthKey } from '../utils/format';
import {
  getMonthlyCashFlow,
  getSortedCategorySpendingEntries,
  getSpendingByCategory,
  getTotalCategorySpending,
} from '../domain/budgeting/selectors';
import { repositories } from '../persistence';

function getMonthKey(offset: number) {
  const d = new Date();
  d.setMonth(d.getMonth() - offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabel(key: string) {
  const [y, m] = key.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function Reports() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [view, setView] = useState<'monthly' | 'category'>('monthly');

  useEffect(() => {
    void repositories.transactions.list().then(setTransactions);
  }, []);

  // Last 6 months
  const months = [0, 1, 2, 3, 4, 5].map(getMonthKey).reverse();
  const thisMonth = currentMonthKey();

  const monthlyData = months.map(month => {
    const { income, expenses } = getMonthlyCashFlow(transactions, month);
    return { month, label: monthLabel(month), income, expenses, net: income - expenses };
  });



  // Category breakdown for current month
  const categoryEntries = getSortedCategorySpendingEntries(getSpendingByCategory(transactions, thisMonth));
  const totalSpend = getTotalCategorySpending(categoryEntries);

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Reports</h1>
          <p>Visual summary of your finances</p>
        </div>
        <div className="toggle-group">
          <button className={`toggle-btn${view === 'monthly' ? ' active' : ''}`} onClick={() => setView('monthly')}>Monthly</button>
          <button className={`toggle-btn${view === 'category' ? ' active' : ''}`} onClick={() => setView('category')}>By Category</button>
        </div>
      </div>

      {view === 'monthly' && (
        <>
          {/* Recharts bar chart */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-title">Income vs. Expenses Last 6 Months</div>
            <div className="chart-container-lg">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 12, color: '#111827', boxShadow: '0 8px 24px rgba(18, 38, 58, .10)' }} formatter={(v) => [`$${Number(v).toLocaleString()}`, undefined]} />
                  <Legend iconType="circle" iconSize={8} formatter={v => <span style={{ color: '#64748b', fontSize: 11 }}>{v}</span>} />
                  <Bar dataKey="income" name="Income" fill="#16A34A" fillOpacity={0.84} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="#DC2626" fillOpacity={0.84} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Month-by-month table */}
          <div className="card">
            <div className="card-title">Month Summary</div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th style={{ textAlign: 'right' }}>Income</th>
                    <th style={{ textAlign: 'right' }}>Expenses</th>
                    <th style={{ textAlign: 'right' }}>Net</th>
                  </tr>
                </thead>
                <tbody>
                  {[...monthlyData].reverse().map(m => (
                    <tr key={m.month} style={m.month === thisMonth ? { background: 'var(--color-primary-light)' } : {}}>
                      <td style={{ fontWeight: m.month === thisMonth ? 700 : 400 }}>
                        {m.label} {m.month === thisMonth && <span className="badge badge-info" style={{ marginLeft: 4 }}>Current</span>}
                      </td>
                      <td style={{ textAlign: 'right' }} className="text-success fw-semibold">{formatCurrency(m.income)}</td>
                      <td style={{ textAlign: 'right' }} className="text-danger fw-semibold">{formatCurrency(m.expenses)}</td>
                      <td style={{ textAlign: 'right' }} className={`fw-bold ${m.net >= 0 ? 'text-success' : 'text-danger'}`}>
                        {m.net >= 0 ? '+' : ''}{formatCurrency(m.net)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {view === 'category' && (
        <div className="card">
          <div className="card-title">Spending by Category â€” {monthLabel(thisMonth)}</div>
          {categoryEntries.length === 0 ? (
            <div className="empty-state"><p>No expense data for this month.</p></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {categoryEntries.map(([cat, amount]) => {
                const pct = totalSpend > 0 ? (amount / totalSpend) * 100 : 0;
                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="category-dot" style={{ background: CATEGORY_COLORS[cat] ?? '#94a3b8', width: 12, height: 12 }} />
                        <span style={{ fontWeight: 500, fontSize: 14 }}>{cat}</span>
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                        <span className="fw-bold">{formatCurrency(amount)}</span>
                        <span className="text-muted"> Â· {pct.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill safe"
                        style={{ width: `${pct}%`, background: CATEGORY_COLORS[cat] ?? '#94a3b8' }}
                      />
                    </div>
                  </div>
                );
              })}
              <div className="divider" />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 15 }}>
                <span>Total</span>
                <span>{formatCurrency(totalSpend)}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

