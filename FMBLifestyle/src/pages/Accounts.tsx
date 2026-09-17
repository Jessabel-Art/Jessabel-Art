import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import type { Account, AccountType, Transaction } from '../types';
import { formatCurrency, generateId } from '../utils/format';
import { AccountBarChart } from '../components/ui/Charts';
import {
  getAccountBalanceByType,
  getAccountCountByType,
  getActiveAccounts,
  getDerivedCurrentBalance,
  getTotalAccountBalance,
} from '../domain/accounts/selectors';
import { parseMoneyInput } from '../domain/money';
import { repositories } from '../persistence';

const ACCOUNT_TYPES: { value: AccountType; label: string; color: string }[] = [
  { value: 'checking',   label: 'Checking',    color: '#2563EB' },
  { value: 'savings',    label: 'Savings',     color: '#16A34A' },
  { value: 'investment', label: 'Investment',  color: '#0A2A66' },
  { value: '401k',       label: '401k',        color: '#7C3AED' },
  { value: 'credit',     label: 'Credit Card', color: '#DC2626' },
  { value: 'cash',       label: 'Cash',        color: '#D4A62A' },
  { value: 'other',      label: 'Other',       color: '#94a3b8' },
];

const DEFAULT_FORM = { name: '', type: 'checking' as AccountType, balance: '', institution: '', notes: '' };

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [form, setForm] = useState(DEFAULT_FORM);

  async function reload() {
    const [nextAccounts, nextTransactions] = await Promise.all([
      repositories.accounts.list(),
      repositories.transactions.list(),
    ]);

    setAccounts(getActiveAccounts(nextAccounts));
    setTransactions(nextTransactions);
  }
  useEffect(() => { void reload(); }, []);

  const totalBalance = getTotalAccountBalance(accounts, transactions);
  const chartData = accounts.map(a => ({
    name: a.name,
    balance: Math.abs(getDerivedCurrentBalance(a, transactions)),
    color: ACCOUNT_TYPES.find(t => t.value === a.type)?.color ?? '#94a3b8',
  }));

  function openAdd() {
    setEditing(null);
    setForm(DEFAULT_FORM);
    setShowModal(true);
  }
  function openEdit(a: Account) {
    setEditing(a);
    setForm({ name: a.name, type: a.type, balance: String(a.balance), institution: a.institution ?? '', notes: a.notes ?? '' });
    setShowModal(true);
  }
  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const item: Account = {
      id: editing?.id ?? generateId(),
      name: form.name.trim(),
      type: form.type,
      balance: parseMoneyInput(form.balance),
      openingBalance: parseMoneyInput(form.balance),
      institution: form.institution.trim() || undefined,
      notes: form.notes.trim() || undefined,
      archivedAt: editing?.archivedAt,
    };
    await repositories.accounts.upsert(item);
    setShowModal(false);
    await reload();
  }

  return (
    <>
      <div className="page-header">
        <div><h1>Accounts</h1><p>Manage your financial accounts</p></div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={14} /> New Account</button>
      </div>

      <div className="stat-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-card-label">Total Balance</div>
          <div className={`stat-card-value tabular ${totalBalance >= 0 ? 'text-success' : 'text-danger'}`}>{formatCurrency(totalBalance)}</div>
          <div className="stat-card-sub">{accounts.length} account{accounts.length !== 1 ? 's' : ''}</div>
        </div>
        {ACCOUNT_TYPES.slice(0, 3).map(t => {
          const sum = getAccountBalanceByType(accounts, t.value, transactions);
          const count = getAccountCountByType(accounts, t.value);
          if (count === 0) return null;
          return (
            <div key={t.value} className="stat-card">
              <div className="stat-card-label">{t.label}</div>
              <div className="stat-card-value tabular" style={{ color: t.color }}>{formatCurrency(sum)}</div>
              <div className="stat-card-sub">{count} account{count !== 1 ? 's' : ''}</div>
            </div>
          );
        })}
      </div>

      <div className="section-grid">
        <div className="card">
          <div className="card-title">Account Balances</div>
          {chartData.length > 0 ? (
            <div className="chart-container-lg"><AccountBarChart data={chartData} /></div>
          ) : (
            <div className="empty-state"><p>No accounts yet</p></div>
          )}
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div className="card-title" style={{ margin: 0 }}>All Accounts</div>
          </div>
          {accounts.length === 0 ? (
            <div className="empty-state"><p>No accounts yet</p></div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Name</th><th>Type</th><th style={{ textAlign: 'right' }}>Balance</th><th /></tr></thead>
                <tbody>
                  {accounts.map(a => {
                    const typeInfo = ACCOUNT_TYPES.find(t => t.value === a.type);
                    const currentBalance = getDerivedCurrentBalance(a, transactions);
                    return (
                      <tr key={a.id}>
                        <td>
                          <div style={{ fontWeight: 500 }}>{a.name}</div>
                          {a.institution && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.institution}</div>}
                        </td>
                        <td>
                          <span className="badge badge-neutral" style={{ color: typeInfo?.color }}>
                            {typeInfo?.label ?? a.type}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }} className={`fw-bold tabular ${currentBalance >= 0 ? 'text-success' : 'text-danger'}`}>
                          {formatCurrency(currentBalance)}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                            <button className="btn btn-ghost btn-sm btn-icon" onClick={() => openEdit(a)}><Pencil size={13} /></button>
                            <button className="btn btn-danger btn-sm btn-icon" onClick={async () => { await repositories.accounts.delete(a.id); await reload(); }}><Trash2 size={13} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">{editing ? 'Edit Account' : 'New Account'}</div>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Account Name</label>
                <input className="form-input" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Chase Checking" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select className="form-select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as AccountType }))}>
                    {ACCOUNT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Balance ($)</label>
                  <input className="form-input" type="number" step="0.01" required value={form.balance} onChange={e => setForm(f => ({ ...f, balance: e.target.value }))} placeholder="0.00" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Institution (optional)</label>
                <input className="form-input" value={form.institution} onChange={e => setForm(f => ({ ...f, institution: e.target.value }))} placeholder="e.g. Chase Bank" />
              </div>
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

