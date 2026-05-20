import { describe, expect, test } from "bun:test";
import { Notice } from "./Notice";

const render = (node: unknown): string => String(node);

describe("Notice", () => {
  test("renders tonal feedback with appropriate role", () => {
    const html = render(
      <Notice tone="warning" heading="Check this">
        Message
      </Notice>,
    );

    expect(html).toContain('class="notice"');
    expect(html).toContain('data-tone="warning"');
    expect(html).toContain('role="alert"');
  });
});
