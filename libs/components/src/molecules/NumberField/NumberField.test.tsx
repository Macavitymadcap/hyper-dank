import { describe, expect, test } from "bun:test";
import { renderToString } from "hono/jsx/dom/server";
import { NumberField } from "./NumberField";

describe("NumberField", () => {
  test("renders a labelled native number input with stepper contracts", () => {
    const html = renderToString(
      <NumberField
        id="servings"
        label="Servings"
        helpText="Use whole servings."
        min={1}
        max={12}
        step={1}
        required
        value={4}
      />,
    );

    expect(html).toContain(
      '<label class="form-field number-field" data-density="default" for="servings">',
    );
    expect(html).toContain('type="number"');
    expect(html).toContain('name="servings"');
    expect(html).toContain('min="1"');
    expect(html).toContain('max="12"');
    expect(html).toContain('step="1"');
    expect(html).toContain('value="4"');
    expect(html).toContain('required=""');
    expect(html).toContain('aria-describedby="servings-help"');
  });

  test("connects error text and disabled compact state", () => {
    const html = renderToString(
      <NumberField
        id="quantity"
        label="Quantity"
        error="Enter a quantity."
        disabled
        density="compact"
      />,
    );

    expect(html).toContain('data-density="compact"');
    expect(html).toContain('disabled=""');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('aria-describedby="quantity-error"');
    expect(html).toContain('role="alert"');
  });
});
