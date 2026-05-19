import { describe, expect, test } from "bun:test";
import { IconButton } from "./IconButton";

const render = (node: unknown): string => String(node);

describe("IconButton", () => {
  test("renders an accessible icon-only button", () => {
    const html = render(<IconButton icon="search" label="Search" variant="ghost" />);

    expect(html).toContain("<button");
    expect(html).toContain('aria-label="Search"');
    expect(html).toContain('class="button icon-button"');
    expect(html).toContain('data-icon="search"');
    expect(html).toContain('aria-hidden="true"');
  });
});
