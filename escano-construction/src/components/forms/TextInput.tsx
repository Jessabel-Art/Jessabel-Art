import type { InputHTMLAttributes } from 'react';
import { Field } from './Field';

interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'aria-invalid'> {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
}

export function TextInput({
  id,
  label,
  hint,
  error,
  optional,
  required,
  ...inputProps
}: TextInputProps) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(' ');

  return (
    <Field htmlFor={id} label={label} hint={hint} error={error} required={required} optional={optional}>
      <input
        id={id}
        className="input"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        required={required}
        {...inputProps}
      />
    </Field>
  );
}
