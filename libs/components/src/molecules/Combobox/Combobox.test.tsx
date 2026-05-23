import { describe, expect, test } from "bun:test";
import { Combobox } from "./Combobox";

describe("Combobox", () => {
  test("renders a labelled native datalist fallback", () => {
    const html = String(
      <Combobox
        id="assignee"
        label="Assignee"
        value="Ada"
        options={[
          { label: "Ada Lovelace", value: "Ada" },
          { label: "Grace Hopper", value: "Grace" },
        ]}
      />,
    );

    expect(html).toContain('<label class="form-field combobox" for="assignee">');
    expect(html).toContain('role="combobox"');
    expect(html).toContain('aria-controls="assignee-list"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('list="assignee-list"');
    expect(html).toContain('<datalist id="assignee-list">');
    expect(html).toContain('<option value="Ada" label="Ada Lovelace"></option>');
  });

  test("renders help, error, and empty datalist guidance", () => {
    const html = String(
      <Combobox
        id="project"
        label="Project"
        helpText="Type to narrow the app-owned options."
        error="Choose a project"
        options={[]}
      />,
    );

    expect(html).toContain('aria-describedby="project-help project-empty project-error"');
    expect(html).toContain('aria-invalid="true"');
    expect(html).toContain('role="status"');
    expect(html).toContain("No options available.");
    expect(html).toContain('role="alert"');
  });
});
