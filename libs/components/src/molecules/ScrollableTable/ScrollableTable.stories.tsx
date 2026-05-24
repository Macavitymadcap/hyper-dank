import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
import { Badge } from "../../atoms/Badge";
import { Button } from "../../atoms/Button";
import { renderStory } from "../../stories/render";
import { PopoverMenu } from "../PopoverMenu";
import { TableFilterSummary } from "../TableFilterSummary";
import { ScrollableTable } from "./ScrollableTable";

interface ScrollableTableStoryArgs {
  isScrollable: boolean;
  rowCount: number;
}

const meta = {
  argTypes: {
    isScrollable: { control: "boolean" },
    rowCount: { control: { max: 8, min: 1, step: 1, type: "number" } },
  },
  args: {
    isScrollable: false,
    rowCount: 3,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Generic sticky-header table shell with responsive column sizing. Inputs are column metadata, row children, scroll counts, and optional sizing properties; output remains a semantic table with scoped headers and a keyboard-focusable scroll body when scrolling is enabled.",
      },
    },
    layout: "fullscreen",
  },
  render: (args) =>
    renderStory(
      <ScrollableTable
        className="storybook-table-preview"
        columns={[
          { key: "name", header: "Name" },
          { key: "value", header: "Value" },
        ]}
        columnsTemplate="1fr 1fr"
        isScrollable={args.isScrollable}
        rowClassName="walks-row"
        scrollBodyRows={3}
      >
        {Array.from({ length: args.rowCount }, (_, index) => (
          <tr class="scrollable-table-row walks-row">
            <td>Metric {index + 1}</td>
            <td>{(index + 1) * 10}</td>
          </tr>
        ))}
      </ScrollableTable>,
      { size: "full" },
    ),
  tags: ["autodocs"],
  title: "Components/Shared/Molecules/ScrollableTable",
} satisfies Meta<ScrollableTableStoryArgs>;

export default meta;
type Story = StoryObj<ScrollableTableStoryArgs>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
  },
};

export const Scrollable: Story = {
  args: {
    isScrollable: true,
    rowCount: 6,
  },
};

export const DenseDashboardTable: Story = {
  render: () =>
    renderStory(
      <section class="storybook-doc__section" aria-labelledby="dashboard-table-heading">
        <h2 id="dashboard-table-heading">Data-heavy dashboard table</h2>
        <ScrollableTable
          caption="Content queue"
          className="storybook-table-preview storybook-dashboard-table"
          columns={[
            {
              key: "title",
              header: <a href="/content?sort=title">Title</a>,
              sortDirection: "ascending",
              width: "minmax(12rem, 2fr)",
              mobileWidth: "minmax(6.5rem, 1.35fr)",
            },
            {
              key: "status",
              header: <a href="/content?sort=status">Status</a>,
              width: "minmax(7rem, 1fr)",
              mobileWidth: "minmax(4.25rem, 0.8fr)",
            },
            {
              key: "updated",
              header: <a href="/content?sort=updated">Updated</a>,
              sortDirection: "descending",
              width: "minmax(7rem, 1fr)",
              mobileWidth: "minmax(3.75rem, 0.7fr)",
            },
            {
              key: "actions",
              header: <abbr title="Actions">Act</abbr>,
              isAction: true,
              width: "5.5rem",
              mobileWidth: "3.25rem",
            },
          ]}
          isScrollable
          mobileScrollBodyRows={4}
          pagination={<nav aria-label="Content pages">Page 1 of 4</nav>}
          rowClassName="storybook-dashboard-row"
          scrollBodyRows={5}
          summary={
            <div class="storybook-dashboard-tools">
              <TableFilterSummary
                activeFilters={[
                  { label: "Status", value: "Published" },
                  { label: "Owner", value: "Platform" },
                ]}
                resetHref="/content"
                resultCount={18}
                title="Active view"
              />
              <div class="storybook-dashboard-toolbar" role="toolbar" aria-label="Table tools">
                <Button type="button" variant="ghost">
                  Columns
                </Button>
                <Button type="button" variant="outline">
                  Save view
                </Button>
              </div>
            </div>
          }
        >
          {[
            ["API reference", "Published", "Today"],
            ["Component recipes", "Draft", "Yesterday"],
            ["Accessibility route", "Published", "Fri"],
            ["Release notes", "Review", "Thu"],
            ["Dashboard guide", "Published", "Wed"],
            ["Search plan", "Draft", "Tue"],
          ].map(([title, status, updated], index) => (
            <tr class="scrollable-table-row storybook-dashboard-row">
              <td>{title}</td>
              <td>
                <Badge tone={status === "Draft" ? "warning" : "accent"}>{status}</Badge>
              </td>
              <td>{updated}</td>
              <td data-action-column="true">
                <PopoverMenu
                  id={`content-row-actions-${index}`}
                  label={`Open actions for ${title}`}
                  items={[
                    { href: `/content/${index}`, label: "Open" },
                    { href: `/content/${index}/edit`, label: "Edit" },
                    { href: `/content/${index}/archive`, label: "Archive", method: "post" },
                  ]}
                />
              </td>
            </tr>
          ))}
        </ScrollableTable>
      </section>,
      { size: "full" },
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("table", { name: "Content queue" })).toBeInTheDocument();
    await expect(canvas.getByRole("columnheader", { name: "Title" })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );
    await expect(canvas.getByRole("status")).toHaveTextContent("18 results");
    await expect(
      canvas.getByRole("button", { name: "Open actions for API reference" }),
    ).toBeInTheDocument();
  },
};
