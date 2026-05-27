import { describe, expect, test } from "bun:test";
import { renderToString } from "hono/jsx/dom/server";
import { FileField } from "./FileField";

describe("FileField", () => {
  test("renders a labelled native file input without app-owned upload handling", () => {
    const html = renderToString(
      <FileField
        id="attachment"
        label="Attachment"
        helpText="Upload handling stays in the route."
        accept=".csv,text/csv"
        multiple
        required
      />,
    );

    expect(html).toContain(
      '<label class="form-field file-field" data-density="default" for="attachment">',
    );
    expect(html).toContain('type="file"');
    expect(html).toContain('accept=".csv,text/csv"');
    expect(html).toContain('multiple=""');
    expect(html).toContain('required=""');
    expect(html).toContain('aria-describedby="attachment-help"');
    expect(html).not.toContain("value=");
  });

  test("connects error text and disabled compact state", () => {
    const html = renderToString(
      <FileField id="avatar" label="Avatar" error="Choose an image." disabled density="compact" />,
    );

    expect(html).toContain('data-density="compact"');
    expect(html).toContain('disabled=""');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('aria-describedby="avatar-error"');
    expect(html).toContain('role="alert"');
  });
});
