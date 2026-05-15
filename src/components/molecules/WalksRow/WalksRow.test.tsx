import { describe, expect, test } from "bun:test";
import { WalksRow } from "./WalksRow";

const render = (node: unknown): string => String(node);

describe("WalksRow", () => {
  test("renders row cells and delete behavior", () => {
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
