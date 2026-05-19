import { describe, expect, test } from "bun:test";
import { Button } from "../../atoms/Button";
import { ButtonGroup } from "./ButtonGroup";

const render = (node: unknown): string => String(node);

describe("ButtonGroup", () => {
  test("groups related actions with an accessible label", () => {
    const html = render(
      <ButtonGroup ariaLabel="Record actions">
        <Button>Save</Button>
        <Button variant="ghost">Cancel</Button>
      </ButtonGroup>,
    );

    expect(html).toContain("<fieldset");
    expect(html).toContain("<legend>Record actions</legend>");
    expect(html).toContain('class="button-group"');
    expect(html).toContain(">Save</button>");
    expect(html).toContain(">Cancel</button>");
  });
});
