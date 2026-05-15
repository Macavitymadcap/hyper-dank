import { describe, expect, test } from "bun:test";
import { LabelledOutput } from "./LabelledOutput";

const render = (node: unknown): string => String(node);

describe("LabelledOutput", () => {
  test("renders formatted output values", () => {
    const html = render(<LabelledOutput label="Avg mph" value={4.321} />);

    expect(html).toContain("<div class=\"labelled-output\">");
    expect(html).toContain("<output class=\"labelled-output-label\">Avg mph</output>");
    expect(html).toContain("<output class=\"labelled-output-value\">4.3</output>");
  });

  test("renders placeholders for empty values", () => {
    expect(render(<LabelledOutput label="Avg mph" value={0} />)).toContain("<output class=\"labelled-output-value\">--</output>");
  });
});
