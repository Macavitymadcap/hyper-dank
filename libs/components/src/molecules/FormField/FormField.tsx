export interface FormFieldProps {
  autocomplete?: string;
  children?: unknown;
  className?: string;
  error?: string;
  helpText?: string;
  htmlFor?: string;
  id?: string;
  inputMode?: "decimal" | "email" | "none" | "numeric" | "search" | "tel" | "text" | "url";
  label: string;
  max?: number | string;
  min?: number | string;
  name?: string;
  pattern?: string;
  placeholder?: string;
  required?: boolean;
  step?: number | string;
  type?: "email" | "number" | "password" | "search" | "tel" | "text" | "url";
  value?: number | string;
}

export const FormField = ({
  autocomplete,
  children,
  className,
  error,
  helpText,
  htmlFor,
  id,
  inputMode,
  label,
  max,
  min,
  name,
  pattern,
  placeholder,
  required = false,
  step,
  type = "text",
  value,
}: FormFieldProps) => {
  const inputId = htmlFor ?? id ?? name;
  const classes = ["form-field", className].filter(Boolean).join(" ");
  const helpId = helpText && inputId ? `${inputId}-help` : undefined;
  const errorId = error && inputId ? `${inputId}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <label className={classes} htmlFor={inputId}>
      <span>{label}</span>
      {helpText ? <small id={helpId}>{helpText}</small> : undefined}
      {children ?? (
        <input
          id={inputId}
          name={name ?? inputId}
          type={type}
          aria-describedby={describedBy}
          aria-invalid={error ? "true" : undefined}
          autocomplete={autocomplete}
          inputmode={inputMode}
          min={min}
          max={max}
          pattern={pattern}
          placeholder={placeholder}
          required={required}
          step={step}
          value={value}
        />
      )}
      {error ? (
        <small id={errorId} role="alert">
          {error}
        </small>
      ) : undefined}
    </label>
  );
};
