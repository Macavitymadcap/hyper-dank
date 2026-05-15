import { describe, expect, test } from "bun:test";
import { WalksCell } from "./WalksCell";

const render = (node: unknown): string => String(node);

describe("WalksCell", () => {
  test("renders a table cell", () => {
    expect(render(<WalksCell value="15.8" />)).toBe('<td class="walks-cell">15.8</td>');
  });
});
