import { describe, expect, test } from "bun:test";
import { Stats } from "./Stats";

const render = (node: unknown): string => String(node);

describe("Stats", () => {
  test("renders both summary stats", () => {
    const html = render(<Stats avgSpeed={4.321} medianPace={15.82} />);

    expect(html).toContain("<div class=\"stats\">");
    expect(html).toContain("Avg mph");
    expect(html).toContain("Med min/mi");
    expect(html).toContain("<output class=\"labelled-output-value\">4.3</output>");
    expect(html).toContain("<output class=\"labelled-output-value\">15.8</output>");
  });
});
