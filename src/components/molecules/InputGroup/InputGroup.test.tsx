import { describe, expect, test } from "bun:test";
import { InputGroup } from "./InputGroup";

const render = (node: unknown): string => String(node);

describe("InputGroup", () => {
  test("renders a connected label and input", () => {
    const html = render(
      <InputGroup type="number" name="miles" label="Mi" step={0.1} min={0} max={100} placeholder="0.0" />
    );

    expect(html).toContain("<label class=\"input-label\" for=\"miles\">Mi</label>");
    expect(html).toContain("type=\"number\"");
    expect(html).toContain("id=\"miles\"");
    expect(html).toContain("name=\"miles\"");
    expect(html).toContain("step=\"0.1\"");
    expect(html).toContain("required=\"\"");
  });
});
