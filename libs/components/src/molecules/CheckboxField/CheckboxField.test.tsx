import { describe, expect, test } from "bun:test";
import { CheckboxField } from "./CheckboxField";

const render = (node: unknown): string => String(node);

describe("CheckboxField", () => {
  test("renders a labelled native checkbox", () => {
    const html = render(
      <CheckboxField id="published" label="Published" helpText="Show this publicly." checked />,
    );

    expect(html).toContain('class="choice-field checkbox-field"');
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('checked=""');
    expect(html).toContain("<span>Published</span>");
    expect(html).toContain('aria-describedby="published-help"');
  });
});
