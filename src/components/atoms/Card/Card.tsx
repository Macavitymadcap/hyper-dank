type CardElement = "article" | "div" | "main" | "section";

interface CardProps {
  as?: CardElement;
  children: unknown;
  className?: string;
  fill?: boolean;
  height?: string;
  maxHeight?: string;
  minHeight?: string;
  radius?: string;
  shadow?: string;
  width?: string;
}

export const Card = ({
  as = "div",
  children,
  className,
  fill = false,
  height,
  maxHeight,
  minHeight,
  radius,
  shadow,
  width,
}: CardProps) => {
  const classes = ["card", className].filter(Boolean).join(" ");
  const customProperties = [
    width && `--card-width: ${width}`,
    height && `--card-height: ${height}`,
    minHeight && `--card-min-height: ${minHeight}`,
    maxHeight && `--card-max-height: ${maxHeight}`,
    radius && `--card-radius: ${radius}`,
    shadow && `--card-shadow: ${shadow}`,
  ].filter(Boolean).join("; ");

  const props = {
    className: classes,
    "data-fill": fill ? "true" : undefined,
    style: customProperties || undefined,
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
