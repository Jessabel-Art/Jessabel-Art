import { steps, TOTAL_STEPS } from '../config/steps';
import './StepProgress.css';

interface StepProgressProps {
  stepIndex: number;
  onSelect: (index: number) => void;
  /** Highest step reached so far — earlier steps stay directly selectable. */
  maxReached: number;
}

/**
 * Progress indicator.
 * Mobile shows a compact "Step n of 9" with a bar; wider viewports add the
 * full labelled sequence.
 */
export function StepProgress({ stepIndex, onSelect, maxReached }: StepProgressProps) {
  const current = steps[stepIndex];
  const percent = Math.round(((stepIndex + 1) / TOTAL_STEPS) * 100);

  return (
    <div className="step-progress">
      <div className="step-progress__summary">
        <p className="step-progress__count">
          Step <strong>{stepIndex + 1}</strong> of {TOTAL_STEPS}
        </p>
        <p className="step-progress__current">{current.shortLabel}</p>
      </div>

      <div
        className="step-progress__bar"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={TOTAL_STEPS}
        aria-valuenow={stepIndex + 1}
        aria-label={`Proposal request progress: step ${stepIndex + 1} of ${TOTAL_STEPS}`}
      >
        <span className="step-progress__fill" style={{ width: `${percent}%` }} />
      </div>

      <ol className="step-progress__list">
        {steps.map((step, index) => {
          const isCurrent = index === stepIndex;
          const isReachable = index <= maxReached;
          const isDone = index < stepIndex;

          return (
            <li
              key={step.id}
              className={[
                'step-progress__item',
                isCurrent ? 'is-current' : '',
                isDone ? 'is-done' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <button
                type="button"
                onClick={() => onSelect(index)}
                disabled={!isReachable}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <span className="step-progress__num">{String(index + 1).padStart(2, '0')}</span>
                <span className="step-progress__label">{step.shortLabel}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
