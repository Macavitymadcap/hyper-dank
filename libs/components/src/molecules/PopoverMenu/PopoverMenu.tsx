import { Icon } from "../../atoms/Icon";

export interface PopoverMenuItem {
  action?: string;
  current?: boolean;
  href: string;
  label: string;
  method?: "get" | "post";
}

export interface PopoverMenuProps {
  className?: string;
  id: string;
  items: PopoverMenuItem[];
  label: string;
  trigger?: unknown;
}

export const PopoverMenu = ({ className, id, items, label, trigger }: PopoverMenuProps) => {
  const panelId = `${id}-panel`;
  const anchorName = `--${id}-anchor`;
  const anchorStyle = `--popover-anchor-name: ${anchorName};`;
  const classes = ["popover-menu", className].filter(Boolean).join(" ");

  return (
    <div className={classes} style={anchorStyle}>
      <button
        className="popover-menu-trigger"
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        popovertarget={panelId}
        popovertargetaction="toggle"
      >
        {trigger ?? <Icon name="menu" />}
      </button>
      <div id={panelId} className="popover-menu-panel" popover="auto" role="menu">
        {items.map((item) =>
          item.method === "post" ? (
            <form
              className="popover-menu-form"
              action={item.action ?? item.href}
              method="post"
              role="none"
            >
              <button
                className="popover-menu-item"
                type="submit"
                role="menuitem"
                aria-current={item.current ? "page" : undefined}
              >
                {item.label}
              </button>
            </form>
          ) : (
            <a
              className="popover-menu-item"
              href={item.href}
              role="menuitem"
              aria-current={item.current ? "page" : undefined}
            >
              {item.label}
            </a>
          ),
        )}
      </div>
    </div>
  );
};
