import type { RiskLevel } from '../../types';

interface Props {
  level: RiskLevel;
  label?: string;
  pulse?: boolean;
}

const LABELS: Record<RiskLevel, string> = {
  green: 'Healthy',
  yellow: 'Watch',
  red: 'At Risk',
};

export default function RiskBadge({ level, label, pulse: _pulse }: Props) {
  return (
    <span className={`risk-badge ${level}`}>
      <span className={`risk-dot risk-${level}`} />
      {label ?? LABELS[level]}
    </span>
  );
}

export function riskLevel(pct: number, inverse = false): RiskLevel {
  if (inverse) {
    // higher is better (e.g. savings progress)
    if (pct >= 80) return 'green';
    if (pct >= 40) return 'yellow';
    return 'red';
  }
  // higher is worse (e.g. spending vs budget)
  if (pct >= 100) return 'red';
  if (pct >= 80) return 'yellow';
  return 'green';
}

export function netWorthRisk(netWorth: number, prevNetWorth: number): RiskLevel {
  if (netWorth <= 0) return 'red';
  if (netWorth < prevNetWorth) return 'yellow';
  return 'green';
}

export function balanceRisk(balance: number, threshold = 500): RiskLevel {
  if (balance < 0) return 'red';
  if (balance < threshold) return 'yellow';
  return 'green';
}

export function utilizationRisk(balance: number, limit: number): RiskLevel {
  const pct = limit > 0 ? (balance / limit) * 100 : 0;
  if (pct >= 90) return 'red';
  if (pct >= 60) return 'yellow';
  return 'green';
}
