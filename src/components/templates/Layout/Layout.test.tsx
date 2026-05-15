import { describe, expect, test } from "bun:test";
import { Layout } from "./Layout";

const render = (node: unknown): string => String(node);

describe("Layout", () => {
  test("renders document chrome and shared CSS", () => {
    const html = render(
      <Layout>
        <main>Body</main>
      </Layout>
    );

    expect(html).toContain("<html lang=\"en\">");
    expect(html).toContain("<title>Walking Pace Tracker</title>");
    expect(html).toContain("pace-calculator-theme");
    expect(html).toContain("fonts.googleapis.com/css2?family=Material+Symbols+Outlined");
    expect(html).toContain("<style>");
    expect(html).toContain(":root[data-theme=\"dark\"]");
    expect(html).toContain("--table-header-bg: var(--gray-1)");
    expect(html).toContain("--table-header-bg: var(--gray-10)");
    expect(html).toContain("--table-action-divider: var(--gray-4)");
    expect(html).toContain("border-inline-start: var(--border-size-2) solid var(--table-action-divider)");
    expect(html).toContain("background-size: 280% 100%");
    expect(html).toContain(".switch-input:checked + .switch-track .switch-thumb");
    expect(html).toContain(".walks-table tbody");
    expect(html).toContain("<main>Body</main>");
  });
});
