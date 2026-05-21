import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
import { renderStory } from "../../../stories/render";
import { emptyStats, storyStats, storyUser, storyWalks } from "../../../stories/sample-data";
import { AdminScoresPanel } from "./AdminScoresPanel";

interface AdminScoresPanelStoryArgs {
  state: "selected" | "empty";
}

const meta = {
  argTypes: {
    state: { control: "select", options: ["selected", "empty"] },
  },
  args: {
    state: "selected",
  },
  parameters: {
    docs: {
      description: {
        component: "Read-only admin review panel for another user's walk statistics and history.",
      },
    },
    layout: "fullscreen",
  },
  render: (args) =>
    renderStory(
      <AdminScoresPanel
        selectedStats={args.state === "empty" ? emptyStats : storyStats}
        selectedUser={args.state === "empty" ? undefined : storyUser}
        selectedWalks={args.state === "empty" ? [] : storyWalks}
      />,
      { size: "full" },
    ),
  tags: ["autodocs"],
  title: "Components/Reference App/Organisms/AdminScoresPanel",
} satisfies Meta<AdminScoresPanelStoryArgs>;

export default meta;
type Story = StoryObj<AdminScoresPanelStoryArgs>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(storyUser.email)).toBeInTheDocument();
  },
};

export const Empty: Story = {
  args: {
    state: "empty",
  },
};
