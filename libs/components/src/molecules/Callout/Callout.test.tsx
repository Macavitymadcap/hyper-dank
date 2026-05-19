import { describe, expect, test } from "bun:test";
import { Callout } from "./Callout";

const render = (node: unknown): string => String(node);

describe("Callout", () => {
  test("renders docs callouts with tone roles", () => {
    const html = render(
      <Callout tone="warning" title="Note">
        Details
      </Callout>,
    );

    expect(html).toContain('class="callout"');
    expect(html).toContain('data-tone="warning"');
    expect(html).toContain('role="alert"');
  });
});
