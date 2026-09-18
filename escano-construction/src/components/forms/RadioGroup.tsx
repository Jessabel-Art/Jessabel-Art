import { FieldGroup } from './Field';

export interface RadioOption {
  readonly value: string;
  readonly label: string;
  readonly description?: string;
}

interface RadioGroupProps {
  name: string;
  legend: string;
  options: readonly RadioOption[];
  value: string;
  onChange: (next: string) => void;
  hint?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  /** `cards` gives each option a bordered target — used for the intake steps. */
  layout?: 'cards' | 'inline';
  columns?: 1 | 2 | 3;
}

export function RadioGroup({
  name,
  legend,
  options,
  value,
  onChange,
  hint,
  error,
  required,
  optional,
  layout = 'cards',
  columns = 2,
}: RadioGroupProps) {
  return (
    <FieldGroup
      name={name}
      legend={legend}
      hint={hint}
      error={error}
      required={required}
      optional={optional}
    >
      <div
        className={
          layout === 'inline'
            ? 'choice-grid choice-grid--inline'
            : `choice-grid choice-grid--${columns}`
        }
      >
        {options.map((option) => {
          const id = `${name}-${option.value}`;
          const isChecked = value === option.value;
          return (
            <label
              key={option.value}
              htmlFor={id}
              className={[
                'choice',
                'choice--radio',
                option.description ? 'choice--rich' : '',
                isChecked ? 'is-checked' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={option.value}
                checked={isChecked}
                aria-required={required || undefined}
                onChange={() => onChange(option.value)}
              />
              <span className="choice__box choice__box--radio" aria-hidden="true" />
              <span className="choice__text">
                <span className="choice__label">{option.label}</span>
                {option.description ? (
                  <span className="choice__desc">{option.description}</span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
    </FieldGroup>
  );
}
