export interface RadioGroupOption {
  disabled?: boolean;
  helpText?: string;
  label: string;
  value: string;
}

export interface RadioGroupProps {
  className?: string;
  legend: string;
  name: string;
  options: RadioGroupOption[];
  required?: boolean;
  value?: string;
}

export const RadioGroup = ({
  className,
  legend,
  name,
  options,
  required = false,
  value,
}: RadioGroupProps) => {
  const classes = ["radio-group", className].filter(Boolean).join(" ");

  return (
    <fieldset className={classes}>
      <legend>{legend}</legend>
      {options.map((option) => {
        const id = `${name}-${option.value}`;
        const helpId = option.helpText ? `${id}-help` : undefined;

        return (
          <label htmlFor={id}>
            <input
              id={id}
              name={name}
              type="radio"
              aria-describedby={helpId}
              checked={option.value === value}
              disabled={option.disabled}
              required={required}
              value={option.value}
            />
            <span>{option.label}</span>
            {option.helpText ? <small id={helpId}>{option.helpText}</small> : undefined}
          </label>
        );
      })}
    </fieldset>
  );
};
