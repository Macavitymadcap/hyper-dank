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
        hx-delete="/walks/1"
        hx-target="#walks-list"
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

  test("renders consumer defaults and ghost variant", () => {
    const html = render(
      <Button id="save-character" variant="ghost" ariaLabel="Save character">
        Save
      </Button>,
    );

    expect(html).toContain('id="save-character"');
    expect(html).toContain('type="button"');
    expect(html).toContain('aria-label="Save character"');
    expect(html).toContain('data-variant="ghost"');
  });
});
