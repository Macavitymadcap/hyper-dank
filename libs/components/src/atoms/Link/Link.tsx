export interface LinkProps {
  children: unknown;
  className?: string;
  current?: boolean;
  external?: boolean;
  href: string;
  id?: string;
}

export const Link = ({
  children,
  className,
  current = false,
  external = false,
  href,
  id,
}: LinkProps) => {
  const classes = ["link", className].filter(Boolean).join(" ");

  return (
    <a
      aria-current={current ? "page" : undefined}
      className={classes}
      href={href}
      id={id}
      rel={external ? "noreferrer" : undefined}
      target={external ? "_blank" : undefined}
    >
      {children}
    </a>
  );
};
