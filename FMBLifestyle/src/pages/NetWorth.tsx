import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, RefreshCw } from 'lucide-react';
import type { Account, Debt, NetWorthAsset, NetWorthLiability, AssetType, LiabilityType, Transaction } from '../types';
import { formatCurrency, generateId, currentMonthKey } from '../utils/format';
import { NetWorthChart } from '../components/ui/Charts';
import RiskBadge from '../components/ui/RiskBadge';
import { calculateNetWorthSummary, calculateNetWorthTrend, getNetWorthRisk, getPreviousNetWorth } from '../domain/netWorth/selectors';
import { parseMoneyInput } from '../domain/money';
import { repositories } from '../persistence';

const ASSET_TYPES: { value: AssetType; label: string }[] = [
  { value: 'cash',        label: 'Cash' },
  { value: 'checking',    label: 'Checking Account' },
  { value: 'savings',     label: 'Savings Account' },
  { value: 'investment',  label: 'Investment Account' },
  { value: '401k',        label: '401k / Retirement' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'vehicle',     label: 'Vehicle' },
  { value: 'business',    label: 'Business Asset' },
  { value: 'other_asset', label: 'Other Asset' },
];

const LIABILITY_TYPES: { value: LiabilityType; label: string }[] = [
  { value: 'credit_card',   label: 'Credit Card' },
  { value: 'loan',          label: 'Student / Personal Loan' },
  { value: 'auto_loan',     label: 'Auto Loan' },
  { value: 'mortgage',      label: 'Mortgage' },
  { value: 'personal_loan', label: 'Personal Loan' },
  { value: 'collections',   label: 'Collections' },
  { value: 'other_debt',    label: 'Other Debt' },
];

type ModalMode = 'asset' | 'liability';

export default function NetWorthTracker() {
  const [assets, setAssets] = useState<NetWorthAsset[]>([]);
  const [liabilities, setLiabilities] = useState<NetWorthLiability[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [snapshots, setSnapshots] = useState<{ month: string; netWorth: number; totalAssets: number; totalLiabilities: number }[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('asset');
  const [editAsset, setEditAsset] = useState<NetWorthAsset | null>(null);
  const [editLiab, setEditLiab] = useState<NetWorthLiability | null>(null);
  const [assetForm, setAssetForm] = useState({ name: '', type: 'checking' as AssetType, value: '', notes: '' });
  const [liabForm, setLiabForm] = useState({ name: '', type: 'credit_card' as LiabilityType, balance: '', notes: '' });

  async function reload() {
    const [
      nextAssets,
      nextLiabilities,
      nextAccounts,
      nextTransactions,
      nextDebts,
      nextSnapshots,
    ] = await Promise.all([
      repositories.netWorth.listAssets(),
      repositories.netWorth.listLiabilities(),
      repositories.accounts.list(),
      repositories.transactions.list(),
      repositories.debts.list(),
      repositories.netWorth.listSnapshots(),
    ]);

    setAssets(nextAssets);
    setLiabilities(nextLiabilities);
    setAccounts(nextAccounts);
    setTransactions(nextTransactions);
    setDebts(nextDebts);
    setSnapshots(nextSnapshots);
  }
  useEffect(() => { void reload(); }, []);

  const { totalAssets, totalLiabilities, netWorth } = calculateNetWorthSummary({
    accounts,
    transactions,
    assets,
    liabilities,
    debts,
  });

  const chartData = calculateNetWorthTrend(snapshots);

  const prevNetWorth = getPreviousNetWorth(snapshots, netWorth);
  const change = netWorth - prevNetWorth;
  const risk = getNetWorthRisk(netWorth, prevNetWorth);

  function openAddAsset() {
    setEditAsset(null);
    setAssetForm({ name: '', type: 'checking', value: '', notes: '' });
    setModalMode('asset');
    setShowModal(true);
  }
  function openEditAsset(a: NetWorthAsset) {
    setEditAsset(a);
    setAssetForm({ name: a.name, type: a.type, value: String(a.value), notes: a.notes ?? '' });
    setModalMode('asset');
    setShowModal(true);
  }
  function openAddLiab() {
    setEditLiab(null);
    setLiabForm({ name: '', type: 'credit_card', balance: '', notes: '' });
    setModalMode('liability');
    setShowModal(true);
  }
  function openEditLiab(l: NetWorthLiability) {
    setEditLiab(l);
    setLiabForm({ name: l.name, type: l.type, balance: String(l.balance), notes: l.notes ?? '' });
    setModalMode('liability');
    setShowModal(true);
  }

  async function handleAssetSubmit(e: React.FormEvent) {
    e.preventDefault();
    const item: NetWorthAsset = {
      id: editAsset?.id ?? generateId(),
      name: assetForm.name.trim(),
      type: assetForm.type,
      value: parseMoneyInput(assetForm.value),
      notes: assetForm.notes.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };
    await repositories.netWorth.upsertAsset(item);
    setShowModal(false);
    await reload();
  }

  async function handleLiabSubmit(e: React.FormEvent) {
    e.preventDefault();
    const item: NetWorthLiability = {
      id: editLiab?.id ?? generateId(),
      name: liabForm.name.trim(),
      type: liabForm.type,
      balance: parseMoneyInput(liabForm.balance),
      notes: liabForm.notes.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };
    await repositories.netWorth.upsertLiability(item);
    setShowModal(false);
    await reload();
  }

  async function snapshotNow() {
    const month = currentMonthKey();
    await repositories.netWorth.saveSnapshot({
      id: generateId(),
      month,
      totalAssets,
      totalLiabilities,
      netWorth,
      createdAt: new Date().toISOString(),
    });
    await reload();
  }

  const assetsByType: Record<string, NetWorthAsset[]> = {};
  assets.forEach(a => {
    (assetsByType[a.type] = assetsByType[a.type] ?? []).push(a);
  });

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Net Worth Tracker</h1>
          <p>Total assets minus total liabilities</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={snapshotNow} title="Save monthly snapshot">
            <RefreshCw size={14} /> Snapshot
          </button>
          <button className="btn btn-ghost" onClick={openAddLiab}>
            <Plus size={14} /> Liability
          </button>
          <button className="btn btn-primary" onClick={openAddAsset}>
            <Plus size={14} /> Asset
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="card" style={{ marginBottom: 20, background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-muted)', marginBottom: 8 }}>Net Worth</div>
            <div className={`nw-hero ${netWorth >= 0 ? 'text-success glow-green' : 'text-danger glow-red'}`}>{formatCurrency(netWorth)}</div>
            <div style={{ display: 'flex', gap: 12, marginTop: 10, alignItems: 'center' }}>
              <RiskBadge level={risk} label={risk === 'green' ? 'Healthy' : risk === 'yellow' ? 'Declining' : 'At Risk'} />
              <span style={{ fontSize: 13, color: change >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                {change >= 0 ? '+' : ''}{formatCurrency(change)} vs last month
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 32 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-muted)', marginBottom: 4 }}>Total Assets</div>
              <div style={{ fontSize: 22, fontWeight: 800 }} className="text-success tabular">{formatCurrency(totalAssets)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-muted)', marginBottom: 4 }}>Total Liabilities</div>
              <div style={{ fontSize: 22, fontWeight: 800 }} className="text-danger tabular">{formatCurrency(totalLiabilities)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 1 && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-title">Net Worth Over Time</div>
          <div className="chart-container-lg">
            <NetWorthChart data={chartData} />
          </div>
        </div>
      )}

      <div className="section-grid">
        {/* Assets */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div className="card-title" style={{ margin: 0 }}>Assets</div>
            <button className="btn btn-ghost btn-sm" onClick={openAddAsset}><Plus size={13} /> Add</button>
          </div>
          {assets.length === 0 ? (
            <div className="empty-state"><p>No assets yet</p></div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Name</th><th>Type</th><th style={{ textAlign: 'right' }}>Value</th><th /></tr></thead>
                <tbody>
                  {assets.map(a => (
                    <tr key={a.id}>
                      <td style={{ fontWeight: 500 }}>{a.name}{a.notes && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.notes}</div>}</td>
                      <td><span className="badge badge-info">{ASSET_TYPES.find(t => t.value === a.type)?.label ?? a.type}</span></td>
                      <td style={{ textAlign: 'right' }} className="text-success fw-bold tabular">{formatCurrency(a.value)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                          <button className="btn btn-ghost btn-sm btn-icon" onClick={() => openEditAsset(a)}><Pencil size={13} /></button>
                          <button className="btn btn-danger btn-sm btn-icon" onClick={async () => { await repositories.netWorth.deleteAsset(a.id); await reload(); }}><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Liabilities */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div className="card-title" style={{ margin: 0 }}>Liabilities</div>
            <button className="btn btn-ghost btn-sm" onClick={openAddLiab}><Plus size={13} /> Add</button>
          </div>
          {liabilities.length === 0 ? (
            <div className="empty-state"><p>No liabilities yet</p></div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Name</th><th>Type</th><th style={{ textAlign: 'right' }}>Balance</th><th /></tr></thead>
                <tbody>
                  {liabilities.map(l => (
                    <tr key={l.id}>
                      <td style={{ fontWeight: 500 }}>{l.name}{l.notes && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l.notes}</div>}</td>
                      <td><span className="badge badge-warning">{LIABILITY_TYPES.find(t => t.value === l.type)?.label ?? l.type}</span></td>
                      <td style={{ textAlign: 'right' }} className="text-danger fw-bold tabular">{formatCurrency(l.balance)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                          <button className="btn btn-ghost btn-sm btn-icon" onClick={() => openEditLiab(l)}><Pencil size={13} /></button>
                          <button className="btn btn-danger btn-sm btn-icon" onClick={async () => { await repositories.netWorth.deleteLiability(l.id); await reload(); }}><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">{modalMode === 'asset' ? (editAsset ? 'Edit Asset' : 'Add Asset') : (editLiab ? 'Edit Liability' : 'Add Liability')}</div>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>

            {modalMode === 'asset' ? (
              <form onSubmit={handleAssetSubmit}>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input className="form-input" required value={assetForm.name} onChange={e => setAssetForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Chase Savings" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <select className="form-select" value={assetForm.type} onChange={e => setAssetForm(f => ({ ...f, type: e.target.value as AssetType }))}>
                      {ASSET_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Value ($)</label>
                    <input className="form-input" type="number" min="0" step="0.01" required value={assetForm.value} onChange={e => setAssetForm(f => ({ ...f, value: e.target.value }))} placeholder="0.00" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Notes (optional)</label>
                  <input className="form-input" value={assetForm.notes} onChange={e => setAssetForm(f => ({ ...f, notes: e.target.value }))} />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Asset</button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleLiabSubmit}>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input className="form-input" required value={liabForm.name} onChange={e => setLiabForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Visa Credit Card" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <select className="form-select" value={liabForm.type} onChange={e => setLiabForm(f => ({ ...f, type: e.target.value as LiabilityType }))}>
                      {LIABILITY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Balance ($)</label>
                    <input className="form-input" type="number" min="0" step="0.01" required value={liabForm.balance} onChange={e => setLiabForm(f => ({ ...f, balance: e.target.value }))} placeholder="0.00" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Notes (optional)</label>
                  <input className="form-input" value={liabForm.notes} onChange={e => setLiabForm(f => ({ ...f, notes: e.target.value }))} />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Liability</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
