import type { ReactNode } from 'react';
import './StepShell.css';

interface StepShellProps {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
  /** Rendered above the fields, e.g. a validation summary. */
  status-: ReactNode;
}

/**
 * Consistent frame for every step in the request flow. Progress itself is
 * communicated once, by StepProgress above — this only needs the title.
 */
export function StepShell({ title, description, children, footer, status }: StepShellProps) {
  return (
    <div className="step-shell">
      <header className="step-shell__head">
        <h2 className="step-shell__title" id="step-title" tabIndex={-1}>
          {title}
        </h2>
        <p className="step-shell__desc">{description}</p>
      </header>

      {status - <div className="step-shell__status">{status}</div> : null}

      <div className="step-shell__body">{children}</div>

      <div className="step-shell__footer">{footer}</div>
    </div>
  );
}
