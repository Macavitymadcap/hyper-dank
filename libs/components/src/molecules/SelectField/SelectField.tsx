export interface SelectFieldOption {
  disabled?: boolean;
  label: string;
  value: string;
}

export interface SelectFieldProps {
  className?: string;
  error?: string;
  helpText?: string;
  id: string;
  label: string;
  name?: string;
  options: SelectFieldOption[];
  required?: boolean;
  value?: string;
}

export const SelectField = ({
  className,
  error,
  helpText,
  id,
  label,
  name,
  options,
  required = false,
  value,
}: SelectFieldProps) => {
  const classes = ["form-field", "select-field", className].filter(Boolean).join(" ");
  const helpId = helpText ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <label className={classes} htmlFor={id}>
      <span>{label}</span>
      {helpText ? <small id={helpId}>{helpText}</small> : undefined}
      <select
        id={id}
        name={name ?? id}
        aria-describedby={describedBy}
        aria-invalid={error ? "true" : undefined}
        required={required}
      >
        {options.map((option) => (
          <option value={option.value} disabled={option.disabled} selected={option.value === value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <small id={errorId} role="alert">
          {error}
        </small>
      ) : undefined}
    </label>
  );
};
