import { describe, expect, test } from "bun:test";
import { AppShell } from "./AppShell";

const render = (node: unknown): string => String(node);

describe("AppShell", () => {
  test("renders app landmarks without owning route content", () => {
    const html = render(
      <AppShell header={<a href="/">Home</a>} navigation={<nav aria-label="Sections">Nav</nav>}>
        <h1>Dashboard</h1>
      </AppShell>,
    );

    expect(html).toContain('class="app-shell"');
    expect(html).toContain("<header");
    expect(html).toContain("<main");
    expect(html).toContain('aria-label="Sections"');
  });
});
