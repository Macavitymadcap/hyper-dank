import { describe, expect, test } from "bun:test";
import type { WalkWithStats } from "../../../db";
import { WalksTable } from "./WalksTable";

const render = (node: unknown): string => String(node);

const sampleWalk: WalkWithStats = {
  id: 1,
  miles: 1.2,
  minutes: 18,
  seconds: 55,
  created_at: "2026-05-15 10:00:00",
  speed: 3.8,
  pace: 15.8,
};

const sampleWalks: WalkWithStats[] = [sampleWalk];

const manyWalks: WalkWithStats[] = [
  sampleWalk,
  { ...sampleWalk, id: 2 },
  { ...sampleWalk, id: 3 },
  { ...sampleWalk, id: 4 },
];

describe("WalksTable", () => {
  test("renders a table with a scrollable body contract", () => {
    const html = render(<WalksTable walks={sampleWalks} />);

    expect(html).toContain("<div class=\"walks-history\">");
    expect(html).toContain("<h3 id=\"history-heading\" class=\"section-title\">Walk history</h3>");
    expect(html).toContain("<span class=\"chip history-count\">1 walk</span>");
    expect(html).toContain("<div class=\"scrollable-table-container\"");
    expect(html).toContain("--scrollable-table-columns:");
    expect(html).toContain("--scrollable-table-mobile-columns:");
    expect(html).toContain("<table class=\"scrollable-table walks-table\">");
    expect(html).toContain("<thead>");
    expect(html).toContain("<tbody>");
    expect(html).toContain("scope=\"col\">Date time</th>");
    expect(html).toContain("<tr class=\"scrollable-table-row walks-row\">");
    expect(html).toContain("class=\"button clear-walks-btn\"");
    expect(html).toContain("data-variant=\"outline\"");
    expect(html).toContain("hx-delete=\"/walks\"");
    expect(html).toContain("Clear all");
    expect(html).toContain("hx-delete=\"/walks/1\"");
    expect(html).toContain(">Clear</button>");
    expect(html).not.toContain("data-scrollable=\"true\"");
  });

  test("marks tables with enough rows as scrollable", () => {
    const html = render(<WalksTable walks={manyWalks} />);

    expect(html).toContain("<span class=\"chip history-count\">4 walks</span>");
    expect(html).toContain("data-scrollable=\"true\"");
  });

  test("renders an empty state", () => {
    const html = render(<WalksTable walks={[]} />);

    expect(html).toContain("<span class=\"chip history-count\">0 walks</span>");
    expect(html).toContain("No walks recorded yet.");
  });
});
