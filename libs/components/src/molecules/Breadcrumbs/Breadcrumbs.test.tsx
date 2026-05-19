import { describe, expect, test } from "bun:test";
import { Breadcrumbs } from "./Breadcrumbs";

const render = (node: unknown): string => String(node);

describe("Breadcrumbs", () => {
  test("renders ordered navigation with a current page", () => {
    const html = render(
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { current: true, href: "/docs", label: "Docs" },
        ]}
      />,
    );

    expect(html).toContain('<nav class="breadcrumbs" aria-label="Breadcrumb">');
    expect(html).toContain("<ol>");
    expect(html).toContain('aria-current="page"');
  });
});
