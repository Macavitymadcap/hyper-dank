import { describe, expect, test } from "bun:test";
import { Switch } from "./Switch";

const render = (node: unknown): string => String(node);

describe("Switch", () => {
  test("renders a checkbox-backed icon toggle", () => {
    const html = render(<Switch id="theme-toggle" label="Color mode" dataThemeToggle />);

    expect(html).toContain('<label class="switch" for="theme-toggle" data-variant="default">');
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

  test("renders generic HTMX and styling hooks", () => {
    const html = render(
      <Switch
        id="inspiration"
        label="Inspiration"
        name="inspiration"
        offIcon="radio_button_unchecked"
        onIcon="bolt"
        variant="compact"
        thumbColor="gold"
        hx-post="/characters/1/inspiration"
        hx-target="#sheet"
      />,
    );

    expect(html).toContain('data-variant="compact"');
    expect(html).toContain('name="inspiration"');
    expect(html).toContain("radio_button_unchecked");
    expect(html).toContain("bolt");
    expect(html).toContain("--switch-thumb-bg: gold");
    expect(html).toContain('hx-post="/characters/1/inspiration"');
    expect(html).toContain('hx-target="#sheet"');
  });
});
