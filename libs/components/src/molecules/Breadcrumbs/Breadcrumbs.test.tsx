import { describe, expect, test } from "bun:test";
import { Breadcrumbs } from "./Breadcrumbs";

const render = (node: unknown): string => String(node);

describe("Breadcrumbs", () => {
  test("renders ordered navigation with a linked current page", () => {
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
    expect(html).toContain('<a href="/docs" aria-current="page">Docs</a>');
  });

  test("renders the current page as text when no href is supplied", () => {
    const html = render(
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { current: true, label: "Docs" },
        ]}
      />,
    );

    expect(html).toContain('<a href="/">Home</a>');
    expect(html).toContain('<span aria-current="page">Docs</span>');
    expect(html).not.toContain('href="undefined"');
  });

  test("preserves custom navigation labels", () => {
    const html = render(
      <Breadcrumbs
        ariaLabel="Section path"
        items={[
          { href: "/", label: "Home" },
          { current: true, label: "Docs" },
        ]}
      />,
    );

    expect(html).toContain('<nav class="breadcrumbs" aria-label="Section path">');
    expect(html).toContain('aria-current="page"');
  });
});
