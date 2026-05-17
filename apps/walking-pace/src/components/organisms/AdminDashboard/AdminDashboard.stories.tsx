import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
import { renderStory } from "../../../stories/render";
import {
  storyAdmin,
  storyInvitations,
  storyStats,
  storyUser,
  storyWalks,
} from "../../../stories/sample-data";
import { AdminDashboard } from "./AdminDashboard";

interface AdminDashboardStoryArgs {
  error?: string;
}

const meta = {
  argTypes: {
    error: { control: "text" },
  },
  args: {
    error: "",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Admin control surface composed from invite, account, invitation, and score sections.",
      },
    },
    layout: "fullscreen",
  },
  render: (args) =>
    renderStory(
      <AdminDashboard
        error={args.error || undefined}
        invitations={storyInvitations}
        selectedStats={storyStats}
        selectedUser={storyUser}
        selectedWalks={storyWalks}
        users={[storyAdmin, storyUser]}
      />,
      { size: "full" },
    ),
  tags: ["autodocs"],
  title: "Components/Organisms/AdminDashboard",
} satisfies Meta<AdminDashboardStoryArgs>;

export default meta;
type Story = StoryObj<AdminDashboardStoryArgs>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Invite user" })).toBeInTheDocument();
  },
};

export const WithError: Story = {
  args: {
    error: "Choose a valid account.",
  },
};
