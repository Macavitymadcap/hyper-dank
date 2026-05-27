import { describe, expect, test } from "bun:test";
import { VisuallyHidden } from "./VisuallyHidden";

const render = (node: unknown): string => String(node);

describe("VisuallyHidden", () => {
  test("renders accessible text with a stable utility class", () => {
    const html = render(<VisuallyHidden id="chart-summary">Chart summary</VisuallyHidden>);

    expect(html).toBe('<span class="visually-hidden" id="chart-summary">Chart summary</span>');
  });
});
