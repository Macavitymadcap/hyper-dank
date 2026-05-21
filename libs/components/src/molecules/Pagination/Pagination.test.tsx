import { describe, expect, test } from "bun:test";
import { Pagination } from "./Pagination";

const render = (node: unknown): string => String(node);

describe("Pagination", () => {
  test("renders native page navigation links and current state", () => {
    const html = render(
      <Pagination currentPage={2} totalPages={5} previousHref="/p/1" nextHref="/p/3" />,
    );

    expect(html).toContain('class="pagination"');
    expect(html).toContain('rel="prev"');
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('rel="next"');
  });
});
