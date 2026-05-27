import { fieldDescriptionIds } from "../field-ids";

export type RangeFieldDensity = "default" | "compact";

export interface RangeFieldProps {
  className?: string;
  density?: RangeFieldDensity;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  id: string;
  label: string;
  max?: number | string;
  min?: number | string;
  name?: string;
  required?: boolean;
  step?: number | string;
  value?: number | string;
  valueLabel?: string;
}

export const RangeField = ({
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
  step,
  value,
  valueLabel,
}: RangeFieldProps) => {
  const classes = ["form-field", "range-field", className].filter(Boolean).join(" ");
  const { describedBy, errorId, helpId } = fieldDescriptionIds(id, helpText, error);

  return (
    <label className={classes} data-density={density} htmlFor={id}>
      <span>{label}</span>
      {helpText ? <small id={helpId}>{helpText}</small> : undefined}
      <input
        id={id}
        name={name ?? id}
        type="range"
        aria-describedby={describedBy}
        aria-invalid={error ? "true" : undefined}
        disabled={disabled}
        min={min}
        max={max}
        required={required}
        step={step}
        value={value}
      />
      {valueLabel ? <span className="range-field-value">{valueLabel}</span> : undefined}
      {error ? (
        <small id={errorId} role="alert">
          {error}
        </small>
      ) : undefined}
    </label>
  );
};
