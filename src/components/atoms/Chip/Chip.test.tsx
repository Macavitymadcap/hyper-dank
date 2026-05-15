import { describe, expect, test } from "bun:test";
import { Chip } from "./Chip";

const render = (node: unknown): string => String(node);

describe("Chip", () => {
  test("renders compact status text", () => {
    const html = render(<Chip className="history-count">2 walks</Chip>);

    expect(html).toBe("<span class=\"chip history-count\">2 walks</span>");
  });
});
