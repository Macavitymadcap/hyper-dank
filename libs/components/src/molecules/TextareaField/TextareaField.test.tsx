import { describe, expect, test } from "bun:test";
import { TextareaField } from "./TextareaField";

const render = (node: unknown): string => String(node);

describe("TextareaField", () => {
  test("renders labelled textarea with help and error text", () => {
    const html = render(
      <TextareaField
        id="summary"
        label="Summary"
        helpText="Keep it short."
        error="Summary is required."
        required
      />,
    );

    expect(html).toContain('<label class="form-field textarea-field" for="summary">');
    expect(html).toContain("<span>Summary</span>");
    expect(html).toContain('id="summary-help"');
    expect(html).toContain('id="summary-error"');
    expect(html).toContain('aria-describedby="summary-help summary-error"');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('role="alert"');
  });
});
