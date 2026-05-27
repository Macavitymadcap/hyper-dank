export type TextElement = "em" | "p" | "small" | "span" | "strong";
export type TextSize = "sm" | "md" | "lg";
export type TextTone = "default" | "muted" | "danger" | "success";
export type TextWeight = "default" | "medium" | "strong";

export interface TextProps {
  as?: TextElement;
  children: unknown;
  className?: string;
  id?: string;
  size?: TextSize;
  tone?: TextTone;
  weight?: TextWeight;
}

export const Text = ({
  as = "p",
  children,
  className,
  id,
  size = "md",
  tone = "default",
  weight = "default",
}: TextProps) => {
  const classes = ["text", className].filter(Boolean).join(" ");
  const props = {
    className: classes,
    "data-size": size,
    "data-tone": tone,
    "data-weight": weight,
    id,
  };

  switch (as) {
    case "em":
      return <em {...props}>{children}</em>;
    case "small":
      return <small {...props}>{children}</small>;
    case "span":
      return <span {...props}>{children}</span>;
    case "strong":
      return <strong {...props}>{children}</strong>;
    default:
      return <p {...props}>{children}</p>;
  }
};
