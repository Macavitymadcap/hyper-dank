import { describe, expect, test } from "bun:test";
import { RadioGroup } from "./RadioGroup";

const render = (node: unknown): string => String(node);

describe("RadioGroup", () => {
  test("renders native radio options inside a fieldset", () => {
    const html = render(
      <RadioGroup
        legend="Mode"
        name="mode"
        value="edit"
        options={[
          { label: "View", value: "view" },
          { label: "Edit", value: "edit", helpText: "Allows changes." },
        ]}
      />,
    );

    expect(html).toContain('<fieldset class="radio-group">');
    expect(html).toContain("<legend>Mode</legend>");
    expect(html).toContain('name="mode"');
    expect(html).toContain('value="edit"');
    expect(html).toContain('checked=""');
    expect(html).toContain('aria-describedby="mode-edit-help"');
  });
});
