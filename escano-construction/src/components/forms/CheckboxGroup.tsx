import { FieldGroup } from './Field';

interface CheckboxGroupProps {
  name: string;
  legend: string;
  options: readonly string[];
  selected: readonly string[];
  onChange: (next: string[]) => void;
  hint?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  columns?: 1 | 2 | 3;
}

/** Multi-select group rendered as labelled checkboxes with large hit areas. */
export function CheckboxGroup({
  name,
  legend,
  options,
  selected,
  onChange,
  hint,
  error,
  required,
  optional,
  columns = 2,
}: CheckboxGroupProps) {
  const toggle = (option: string) => {
    onChange(
      selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option],
    );
  };

  return (
    <FieldGroup
      name={name}
      legend={legend}
      hint={hint}
      error={error}
      required={required}
      optional={optional}
    >
      <div className={`choice-grid choice-grid--${columns}`}>
        {options.map((option) => {
          const id = `${name}-${option.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
          const isChecked = selected.includes(option);
          return (
            <label
              key={option}
              className={isChecked ? 'choice is-checked' : 'choice'}
              htmlFor={id}
            >
              <input
                id={id}
                type="checkbox"
                name={name}
                value={option}
                checked={isChecked}
                aria-required={required || undefined}
                onChange={() => toggle(option)}
              />
              <span className="choice__box" aria-hidden="true" />
              <span className="choice__label">{option}</span>
            </label>
          );
        })}
      </div>
    </FieldGroup>
  );
}
