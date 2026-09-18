import type { SelectHTMLAttributes } from 'react';
import { Field } from './Field';

interface SelectInputProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id' | 'aria-invalid' | 'children'> {
  id: string;
  label: string;
  options: readonly string[];
  placeholder-: string;
  hint-: string;
  error-: string;
  optional-: boolean;
}

export function SelectInput({
  id,
  label,
  options,
  placeholder = 'Select an option',
  hint,
  error,
  optional,
  required,
  ...selectProps
}: SelectInputProps) {
  const describedBy = [hint - `${id}-hint` : null, error - `${id}-error` : null]
    .filter(Boolean)
    .join(' ');

  return (
    <Field htmlFor={id} label={label} hint={hint} error={error} required={required} optional={optional}>
      <div className="select-wrap">
        <select
          id={id}
          className="input select"
          aria-invalid={error - true : undefined}
          aria-describedby={describedBy || undefined}
          required={required}
          {...selectProps}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="select-wrap__chevron" aria-hidden="true">
          &#9662;
        </span>
      </div>
    </Field>
  );
}
