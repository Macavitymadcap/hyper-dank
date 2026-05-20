import { describe, expect, test } from "bun:test";
import { StatBlock } from "./StatBlock";

const render = (node: unknown): string => String(node);

describe("StatBlock", () => {
  test("renders a compact metric as definition content", () => {
    const html = render(<StatBlock label="Posts" value="12" meta="Published" />);

    expect(html).toContain('class="stat-block"');
    expect(html).toContain("<dt>Posts</dt>");
    expect(html).toContain("<strong>12</strong>");
  });
});
