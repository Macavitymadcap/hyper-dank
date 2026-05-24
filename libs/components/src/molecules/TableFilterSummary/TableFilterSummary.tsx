export interface TableFilterSummaryItem {
  label: string;
  value: unknown;
}

export interface TableFilterSummaryProps {
  activeFilters: TableFilterSummaryItem[];
  className?: string;
  id?: string;
  resetHref?: string;
  resetLabel?: string;
  resultCount?: number;
  title?: unknown;
}

export const TableFilterSummary = ({
  activeFilters,
  className,
  id,
  resetHref,
  resetLabel = "Clear filters",
  resultCount,
  title = "Table filters",
}: TableFilterSummaryProps) => {
  const classes = ["table-filter-summary", className].filter(Boolean).join(" ");

  return (
    <section id={id} className={classes} role="status" aria-live="polite">
      <div className="table-filter-summary-heading">
        <strong>{title}</strong>
        {typeof resultCount === "number" ? (
          <span className="table-filter-summary-count">
            {resultCount} {resultCount === 1 ? "result" : "results"}
          </span>
        ) : undefined}
      </div>
      {activeFilters.length > 0 ? (
        <dl>
          {activeFilters.map((filter) => (
            <div className="table-filter-summary-item">
              <dt>{filter.label}</dt>
              <dd>{filter.value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p>No filters applied</p>
      )}
      {resetHref ? <a href={resetHref}>{resetLabel}</a> : undefined}
    </section>
  );
};
