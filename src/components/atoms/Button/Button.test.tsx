import { describe, expect, test } from "bun:test";
import { Button } from "./Button";

const render = (node: unknown): string => String(node);

describe("Button", () => {
  test("renders standard and HTMX attributes", () => {
    const html = render(
      <Button
        type="button"
        className="clear-walk-btn"
        variant="danger"
        size="compact"
        hxDelete="/walks/1"
        hxTarget="#walks-list"
      >
        Clear
      </Button>,
    );

    expect(html).toContain("<button");
    expect(html).toContain('class="button clear-walk-btn"');
    expect(html).toContain('type="button"');
    expect(html).toContain('data-size="compact"');
    expect(html).toContain('data-variant="danger"');
    expect(html).toContain('hx-delete="/walks/1"');
    expect(html).toContain('hx-target="#walks-list"');
    expect(html).toContain(">Clear</button>");
  });
});
