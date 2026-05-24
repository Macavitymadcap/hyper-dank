import { describe, expect, test } from "bun:test";
import { TableFilterSummary } from "./TableFilterSummary";

const render = (node: unknown): string => String(node);

describe("TableFilterSummary", () => {
  test("renders active filters as a polite status region", () => {
    const html = render(
      <TableFilterSummary
        activeFilters={[
          { label: "Status", value: "Published" },
          { label: "Owner", value: "Platform" },
        ]}
        resultCount={12}
        resetHref="/content"
        title="Filtered content"
      />,
    );

    expect(html).toContain('class="table-filter-summary"');
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain("12 results");
    expect(html).toContain("<dt>Status</dt>");
    expect(html).toContain("<dd>Published</dd>");
    expect(html).toContain('href="/content"');
  });

  test("renders a no-filter state without reset action", () => {
    const html = render(<TableFilterSummary activeFilters={[]} resultCount={0} />);

    expect(html).toContain("0 results");
    expect(html).toContain("No filters applied");
    expect(html).not.toContain("<a");
  });
});
