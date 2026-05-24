/** Column contract used to render semantic headers and responsive grid widths. */
export interface ScrollableTableColumn {
  className?: string;
  /** Header content rendered inside a scoped column header. */
  header: unknown;
  /** Marks mutation/action columns so app CSS can narrow them on compact screens. */
  isAction?: boolean;
  /** Stable column key used for rendering and story documentation. */
  key: string;
  /** Optional mobile grid track, falling back to width and then minmax(0, 1fr). */
  mobileWidth?: string;
  /** Optional semantic sort state for the column header; execution stays app-owned. */
  sortDirection?: "ascending" | "descending" | "none" | "other";
  /** Optional desktop grid track, falling back to minmax(0, 1fr). */
  width?: string;
}

/** Responsive table shell with sticky headers and keyboard-reachable scroll bodies. */
export interface ScrollableTableProps {
  /** Table row elements owned by the consuming app. */
  children?: unknown;
  className?: string;
  caption?: unknown;
  /** Ordered column metadata used for headers and CSS grid tracks. */
  columns: ScrollableTableColumn[];
  columnsTemplate?: string;
  emptyState?: unknown;
  headerHeight?: string;
  /** Enables the scroll-body contract and gives tbody a keyboard focus target. */
  isScrollable?: boolean;
  loading?: unknown;
  mobileColumnsTemplate?: string;
  mobileHeaderHeight?: string;
  mobileRowHeight?: string;
  mobileScrollBodyRows?: number;
  pagination?: unknown;
  summary?: unknown;
  rowClassName?: string;
  rowHeight?: string;
  scrollBodyRows?: number;
}

export const ScrollableTable = ({
  children,
  className,
  caption,
  columns,
  columnsTemplate,
  emptyState,
  headerHeight,
  isScrollable = false,
  loading,
  mobileColumnsTemplate,
  mobileHeaderHeight,
  mobileRowHeight,
  mobileScrollBodyRows,
  pagination,
  summary,
  rowClassName,
  rowHeight,
  scrollBodyRows,
}: ScrollableTableProps) => {
  const tableClasses = ["scrollable-table", className].filter(Boolean).join(" ");
  const headerRowClasses = ["scrollable-table-row", rowClassName].filter(Boolean).join(" ");
  const resolvedColumnsTemplate = columnsTemplate ?? buildColumnsTemplate(columns, "width");
  const resolvedMobileColumnsTemplate =
    mobileColumnsTemplate ?? buildColumnsTemplate(columns, "mobileWidth", "width");
  const customProperties = [
    `--scrollable-table-columns: ${resolvedColumnsTemplate}`,
    resolvedMobileColumnsTemplate &&
      `--scrollable-table-mobile-columns: ${resolvedMobileColumnsTemplate}`,
    headerHeight && `--scrollable-table-header-height: ${headerHeight}`,
    mobileHeaderHeight && `--scrollable-table-mobile-header-height: ${mobileHeaderHeight}`,
    rowHeight && `--scrollable-table-row-height: ${rowHeight}`,
    mobileRowHeight && `--scrollable-table-mobile-row-height: ${mobileRowHeight}`,
    scrollBodyRows && `--scrollable-table-scroll-body-rows: ${scrollBodyRows}`,
    mobileScrollBodyRows && `--scrollable-table-mobile-scroll-body-rows: ${mobileScrollBodyRows}`,
  ]
    .filter(Boolean)
    .join("; ");

  return (
    <div
      className="scrollable-table-container"
      data-scrollable={isScrollable ? "true" : undefined}
      style={customProperties || undefined}
    >
      {summary ? <div className="scrollable-table-summary">{summary}</div> : undefined}
      {loading ? <div className="scrollable-table-loading">{loading}</div> : undefined}
      {children ? (
        <table className={tableClasses}>
          {caption ? <caption>{caption}</caption> : undefined}
          <thead>
            <tr className={headerRowClasses}>
              {columns.map((column) => (
                <th
                  aria-sort={column.sortDirection}
                  key={column.key}
                  className={column.className}
                  data-action-column={column.isAction ? "true" : undefined}
                  scope="col"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody tabindex={isScrollable ? 0 : undefined}>{children}</tbody>
        </table>
      ) : (
        emptyState
      )}
      {pagination ? <div className="scrollable-table-pagination">{pagination}</div> : undefined}
    </div>
  );
};

function buildColumnsTemplate(
  columns: ScrollableTableColumn[],
  primaryKey: "width" | "mobileWidth",
  fallbackKey?: "width",
) {
  return columns
    .map(
      (column) =>
        column[primaryKey] ?? (fallbackKey ? column[fallbackKey] : undefined) ?? "minmax(0, 1fr)",
    )
    .join(" ");
}
