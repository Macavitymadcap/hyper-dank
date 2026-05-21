export interface CheckboxFieldProps {
  checked?: boolean;
  className?: string;
  error?: string;
  helpText?: string;
  id: string;
  label: string;
  name?: string;
  required?: boolean;
  value?: string;
}

export const CheckboxField = ({
  checked = false,
  className,
  error,
  helpText,
  id,
  label,
  name,
  required = false,
  value = "on",
}: CheckboxFieldProps) => {
  const classes = ["choice-field", "checkbox-field", className].filter(Boolean).join(" ");
  const helpId = helpText ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={classes}>
      <label htmlFor={id}>
        <input
          id={id}
          name={name ?? id}
          type="checkbox"
          aria-describedby={describedBy}
          aria-invalid={error ? "true" : undefined}
          checked={checked}
          required={required}
          value={value}
        />
        <span>{label}</span>
      </label>
      {helpText ? <small id={helpId}>{helpText}</small> : undefined}
      {error ? (
        <small id={errorId} role="alert">
          {error}
        </small>
      ) : undefined}
    </div>
  );
};
