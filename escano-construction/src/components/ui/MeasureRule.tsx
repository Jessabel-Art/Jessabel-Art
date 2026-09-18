import './MeasureRule.css';

/**
 * Thin ruled divider with tick marks — a restrained reference to
 * measurement and setting-out. Decorative only.
 */
export function MeasureRule({ tone = 'default' }: { tone?: 'default' | 'inverse' }) {
  return <div className={`measure-rule measure-rule--${tone}`} aria-hidden="true" />;
}
