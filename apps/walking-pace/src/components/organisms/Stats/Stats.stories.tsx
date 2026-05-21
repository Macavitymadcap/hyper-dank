import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
import { renderStory } from "../../../stories/render";
import { Stats } from "./Stats";

interface StatsStoryArgs {
  avgSpeed: number;
  medianPace: number;
}

const meta = {
  argTypes: {
    avgSpeed: { control: { min: 0, step: 0.1, type: "number" } },
    medianPace: { control: { min: 0, step: 0.1, type: "number" } },
  },
  args: {
    avgSpeed: 3.8,
    medianPace: 15.8,
  },
  parameters: {
    docs: {
      description: {
        component: "Summary statistics block for average speed and median pace.",
      },
    },
    layout: "fullscreen",
  },
  render: (args) =>
    renderStory(<Stats avgSpeed={args.avgSpeed} medianPace={args.medianPace} />, {
      size: "compact",
    }),
  tags: ["autodocs"],
  title: "Components/Reference App/Organisms/Stats",
} satisfies Meta<StatsStoryArgs>;

export default meta;
type Story = StoryObj<StatsStoryArgs>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Avg mph")).toBeInTheDocument();
  },
};

export const Empty: Story = {
  args: {
    avgSpeed: 0,
    medianPace: 0,
  },
};
