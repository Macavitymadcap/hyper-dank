import { type HtmxProps, htmxAttributes } from "../../model";

export interface ButtonProps extends HtmxProps {
  children: unknown;
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  size?: "default" | "compact";
  type?: "submit" | "reset" | "button";
  value?: string;
  variant?: "primary" | "danger" | "outline" | "text" | "ghost";
}

export const Button = ({
  ariaLabel,
  className,
  children,
  disabled = false,
  id,
  name,
  size = "default",
  type = "button",
  value,
  variant = "primary",
  ...hxProps
}: ButtonProps) => {
  const classes = ["button", className].filter(Boolean).join(" ");

  return (
    <button
      id={id}
      className={classes}
      type={type}
      name={name}
      value={value}
      aria-label={ariaLabel}
      disabled={disabled}
      data-size={size}
      data-variant={variant}
      {...htmxAttributes(hxProps)}
    >
      {children}
    </button>
  );
};
