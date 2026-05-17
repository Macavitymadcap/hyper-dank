import { describe, expect, test } from "bun:test";

describe("client styles", () => {
  test("contains the migrated app style contracts", async () => {
    const css = await Bun.file(new URL("./styles.css", import.meta.url)).text();

    expect(css).toContain('@import "open-props/style"');
    expect(css).toContain('@import "open-props/normalize"');
    expect(css).toContain(':root[data-theme="dark"]');
    expect(css).toContain("--theme-duration: 480ms");
    expect(css).toContain("--button-text: var(--blue-9)");
    expect(css).toContain("--scrollable-table-header-height: 3.5rem");
    expect(css).toContain(".scrollable-table tbody .scrollable-table-row:last-child > td");
    expect(css).toContain(".switch-input:checked + .switch-track .switch-thumb");
    expect(css).not.toContain(".scrollable-table-filler-row");
  });
});
