interface BreadcrumbBaseItem {
  label: unknown;
}

interface BreadcrumbLinkedItem extends BreadcrumbBaseItem {
  current?: boolean;
  href: string;
}

interface BreadcrumbCurrentItem extends BreadcrumbBaseItem {
  current: true;
  href?: string;
}

export type BreadcrumbItem = BreadcrumbLinkedItem | BreadcrumbCurrentItem;

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
            {item.href ? (
              <a href={item.href} aria-current={item.current ? "page" : undefined}>
                {item.label}
              </a>
            ) : (
              <span aria-current={item.current ? "page" : undefined}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
