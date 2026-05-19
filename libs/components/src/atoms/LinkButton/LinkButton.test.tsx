import { describe, expect, test } from "bun:test";
import { LinkButton } from "./LinkButton";

const render = (node: unknown): string => String(node);

describe("LinkButton", () => {
  test("renders link semantics with button styling hooks", () => {
    const html = render(
      <LinkButton href="/docs" variant="outline" size="compact">
        Docs
      </LinkButton>,
    );

    expect(html).toContain("<a");
    expect(html).toContain('href="/docs"');
    expect(html).toContain('class="button link-button"');
    expect(html).toContain('data-variant="outline"');
    expect(html).toContain('data-size="compact"');
  });

  test("supports HTMX enhancement without losing native href fallback", () => {
    const html = render(
      <LinkButton href="/items" hx-get="/items" hx-target="#items" ariaLabel="Load items">
        Load
      </LinkButton>,
    );

    expect(html).toContain('href="/items"');
    expect(html).toContain('hx-get="/items"');
    expect(html).toContain('hx-target="#items"');
    expect(html).toContain('aria-label="Load items"');
  });
});
