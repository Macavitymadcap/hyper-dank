import { describe, expect, test } from "bun:test";
import { renderToString } from "hono/jsx/dom/server";
import { RangeField } from "./RangeField";

describe("RangeField", () => {
  test("renders a labelled native range input with app-owned value text", () => {
    const html = renderToString(
      <RangeField
        id="confidence"
        label="Confidence"
        helpText="The app owns value formatting."
        min={0}
        max={100}
        step={5}
        value={75}
        valueLabel="75%"
      />,
    );

    expect(html).toContain(
      '<label class="form-field range-field" data-density="default" for="confidence">',
    );
    expect(html).toContain('type="range"');
    expect(html).toContain('min="0"');
    expect(html).toContain('max="100"');
    expect(html).toContain('step="5"');
    expect(html).toContain('value="75"');
    expect(html).toContain('aria-describedby="confidence-help"');
    expect(html).toContain('<span class="range-field-value">75%</span>');
  });

  test("connects error text and disabled compact state", () => {
    const html = renderToString(
      <RangeField
        id="priority"
        label="Priority"
        error="Choose a priority."
        disabled
        density="compact"
      />,
    );

    expect(html).toContain('data-density="compact"');
    expect(html).toContain('disabled=""');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('aria-describedby="priority-error"');
    expect(html).toContain('role="alert"');
  });
});
