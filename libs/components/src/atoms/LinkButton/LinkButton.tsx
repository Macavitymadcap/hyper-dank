import { type HtmxProps, htmxAttributes } from "../../model";

export interface LinkButtonProps extends HtmxProps {
  ariaLabel?: string;
  children: unknown;
  className?: string;
  href: string;
  id?: string;
  size?: "default" | "compact";
  target?: "_blank" | "_parent" | "_self" | "_top";
  variant?: "primary" | "danger" | "outline" | "text" | "ghost";
}

export const LinkButton = ({
  ariaLabel,
  children,
  className,
  href,
  id,
  size = "default",
  target,
  variant = "primary",
  ...hxProps
}: LinkButtonProps) => {
  const classes = ["button", "link-button", className].filter(Boolean).join(" ");
  const rel = target === "_blank" ? "noreferrer" : undefined;

  return (
    <a
      id={id}
      aria-label={ariaLabel}
      className={classes}
      data-size={size}
      data-variant={variant}
      href={href}
      rel={rel}
      target={target}
      {...htmxAttributes(hxProps)}
    >
      {children}
    </a>
  );
};
