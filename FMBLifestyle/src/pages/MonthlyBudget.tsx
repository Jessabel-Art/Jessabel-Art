import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import type { BudgetCategory } from '../types';
import { EXPENSE_CATEGORIES, CATEGORY_COLORS } from '../types';
import { formatCurrency, currentMonthLabel, currentMonthKey, generateId } from '../utils/format';
import ProgressBar from '../components/ui/ProgressBar';
import { filterBudgetsByMonth, getBudgetTotals } from '../domain/budgeting/selectors';
import { parseMoneyInput } from '../domain/money';
import { repositories } from '../persistence';

const COLORS = Object.values(CATEGORY_COLORS);
const EMPTY_FORM = { category: 'Food & Dining', budgeted: '', spent: '', color: COLORS[0] };

export default function MonthlyBudget() {
  const [budgets, setBudgets] = useState<BudgetCategory[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<BudgetCategory | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  const thisMonth = currentMonthKey();

  async function reload() {
    setBudgets(filterBudgetsByMonth(await repositories.budgets.list(), thisMonth));
  }
  useEffect(() => { void reload(); }, []);

  const { totalBudgeted, totalSpent, remaining, overBudget } = getBudgetTotals(budgets);

  function openAdd() {
    setEditTarget(null);
    setForm({ ...EMPTY_FORM });
    setShowModal(true);
  }

  function openEdit(b: BudgetCategory) {
    setEditTarget(b);
    setForm({ category: b.category, budgeted: String(b.budgeted), spent: String(b.spent), color: b.color });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const entry: BudgetCategory = {
      id: editTarget?.id ?? generateId(),
      category: form.category,
      budgeted: parseMoneyInput(form.budgeted),
      spent: parseMoneyInput(form.spent),
      month: thisMonth,
      color: form.color,
    };
    await repositories.budgets.upsert(entry);
    setShowModal(false);
    await reload();
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this budget category?')) return;
    await repositories.budgets.delete(id);
    await reload();
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Monthly Budget</h1>
          <p>{currentMonthLabel()}</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Summary */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-card-label">Total Budgeted</div>
          <div className="stat-card-value">{formatCurrency(totalBudgeted)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Total Spent</div>
          <div className={`stat-card-value ${totalSpent > totalBudgeted ? 'text-danger' : 'text-success'}`}>
            {formatCurrency(totalSpent)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Remaining</div>
          <div className={`stat-card-value ${remaining < 0 ? 'text-danger' : ''}`}>
            {formatCurrency(remaining)}
          </div>
          {overBudget.length > 0 && (
            <div className="stat-card-sub" style={{ color: 'var(--color-danger)' }}>
              {overBudget.length} categor{overBudget.length === 1 ? 'y' : 'ies'} over budget
            </div>
          )}
        </div>
      </div>

      <div className="card">
        {budgets.length === 0 ? (
          <div className="empty-state">
            <p>No budget categories yet. Add one to get started.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {budgets.map((b, i) => {
              const pct = b.budgeted > 0 ? (b.spent / b.budgeted) * 100 : 0;
              const over = b.spent > b.budgeted;
              return (
                <div
                  key={b.id}
                  style={{
                    padding: '16px 4px',
                    borderBottom: i < budgets.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span className="category-dot" style={{ background: b.color, width: 12, height: 12 }} />
                      <span style={{ fontWeight: 600, fontSize: 15 }}>{b.category}</span>
                      {over && <span className="badge badge-danger">Over budget</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, color: over ? 'var(--color-danger)' : 'var(--text-secondary)', fontWeight: 600 }}>
                        {formatCurrency(b.spent)} <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>of {formatCurrency(b.budgeted)}</span>
                      </span>
                      <button className="btn btn-ghost btn-sm btn-icon" onClick={() => openEdit(b)}>
                        <Pencil size={14} />
                      </button>
                      <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(b.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <ProgressBar value={b.spent} max={b.budgeted} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                    <span>{Math.round(pct)}% used</span>
                    <span>{over ? `${formatCurrency(b.spent - b.budgeted)} over` : `${formatCurrency(b.budgeted - b.spent)} left`}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">{editTarget ? 'Edit Budget Category' : 'Add Budget Category'}</div>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value, color: CATEGORY_COLORS[e.target.value] ?? COLORS[0] }))}>
                  {EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Budgeted ($)</label>
                  <input className="form-input" type="number" min="0" step="0.01" required value={form.budgeted} onChange={e => setForm(f => ({ ...f, budgeted: e.target.value }))} placeholder="0.00" />
                </div>
                <div className="form-group">
                  <label className="form-label">Spent so far ($)</label>
                  <input className="form-input" type="number" min="0" step="0.01" value={form.spent} onChange={e => setForm(f => ({ ...f, spent: e.target.value }))} placeholder="0.00" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editTarget ? 'Save Changes' : 'Add Category'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
