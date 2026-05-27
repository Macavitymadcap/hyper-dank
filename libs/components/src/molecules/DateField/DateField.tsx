import { fieldDescriptionIds } from "../field-ids";

export type DateFieldDensity = "default" | "compact";

export interface DateFieldProps {
  className?: string;
  density?: DateFieldDensity;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  id: string;
  label: string;
  max?: string;
  min?: string;
  name?: string;
  required?: boolean;
  value?: string;
}

export const DateField = ({
  className,
  density = "default",
  disabled = false,
  error,
  helpText,
  id,
  label,
  max,
  min,
  name,
  required = false,
  value,
}: DateFieldProps) => {
  const classes = ["form-field", "date-field", className].filter(Boolean).join(" ");
  const { describedBy, errorId, helpId } = fieldDescriptionIds(id, helpText, error);

  return (
    <label className={classes} data-density={density} htmlFor={id}>
      <span>{label}</span>
      {helpText ? <small id={helpId}>{helpText}</small> : undefined}
      <input
        id={id}
        name={name ?? id}
        type="date"
        aria-describedby={describedBy}
        aria-invalid={error ? "true" : undefined}
        disabled={disabled}
        min={min}
        max={max}
        required={required}
        value={value}
      />
      {error ? (
        <small id={errorId} role="alert">
          {error}
        </small>
      ) : undefined}
    </label>
  );
};
