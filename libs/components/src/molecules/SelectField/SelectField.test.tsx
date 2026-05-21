import { describe, expect, test } from "bun:test";
import { SelectField } from "./SelectField";

const render = (node: unknown): string => String(node);

describe("SelectField", () => {
  test("renders labelled native select options", () => {
    const html = render(
      <SelectField
        id="status"
        label="Status"
        value="draft"
        options={[
          { label: "Draft", value: "draft" },
          { label: "Published", value: "published" },
        ]}
      />,
    );

    expect(html).toContain('<label class="form-field select-field" for="status">');
    expect(html).toContain('<select id="status" name="status">');
    expect(html).toContain('<option value="draft" selected="">Draft</option>');
    expect(html).toContain('<option value="published">Published</option>');
  });
});
