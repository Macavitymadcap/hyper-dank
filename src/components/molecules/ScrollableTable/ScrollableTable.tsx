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
  mobileColumnsTemplate?: string;
  mobileHeaderHeight?: string;
  mobileRowHeight?: string;
  mobileScrollBodyRows?: number;
  rowClassName?: string;
  rowHeight?: string;
  scrollBodyRows?: number;
}

export const ScrollableTable = ({
  children,
  className,
  columns,
  columnsTemplate,
  headerHeight,
  isScrollable = false,
  mobileColumnsTemplate,
  mobileHeaderHeight,
  mobileRowHeight,
  mobileScrollBodyRows,
  rowClassName,
  rowHeight,
  scrollBodyRows,
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
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};
