export interface SectionHeaderProps {
  actions?: unknown;
  className?: string;
  description?: unknown;
  headingLevel?: 2 | 3 | 4;
  id?: string;
  title: unknown;
}

export const SectionHeader = ({
  actions,
  className,
  description,
  headingLevel = 2,
  id,
  title,
}: SectionHeaderProps) => {
  const classes = ["section-header", className].filter(Boolean).join(" ");
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4";

  return (
    <header className={classes}>
      <div>
        <Heading id={id}>{title}</Heading>
        {description ? <p className="section-header-description">{description}</p> : undefined}
      </div>
      {actions ? <div className="section-header-actions">{actions}</div> : undefined}
    </header>
  );
};
