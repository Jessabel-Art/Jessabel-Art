import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import type { Debt } from '../types';
import { formatCurrency, generateId } from '../utils/format';
import ProgressBar from '../components/ui/ProgressBar';
import { getDebtTotals } from '../domain/debt/selectors';
import { parseMoneyInput } from '../domain/money';
import { repositories } from '../persistence';

const PALETTE = ['#0A2A66', '#DC2626', '#2563EB', '#D4A62A', '#16A34A', '#7C3AED', '#7C3AED'];
const EMPTY_FORM = { name: '', balance: '', originalBalance: '', interestRate: '', minimumPayment: '', dueDate: '', color: PALETTE[0], notes: '' };

export default function DebtTracker() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Debt | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  async function reload() { setDebts(await repositories.debts.list()); }
  useEffect(() => { void reload(); }, []);

  const { totalDebt, totalMinimumPayment: totalMinPayment, totalOriginal, overallProgress } = getDebtTotals(debts);

  function openAdd() { setEditTarget(null); setForm({ ...EMPTY_FORM }); setShowModal(true); }
  function openEdit(d: Debt) {
    setEditTarget(d);
    setForm({ name: d.name, balance: String(d.balance), originalBalance: String(d.originalBalance), interestRate: String(d.interestRate), minimumPayment: String(d.minimumPayment), dueDate: String(d.dueDate), color: d.color, notes: d.notes ?? '' });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const debt: Debt = {
      id: editTarget?.id ?? generateId(),
      name: form.name.trim(),
      balance: parseMoneyInput(form.balance),
      originalBalance: parseMoneyInput(form.originalBalance) || parseMoneyInput(form.balance),
      interestRate: parseFloat(form.interestRate),
      minimumPayment: parseMoneyInput(form.minimumPayment),
      dueDate: parseInt(form.dueDate),
      color: form.color,
      notes: form.notes.trim() || undefined,
    };
    await repositories.debts.upsert(debt);
    setShowModal(false);
    await reload();
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this debt?')) return;
    await repositories.debts.delete(id);
    await reload();
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Debt Tracker</h1>
          <p>{debts.length} account{debts.length !== 1 ? 's' : ''} · {formatCurrency(totalDebt)} remaining</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} /> Add Debt
        </button>
      </div>

      {/* Summary */}
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-card-label">Total Debt</div>
          <div className="stat-card-value text-danger">{formatCurrency(totalDebt)}</div>
          <div className="stat-card-sub">across {debts.length} account{debts.length !== 1 ? 's' : ''}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Min. Monthly Payment</div>
          <div className="stat-card-value">{formatCurrency(totalMinPayment)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Overall Progress</div>
          <div className="stat-card-value text-success">{overallProgress.toFixed(0)}%</div>
          <div className="stat-card-sub">{formatCurrency(totalOriginal - totalDebt)} paid off</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {debts.length === 0 ? (
          <div className="card">
            <div className="empty-state"><p>No debts tracked. Add one to start.</p></div>
          </div>
        ) : (
          debts.map(d => {
            const pct = d.originalBalance > 0 ? ((d.originalBalance - d.balance) / d.originalBalance) * 100 : 0;
            return (
              <div className="card" key={d.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="category-dot" style={{ background: d.color, width: 14, height: 14 }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{d.name}</div>
                      {d.notes && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.notes}</div>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-sm btn-icon" onClick={() => openEdit(d)}><Pencil size={14} /></button>
                    <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(d.id)}><Trash2 size={14} /></button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: 3 }}>Balance</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-danger)' }}>{formatCurrency(d.balance)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: 3 }}>APR</div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{d.interestRate}%</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: 3 }}>Min. Payment</div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{formatCurrency(d.minimumPayment)}</div>
                  </div>
                </div>

                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                    <span>{pct.toFixed(0)}% paid off</span>
                    <span>Due on the {d.dueDate}{['st','nd','rd'][d.dueDate - 1] ?? 'th'}</span>
                  </div>
                  <ProgressBar value={d.originalBalance - d.balance} max={d.originalBalance} />
                </div>
              </div>
            );
          })
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">{editTarget ? 'Edit Debt' : 'Add Debt'}</div>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Debt Name</label>
                <input className="form-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Student Loan" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Current Balance ($)</label>
                  <input className="form-input" type="number" min="0" step="0.01" required value={form.balance} onChange={e => setForm(f => ({ ...f, balance: e.target.value }))} placeholder="0.00" />
                </div>
                <div className="form-group">
                  <label className="form-label">Original Balance ($)</label>
                  <input className="form-input" type="number" min="0" step="0.01" value={form.originalBalance} onChange={e => setForm(f => ({ ...f, originalBalance: e.target.value }))} placeholder="Same as current" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Interest Rate (%)</label>
                  <input className="form-input" type="number" min="0" step="0.01" required value={form.interestRate} onChange={e => setForm(f => ({ ...f, interestRate: e.target.value }))} placeholder="0.00" />
                </div>
                <div className="form-group">
                  <label className="form-label">Min. Payment ($)</label>
                  <input className="form-input" type="number" min="0" step="0.01" required value={form.minimumPayment} onChange={e => setForm(f => ({ ...f, minimumPayment: e.target.value }))} placeholder="0.00" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Due Day (1-31)</label>
                  <input className="form-input" type="number" min="1" max="31" required value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} placeholder="15" />
                </div>
                <div className="form-group">
                  <label className="form-label">Color</label>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                    {PALETTE.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, color: c }))}
                        style={{
                          width: 26, height: 26, borderRadius: '50%', background: c, border: form.color === c ? '3px solid var(--text-primary)' : '2px solid transparent', cursor: 'pointer',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Notes (optional)</label>
                <input className="form-input" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Lender, account number, etc." />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editTarget ? 'Save Changes' : 'Add Debt'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

