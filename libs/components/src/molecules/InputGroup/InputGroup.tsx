export interface InputGroupProps {
  className?: string;
  error?: string;
  helpText?: string;
  id?: string;
  label: string;
  max?: number;
  min?: number;
  name: string;
  placeholder: string;
  required?: boolean;
  step?: number;
  type: string;
  value?: number | string;
}

export const InputGroup = ({
  className,
  error,
  helpText,
  id,
  type,
  name,
  label,
  min,
  max,
  step,
  placeholder,
  required = true,
  value,
}: InputGroupProps) => {
  const inputId = id ?? name;
  const classes = ["input-group", className].filter(Boolean).join(" ");
  const helpId = helpText ? `${inputId}-help` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={classes}>
      <label className="input-label" htmlFor={inputId}>
        {label}
      </label>
      {helpText ? <small id={helpId}>{helpText}</small> : undefined}
      <input
        type={type}
        id={inputId}
        name={name}
        aria-describedby={describedBy}
        aria-invalid={error ? "true" : undefined}
        step={step}
        min={min}
        max={max}
        required={required}
        placeholder={placeholder}
        value={value}
      />
      {error ? (
        <small id={errorId} role="alert">
          {error}
        </small>
      ) : undefined}
    </div>
  );
};
