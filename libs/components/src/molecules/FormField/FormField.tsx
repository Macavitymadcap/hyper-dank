export interface FormFieldProps {
  autocomplete?: string;
  children?: unknown;
  className?: string;
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

  return (
    <label className={classes} htmlFor={inputId}>
      <span>{label}</span>
      {children ?? (
        <input
          id={inputId}
          name={name ?? inputId}
          type={type}
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
    </label>
  );
};
