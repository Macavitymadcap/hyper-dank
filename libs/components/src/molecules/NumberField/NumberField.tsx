import { fieldDescriptionIds } from "../field-ids";

export type NumberFieldDensity = "default" | "compact";

export interface NumberFieldProps {
  autocomplete?: string;
  className?: string;
  density?: NumberFieldDensity;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  id: string;
  inputMode?: "decimal" | "numeric";
  label: string;
  max?: number | string;
  min?: number | string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  step?: number | string;
  value?: number | string;
}

export const NumberField = ({
  autocomplete,
  className,
  density = "default",
  disabled = false,
  error,
  helpText,
  id,
  inputMode = "decimal",
  label,
  max,
  min,
  name,
  placeholder,
  required = false,
  step,
  value,
}: NumberFieldProps) => {
  const classes = ["form-field", "number-field", className].filter(Boolean).join(" ");
  const { describedBy, errorId, helpId } = fieldDescriptionIds(id, helpText, error);

  return (
    <label className={classes} data-density={density} htmlFor={id}>
      <span>{label}</span>
      {helpText ? <small id={helpId}>{helpText}</small> : undefined}
      <input
        id={id}
        name={name ?? id}
        type="number"
        aria-describedby={describedBy}
        aria-invalid={error ? "true" : undefined}
        autocomplete={autocomplete}
        disabled={disabled}
        inputmode={inputMode}
        min={min}
        max={max}
        placeholder={placeholder}
        required={required}
        step={step}
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
