import { describe, expect, test } from "bun:test";
import { Separator } from "./Separator";

const render = (node: unknown): string => String(node);

describe("Separator", () => {
  test("renders decorative separators by default", () => {
    const html = render(<Separator />);

    expect(html).toBe('<hr class="separator" data-orientation="horizontal" role="presentation"/>');
  });

  test("renders semantic vertical separators when requested", () => {
    const html = render(<Separator decorative={false} orientation="vertical" />);

    expect(html).toContain('role="separator"');
    expect(html).toContain('aria-orientation="vertical"');
  });
});
