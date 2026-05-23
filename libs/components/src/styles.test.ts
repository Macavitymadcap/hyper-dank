import { describe, expect, test } from "bun:test";

describe("shared component styles", () => {
  test("documents baseline selectors for public component variants", async () => {
    const css = await Bun.file(new URL("./styles.css", import.meta.url)).text();

    expect(css).toContain(".app-shell");
    expect(css).toContain("@media (max-width: 48rem)");
    expect(css).toContain(".accordion-item summary span");
    expect(css).toContain(".aspect-ratio");
    expect(css).toContain(".avatar");
    expect(css).toContain(".breadcrumbs ol");
    expect(css).toContain('.button[data-variant="ghost"]');
    expect(css).toContain(".button-group");
    expect(css).toContain(".callout");
    expect(css).toContain(".choice-field");
    expect(css).toContain(".dialog");
    expect(css).toContain("dialog.dialog:not([open])");
    expect(css).toContain(".empty-state");
    expect(css).toContain(".icon-button");
    expect(css).toContain(".kbd");
    expect(css).toContain(".metadata-list");
    expect(css).toContain(".pagination");
    expect(css).toContain(".page-header-content");
    expect(css).toContain(".page-header h1");
    expect(css).toContain("font-size: var(--font-size-4, 2rem)");
    expect(css).toContain("anchor-name: var(--popover-anchor-name)");
    expect(css).toContain("position-anchor: var(--popover-anchor-name)");
    expect(css).toContain(".popover-menu-form");
    expect(css).toContain(".popover-menu-item:hover");
    expect(css).toContain(".prose");
    expect(css).toContain(".separator");
    expect(css).toContain(".side-nav ul");
    expect(css).toContain(".skeleton");
    expect(css).toContain(".stat-block");
    expect(css).toContain(".timeline-list");
    expect(css).toContain(".tooltip");
    expect(css).toContain(".validation-summary");
    expect(css).toContain(".button:disabled");
    expect(css).toContain(".compact-list-row dd");
    expect(css).toContain('.switch[data-variant="compact"] .switch-track');
    expect(css).not.toContain("Walking Pace");
    expect(css).not.toContain("Character Sheet");
  });
});
