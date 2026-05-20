export interface EmptyStateProps {
  actions?: unknown;
  children?: unknown;
  className?: string;
  icon?: unknown;
  title: unknown;
}

export const EmptyState = ({ actions, children, className, icon, title }: EmptyStateProps) => {
  const classes = ["empty-state", className].filter(Boolean).join(" ");

  return (
    <section className={classes}>
      {icon ? <div className="empty-state-icon">{icon}</div> : undefined}
      <h2>{title}</h2>
      {children ? <div className="empty-state-body">{children}</div> : undefined}
      {actions ? <div className="empty-state-actions">{actions}</div> : undefined}
    </section>
  );
};
