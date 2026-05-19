export interface StatusSummaryItem {
  label: string;
  tone?: "neutral" | "success" | "warning" | "danger";
  value: unknown;
}

export interface StatusSummaryProps {
  className?: string;
  items: StatusSummaryItem[];
  title?: unknown;
}

export const StatusSummary = ({ className, items, title }: StatusSummaryProps) => {
  const classes = ["status-summary", className].filter(Boolean).join(" ");

  return (
    <section className={classes}>
      {title ? <h2>{title}</h2> : undefined}
      <dl>
        {items.map((item) => (
          <div className="status-summary-item" data-tone={item.tone ?? "neutral"}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
