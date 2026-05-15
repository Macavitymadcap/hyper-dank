interface ScrollableTableColumn {
  className?: string;
  header: unknown;
  isAction?: boolean;
  key: string;
}

interface ScrollableTableProps {
  children: unknown;
  className?: string;
  columns: ScrollableTableColumn[];
  columnsTemplate: string;
  headerHeight?: string;
  isScrollable?: boolean;
  minBodyRows?: number;
  mobileColumnsTemplate?: string;
  mobileHeaderHeight?: string;
  mobileRowHeight?: string;
  rowClassName?: string;
  rowHeight?: string;
}

export const ScrollableTable = ({
  children,
  className,
  columns,
  columnsTemplate,
  headerHeight,
  isScrollable = false,
  minBodyRows,
  mobileColumnsTemplate,
  mobileHeaderHeight,
  mobileRowHeight,
  rowClassName,
  rowHeight,
}: ScrollableTableProps) => {
  const tableClasses = ["scrollable-table", className].filter(Boolean).join(" ");
  const headerRowClasses = ["scrollable-table-row", rowClassName].filter(Boolean).join(" ");
  const customProperties = [
    `--scrollable-table-columns: ${columnsTemplate}`,
    mobileColumnsTemplate && `--scrollable-table-mobile-columns: ${mobileColumnsTemplate}`,
    headerHeight && `--scrollable-table-header-height: ${headerHeight}`,
    mobileHeaderHeight && `--scrollable-table-mobile-header-height: ${mobileHeaderHeight}`,
    rowHeight && `--scrollable-table-row-height: ${rowHeight}`,
    mobileRowHeight && `--scrollable-table-mobile-row-height: ${mobileRowHeight}`,
    minBodyRows && `--scrollable-table-min-body-rows: ${minBodyRows}`,
  ].filter(Boolean).join("; ");

  return (
    <div
      className="scrollable-table-container"
      data-scrollable={isScrollable ? "true" : undefined}
      style={customProperties || undefined}
    >
      <table className={tableClasses}>
        <thead>
          <tr className={headerRowClasses}>
            {columns.map((column) => (
              <th
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
        <tbody>
          {children}
          <tr className={`${headerRowClasses} scrollable-table-filler-row`} aria-hidden="true">
            {columns.map((column) => (
              <td
                key={`${column.key}-filler`}
                className={column.className}
                data-action-column={column.isAction ? "true" : undefined}
              />
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
