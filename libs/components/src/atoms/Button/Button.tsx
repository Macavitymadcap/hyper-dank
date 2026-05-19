import { type HtmxProps, htmxAttributes } from "../../model";

/** Native button primitive with shared variants and optional HTMX attributes. */
export interface ButtonProps extends HtmxProps {
  /** Visible label or rich inline content. Provide ariaLabel when this is not descriptive text. */
  children: unknown;
  /** Accessible label for icon-only or ambiguous button content. */
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  /** Visual density contract exposed through the data-size attribute. */
  size?: "default" | "compact";
  /** Native button type. Defaults to button to avoid accidental form submission. */
  type?: "submit" | "reset" | "button";
  value?: string;
  /** Visual intent contract exposed through the data-variant attribute. */
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
