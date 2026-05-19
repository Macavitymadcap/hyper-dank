import { describe, expect, test } from "bun:test";
import { StatusSummary } from "./StatusSummary";

const render = (node: unknown): string => String(node);

describe("StatusSummary", () => {
  test("renders status rows as a definition list", () => {
    const html = render(
      <StatusSummary items={[{ label: "Build", tone: "success", value: "Passed" }]} />,
    );

    expect(html).toContain('class="status-summary"');
    expect(html).toContain("<dl>");
    expect(html).toContain('data-tone="success"');
  });
});
