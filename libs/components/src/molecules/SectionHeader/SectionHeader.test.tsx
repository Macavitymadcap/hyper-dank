import { describe, expect, test } from "bun:test";
import { SectionHeader } from "./SectionHeader";

const render = (node: unknown): string => String(node);

describe("SectionHeader", () => {
  test("renders a configurable section heading with actions", () => {
    const html = render(
      <SectionHeader id="filters" title="Filters" actions={<button type="button">Reset</button>} />,
    );

    expect(html).toContain('class="section-header"');
    expect(html).toContain('<h2 id="filters">Filters</h2>');
    expect(html).toContain('class="section-header-actions"');
  });
});
