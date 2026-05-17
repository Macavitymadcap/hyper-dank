export interface TableCellProps {
  className?: string;
  value: string | number;
}

export const TableCell = ({ className, value }: TableCellProps) => {
  const classes = ["table-cell", className].filter(Boolean).join(" ");

  return <td className={classes}>{value}</td>;
};
