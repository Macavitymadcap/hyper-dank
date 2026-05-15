import { describe, expect, test } from "bun:test";
import type { WalkWithStats } from "../../../db";
import { WalksTable } from "./WalksTable";

const render = (node: unknown): string => String(node);

const sampleWalks: WalkWithStats[] = [
  {
    id: 1,
    miles: 1.2,
    minutes: 18,
    seconds: 55,
    created_at: "2026-05-15 10:00:00",
    speed: 3.8,
    pace: 15.8,
  },
];

describe("WalksTable", () => {
  test("renders a table with a scrollable body contract", () => {
    const html = render(<WalksTable walks={sampleWalks} />);

    expect(html).toContain("<div class=\"table-container\">");
    expect(html).toContain("<table class=\"walks-table\">");
    expect(html).toContain("<thead>");
    expect(html).toContain("<tbody>");
    expect(html).toContain("<tr class=\"walks-row\">");
    expect(html).toContain("class=\"clear-walks-btn\"");
    expect(html).toContain("hx-delete=\"/walks\"");
    expect(html).toContain("Clear all");
    expect(html).toContain("hx-delete=\"/walks/1\"");
  });

  test("renders an empty state", () => {
    expect(render(<WalksTable walks={[]} />)).toContain("No walks recorded yet.");
  });
});
