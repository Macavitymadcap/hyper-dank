import { describe, expect, test } from "bun:test";
import { renderToString } from "hono/jsx/dom/server";
import { FormField } from "./FormField";

describe("FormField", () => {
  test("connects label text to the native form control", () => {
    const html = renderToString(
      <FormField htmlFor="email" label="Email">
        <input id="email" name="email" />
      </FormField>,
    );

    expect(html).toContain('<label class="form-field" for="email">');
    expect(html).toContain("<span>Email</span>");
    expect(html).toContain('<input id="email" name="email"/>');
  });

  test("can generate a simple input for consumer forms", () => {
    const html = renderToString(
      <FormField
        id="character-name"
        name="characterName"
        label="Character name"
        autocomplete="name"
        placeholder="Lynott"
        required
      />,
    );

    expect(html).toContain('<label class="form-field" for="character-name">');
    expect(html).toContain("<span>Character name</span>");
    expect(html).toContain('id="character-name"');
    expect(html).toContain('name="characterName"');
    expect(html).toContain('type="text"');
    expect(html).toContain('autocomplete="name"');
    expect(html).toContain('placeholder="Lynott"');
    expect(html).toContain('required=""');
  });
});
