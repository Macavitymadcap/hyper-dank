export interface SideNavItem {
  current?: boolean;
  href: string;
  label: unknown;
}

export interface SideNavProps {
  ariaLabel: string;
  className?: string;
  items: SideNavItem[];
}

export const SideNav = ({ ariaLabel, className, items }: SideNavProps) => {
  const classes = ["side-nav", className].filter(Boolean).join(" ");

  return (
    <nav className={classes} aria-label={ariaLabel}>
      <ul>
        {items.map((item) => (
          <li>
            <a href={item.href} aria-current={item.current ? "page" : undefined}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
