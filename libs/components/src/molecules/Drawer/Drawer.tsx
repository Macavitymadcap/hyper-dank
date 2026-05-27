import { type HtmxProps, htmxAttributes } from "../../model";

export type DrawerPlacement = "end" | "start";

export interface DrawerProps extends HtmxProps {
  actions?: unknown;
  children: unknown;
  className?: string;
  closeLabel?: string;
  description?: unknown;
  fallbackHref?: string;
  id: string;
  placement?: DrawerPlacement;
  title: unknown;
  trigger?: unknown;
  triggerLabel: string;
}

export const Drawer = ({
  actions,
  children,
  className,
  closeLabel = "Close",
  description,
  fallbackHref,
  id,
  placement = "end",
  title,
  trigger,
  triggerLabel,
  ...hxProps
}: DrawerProps) => {
  const classes = ["drawer", className].filter(Boolean).join(" ");
  const titleId = `${id}-title`;
  const descriptionId = description ? `${id}-description` : undefined;
  const triggerScript = `document.getElementById(${JSON.stringify(id)})?.showModal()`;

  return (
    <div className="drawer-wrapper">
      <button
        type="button"
        className="drawer-trigger"
        aria-haspopup="dialog"
        aria-controls={id}
        onclick={triggerScript}
        {...htmxAttributes(hxProps)}
      >
        {trigger ?? triggerLabel}
      </button>
      {fallbackHref ? (
        <a className="drawer-fallback" href={fallbackHref}>
          Open panel
        </a>
      ) : undefined}
      <dialog
        id={id}
        className={classes}
        data-placement={placement}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <header className="drawer-header">
          <div>
            <h2 id={titleId}>{title}</h2>
            {description ? <p id={descriptionId}>{description}</p> : undefined}
          </div>
          <form method="dialog">
            <button type="submit" aria-label={closeLabel}>
              {closeLabel}
            </button>
          </form>
        </header>
        <div className="drawer-body">{children}</div>
        {actions ? <footer className="drawer-actions">{actions}</footer> : undefined}
      </dialog>
    </div>
  );
};
