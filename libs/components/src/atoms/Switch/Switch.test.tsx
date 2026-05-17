import { describe, expect, test } from "bun:test";
import { Switch } from "./Switch";

const render = (node: unknown): string => String(node);

describe("Switch", () => {
  test("renders a checkbox-backed icon toggle", () => {
    const html = render(<Switch id="theme-toggle" label="Color mode" dataThemeToggle />);

    expect(html).toContain('<label class="switch" for="theme-toggle">');
    expect(html).toContain("<input");
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('role="switch"');
    expect(html).toContain('aria-label="Color mode"');
    expect(html).toContain('data-theme-toggle=""');
    expect(html).toContain("light_mode");
    expect(html).toContain("dark_mode");
    expect(html).toContain("material-symbols-outlined");
  });

  test("renders checked state for dark mode", () => {
    const html = render(<Switch id="theme-toggle" label="Color mode" checked dataThemeToggle />);

    expect(html).toContain('checked=""');
    expect(html).toContain('aria-checked="true"');
  });
});
