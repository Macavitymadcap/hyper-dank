import { describe, expect, test } from "bun:test";
import type { WalkWithStats } from "../../../db";
import { Home } from "./Home";

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

describe("Home", () => {
  test("renders semantic sections and page-level HTMX anchors", () => {
    const html = render(<Home walks={sampleWalks} stats={{ avgSpeed: 3.8, medianPace: 15.8, count: 1 }} />);

    expect(html).toContain("<main class=\"container\">");
    expect(html).toContain("<header class=\"app-header\">");
    expect(html).toContain("id=\"theme-toggle\"");
    expect(html).toContain("role=\"switch\"");
    expect(html).toContain("data-theme-toggle=\"\"");
    expect(html).toContain("<section class=\"page-section\" aria-labelledby=\"summary-heading\">");
    expect(html).toContain("<h3 id=\"summary-heading\" class=\"section-title\">Summary</h3>");
    expect(html).toContain("<h3 id=\"entry-heading\" class=\"section-title\">Add walk</h3>");
    expect(html).toContain("<h3 id=\"history-heading\" class=\"section-title\">Walk history</h3>");
    expect(html).toContain("id=\"stats\" hx-get=\"/stats\"");
    expect(html).toContain("id=\"walks-list\"");
  });
});
