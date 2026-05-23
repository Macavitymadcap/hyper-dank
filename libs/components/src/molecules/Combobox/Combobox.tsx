export interface ComboboxOption {
  disabled?: boolean;
  label: string;
  value: string;
}

export interface ComboboxProps {
  className?: string;
  emptyText?: string;
  error?: string;
  helpText?: string;
  id: string;
  label: string;
  listId?: string;
  name?: string;
  options: ComboboxOption[];
  placeholder?: string;
  required?: boolean;
  value?: string;
}

export const Combobox = ({
  className,
  emptyText = "No options available.",
  error,
  helpText,
  id,
  label,
  listId = `${id}-list`,
  name,
  options,
  placeholder,
  required = false,
  value,
}: ComboboxProps) => {
  const classes = ["form-field", "combobox", className].filter(Boolean).join(" ");
  const helpId = helpText ? `${id}-help` : undefined;
  const emptyId = options.length === 0 ? `${id}-empty` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpId, emptyId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <label className={classes} htmlFor={id}>
      <span>{label}</span>
      {helpText ? <small id={helpId}>{helpText}</small> : undefined}
      <input
        id={id}
        name={name ?? id}
        type="text"
        // biome-ignore lint/a11y/noRedundantRoles: Chromium Storybook role checks do not expose datalist inputs as comboboxes without the explicit role.
        role="combobox"
        list={listId}
        value={value}
        placeholder={placeholder}
        required={required}
        aria-controls={listId}
        aria-describedby={describedBy}
        aria-expanded="false"
        aria-invalid={error ? "true" : undefined}
      />
      <datalist id={listId}>
        {options.map((option) => (
          <option value={option.value} label={option.label} disabled={option.disabled} />
        ))}
      </datalist>
      {options.length === 0 ? (
        <small id={emptyId} role="status">
          {emptyText}
        </small>
      ) : undefined}
      {error ? (
        <small id={errorId} role="alert">
          {error}
        </small>
      ) : undefined}
    </label>
  );
};
