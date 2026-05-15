import { describe, expect, test } from "bun:test";
import { Home, StatsSection, WalkForm, WalksList } from "./index";
import type { WalkWithStats } from "../db";

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

describe("components", () => {
  test("renders the full page with semantic sections and shared styles", () => {
    const html = String(<Home walks={sampleWalks} stats={{ avgSpeed: 3.8, medianPace: 15.8, count: 1 }} />);

    expect(html).toContain("<main class=\"container\">");
    expect(html).toContain("<h3 id=\"summary-heading\" class=\"section-title\">Summary</h3>");
    expect(html).toContain("<h3 id=\"entry-heading\" class=\"section-title\">Add walk</h3>");
    expect(html).toContain("<h3 id=\"history-heading\" class=\"section-title\">Walk history</h3>");
    expect(html).toContain(".app-header");
    expect(html).toContain("position: sticky");
  });

  test("renders the add-walk form with HTMX attributes", () => {
    const html = String(<WalkForm />);

    expect(html).toContain("hx-post=\"/walks\"");
    expect(html).toContain("hx-target=\"#walks-list\"");
    expect(html).toContain("name=\"miles\"");
    expect(html).toContain("name=\"minutes\"");
    expect(html).toContain("name=\"seconds\"");
  });

  test("renders stats with formatted values", () => {
    const html = String(<StatsSection avgSpeed={4.321} medianPace={15.82} />);

    expect(html).toContain("<output class=\"stat-label\">Avg mph</output>");
    expect(html).toContain("<output class=\"stat-value\">4.3</output>");
    expect(html).toContain("<output class=\"stat-value\">15.8</output>");
  });

  test("renders walk table and empty states", () => {
    const list = String(<WalksList walks={sampleWalks} />);
    const empty = String(<WalksList walks={[]} />);

    expect(list).toContain("<thead>");
    expect(list).toContain("hx-delete=\"/walks/1\"");
    expect(list).toContain("<td class=\"walk-value\">15.8</td>");
    expect(empty).toContain("No walks recorded yet.");
  });
});
