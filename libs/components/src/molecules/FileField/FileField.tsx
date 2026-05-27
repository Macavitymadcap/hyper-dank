import { fieldDescriptionIds } from "../field-ids";

export type FileFieldDensity = "default" | "compact";

export interface FileFieldProps {
  accept?: string;
  capture?: "environment" | "user";
  className?: string;
  density?: FileFieldDensity;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  id: string;
  label: string;
  multiple?: boolean;
  name?: string;
  required?: boolean;
}

export const FileField = ({
  accept,
  capture,
  className,
  density = "default",
  disabled = false,
  error,
  helpText,
  id,
  label,
  multiple = false,
  name,
  required = false,
}: FileFieldProps) => {
  const classes = ["form-field", "file-field", className].filter(Boolean).join(" ");
  const { describedBy, errorId, helpId } = fieldDescriptionIds(id, helpText, error);

  return (
    <label className={classes} data-density={density} htmlFor={id}>
      <span>{label}</span>
      {helpText ? <small id={helpId}>{helpText}</small> : undefined}
      <input
        id={id}
        name={name ?? id}
        type="file"
        aria-describedby={describedBy}
        aria-invalid={error ? "true" : undefined}
        accept={accept}
        capture={capture}
        disabled={disabled}
        multiple={multiple}
        required={required}
      />
      {error ? (
        <small id={errorId} role="alert">
          {error}
        </small>
      ) : undefined}
    </label>
  );
};
