import { describe, expect, test } from "bun:test";
import { Layout } from "./Layout";

const render = (node: unknown): string => String(node);

describe("Layout", () => {
  test("renders document chrome and shared CSS", () => {
    const html = render(
      <Layout>
        <main>Body</main>
      </Layout>,
    );

    expect(html).toContain('<html lang="en">');
    expect(html).toContain("<title>Walking Pace Tracker</title>");
    expect(html).toContain("pace-calculator-theme");
    expect(html).toContain("fonts.googleapis.com/css2?family=Material+Symbols+Outlined");
    expect(html).toContain("<style>");
    expect(html).toContain(':root[data-theme="dark"]');
    expect(html).toContain("--theme-duration: 480ms");
    expect(html).toContain("--theme-text-transition: 0ms linear");
    expect(html).toContain("--button-text: var(--blue-9)");
    expect(html).toContain("--form-bg: var(--blue-9)");
    expect(html).toContain("--form-text: var(--gray-0)");
    expect(html).toContain("--switch-icon-light: var(--yellow-9)");
    expect(html).toContain("--switch-icon-dark: var(--gray-0)");
    expect(html).toContain("--page-gutter: var(--size-4)");
    expect(html).toContain("--page-gutter: var(--size-2)");
    expect(html).toContain('event.key !== "Enter"');
    expect(html).toContain('toggle.dispatchEvent(new Event("change", { bubbles: true }))');
    expect(html).toContain("--table-header-bg: var(--gray-1)");
    expect(html).toContain("--table-header-bg: var(--gray-10)");
    expect(html).toContain("--table-border: var(--gray-5)");
    expect(html).toContain("--table-action-divider: var(--gray-6)");
    expect(html).toContain("--scrollable-table-header-height: 3.5rem");
    expect(html).toContain("--scrollable-table-row-height: 3rem");
    expect(html).toContain("--scrollable-table-scroll-body-rows: 4");
    expect(html).toContain("--scrollable-table-mobile-scroll-body-rows: 3");
    expect(html).toContain(
      "--scrollable-table-current-scroll-body-rows: var(--scrollable-table-scroll-body-rows)",
    );
    expect(html).toContain(
      "--scrollable-table-inner-radius: calc(var(--radius-2) - var(--border-size-1))",
    );
    expect(html).toContain("flex: 0 1 auto;");
    expect(html).toContain("height: auto;");
    expect(html).toContain("grid-template-rows: var(--scrollable-table-header-height) auto;");
    expect(html).toContain("overflow-y: visible;");
    expect(html).toContain(
      '.scrollable-table-container[data-scrollable="true"] .scrollable-table tbody',
    );
    expect(html).toContain(
      "--scrollable-table-current-scroll-body-rows: var(--scrollable-table-mobile-scroll-body-rows)",
    );
    expect(html).toContain("--card-min-height: calc(100dvh - (var(--page-gutter) * 2))");
    expect(html).toContain("border: var(--border-size-1) solid var(--table-border);");
    expect(html).toContain("min-height: calc(2.75rem + (2 * 2.5rem))");
    expect(html).toContain("flex: 0 0 var(--scrollable-table-row-height);");
    expect(html).toContain(".scrollable-table tbody .scrollable-table-row:last-child > td");
    expect(html).toContain("overflow-x: hidden;");
    expect(html).not.toContain(".scrollable-table-filler-row");
    expect(html).toContain("border-end-start-radius: var(--scrollable-table-inner-radius)");
    expect(html).toContain("border-end-end-radius: var(--scrollable-table-inner-radius)");
    expect(html).toContain(
      "border-inline-start: var(--border-size-2) solid var(--table-action-divider)",
    );
    expect(html).toContain(".scrollable-table tbody,");
    expect(html).toContain(".chip,");
    expect(html).toContain(".labelled-output-value,");
    expect(html).toContain("background-size: 280% 100%");
    expect(html).toContain("transition: color var(--theme-text-transition);");
    expect(html).not.toContain(
      "transition: opacity var(--theme-transition), transform var(--theme-transition), color var(--theme-transition)",
    );
    expect(html).not.toContain('input[type="number"],');
    expect(html).toContain("border-color var(--speed-2)");
    expect(html).toContain(':root[data-theme="dark"] .switch-input + .switch-track .switch-thumb');
    expect(html).not.toContain(".switch-input:checked + .switch-track .switch-thumb");
    expect(html).toContain(".scrollable-table tbody");
    expect(html).toContain("<main>Body</main>");
  });
});
