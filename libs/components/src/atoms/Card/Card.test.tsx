import { describe, expect, test } from "bun:test";
import { Card } from "./Card";

const render = (node: unknown): string => String(node);

describe("Card", () => {
  test("renders as a fill card with semantic element support", () => {
    const html = render(
      <Card as="main" fill className="app-card">
        Content
      </Card>,
    );

    expect(html).toContain('<main class="card app-card" data-fill="true">');
    expect(html).toContain("Content");
  });

  test("sets dimensions through custom properties", () => {
    const html = render(
      <Card
        width="20rem"
        height="12rem"
        minHeight="8rem"
        maxHeight="16rem"
        radius="var(--radius-2)"
        shadow="none"
      >
        Fixed
      </Card>,
    );

    expect(html).toContain('<div class="card"');
    expect(html).toContain("--card-width: 20rem");
    expect(html).toContain("--card-height: 12rem");
    expect(html).toContain("--card-min-height: 8rem");
    expect(html).toContain("--card-max-height: 16rem");
    expect(html).toContain("--card-radius: var(--radius-2)");
    expect(html).toContain("--card-shadow: none");
  });
});
