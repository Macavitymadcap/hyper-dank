export type ContainerElement = "article" | "div" | "main" | "section";
export type ContainerWidth = "narrow" | "default" | "wide" | "full";

export interface ContainerProps {
  as?: ContainerElement;
  children: unknown;
  className?: string;
  id?: string;
  labelledBy?: string;
  maxWidth?: string;
  width?: ContainerWidth;
}

export const Container = ({
  as = "div",
  children,
  className,
  id,
  labelledBy,
  maxWidth,
  width = "default",
}: ContainerProps) => {
  const classes = ["container", className].filter(Boolean).join(" ");
  const props = {
    "aria-labelledby": labelledBy,
    className: classes,
    "data-width": width,
    id,
    style: maxWidth ? `--container-max-width: ${maxWidth}` : undefined,
  };

  switch (as) {
    case "article":
      return <article {...props}>{children}</article>;
    case "main":
      return <main {...props}>{children}</main>;
    case "section":
      return <section {...props}>{children}</section>;
    default:
      return <div {...props}>{children}</div>;
  }
};
