import { type HtmxProps, htmxAttributes } from "../../model";

export interface CopyFieldProps extends HtmxProps {
  actions?: unknown;
  buttonLabel?: unknown;
  className?: string;
  helpText?: unknown;
  id: string;
  label: unknown;
  status?: unknown;
  value: string;
}

export const CopyField = ({
  actions,
  buttonLabel = "Copy",
  className,
  helpText,
  id,
  label,
  status,
  value,
  ...hxProps
}: CopyFieldProps) => {
  const classes = ["copy-field", className].filter(Boolean).join(" ");
  const helpId = helpText ? `${id}-help` : undefined;
  const statusId = `${id}-status`;

  return (
    <section className={classes} aria-labelledby={`${id}-label`} {...htmxAttributes(hxProps)}>
      <div className="copy-field-header">
        <label id={`${id}-label`} htmlFor={id}>
          {label}
        </label>
        {helpText ? (
          <p className="copy-field-help" id={helpId}>
            {helpText}
          </p>
        ) : undefined}
      </div>
      <div className="copy-field-control">
        <input
          aria-describedby={[helpId, statusId].filter(Boolean).join(" ") || undefined}
          id={id}
          readOnly
          type="text"
          value={value}
        />
        {actions ?? (
          <button className="button" data-copy-target={id} type="button">
            {buttonLabel}
          </button>
        )}
      </div>
      <p className="copy-field-status" id={statusId} role="status" aria-live="polite">
        {status ?? "Ready to copy"}
      </p>
    </section>
  );
};
