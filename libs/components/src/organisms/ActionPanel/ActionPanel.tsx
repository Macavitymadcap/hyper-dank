import { type HtmxProps, htmxAttributes } from "../../model";

export interface ActionPanelProps extends HtmxProps {
  children?: unknown;
  className?: string;
  destructiveActions?: unknown;
  id?: string;
  meta?: unknown;
  primaryActions?: unknown;
  secondaryActions?: unknown;
  title: unknown;
}

export const ActionPanel = ({
  children,
  className,
  destructiveActions,
  id,
  meta,
  primaryActions,
  secondaryActions,
  title,
  ...hxProps
}: ActionPanelProps) => {
  const classes = ["action-panel", className].filter(Boolean).join(" ");
  const headingId = id ? `${id}-heading` : undefined;

  return (
    <section id={id} className={classes} aria-labelledby={headingId} {...htmxAttributes(hxProps)}>
      <header className="action-panel-header">
        <div className="action-panel-copy">
          <h2 id={headingId}>{title}</h2>
          {children ? <div className="action-panel-body">{children}</div> : undefined}
        </div>
        {meta ? <div className="action-panel-meta">{meta}</div> : undefined}
      </header>
      {primaryActions || secondaryActions || destructiveActions ? (
        <div className="action-panel-actions">
          {primaryActions ? (
            <div className="action-panel-actions-primary">{primaryActions}</div>
          ) : undefined}
          {secondaryActions ? (
            <div className="action-panel-actions-secondary">{secondaryActions}</div>
          ) : undefined}
          {destructiveActions ? (
            <div className="action-panel-actions-danger">{destructiveActions}</div>
          ) : undefined}
        </div>
      ) : undefined}
    </section>
  );
};
