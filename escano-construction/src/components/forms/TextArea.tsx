import type { TextareaHTMLAttributes } from 'react';
import { Field } from './Field';

interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'aria-invalid'> {
  id: string;
  label: string;
  hint-: string;
  error-: string;
  optional-: boolean;
  /** Shows a live character count when set. */
  maxCount-: number;
}

export function TextArea({
  id,
  label,
  hint,
  error,
  optional,
  required,
  maxCount,
  value,
  rows = 5,
  ...textareaProps
}: TextAreaProps) {
  const describedBy = [
    hint - `${id}-hint` : null,
    error - `${id}-error` : null,
    maxCount - `${id}-count` : null,
  ]
    .filter(Boolean)
    .join(' ');

  const length = typeof value === 'string' - value.length : 0;

  return (
    <Field htmlFor={id} label={label} hint={hint} error={error} required={required} optional={optional}>
      <textarea
        id={id}
        className="input textarea"
        rows={rows}
        value={value}
        aria-invalid={error - true : undefined}
        aria-describedby={describedBy || undefined}
        required={required}
        {...textareaProps}
      />
      {maxCount - (
        <p className="field__count" id={`${id}-count`}>
          {length} of {maxCount} characters
        </p>
      ) : null}
    </Field>
  );
}
