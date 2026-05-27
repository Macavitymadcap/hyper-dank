import { describe, expect, test } from "bun:test";
import { Text } from "./Text";

const render = (node: unknown): string => String(node);

describe("Text", () => {
  test("renders quiet text variants without owning product copy", () => {
    const html = render(
      <Text as="small" tone="muted" size="sm" weight="medium">
        Updated just now
      </Text>,
    );

    expect(html).toBe(
      '<small class="text" data-size="sm" data-tone="muted" data-weight="medium">Updated just now</small>',
    );
  });
});
