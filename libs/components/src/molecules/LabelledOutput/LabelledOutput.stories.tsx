import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
import { renderStory } from "../../stories/render";
import { LabelledOutput } from "./LabelledOutput";

interface LabelledOutputStoryArgs {
  label: string;
  value: number;
}

const meta = {
  argTypes: {
    label: { control: "text" },
    value: { control: { min: 0, step: 0.1, type: "number" } },
  },
  args: {
    label: "Avg mph",
    value: 3.8,
  },
  parameters: {
    docs: {
      description: {
        component: "Label plus output value used by summary statistics.",
      },
    },
    layout: "fullscreen",
  },
  render: (args) =>
    renderStory(<LabelledOutput label={args.label} value={args.value} />, { size: "compact" }),
  tags: ["autodocs"],
  title: "Components/Molecules/LabelledOutput",
} satisfies Meta<LabelledOutputStoryArgs>;

export default meta;
type Story = StoryObj<LabelledOutputStoryArgs>;

export const Playground: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(args.label)).toBeInTheDocument();
  },
};

export const Empty: Story = {
  args: {
    label: "Med min/mi",
    value: 0,
  },
};
