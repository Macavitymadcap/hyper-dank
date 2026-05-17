import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
import { renderDocumentStory } from "../../../stories/render";
import {
  storyAdmin,
  storyInvitations,
  storyStats,
  storyUser,
  storyWalks,
} from "../../../stories/sample-data";
import { AdminPage } from "./Admin";

interface AdminPageStoryArgs {
  error: string;
  selected: boolean;
}

const meta = {
  argTypes: {
    error: { control: "text" },
    selected: { control: "boolean" },
  },
  args: {
    error: "",
    selected: true,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Admin page composed from account navigation, invitation management, and read-only score review.",
      },
    },
    layout: "fullscreen",
  },
  render: (args) =>
    renderDocumentStory(
      <AdminPage
        error={args.error || undefined}
        invitations={storyInvitations}
        selectedStats={storyStats}
        selectedUser={args.selected ? storyUser : undefined}
        selectedWalks={args.selected ? storyWalks : []}
        users={[storyAdmin, storyUser]}
      />,
      { size: "full" },
    ),
  tags: ["autodocs"],
  title: "Components/Pages/Admin",
} satisfies Meta<AdminPageStoryArgs>;

export default meta;
type Story = StoryObj<AdminPageStoryArgs>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Admin" })).toBeInTheDocument();
    await expect(canvas.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/storybook/",
    );
  },
};

export const NoSelectedUser: Story = {
  args: {
    selected: false,
  },
};
