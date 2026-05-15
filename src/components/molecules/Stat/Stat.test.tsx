import { describe, expect, test } from "bun:test";
import { Stat } from "./Stat";

const render = (node: unknown): string => String(node);

describe("Stat", () => {
  test("renders formatted output values", () => {
    const html = render(<Stat label="Avg mph" value={4.321} />);

    expect(html).toContain("<output class=\"stat-label\">Avg mph</output>");
    expect(html).toContain("<output class=\"stat-value\">4.3</output>");
  });

  test("renders placeholders for empty values", () => {
    expect(render(<Stat label="Avg mph" value={0} />)).toContain("<output class=\"stat-value\">--</output>");
  });
});
