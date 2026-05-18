import { describe, expect, test } from "bun:test";
import { ScrollableTable } from "./ScrollableTable";

const render = (node: unknown): string => String(node);

describe("ScrollableTable", () => {
  test("renders a reusable scrollable table shell", () => {
    const html = render(
      <ScrollableTable
        className="example-table"
        columns={[
          {
            key: "name",
            header: "Name",
            width: "minmax(12rem, 2fr)",
            mobileWidth: "minmax(0, 1fr)",
          },
          { key: "actions", header: "Actions", isAction: true, width: "5rem", mobileWidth: "4rem" },
        ]}
        isScrollable
        mobileScrollBodyRows={2}
        rowClassName="example-row"
        scrollBodyRows={3}
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
    expect(html).toContain('<table class="scrollable-table example-table">');
    expect(html).toContain('<tr class="scrollable-table-row example-row">');
    expect(html).toContain('<th scope="col">Name</th>');
    expect(html).toContain('data-action-column="true" scope="col">Actions</th>');
    expect(html).toContain('<tbody tabindex="0"><tr class="scrollable-table-row example-row">');
    expect(html).not.toContain("scrollable-table-filler-row");
  });
});
