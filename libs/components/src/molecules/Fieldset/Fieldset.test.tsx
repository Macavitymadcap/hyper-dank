import { describe, expect, test } from "bun:test";
import { Fieldset } from "./Fieldset";

const render = (node: unknown): string => String(node);

describe("Fieldset", () => {
  test("renders grouped controls with a legend", () => {
    const html = render(
      <Fieldset legend="Filters" description="Choose one or more options.">
        <input name="active" />
      </Fieldset>,
    );

    expect(html).toContain('<fieldset class="fieldset">');
    expect(html).toContain("<legend>Filters</legend>");
    expect(html).toContain('class="fieldset-description"');
    expect(html).toContain('<input name="active"/>');
  });
});
