import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, Legend,
  LineChart, Line,
} from 'recharts';

// â”€â”€ Shared tooltip style â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const tooltipStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #E5E7EB',
  borderRadius: 8,
  fontSize: 12,
  color: '#111827',
  boxShadow: '0 8px 24px rgba(18, 38, 58, .10)',
};

const gridColor = '#E5E7EB';
const axisColor = '#64748b';
const legendColor = '#64748b';
const colors = {
  primary: '#0A2A66',
  gold: '#D4A62A',
  info: '#2563EB',
  success: '#16A34A',
  danger: '#DC2626',
  muted: '#E5E7EB',
};

// â”€â”€ Net Worth Area Chart â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface NWPoint { month: string; netWorth: number; assets: number; liabilities: number; }
export function NetWorthChart({ data }: { data: NWPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
        <defs>
          <linearGradient id="nwGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={colors.primary} stopOpacity={0.18} />
            <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="assGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={colors.success} stopOpacity={0.14} />
            <stop offset="95%" stopColor={colors.success} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="liabGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={colors.danger} stopOpacity={0.14} />
            <stop offset="95%" stopColor={colors.danger} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`$${Number(v).toLocaleString()}`, undefined]} />
        <Area type="monotone" dataKey="assets" stroke={colors.success} strokeWidth={1.5} fill="url(#assGrad)" name="Assets" />
        <Area type="monotone" dataKey="liabilities" stroke={colors.danger} strokeWidth={1.5} fill="url(#liabGrad)" name="Liabilities" />
        <Area type="monotone" dataKey="netWorth" stroke={colors.primary} strokeWidth={2} fill="url(#nwGrad)" name="Net Worth" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// â”€â”€ Spending Bar Chart â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface SpendPoint { category: string; amount: number; budget?: number; color: string; }
export function SpendingBarChart({ data }: { data: SpendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis dataKey="category" tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`$${Number(v).toFixed(2)}`, undefined]} />
        <Bar dataKey="amount" radius={[4, 4, 0, 0]} name="Spent">
          {data.map((d, i) => <Cell key={i} fill={d.color} fillOpacity={0.85} />)}
        </Bar>
        {data[0]?.budget !== undefined && (
          <Bar dataKey="budget" radius={[4, 4, 0, 0]} fill={colors.muted} name="Budget" />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}

// â”€â”€ Donut / Pie Chart â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface PiePoint { name: string; value: number; color: string; }
export function DonutChart({ data }: { data: PiePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%" cy="50%"
          innerRadius="55%" outerRadius="80%"
          dataKey="value"
          paddingAngle={2}
        >
          {data.map((d, i) => <Cell key={i} fill={d.color} />)}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`$${Number(v).toLocaleString()}`, undefined]} />
        <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ color: legendColor, fontSize: 11 }}>{v}</span>} />
      </PieChart>
    </ResponsiveContainer>
  );
}

// â”€â”€ Account Balance Bar Chart â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface AccountPoint { name: string; balance: number; color: string; }
export function AccountBarChart({ data }: { data: AccountPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 60, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
        <XAxis type="number" tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
        <YAxis type="category" dataKey="name" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} width={56} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`$${Number(v).toLocaleString()}`, undefined]} />
        <Bar dataKey="balance" radius={[0, 4, 4, 0]} name="Balance">
          {data.map((d, i) => <Cell key={i} fill={d.color} fillOpacity={0.85} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// â”€â”€ Debt Payoff Progress Bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface DebtProgressPoint { name: string; paid: number; remaining: number; color: string; }
export function DebtProgressChart({ data }: { data: DebtProgressPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 80, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
        <XAxis type="number" tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
        <YAxis type="category" dataKey="name" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} width={76} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`$${Number(v).toLocaleString()}`, undefined]} />
        <Bar dataKey="paid" stackId="a" radius={[0, 0, 0, 0]} name="Paid" fill={colors.success} fillOpacity={0.78} />
        <Bar dataKey="remaining" stackId="a" radius={[0, 4, 4, 0]} name="Remaining">
          {data.map((d, i) => <Cell key={i} fill={d.color} fillOpacity={0.6} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

interface MortgageTrendPoint {
  date: string;
  backEndDti: number;
  dtiUsagePercent: number;
  readinessScore: number;
}

export function MortgageTrendChart({ data }: { data: MortgageTrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="date" tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v, name) => {
          const label = name === 'readinessScore' ? 'Readiness Score' : name === 'dtiUsagePercent' ? 'DTI Usage' : 'Back-End DTI';
          return [name === 'readinessScore' ? Number(v).toFixed(0) : `${Number(v).toFixed(1)}%`, label];
        }} />
        <Legend iconType="circle" iconSize={8} formatter={(v) => {
          const label = v === 'readinessScore' ? 'Readiness Score' : v === 'dtiUsagePercent' ? 'DTI Usage' : 'Back-End DTI';
          return <span style={{ color: legendColor, fontSize: 11 }}>{label}</span>;
        }} />
        <Line type="monotone" dataKey="backEndDti" stroke={colors.primary} strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="dtiUsagePercent" stroke={colors.gold} strokeWidth={2} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="readinessScore" stroke={colors.info} strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

