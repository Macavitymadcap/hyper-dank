import { describe, expect, test } from "bun:test";
import { Grid } from "./Grid";

const render = (node: unknown): string => String(node);

describe("Grid", () => {
  test("renders a responsive grid helper with custom property hooks", () => {
    const html = render(
      <Grid as="ul" columns="repeat(2, minmax(0, 1fr))" gap="0.75rem" minColumnWidth="14rem">
        <li>One</li>
      </Grid>,
    );

    expect(html).toContain("<ul");
    expect(html).toContain('class="grid"');
    expect(html).toContain("--grid-columns: repeat(2, minmax(0, 1fr))");
    expect(html).toContain("--grid-gap: 0.75rem");
    expect(html).toContain("--grid-min-column-width: 14rem");
  });

  test("supports predictable accessible label vocabulary", () => {
    const html = render(
      <Grid as="section" ariaLabel="Card grid" ariaLabelledBy="grid-heading">
        <article>One</article>
      </Grid>,
    );

    expect(html).toContain('aria-label="Card grid"');
    expect(html).toContain('aria-labelledby="grid-heading"');
  });
});
