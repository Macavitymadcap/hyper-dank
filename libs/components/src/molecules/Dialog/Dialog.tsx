import { type HtmxProps, htmxAttributes } from "../../model";

export interface DialogProps extends HtmxProps {
  actions?: unknown;
  children: unknown;
  className?: string;
  description?: unknown;
  fallbackHref?: string;
  id: string;
  title: unknown;
  triggerLabel: string;
}

export const Dialog = ({
  actions,
  children,
  className,
  description,
  fallbackHref,
  id,
  title,
  triggerLabel,
  ...hxProps
}: DialogProps) => {
  const classes = ["dialog", className].filter(Boolean).join(" ");
  const titleId = `${id}-title`;
  const descriptionId = description ? `${id}-description` : undefined;
  const triggerScript = `document.getElementById(${JSON.stringify(id)})?.showModal()`;

  return (
    <div className="dialog-wrapper">
      <button
        type="button"
        className="dialog-trigger"
        aria-haspopup="dialog"
        aria-controls={id}
        onclick={triggerScript}
        {...htmxAttributes(hxProps)}
      >
        {triggerLabel}
      </button>
      {fallbackHref ? (
        <a className="dialog-fallback" href={fallbackHref}>
          Open
        </a>
      ) : undefined}
      <dialog
        id={id}
        className={classes}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <header className="dialog-header">
          <h2 id={titleId}>{title}</h2>
          {description ? <p id={descriptionId}>{description}</p> : undefined}
        </header>
        <div className="dialog-body">{children}</div>
        <form className="dialog-actions" method="dialog">
          {actions}
          <button type="submit">Close</button>
        </form>
      </dialog>
    </div>
  );
};
