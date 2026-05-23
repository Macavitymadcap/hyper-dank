import { describe, expect, test } from "bun:test";
import { AspectRatio } from "./AspectRatio";

const render = (node: unknown): string => String(node);

describe("AspectRatio", () => {
  test("renders a stable ratio wrapper", () => {
    const html = render(
      <AspectRatio ratio="4 / 3">
        <img src="/preview.png" alt="Preview" />
      </AspectRatio>,
    );

    expect(html).toContain('class="aspect-ratio"');
    expect(html).toContain('style="--aspect-ratio: 4 / 3;"');
    expect(html).toContain('<img src="/preview.png" alt="Preview"/>');
  });
});
