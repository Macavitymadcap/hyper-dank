export type GridElement = "div" | "section" | "ul";

export interface GridProps {
  as?: GridElement;
  children: unknown;
  className?: string;
  columns?: string;
  gap?: string;
  id?: string;
  labelledBy?: string;
  minColumnWidth?: string;
}

export const Grid = ({
  as = "div",
  children,
  className,
  columns,
  gap,
  id,
  labelledBy,
  minColumnWidth,
}: GridProps) => {
  const classes = ["grid", className].filter(Boolean).join(" ");
  const customProperties = [
    columns && `--grid-columns: ${columns}`,
    gap && `--grid-gap: ${gap}`,
    minColumnWidth && `--grid-min-column-width: ${minColumnWidth}`,
  ]
    .filter(Boolean)
    .join("; ");
  const props = {
    "aria-labelledby": labelledBy,
    className: classes,
    id,
    style: customProperties || undefined,
  };

  switch (as) {
    case "section":
      return <section {...props}>{children}</section>;
    case "ul":
      return <ul {...props}>{children}</ul>;
    default:
      return <div {...props}>{children}</div>;
  }
};
