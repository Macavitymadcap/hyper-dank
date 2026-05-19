export interface TextareaFieldProps {
  className?: string;
  error?: string;
  helpText?: string;
  id: string;
  label: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  value?: string;
}

export const TextareaField = ({
  className,
  error,
  helpText,
  id,
  label,
  name,
  placeholder,
  required = false,
  rows = 4,
  value,
}: TextareaFieldProps) => {
  const classes = ["form-field", "textarea-field", className].filter(Boolean).join(" ");
  const helpId = helpText ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <label className={classes} htmlFor={id}>
      <span>{label}</span>
      {helpText ? <small id={helpId}>{helpText}</small> : undefined}
      <textarea
        id={id}
        name={name ?? id}
        aria-describedby={describedBy}
        aria-invalid={error ? "true" : undefined}
        placeholder={placeholder}
        required={required}
        rows={rows}
      >
        {value}
      </textarea>
      {error ? (
        <small id={errorId} role="alert">
          {error}
        </small>
      ) : undefined}
    </label>
  );
};
