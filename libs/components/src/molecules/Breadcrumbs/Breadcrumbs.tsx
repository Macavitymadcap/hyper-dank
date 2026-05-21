export interface BreadcrumbItem {
  current?: boolean;
  href: string;
  label: unknown;
}

export interface BreadcrumbsProps {
  ariaLabel?: string;
  className?: string;
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ ariaLabel = "Breadcrumb", className, items }: BreadcrumbsProps) => {
  const classes = ["breadcrumbs", className].filter(Boolean).join(" ");

  return (
    <nav className={classes} aria-label={ariaLabel}>
      <ol>
        {items.map((item) => (
          <li>
            <a href={item.href} aria-current={item.current ? "page" : undefined}>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
};
