import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
import { renderStory } from "../../stories/render";
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
        component: "Generic sticky-header table shell with responsive column sizing.",
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
  title: "Components/Molecules/ScrollableTable",
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
