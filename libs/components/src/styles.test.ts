import { describe, expect, test } from "bun:test";

describe("shared component styles", () => {
  test("documents baseline selectors for public component variants", async () => {
    const css = await Bun.file(new URL("./styles.css", import.meta.url)).text();

    expect(css).toContain(".app-shell");
    expect(css).toContain(".breadcrumbs ol");
    expect(css).toContain('.button[data-variant="ghost"]');
    expect(css).toContain(".button-group");
    expect(css).toContain(".callout");
    expect(css).toContain(".choice-field");
    expect(css).toContain(".dialog");
    expect(css).toContain("dialog.dialog:not([open])");
    expect(css).toContain(".empty-state");
    expect(css).toContain(".icon-button");
    expect(css).toContain(".metadata-list");
    expect(css).toContain(".pagination");
    expect(css).toContain(".prose");
    expect(css).toContain(".side-nav ul");
    expect(css).toContain(".stat-block");
    expect(css).toContain(".timeline-list");
    expect(css).toContain(".validation-summary");
    expect(css).toContain(".button:disabled");
    expect(css).toContain('.switch[data-variant="compact"] .switch-track');
    expect(css).not.toContain("Walking Pace");
    expect(css).not.toContain("Character Sheet");
  });
});
