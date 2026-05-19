import { describe, expect, test } from "bun:test";
import { SegmentedControl } from "./SegmentedControl";

const render = (node: unknown): string => String(node);

describe("SegmentedControl", () => {
  test("renders radio-backed mode controls", () => {
    const html = render(
      <SegmentedControl
        legend="View mode"
        name="view"
        value="table"
        options={[
          { label: "Cards", value: "cards" },
          { label: "Table", value: "table" },
        ]}
      />,
    );

    expect(html).toContain('<fieldset class="segmented-control">');
    expect(html).toContain("<legend>View mode</legend>");
    expect(html).toContain('class="segmented-control-options"');
    expect(html).toContain('type="radio"');
    expect(html).toContain('data-selected="true"');
  });
});
