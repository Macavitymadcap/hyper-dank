import { type HtmxProps, htmxAttributes } from "../../model";

export type AlertDialogTone = "danger" | "default";

export interface AlertDialogProps extends HtmxProps {
  action?: string;
  cancelLabel?: string;
  children: unknown;
  className?: string;
  confirmLabel: string;
  confirmName?: string;
  confirmValue?: string;
  description?: unknown;
  fallbackHref?: string;
  id: string;
  method?: "dialog" | "get" | "post";
  title: unknown;
  tone?: AlertDialogTone;
  triggerLabel: string;
}

export const AlertDialog = ({
  action,
  cancelLabel = "Cancel",
  children,
  className,
  confirmLabel,
  confirmName,
  confirmValue,
  description,
  fallbackHref,
  id,
  method = "post",
  title,
  tone = "danger",
  triggerLabel,
  ...hxProps
}: AlertDialogProps) => {
  const classes = ["alert-dialog", className].filter(Boolean).join(" ");
  const confirmVariant = tone === "danger" ? "danger" : "primary";
  const titleId = `${id}-title`;
  const descriptionId = description ? `${id}-description` : undefined;
  const triggerScript = `document.getElementById(${JSON.stringify(id)})?.showModal()`;

  return (
    <div className="alert-dialog-wrapper">
      <button
        type="button"
        className="button alert-dialog-trigger"
        data-size="default"
        data-variant="outline"
        aria-haspopup="dialog"
        aria-controls={id}
        onclick={triggerScript}
      >
        {triggerLabel}
      </button>
      {fallbackHref ? (
        <a className="alert-dialog-fallback" href={fallbackHref}>
          Review action
        </a>
      ) : undefined}
      <dialog
        id={id}
        className={classes}
        role="alertdialog"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <header className="alert-dialog-header">
          <h2 id={titleId}>{title}</h2>
          {description ? <p id={descriptionId}>{description}</p> : undefined}
        </header>
        <div className="alert-dialog-body">{children}</div>
        <form
          className="alert-dialog-actions"
          action={action}
          method={method}
          {...htmxAttributes(hxProps)}
        >
          <button
            type="submit"
            className="button"
            data-size="compact"
            data-variant="outline"
            formmethod="dialog"
          >
            {cancelLabel}
          </button>
          <button
            type="submit"
            className="button alert-dialog-confirm"
            data-size="compact"
            data-variant={confirmVariant}
            name={confirmName}
            value={confirmValue}
          >
            {confirmLabel}
          </button>
        </form>
      </dialog>
    </div>
  );
};
