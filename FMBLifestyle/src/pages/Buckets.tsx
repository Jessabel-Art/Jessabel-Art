import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, PiggyBank } from 'lucide-react';
import type { SavingsBucket, Account, Transaction } from '../types';
import { formatCurrency, generateId } from '../utils/format';
import RiskBadge from '../components/ui/RiskBadge';
import { getActiveAccounts } from '../domain/accounts/selectors';
import {
  calculateAvailableToAllocateByAccount,
  calculateBucketProgress,
  calculateBucketRisk,
  calculateSavingsSummary,
  getBucketDaysLeft,
} from '../domain/savings/selectors';
import { parseMoneyInput } from '../domain/money';
import { repositories } from '../persistence';

const BUCKET_COLORS = ['#0A2A66', '#16A34A', '#DC2626', '#D4A62A', '#2563EB', '#F97316', '#7C3AED', '#16A34A'];

const DEFAULT_FORM = { name: '', goalAmount: '', allocatedAmount: '', targetDate: '', accountId: '', color: BUCKET_COLORS[0], notes: '' };

export default function Buckets() {
  const [buckets, setBuckets] = useState<SavingsBucket[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [allAccounts, setAllAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<SavingsBucket | null>(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [formError, setFormError] = useState('');

  async function reload() {
    const [nextAccounts, nextBuckets, nextTransactions] = await Promise.all([
      repositories.accounts.list(),
      repositories.savingsBuckets.list(),
      repositories.transactions.list(),
    ]);

    setBuckets(nextBuckets);
    setAllAccounts(nextAccounts);
    setAccounts(getActiveAccounts(nextAccounts));
    setTransactions(nextTransactions);
  }
  useEffect(() => { void reload(); }, []);

  const { totalGoal, totalAllocated, totalRemaining } = calculateSavingsSummary(buckets);
  const selectedAccountAvailable = form.accountId
    ? calculateAvailableToAllocateByAccount({
      accounts,
      transactions,
      buckets,
      accountId: form.accountId,
      excludeBucketId: editing?.id,
    })
    : null;
  const formAllocatedAmount = parseMoneyInput(form.allocatedAmount || '0');
  const allocationError = selectedAccountAvailable !== null && formAllocatedAmount > selectedAccountAvailable
    ? `This bucket exceeds the selected account's available amount by ${formatCurrency(formAllocatedAmount - selectedAccountAvailable)}.`
    : '';

  function openAdd() {
    setEditing(null);
    setForm(DEFAULT_FORM);
    setFormError('');
    setShowModal(true);
  }
  function openEdit(b: SavingsBucket) {
    setEditing(b);
    setForm({
      name: b.name,
      goalAmount: String(b.goalAmount),
      allocatedAmount: String(b.allocatedAmount),
      targetDate: b.targetDate ?? '',
      accountId: b.accountId ?? '',
      color: b.color ?? BUCKET_COLORS[0],
      notes: b.notes ?? '',
    });
    setFormError('');
    setShowModal(true);
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (allocationError) {
      setFormError(allocationError);
      return;
    }

    const item: SavingsBucket = {
      id: editing?.id ?? generateId(),
      name: form.name.trim(),
      goalAmount: parseMoneyInput(form.goalAmount),
      allocatedAmount: parseMoneyInput(form.allocatedAmount || '0'),
      targetDate: form.targetDate || undefined,
      accountId: form.accountId || undefined,
      color: form.color,
      notes: form.notes.trim() || undefined,
    };
    try {
      await repositories.savingsBuckets.upsert(item);
      setShowModal(false);
      setFormError('');
      await reload();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to save bucket.');
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Savings Buckets</h1>
          <p>Named savings goals with progress tracking</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={14} /> New Bucket</button>
      </div>

      {/* Summary */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-card-label">Total Goal</div>
          <div className="stat-card-value tabular">{formatCurrency(totalGoal)}</div>
          <div className="stat-card-sub">{buckets.length} goal{buckets.length !== 1 ? 's' : ''}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Saved So Far</div>
          <div className="stat-card-value text-success tabular">{formatCurrency(totalAllocated)}</div>
          <div className="stat-card-sub">{totalGoal > 0 ? ((totalAllocated / totalGoal) * 100).toFixed(0) : 0}% of goals</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Still Needed</div>
          <div className={`stat-card-value tabular ${totalRemaining <= 0 ? 'text-success' : ''}`}>{formatCurrency(Math.max(0, totalRemaining))}</div>
          <div className="stat-card-sub">{totalRemaining <= 0 ? 'All goals funded! ðŸŽ‰' : 'remaining to reach all goals'}</div>
        </div>
      </div>

      {buckets.length === 0 ? (
        <div className="card"><div className="empty-state"><PiggyBank size={32} style={{ opacity: .2 }} /><p>No savings goals yet. Create your first bucket!</p></div></div>
      ) : (
        <div className="section-grid">
          {buckets.map(b => {
            const { percent: pct, remaining, fillClass } = calculateBucketProgress(b);
            const risk = calculateBucketRisk(b);
            const acct = allAccounts.find(a => a.id === b.accountId);
            const daysLeft = getBucketDaysLeft(b);

            return (
              <div key={b.id} className="bucket-card">
                <div className="bucket-card-fill" style={{ height: `${pct}%`, background: b.color ?? '#0A2A66' }} />
                <div style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ width: 12, height: 12, borderRadius: 3, background: b.color ?? '#0A2A66', flexShrink: 0 }} />
                      <span style={{ fontWeight: 700, fontSize: 15 }}>{b.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-ghost btn-sm btn-icon" onClick={() => openEdit(b)}><Pencil size={12} /></button>
                      <button className="btn btn-danger btn-sm btn-icon" onClick={async () => { await repositories.savingsBuckets.delete(b.id); await reload(); }}><Trash2 size={12} /></button>
                    </div>
                  </div>

                  {b.notes && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>{b.notes}</div>}

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-muted)' }}>Saved</div>
                      <div style={{ fontSize: 18, fontWeight: 800 }} className="text-success tabular">{formatCurrency(b.allocatedAmount)}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-muted)' }}>Goal</div>
                      <div style={{ fontSize: 18, fontWeight: 800 }} className="tabular">{formatCurrency(b.goalAmount)}</div>
                    </div>
                  </div>

                  <div className="progress-bar" style={{ marginBottom: 8, height: 8 }}>
                    <div className={`progress-fill ${fillClass}`} style={{ width: `${pct}%` }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                    <RiskBadge level={risk} label={pct >= 100 ? 'Goal Reached' : `${pct.toFixed(0)}% Funded`} />
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      {remaining > 0 && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatCurrency(remaining)} left</span>}
                      {daysLeft !== null && (
                        <span style={{ fontSize: 11, color: daysLeft < 30 ? 'var(--color-danger)' : 'var(--text-muted)' }}>
                          {daysLeft > 0 ? `${daysLeft}d left` : 'Past target'}
                        </span>
                      )}
                      {acct && <span className="account-pill"><span className="account-pill-dot" style={{ background: '#0A2A66' }} />{acct.name}{acct.archivedAt ? ' (archived)' : ''}</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">{editing ? 'Edit Bucket' : 'New Savings Bucket'}</div>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Goal Name</label>
                <input className="form-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Emergency Fund" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Goal Amount ($)</label>
                  <input className="form-input" type="number" min="0" step="0.01" required value={form.goalAmount} onChange={e => setForm(f => ({ ...f, goalAmount: e.target.value }))} placeholder="0.00" />
                </div>
                <div className="form-group">
                  <label className="form-label">Saved So Far ($)</label>
                  <input className="form-input" type="number" min="0" step="0.01" value={form.allocatedAmount} onChange={e => setForm(f => ({ ...f, allocatedAmount: e.target.value }))} placeholder="0.00" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Target Date (optional)</label>
                  <input className="form-input" type="date" value={form.targetDate} onChange={e => setForm(f => ({ ...f, targetDate: e.target.value }))} />
                </div>
                {accounts.length > 0 && (
                  <div className="form-group">
                    <label className="form-label">Linked Account (optional)</label>
                    <select className="form-select" value={form.accountId} onChange={e => setForm(f => ({ ...f, accountId: e.target.value }))}>
                      <option value="">â€” None â€”</option>
                      {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                    {selectedAccountAvailable !== null && (
                      <div style={{ fontSize: 12, color: allocationError ? 'var(--color-danger)' : 'var(--text-muted)' }}>
                        Available to allocate: {formatCurrency(selectedAccountAvailable)}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Notes (optional)</label>
                <input className="form-input" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="e.g. 3-6 months expenses" />
              </div>
              <div className="form-group">
                <label className="form-label">Color</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {BUCKET_COLORS.map(c => (
                    <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))} style={{
                      width: 28, height: 28, borderRadius: 6, background: c, border: form.color === c ? '2px solid white' : '2px solid transparent', cursor: 'pointer'
                    }} />
                  ))}
                </div>
              </div>
              {(formError || allocationError) && (
                <div style={{ fontSize: 13, color: 'var(--color-danger)', marginTop: -4, marginBottom: 12 }}>
                  {formError || allocationError}
                </div>
              )}
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

