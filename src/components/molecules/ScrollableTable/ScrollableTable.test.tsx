import { describe, expect, test } from "bun:test";
import { ScrollableTable } from "./ScrollableTable";

const render = (node: unknown): string => String(node);

describe("ScrollableTable", () => {
  test("renders a reusable scrollable table shell", () => {
    const html = render(
      <ScrollableTable
        className="example-table"
        columns={[
          { key: "name", header: "Name" },
          { key: "actions", header: "Actions", isAction: true },
        ]}
        columnsTemplate="1fr auto"
        isScrollable
        minBodyRows={2}
        mobileColumnsTemplate="minmax(0, 1fr) auto"
        rowClassName="example-row"
      >
        <tr className="scrollable-table-row example-row">
          <td>Ada</td>
          <td data-action-column="true">Clear</td>
        </tr>
      </ScrollableTable>
    );

    expect(html).toContain("<div class=\"scrollable-table-container\" data-scrollable=\"true\"");
    expect(html).toContain("--scrollable-table-columns: 1fr auto");
    expect(html).toContain("--scrollable-table-mobile-columns: minmax(0, 1fr) auto");
    expect(html).toContain("--scrollable-table-min-body-rows: 2");
    expect(html).toContain("<table class=\"scrollable-table example-table\">");
    expect(html).toContain("<tr class=\"scrollable-table-row example-row\">");
    expect(html).toContain("<th scope=\"col\">Name</th>");
    expect(html).toContain("data-action-column=\"true\" scope=\"col\">Actions</th>");
    expect(html).toContain("<tbody><tr class=\"scrollable-table-row example-row\">");
    expect(html).toContain("<tr class=\"scrollable-table-row example-row scrollable-table-filler-row\" aria-hidden=\"true\">");
  });
});
