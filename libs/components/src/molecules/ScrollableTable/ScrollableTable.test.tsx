import { describe, expect, test } from "bun:test";
import { ScrollableTable } from "./ScrollableTable";

const render = (node: unknown): string => String(node);

describe("ScrollableTable", () => {
  test("renders a reusable scrollable table shell", () => {
    const html = render(
      <ScrollableTable
        caption="Example metrics"
        className="example-table"
        columns={[
          {
            key: "name",
            header: "Name",
            sortDirection: "ascending",
            width: "minmax(12rem, 2fr)",
            mobileWidth: "minmax(0, 1fr)",
          },
          { key: "actions", header: "Actions", isAction: true, width: "5rem", mobileWidth: "4rem" },
        ]}
        isScrollable
        mobileScrollBodyRows={2}
        rowClassName="example-row"
        scrollBodyRows={3}
        summary={<p>Filtered by owner</p>}
      >
        <tr className="scrollable-table-row example-row">
          <td>Ada</td>
          <td data-action-column="true">Clear</td>
        </tr>
      </ScrollableTable>,
    );

    expect(html).toContain('<div class="scrollable-table-container" data-scrollable="true"');
    expect(html).toContain("--scrollable-table-columns: minmax(12rem, 2fr) 5rem");
    expect(html).toContain("--scrollable-table-mobile-columns: minmax(0, 1fr) 4rem");
    expect(html).toContain("--scrollable-table-scroll-body-rows: 3");
    expect(html).toContain("--scrollable-table-mobile-scroll-body-rows: 2");
    expect(html).toContain('class="scrollable-table-summary"');
    expect(html).toContain('<table class="scrollable-table example-table">');
    expect(html).toContain("<caption>Example metrics</caption>");
    expect(html).toContain('<tr class="scrollable-table-row example-row">');
    expect(html).toContain('<th aria-sort="ascending" scope="col">Name</th>');
    expect(html).toContain('data-action-column="true" scope="col">Actions</th>');
    expect(html).toContain('<tbody tabindex="0"><tr class="scrollable-table-row example-row">');
    expect(html).not.toContain("scrollable-table-filler-row");
  });

  test("supports loading, empty, and pagination composition", () => {
    const html = render(
      <ScrollableTable
        columns={[{ key: "name", header: "Name" }]}
        loading={<span>Loading rows</span>}
        emptyState={<p>No rows</p>}
        pagination={<nav aria-label="Pages">Pages</nav>}
      />,
    );

    expect(html).toContain('class="scrollable-table-loading"');
    expect(html).toContain("No rows");
    expect(html).toContain('class="scrollable-table-pagination"');
  });
});
