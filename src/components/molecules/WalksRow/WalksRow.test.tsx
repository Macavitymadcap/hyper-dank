import { describe, expect, test } from "bun:test";
import { WalksRow } from "./WalksRow";

const render = (node: unknown): string => String(node);

describe("WalksRow", () => {
  test("renders row cells and clear behavior", () => {
    const html = render(
      <WalksRow id={1} createdAt="2026-05-15 10:00:00" miles={1.2} minutes={18} seconds={55} speed={3.8} pace={15.8} />
    );

    expect(html).toContain("<tr class=\"walks-row\">");
    expect(html).toContain("<time dateTime=\"2026-05-15 10:00:00\">10:00</time>");
    expect(html).toContain("<td class=\"walks-cell\">1.2</td>");
    expect(html).toContain("<td class=\"walks-cell\">15.8</td>");
    expect(html).toContain("data-size=\"compact\"");
    expect(html).toContain("data-variant=\"danger\"");
    expect(html).toContain("hx-delete=\"/walks/1\"");
    expect(html).toContain("hx-target=\"#walks-list\"");
    expect(html).toContain("hx-confirm=\"Clear this walk?\"");
    expect(html).toContain(">Clear</button>");
  });
});
