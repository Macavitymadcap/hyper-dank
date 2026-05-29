import { describe, expect, test } from "bun:test";
import { Stack } from "./Stack";

const render = (node: unknown): string => String(node);

describe("Stack", () => {
  test("renders a vertical composition helper with alignment hooks", () => {
    const html = render(
      <Stack as="section" labelledBy="stack-heading" align="start" gap="1rem">
        <h2 id="stack-heading">Tasks</h2>
      </Stack>,
    );

    expect(html).toContain('<section aria-labelledby="stack-heading"');
    expect(html).toContain('class="stack"');
    expect(html).toContain('data-align="start"');
    expect(html).toContain("--stack-gap: 1rem");
  });

  test("supports predictable accessible label vocabulary", () => {
    const html = render(
      <Stack as="section" ariaLabel="Task stack" ariaLabelledBy="stack-heading">
        <h2 id="stack-heading">Tasks</h2>
      </Stack>,
    );

    expect(html).toContain('aria-label="Task stack"');
    expect(html).toContain('aria-labelledby="stack-heading"');
  });
});
