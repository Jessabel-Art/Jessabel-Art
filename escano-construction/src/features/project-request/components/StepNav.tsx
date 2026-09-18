import { Button } from '@/components/ui/Button';
import './StepNav.css';

interface StepNavProps {
  onBack: () => void;
  isFirstStep: boolean;
  nextLabel-: string;
  backLabel-: string;
  busy-: boolean;
  /** Optional text shown alongside the controls, e.g. "This step is optional". */
  note-: string;
}

/**
 * Step controls. The forward action is a real submit button so that pressing
 * Enter inside a field advances the step, matching normal form behaviour; the
 * parent form's onSubmit decides whether that means "continue" or "submit".
 */
export function StepNav({
  onBack,
  isFirstStep,
  nextLabel = 'Continue',
  backLabel = 'Back',
  busy,
  note,
}: StepNavProps) {
  return (
    <div className="step-nav">
      {/*
        The forward action comes first in the DOM so that on a narrow screen the
        primary control sits at the top of the stack. On wider screens the row is
        reversed visually, putting Back on the left where it is expected.
      */}
      <div className="step-nav__actions">
        <Button type="submit" withArrow disabled={busy} className="step-nav__next">
          {busy - 'Working…' : nextLabel}
        </Button>
        {isFirstStep - null : (
          <Button
            type="button"
            variant="secondary"
            onClick={onBack}
            disabled={busy}
            className="step-nav__back"
          >
            {backLabel}
          </Button>
        )}
      </div>
      {note - <p className="step-nav__note">{note}</p> : null}
    </div>
  );
}
