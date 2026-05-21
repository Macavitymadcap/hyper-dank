import { describe, expect, test } from "bun:test";
import { Tabs } from "./Tabs";

const render = (node: unknown): string => String(node);

describe("Tabs", () => {
  test("renders link-backed tabs with current state", () => {
    const html = render(
      <Tabs
        ariaLabel="Sections"
        items={[
          { current: true, href: "/a", label: "A" },
          { href: "/b", label: "B" },
        ]}
      />,
    );

    expect(html).toContain('class="tabs"');
    expect(html).toContain('aria-label="Sections"');
    expect(html).toContain('aria-current="page"');
  });
});
