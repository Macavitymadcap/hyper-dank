import { describe, expect, test } from "bun:test";
import { renderToString } from "hono/jsx/dom/server";
import { DateField } from "./DateField";

describe("DateField", () => {
  test("renders a labelled native date input", () => {
    const html = renderToString(
      <DateField
        id="publish-date"
        label="Publish date"
        helpText="The app owns date-range validation."
        min="2026-01-01"
        max="2026-12-31"
        required
        value="2026-05-27"
      />,
    );

    expect(html).toContain(
      '<label class="form-field date-field" data-density="default" for="publish-date">',
    );
    expect(html).toContain('type="date"');
    expect(html).toContain('min="2026-01-01"');
    expect(html).toContain('max="2026-12-31"');
    expect(html).toContain('value="2026-05-27"');
    expect(html).toContain('required=""');
    expect(html).toContain('aria-describedby="publish-date-help"');
  });

  test("connects error text and disabled compact state", () => {
    const html = renderToString(
      <DateField
        id="start-date"
        label="Start date"
        error="Choose a start date."
        disabled
        density="compact"
      />,
    );

    expect(html).toContain('data-density="compact"');
    expect(html).toContain('disabled=""');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('aria-describedby="start-date-error"');
    expect(html).toContain('role="alert"');
  });
});
