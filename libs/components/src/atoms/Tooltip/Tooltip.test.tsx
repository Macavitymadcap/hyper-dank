import { describe, expect, test } from "bun:test";
import { Tooltip } from "./Tooltip";

const render = (node: unknown): string => String(node);

describe("Tooltip", () => {
  test("renders a focusable trigger with described tooltip content", () => {
    const html = render(
      <Tooltip id="save-help" content="Persists the current draft.">
        Save
      </Tooltip>,
    );

    expect(html).toContain('class="tooltip"');
    expect(html).toContain('data-side="top"');
    expect(html).toContain('type="button"');
    expect(html).toContain('aria-describedby="save-help"');
    expect(html).toContain('id="save-help" role="tooltip"');
    expect(html).toContain("Persists the current draft.");
  });
});
