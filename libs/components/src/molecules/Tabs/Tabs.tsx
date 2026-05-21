export interface TabItem {
  current?: boolean;
  href: string;
  label: unknown;
}

export interface TabsProps {
  ariaLabel: string;
  className?: string;
  items: TabItem[];
}

export const Tabs = ({ ariaLabel, className, items }: TabsProps) => {
  const classes = ["tabs", className].filter(Boolean).join(" ");

  return (
    <nav className={classes} aria-label={ariaLabel}>
      <ul>
        {items.map((item) => (
          <li>
            <a className="tab" href={item.href} aria-current={item.current ? "page" : undefined}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
