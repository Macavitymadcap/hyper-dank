import { describe, expect, test } from "bun:test";

describe("shared component styles", () => {
  test("documents baseline selectors for public component variants", async () => {
    const css = await Bun.file(new URL("./styles.css", import.meta.url)).text();

    expect(css).toContain('.button[data-variant="ghost"]');
    expect(css).toContain(".button:disabled");
    expect(css).toContain('.switch[data-variant="compact"] .switch-track');
    expect(css).not.toContain("Walking Pace");
    expect(css).not.toContain("Character Sheet");
  });
});
