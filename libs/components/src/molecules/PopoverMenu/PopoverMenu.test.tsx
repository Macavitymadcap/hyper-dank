import { describe, expect, test } from "bun:test";
import { PopoverMenu } from "./PopoverMenu";

describe("PopoverMenu", () => {
  test("renders links and post actions as menu items", () => {
    const html = String(
      <PopoverMenu
        id="site-menu"
        label="Open menu"
        items={[
          { current: true, href: "/", label: "Home" },
          { action: "/logout", href: "/logout", label: "Sign out", method: "post" },
        ]}
      />,
    );

    expect(html).toContain('aria-label="Open menu"');
    expect(html).toContain('href="/"');
    expect(html).toContain('action="/logout"');
    expect(html).toContain('role="menuitem"');
    expect(html).toContain('aria-haspopup="menu"');
  });
});
