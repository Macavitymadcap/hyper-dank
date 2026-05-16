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
});
