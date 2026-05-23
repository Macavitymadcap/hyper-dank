import { describe, expect, test } from "bun:test";
import { Skeleton } from "./Skeleton";

const render = (node: unknown): string => String(node);

describe("Skeleton", () => {
  test("renders a labelled loading placeholder with sizing hooks", () => {
    const html = render(
      <Skeleton width="12rem" height="2rem" shape="block" label="Loading card" />,
    );

    expect(html).toContain('class="skeleton"');
    expect(html).toContain('data-shape="block"');
    expect(html).toContain('role="status"');
    expect(html).toContain('style="--skeleton-width: 12rem; --skeleton-height: 2rem"');
    expect(html).toContain('class="skeleton-label">Loading card');
  });

  test("hides purely visual placeholders from assistive technology", () => {
    const html = render(<Skeleton width="12rem" />);

    expect(html).toContain('aria-hidden="true"');
  });
});
