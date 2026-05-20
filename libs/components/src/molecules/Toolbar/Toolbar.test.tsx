import { describe, expect, test } from "bun:test";
import { Toolbar } from "./Toolbar";

const render = (node: unknown): string => String(node);

describe("Toolbar", () => {
  test("groups compact actions with a toolbar label", () => {
    const html = render(
      <Toolbar ariaLabel="Table tools">
        <button type="button">Filter</button>
      </Toolbar>,
    );

    expect(html).toContain('role="toolbar"');
    expect(html).toContain('aria-label="Table tools"');
    expect(html).toContain('class="toolbar"');
  });
});
