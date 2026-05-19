import { describe, expect, test } from "bun:test";
import { Icon } from "./Icon";

describe("Icon", () => {
  test("renders decorative icons as hidden", () => {
    const html = String(<Icon name="menu" />);

    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('data-icon="menu"');
  });

  test("renders labelled icons with image semantics", () => {
    const html = String(<Icon label="Success" name="check" tone="success" />);

    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Success"');
    expect(html).toContain('data-icon="check-circle"');
  });

  test("supports app-builder aliases and catalogue icons", () => {
    const html = String(<Icon name="save" />);

    expect(html).toContain('data-icon="floppy"');
  });

  test("covers the required app-builder icon catalogue", () => {
    const requiredIcons = [
      ["menu", "menu"],
      ["check", "check-circle"],
      ["dark_mode", "moon"],
      ["light_mode", "sun"],
      ["workspace_premium", "star"],
      ["radio_button_unchecked", "circle"],
      ["document", "document"],
      ["search", "search"],
      ["filter", "filter"],
      ["edit", "pencil"],
      ["delete", "trash"],
      ["add", "plus"],
      ["save", "floppy"],
      ["download", "download"],
      ["upload", "upload"],
      ["settings", "gear"],
      ["user", "user"],
      ["lock", "lock"],
      ["warning", "warning"],
      ["close", "close"],
      ["external-link", "external-link"],
      ["home", "home"],
      ["calendar", "calendar"],
      ["tag", "tag"],
      ["folder", "folder"],
      ["database", "database"],
      ["dice", "dice"],
      ["shield", "shield"],
      ["book", "book-open"],
      ["map", "map"],
    ] as const;

    for (const [name, expectedIcon] of requiredIcons) {
      const html = String(<Icon name={name} />);

      expect(html).toContain(`data-icon="${expectedIcon}"`);
    }
  });

  test("falls back to the circle icon for unknown names", () => {
    const html = String(<Icon name="missing" />);

    expect(html).toContain('data-icon="circle"');
  });
});
