import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
import { renderStory } from "../../../stories/render";
import { Chip } from "./Chip";

interface ChipStoryArgs {
  className?: string;
  label: string;
}

const meta = {
  argTypes: {
    className: { control: "text" },
    label: { control: "text" },
  },
  args: {
    className: "",
    label: "Active",
  },
  parameters: {
    docs: {
      description: {
        component: "Compact metadata indicator used for counts, roles, and statuses.",
      },
    },
    layout: "fullscreen",
  },
  render: (args) =>
    renderStory(<Chip className={args.className || undefined}>{args.label}</Chip>, {
      size: "compact",
    }),
  tags: ["autodocs"],
  title: "Components/Atoms/Chip",
} satisfies Meta<ChipStoryArgs>;

export default meta;
type Story = StoryObj<ChipStoryArgs>;

export const Playground: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(args.label)).toBeInTheDocument();
  },
};

export const StatusSet: Story = {
  render: () =>
    renderStory(
      <div class="storybook-row">
        <Chip>user</Chip>
        <Chip>admin</Chip>
        <Chip>pending</Chip>
        <Chip>Banned</Chip>
      </div>,
      { size: "compact" },
    ),
};
