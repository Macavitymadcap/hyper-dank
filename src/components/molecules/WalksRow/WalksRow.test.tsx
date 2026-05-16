import { describe, expect, test } from "bun:test";
import { WalksRow } from "./WalksRow";

const render = (node: unknown): string => String(node);

describe("WalksRow", () => {
  test("renders row cells and clear behavior", () => {
    const html = render(
      <WalksRow
        id={1}
        createdAt="2026-05-15 10:00:00"
        miles={1.2}
        minutes={18}
        seconds={55}
        speed={3.8}
        pace={15.8}
      />,
    );

    expect(html).toContain('<tr class="scrollable-table-row walks-row">');
    expect(html).toContain('<time class="walk-created-at" dateTime="2026-05-15 10:00:00">');
    expect(html).toContain("<span>15 May</span>");
    expect(html).toContain("<span>10:00</span>");
    expect(html).toContain('<td class="walks-cell">1.2</td>');
    expect(html).toContain('<td class="walks-cell">15.8</td>');
    expect(html).toContain('data-size="compact"');
    expect(html).toContain('data-variant="danger"');
    expect(html).toContain('<td data-action-column="true">');
    expect(html).toContain('hx-delete="/walks/1"');
    expect(html).toContain('hx-target="#walks-list"');
    expect(html).toContain('hx-confirm="Clear this walk?"');
    expect(html).toContain(">Clear</button>");
  });

  test("omits action cells when rendered read-only", () => {
    const html = render(
      <WalksRow
        id={1}
        createdAt="2026-05-15 10:00:00"
        miles={1.2}
        minutes={18}
        seconds={55}
        speed={3.8}
        pace={15.8}
        canMutate={false}
      />,
    );

    expect(html).not.toContain('data-action-column="true"');
    expect(html).not.toContain('hx-delete="/walks/1"');
  });
});
