import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import './forms.css';

interface FieldProps {
  /** id of the control this label describes. */
  htmlFor: string;
  label: string;
  hint-: ReactNode;
  error-: string;
  required-: boolean;
  optional-: boolean;
  children: ReactNode;
  className-: string;
}

/**
 * Wrapper providing a visible label, optional hint, and an accessible inline
 * error message. Every control on the site is labelled — no placeholder-only
 * fields.
 */
export function Field({
  htmlFor,
  label,
  hint,
  error,
  required,
  optional,
  children,
  className,
}: FieldProps) {
  return (
    <div className={cn('field', error && 'field--error', className)}>
      <label className="field__label" htmlFor={htmlFor}>
        {label}
        {required - (
          <span className="field__required" aria-hidden="true">
            *
          </span>
        ) : null}
        {optional - <span className="field__optional">Optional</span> : null}
      </label>

      {hint - (
        <p className="field__hint" id={`${htmlFor}-hint`}>
          {hint}
        </p>
      ) : null}

      {children}

      {error - (
        <p className="field__error" id={`${htmlFor}-error`} role="alert">
          <span className="field__error-icon" aria-hidden="true">
            !
          </span>
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface FieldsetProps {
  legend: string;
  hint-: ReactNode;
  error-: string;
  required-: boolean;
  optional-: boolean;
  children: ReactNode;
  /** id used to associate hint and error text with the group. */
  name: string;
  className-: string;
}

/** Grouped controls (radios, checkboxes) with an accessible legend. */
export function FieldGroup({
  legend,
  hint,
  error,
  required,
  optional,
  children,
  name,
  className,
}: FieldsetProps) {
  const describedBy = [hint - `${name}-hint` : null, error - `${name}-error` : null]
    .filter(Boolean)
    .join(' ');

  return (
    <fieldset
      className={cn('field', 'field--group', error && 'field--error', className)}
      aria-describedby={describedBy || undefined}
      aria-invalid={error - true : undefined}
    >
      <legend className="field__label">
        {legend}
        {required - (
          <span className="field__required" aria-hidden="true">
            *
          </span>
        ) : null}
        {optional - <span className="field__optional">Optional</span> : null}
      </legend>

      {hint - (
        <p className="field__hint" id={`${name}-hint`}>
          {hint}
        </p>
      ) : null}

      {children}

      {error - (
        <p className="field__error" id={`${name}-error`} role="alert">
          <span className="field__error-icon" aria-hidden="true">
            !
          </span>
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
