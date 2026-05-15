import { describe, expect, test } from "bun:test";
import type { WalkWithStats } from "../db";
import { Button } from "./atoms/Button";
import { Switch } from "./atoms/Switch";
import { WalksCell } from "./atoms/WalksCell";
import { InputGroup } from "./molecules/InputGroup";
import { Stat } from "./molecules/Stat";
import { WalksRow } from "./molecules/WalksRow";
import { Stats as StatsSection } from "./organisms/Stats";
import { WalkForm } from "./organisms/WalkForm";
import { WalksTable } from "./organisms/WalksTable";
import { Home } from "./pages/Home";
import { Layout } from "./templates/Layout";

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

describe("atoms", () => {
  test("Button renders standard and HTMX attributes", () => {
    const html = render(
      <Button type="button" className="delete-btn" hxDelete="/walks/1" hxTarget="#walks-list">
        Del
      </Button>
    );

    expect(html).toContain("<button");
    expect(html).toContain("class=\"button delete-btn\"");
    expect(html).toContain("type=\"button\"");
    expect(html).toContain("hx-delete=\"/walks/1\"");
    expect(html).toContain("hx-target=\"#walks-list\"");
    expect(html).toContain(">Del</button>");
  });

  test("WalksCell renders a table cell", () => {
    expect(render(<WalksCell value="15.8" />)).toBe("<td class=\"walks-cell\">15.8</td>");
  });

  test("Switch renders a checkbox-backed icon toggle", () => {
    const html = render(<Switch id="theme-toggle" label="Color mode" dataThemeToggle />);

    expect(html).toContain("<label class=\"switch\" for=\"theme-toggle\">");
    expect(html).toContain("<input");
    expect(html).toContain("type=\"checkbox\"");
    expect(html).toContain("role=\"switch\"");
    expect(html).toContain("aria-label=\"Color mode\"");
    expect(html).toContain("data-theme-toggle=\"\"");
    expect(html).toContain("light_mode");
    expect(html).toContain("dark_mode");
    expect(html).toContain("material-symbols-outlined");
  });

  test("Switch can render checked state for dark mode", () => {
    const html = render(<Switch id="theme-toggle" label="Color mode" checked dataThemeToggle />);

    expect(html).toContain("checked=\"\"");
    expect(html).toContain("aria-checked=\"true\"");
  });
});

describe("molecules", () => {
  test("InputGroup renders a connected label and input", () => {
    const html = render(
      <InputGroup type="number" name="miles" label="Mi" step={0.1} min={0} max={100} placeholder="0.0" />
    );

    expect(html).toContain("<label class=\"input-label\" for=\"miles\">Mi</label>");
    expect(html).toContain("type=\"number\"");
    expect(html).toContain("id=\"miles\"");
    expect(html).toContain("name=\"miles\"");
    expect(html).toContain("step=\"0.1\"");
    expect(html).toContain("required=\"\"");
  });

  test("Stat renders formatted output values", () => {
    const html = render(<Stat label="Avg mph" value={4.321} />);

    expect(html).toContain("<output class=\"stat-label\">Avg mph</output>");
    expect(html).toContain("<output class=\"stat-value\">4.3</output>");
  });

  test("Stat renders placeholders for empty values", () => {
    expect(render(<Stat label="Avg mph" value={0} />)).toContain("<output class=\"stat-value\">--</output>");
  });

  test("WalksRow renders row cells and delete behavior", () => {
    const html = render(
      <WalksRow id={1} miles={1.2} minutes={18} seconds={55} speed={3.8} pace={15.8} />
    );

    expect(html).toContain("<tr class=\"walks-row\">");
    expect(html).toContain("<td class=\"walks-cell\">1.2</td>");
    expect(html).toContain("<td class=\"walks-cell\">15.8</td>");
    expect(html).toContain("hx-delete=\"/walks/1\"");
    expect(html).toContain("hx-target=\"#walks-list\"");
  });
});

describe("organisms", () => {
  test("StatsSection renders both summary stats", () => {
    const html = render(<StatsSection avgSpeed={4.321} medianPace={15.82} />);

    expect(html).toContain("<div class=\"stats\">");
    expect(html).toContain("Avg mph");
    expect(html).toContain("Med min/mi");
    expect(html).toContain("<output class=\"stat-value\">4.3</output>");
    expect(html).toContain("<output class=\"stat-value\">15.8</output>");
  });

  test("WalkForm renders the HTMX form contract", () => {
    const html = render(<WalkForm />);

    expect(html).toContain("hx-post=\"/walks\"");
    expect(html).toContain("hx-target=\"#walks-list\"");
    expect(html).toContain("hx-swap=\"innerHTML\"");
    expect(html).toContain("htmx.trigger(&#39;#stats&#39;, &#39;refresh&#39;)");
    expect(html).toContain("name=\"miles\"");
    expect(html).toContain("name=\"minutes\"");
    expect(html).toContain("name=\"seconds\"");
  });

  test("WalksTable renders a table with a scrollable body contract", () => {
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

  test("WalksTable renders an empty state", () => {
    expect(render(<WalksTable walks={[]} />)).toContain("No walks recorded yet.");
  });
});

describe("templates and pages", () => {
  test("Layout renders document chrome and shared CSS", () => {
    const html = render(
      <Layout>
        <main>Body</main>
      </Layout>
    );

    expect(html).toContain("<html lang=\"en\">");
    expect(html).toContain("<title>Walking Pace Tracker</title>");
    expect(html).toContain("pace-calculator-theme");
    expect(html).toContain("fonts.googleapis.com/css2?family=Material+Symbols+Outlined");
    expect(html).toContain("<style>");
    expect(html).toContain(":root[data-theme=\"dark\"]");
    expect(html).toContain("--table-header-bg: var(--gray-1)");
    expect(html).toContain("--table-header-bg: var(--gray-10)");
    expect(html).toContain(".walks-table tbody");
    expect(html).toContain("<main>Body</main>");
  });

  test("Home renders semantic sections and page-level HTMX anchors", () => {
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
