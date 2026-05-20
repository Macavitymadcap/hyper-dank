import { describe, expect, test } from "bun:test";
import { LoadingIndicator } from "./LoadingIndicator";

const render = (node: unknown): string => String(node);

describe("LoadingIndicator", () => {
  test("renders polite loading status text", () => {
    const html = render(<LoadingIndicator label="Saving" />);

    expect(html).toContain('class="loading-indicator"');
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
  });
});
