import { describe, expect, test } from "bun:test";
import { TableCell } from "./TableCell";

const render = (node: unknown): string => String(node);

describe("TableCell", () => {
  test("renders a table cell", () => {
    expect(render(<TableCell className="walks-cell" value="15.8" />)).toBe(
      '<td class="table-cell walks-cell">15.8</td>',
    );
  });
});
