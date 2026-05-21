import { describe, expect, test } from "bun:test";
import { SideNav } from "./SideNav";

const render = (node: unknown): string => String(node);

describe("SideNav", () => {
  test("renders labelled section navigation", () => {
    const html = render(
      <SideNav ariaLabel="Docs" items={[{ current: true, href: "/docs", label: "Docs" }]} />,
    );

    expect(html).toContain('class="side-nav"');
    expect(html).toContain('aria-label="Docs"');
    expect(html).toContain('aria-current="page"');
  });
});
