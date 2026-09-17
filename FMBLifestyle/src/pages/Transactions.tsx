import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import type { Account, Envelope, Transaction, TransactionType } from '../types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../types';
import { formatCurrency, formatDate, generateId } from '../utils/format';
import { getEnvelopesByMonth } from '../domain/budgeting/selectors';
import { parseMoneyInput } from '../domain/money';
import { getActiveAccounts } from '../domain/accounts/selectors';
import { repositories } from '../persistence';

const EMPTY_FORM = {
  date: new Date().toISOString().split('T')[0],
  description: '',
  amount: '',
  category: 'Food & Dining',
  type: 'expense' as TransactionType,
  accountId: '',
  envelopeId: '',
  notes: '',
};

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  async function reload() {
    const [nextTransactions, nextAccounts, nextEnvelopes] = await Promise.all([
      repositories.transactions.list(),
      repositories.accounts.list(),
      repositories.envelopes.list(),
    ]);

    setTransactions(nextTransactions);
    setAccounts(getActiveAccounts(nextAccounts));
    setEnvelopes(nextEnvelopes);
  }

  useEffect(() => { void reload(); }, []);

  const filtered = transactions.filter(t => {
    if (filter !== 'all' && t.type !== filter) return false;
    if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function openAdd() {
    setEditTarget(null);
    setForm({ ...EMPTY_FORM });
    setShowModal(true);
  }

  function openEdit(t: Transaction) {
    setEditTarget(t);
    setForm({
      date: t.date,
      description: t.description,
      amount: String(t.amount),
      category: t.category,
      type: t.type,
      accountId: t.accountId ?? '',
      envelopeId: t.type === 'expense' ? t.envelopeId ?? '' : '',
      notes: t.notes ?? '',
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const txn: Transaction = {
      id: editTarget?.id ?? generateId(),
      date: form.date,
      description: form.description.trim(),
      amount: parseMoneyInput(form.amount),
      category: form.category,
      type: form.type,
      accountId: form.accountId || undefined,
      envelopeId: form.type === 'expense' ? form.envelopeId || undefined : undefined,
      notes: form.notes.trim() || undefined,
    };
    if (editTarget) {
      await repositories.transactions.update(txn);
    } else {
      await repositories.transactions.add(txn);
    }
    setShowModal(false);
    await reload();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this transaction?')) return;
    await repositories.transactions.delete(id);
    await reload();
  }

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const transactionMonth = form.date.slice(0, 7);
  const availableEnvelopes = form.type === 'expense'
    ? getEnvelopesByMonth(envelopes, transactionMonth)
    : [];

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Transactions</h1>
          <p>{filtered.length} record{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} /> Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="toggle-group" style={{ flexShrink: 0 }}>
            {(['all', 'income', 'expense'] as const).map(f => (
              <button
                key={f}
                className={`toggle-btn${filter === f ? ' active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <input
            className="form-input"
            style={{ maxWidth: 260 }}
            placeholder="Search descriptions…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <p>No transactions found.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id}>
                    <td className="text-muted" style={{ whiteSpace: 'nowrap' }}>{formatDate(t.date)}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{t.description}</div>
                      {t.notes && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.notes}</div>}
                    </td>
                    <td>
                      <span className="badge badge-neutral">{t.category}</span>
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <span className={`fw-bold ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <button className="btn btn-ghost btn-sm btn-icon" onClick={() => openEdit(t)} title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(t.id)} title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">{editTarget ? 'Edit Transaction' : 'Add Transaction'}</div>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="toggle-group" style={{ marginBottom: 16 }}>
                {(['expense', 'income'] as const).map(tp => (
                  <button
                    key={tp}
                    type="button"
                    className={`toggle-btn${form.type === tp ? ' active' : ''}`}
                    onClick={() => setForm(f => ({
                      ...f,
                      type: tp,
                      category: tp === 'income' ? 'Salary' : 'Food & Dining',
                      envelopeId: tp === 'income' ? '' : f.envelopeId,
                    }))}
                  >
                    {tp.charAt(0).toUpperCase() + tp.slice(1)}
                  </button>
                ))}
              </div>

              <div className="form-row">
                <div className="form-group">
                <label className="form-label">Date</label>
                  <input className="form-input" type="date" required value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value, envelopeId: '' }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Amount ($)</label>
                  <input className="form-input" type="number" min="0.01" step="0.01" required value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <input className="form-input" required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="e.g. Grocery store" />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              {availableEnvelopes.length > 0 && (
                <div className="form-group">
                  <label className="form-label">Envelope (optional)</label>
                  <select className="form-select" value={form.envelopeId} onChange={e => setForm(f => ({ ...f, envelopeId: e.target.value }))}>
                    <option value="">None</option>
                    {availableEnvelopes.map(envelope => <option key={envelope.id} value={envelope.id}>{envelope.name}</option>)}
                  </select>
                </div>
              )}

              {accounts.length > 0 && (
                <div className="form-group">
                  <label className="form-label">Account (optional)</label>
                  <select className="form-select" value={form.accountId} onChange={e => setForm(f => ({ ...f, accountId: e.target.value }))}>
                    <option value="">None</option>
                    {accounts.map(account => <option key={account.id} value={account.id}>{account.name}</option>)}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Notes (optional)</label>
                <input className="form-input" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any extra detail…" />
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editTarget ? 'Save Changes' : 'Add Transaction'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
