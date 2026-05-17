import { type HtmxProps, htmxAttributes } from "../../model";

export interface ButtonProps extends HtmxProps {
  type: "submit" | "reset" | "button";
  children: unknown;
  className?: string;
  size?: "default" | "compact";
  variant?: "primary" | "danger" | "outline" | "text";
}

export const Button = ({
  className,
  type,
  children,
  size = "default",
  variant = "primary",
  ...hxProps
}: ButtonProps) => {
  const classes = ["button", className].filter(Boolean).join(" ");

  return (
    <button
      className={classes}
      type={type}
      data-size={size}
      data-variant={variant}
      {...htmxAttributes(hxProps)}
    >
      {children}
    </button>
  );
};
