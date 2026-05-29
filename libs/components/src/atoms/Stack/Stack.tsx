export type StackElement = "div" | "fieldset" | "section" | "ul";
export type StackAlign = "start" | "center" | "end" | "stretch";

export interface StackProps {
  align?: StackAlign;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  as?: StackElement;
  children: unknown;
  className?: string;
  gap?: string;
  id?: string;
  labelledBy?: string;
}

export const Stack = ({
  align = "stretch",
  ariaLabel,
  ariaLabelledBy,
  as = "div",
  children,
  className,
  gap,
  id,
  labelledBy,
}: StackProps) => {
  const classes = ["stack", className].filter(Boolean).join(" ");
  const labelledById = ariaLabelledBy ?? labelledBy;
  const props = {
    "aria-label": ariaLabel,
    "aria-labelledby": labelledById,
    className: classes,
    "data-align": align,
    id,
    style: gap ? `--stack-gap: ${gap}` : undefined,
  };

  switch (as) {
    case "fieldset":
      return <fieldset {...props}>{children}</fieldset>;
    case "section":
      return <section {...props}>{children}</section>;
    case "ul":
      return <ul {...props}>{children}</ul>;
    default:
      return <div {...props}>{children}</div>;
  }
};
