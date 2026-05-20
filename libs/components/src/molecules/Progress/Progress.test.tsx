import { describe, expect, test } from "bun:test";
import { Progress } from "./Progress";

const render = (node: unknown): string => String(node);

describe("Progress", () => {
  test("renders native progress with a label", () => {
    const html = render(<Progress label="Import" value={40} />);

    expect(html).toContain('class="progress"');
    expect(html).toContain("<progress");
    expect(html).toContain('value="40"');
  });
});
