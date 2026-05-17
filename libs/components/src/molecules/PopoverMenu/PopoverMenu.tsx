import { Icon } from "../../atoms/Icon";

export interface PopoverMenuItem {
  action?: string;
  current?: boolean;
  href: string;
  label: string;
  method?: "get" | "post";
}

export interface PopoverMenuProps {
  id: string;
  items: PopoverMenuItem[];
  label: string;
}

export const PopoverMenu = ({ id, items, label }: PopoverMenuProps) => {
  const panelId = `${id}-panel`;
  const anchorName = `--${id}-anchor`;
  const anchorStyle = `--popover-anchor-name: ${anchorName};`;

  return (
    <div className="popover-menu" style={anchorStyle}>
      <button
        className="popover-menu-trigger"
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        popovertarget={panelId}
        popovertargetaction="toggle"
      >
        <Icon name="menu" />
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
