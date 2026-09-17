interface ProgressBarProps {
  value: number;  // 0-100
  max?: number;
}

function getStatus(pct: number) {
  if (pct >= 100) return 'danger';
  if (pct >= 80) return 'warning';
  return 'safe';
}

export default function ProgressBar({ value, max = 100 }: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="progress-bar">
      <div
        className={`progress-fill ${getStatus(pct)}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
