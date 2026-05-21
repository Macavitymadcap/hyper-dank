export interface PageHeaderProps {
  actions?: unknown;
  className?: string;
  description?: unknown;
  eyebrow?: unknown;
  id?: string;
  metadata?: unknown;
  title: unknown;
}

export const PageHeader = ({
  actions,
  className,
  description,
  eyebrow,
  id,
  metadata,
  title,
}: PageHeaderProps) => {
  const classes = ["page-header", className].filter(Boolean).join(" ");
  const titleId = id ? `${id}-title` : undefined;

  return (
    <section id={id} className={classes} aria-labelledby={titleId}>
      <div className="page-header-content">
        {eyebrow ? <p className="page-header-eyebrow">{eyebrow}</p> : undefined}
        <h1 id={titleId}>{title}</h1>
        {description ? <p className="page-header-description">{description}</p> : undefined}
        {metadata ? <div className="page-header-metadata">{metadata}</div> : undefined}
      </div>
      {actions ? <div className="page-header-actions">{actions}</div> : undefined}
    </section>
  );
};
