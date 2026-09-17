import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import type { Account, Envelope, Transaction } from '../types';
import { formatCurrency, generateId, currentMonthKey } from '../utils/format';
import RiskBadge from '../components/ui/RiskBadge';
import { getActiveAccounts } from '../domain/accounts/selectors';
import {
  calculateAvailableEnvelopeAllocationByAccount,
  calculateEnvelopeRemaining,
  calculateEnvelopeRisk,
  calculateEnvelopeSpentFromTransactions,
  calculateEnvelopeSummary,
  getEnvelopesByMonth,
} from '../domain/budgeting/selectors';
import { parseMoneyInput } from '../domain/money';
import { repositories } from '../persistence';

const ENVELOPE_COLORS = ['#0A2A66', '#16A34A', '#DC2626', '#D4A62A', '#2563EB', '#F97316', '#7C3AED', '#16A34A'];

const DEFAULT_FORM = { name: '', category: '', allocated: '', color: ENVELOPE_COLORS[0], fromAccountId: '' };

export default function Envelopes() {
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [allEnvelopes, setAllEnvelopes] = useState<Envelope[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [allAccounts, setAllAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Envelope | null>(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [formError, setFormError] = useState('');
  const month = currentMonthKey();

  async function reload() {
    const [nextEnvelopes, nextAccounts, nextTransactions] = await Promise.all([
      repositories.envelopes.list(),
      repositories.accounts.list(),
      repositories.transactions.list(),
    ]);

    setAllEnvelopes(nextEnvelopes);
    setEnvelopes(getEnvelopesByMonth(nextEnvelopes, month));
    setAllAccounts(nextAccounts);
    setAccounts(getActiveAccounts(nextAccounts));
    setTransactions(nextTransactions);
  }
  useEffect(() => { void reload(); }, []);

  const { totalAllocated, totalSpent, totalRemaining } = calculateEnvelopeSummary(envelopes, transactions);
  const selectedAccountIsActive = accounts.some(account => account.id === form.fromAccountId);
  const selectedAccountAvailable = form.fromAccountId && selectedAccountIsActive
    ? calculateAvailableEnvelopeAllocationByAccount({
      accounts,
      transactions,
      envelopes: allEnvelopes,
      accountId: form.fromAccountId,
      month,
      excludeEnvelopeId: editing?.id,
    })
    : null;
  const formAllocatedAmount = parseMoneyInput(form.allocated || '0');
  const allocationError = selectedAccountAvailable !== null && formAllocatedAmount > selectedAccountAvailable
    ? `This envelope exceeds the selected account's available amount by ${formatCurrency(formAllocatedAmount - selectedAccountAvailable)}.`
    : '';
  const archivedSelectedAccount = form.fromAccountId && !selectedAccountIsActive
    ? allAccounts.find(account => account.id === form.fromAccountId)
    : undefined;

  function openAdd() {
    setEditing(null);
    setForm(DEFAULT_FORM);
    setFormError('');
    setShowModal(true);
  }

  function openEdit(envelope: Envelope) {
    setEditing(envelope);
    setForm({
      name: envelope.name,
      category: envelope.category ?? '',
      allocated: String(envelope.allocated),
      color: envelope.color ?? ENVELOPE_COLORS[0],
      fromAccountId: envelope.fromAccountId ?? '',
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

    const item: Envelope = {
      id: editing?.id ?? generateId(),
      name: form.name.trim(),
      category: form.category.trim() || undefined,
      allocated: parseMoneyInput(form.allocated),
      spent: editing?.spent ?? 0,
      month,
      color: form.color,
      fromAccountId: form.fromAccountId || undefined,
    };

    try {
      await repositories.envelopes.upsert(item);
      setShowModal(false);
      setFormError('');
      await reload();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to save envelope.');
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Envelopes</h1>
          <p>Virtual spending allocations for this month</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={14} /> New Envelope</button>
      </div>

      <div className="stat-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-card-label">Total Allocated</div>
          <div className="stat-card-value tabular">{formatCurrency(totalAllocated)}</div>
          <div className="stat-card-sub">{envelopes.length} envelopes</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Total Spent</div>
          <div className="stat-card-value text-danger tabular">{formatCurrency(totalSpent)}</div>
          <div className="stat-card-sub">{totalAllocated > 0 ? ((totalSpent / totalAllocated) * 100).toFixed(0) : 0}% of budget</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Remaining</div>
          <div className={`stat-card-value tabular ${totalRemaining >= 0 ? 'text-success' : 'text-danger'}`}>{formatCurrency(totalRemaining)}</div>
          <div className="stat-card-sub">this month</div>
        </div>
      </div>

      {envelopes.length === 0 ? (
        <div className="card"><div className="empty-state"><p>No envelopes for this month. Create one to start allocating.</p></div></div>
      ) : (
        <div className="section-grid-3">
          {envelopes.map(envelope => {
            const spent = calculateEnvelopeSpentFromTransactions(envelope, transactions);
            const pct = envelope.allocated > 0 ? (spent / envelope.allocated) * 100 : 0;
            const remaining = calculateEnvelopeRemaining(envelope, transactions);
            const risk = calculateEnvelopeRisk(envelope, transactions);
            const account = allAccounts.find(item => item.id === envelope.fromAccountId);
            const fillClass = pct >= 100 ? 'danger' : pct >= 80 ? 'warning' : 'safe';

            return (
              <div key={envelope.id} className="envelope-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ width: 12, height: 12, borderRadius: 3, background: envelope.color ?? '#0A2A66', flexShrink: 0 }} />
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{envelope.name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="btn btn-ghost btn-sm btn-icon" onClick={() => openEdit(envelope)}><Pencil size={12} /></button>
                    <button className="btn btn-danger btn-sm btn-icon" onClick={async () => { await repositories.envelopes.delete(envelope.id); await reload(); }}><Trash2 size={12} /></button>
                  </div>
                </div>

                {envelope.category && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>{envelope.category}</div>}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-muted)' }}>Spent</div>
                    <div style={{ fontSize: 16, fontWeight: 800 }} className="text-danger tabular">{formatCurrency(spent)}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', color: 'var(--text-muted)' }}>Remaining</div>
                    <div style={{ fontSize: 16, fontWeight: 800 }} className={remaining >= 0 ? 'text-success tabular' : 'text-danger tabular'}>{formatCurrency(remaining)}</div>
                  </div>
                </div>

                <div className="progress-bar" style={{ marginBottom: 8 }}>
                  <div className={`progress-fill ${fillClass}`} style={{ width: `${Math.min(100, pct)}%` }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <RiskBadge level={risk} label={pct >= 100 ? 'Overspent' : pct >= 80 ? 'Almost Gone' : 'On Track'} />
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatCurrency(envelope.allocated)} budget</span>
                    {account && <span className="account-pill"><span className="account-pill-dot" style={{ background: '#0A2A66' }} />{account.name}{account.archivedAt ? ' (archived)' : ''}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={ev => { if (ev.target === ev.currentTarget) setShowModal(false); }}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">{editing ? 'Edit Envelope' : 'New Envelope'}</div>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Envelope Name</label>
                <input className="form-input" required value={form.name} onChange={ev => setForm(current => ({ ...current, name: ev.target.value }))} placeholder="e.g. Groceries" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category (optional)</label>
                  <input className="form-input" value={form.category} onChange={ev => setForm(current => ({ ...current, category: ev.target.value }))} placeholder="e.g. Food" />
                </div>
                <div className="form-group">
                  <label className="form-label">Monthly Budget ($)</label>
                  <input className="form-input" type="number" min="0" step="0.01" required value={form.allocated} onChange={ev => setForm(current => ({ ...current, allocated: ev.target.value }))} placeholder="0.00" />
                </div>
              </div>
              {(accounts.length > 0 || archivedSelectedAccount) && (
                <div className="form-group">
                  <label className="form-label">Source Account (optional)</label>
                  <select className="form-select" value={form.fromAccountId} onChange={ev => setForm(current => ({ ...current, fromAccountId: ev.target.value }))}>
                    <option value="">None</option>
                    {archivedSelectedAccount && <option value={archivedSelectedAccount.id} disabled>{archivedSelectedAccount.name} (archived)</option>}
                    {accounts.map(account => <option key={account.id} value={account.id}>{account.name}</option>)}
                  </select>
                  {selectedAccountAvailable !== null && (
                    <div style={{ fontSize: 12, color: allocationError ? 'var(--color-danger)' : 'var(--text-muted)' }}>
                      Available to allocate: {formatCurrency(selectedAccountAvailable)}
                    </div>
                  )}
                </div>
              )}
              <div className="form-group">
                <label className="form-label">Color</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {ENVELOPE_COLORS.map(color => (
                    <button key={color} type="button" onClick={() => setForm(current => ({ ...current, color }))} style={{
                      width: 28, height: 28, borderRadius: 6, background: color, border: form.color === color ? '2px solid white' : '2px solid transparent', cursor: 'pointer'
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

