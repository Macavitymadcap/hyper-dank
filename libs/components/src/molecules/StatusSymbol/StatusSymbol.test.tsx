import { describe, expect, test } from "bun:test";
import { StatusSymbol } from "./StatusSymbol";

const render = (node: unknown): string => String(node);

describe("StatusSymbol", () => {
  test("renders a labelled non-colour status marker", () => {
    const html = render(<StatusSymbol label="Sync passed" status="success" />);

    expect(html).toContain('class="status-symbol"');
    expect(html).toContain('data-status="success"');
    expect(html).toContain('data-shape="check"');
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Sync passed"');
    expect(html).toContain("✓");
  });

  test("can render decorative inline markers when surrounding text owns the label", () => {
    const html = render(<StatusSymbol decorative status="warning" />);

    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain('role="img"');
    expect(html).not.toContain("aria-label");
    expect(html).toContain('data-shape="triangle"');
  });
});
