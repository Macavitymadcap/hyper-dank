import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
import { renderStory } from "../../stories/render";
import { TableCell } from "./TableCell";

interface TableCellStoryArgs {
  value: string;
}

const meta = {
  argTypes: {
    value: { control: "text" },
  },
  args: {
    value: "3.8",
  },
  parameters: {
    docs: {
      description: {
        component: "Table cell primitive used by walk-history rows.",
      },
    },
    layout: "fullscreen",
  },
  render: (args) =>
    renderStory(
      <table class="storybook-table-preview">
        <tbody>
          <tr>
            <TableCell value={args.value} />
          </tr>
        </tbody>
      </table>,
      { size: "full" },
    ),
  tags: ["autodocs"],
  title: "Components/Shared/Atoms/TableCell",
} satisfies Meta<TableCellStoryArgs>;

export default meta;
type Story = StoryObj<TableCellStoryArgs>;

export const Playground: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("cell", { name: args.value })).toBeInTheDocument();
  },
};
