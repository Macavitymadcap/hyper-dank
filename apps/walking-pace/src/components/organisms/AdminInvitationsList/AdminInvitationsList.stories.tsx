import type { Meta, StoryObj } from "@storybook/html-vite";
import { action } from "storybook/actions";
import { expect, userEvent, within } from "storybook/test";
import { renderStoryWithActions, type StoryActionHandler } from "../../../stories/render";
import { storyInvitations } from "../../../stories/sample-data";
import { AdminInvitationsList } from "./AdminInvitationsList";

interface AdminInvitationsListStoryArgs {
  onRevoke: StoryActionHandler;
  state: "empty" | "pending";
}

const meta = {
  argTypes: {
    onRevoke: { control: false },
    state: { control: "select", options: ["empty", "pending"] },
  },
  args: {
    onRevoke: action("invitation revoke requested"),
    state: "pending",
  },
  parameters: {
    docs: {
      description: {
        component: "Admin invitation list with role/status chips and pending revoke actions.",
      },
    },
    layout: "fullscreen",
  },
  render: (args) =>
    renderStoryWithActions(
      <AdminInvitationsList invitations={args.state === "empty" ? [] : storyInvitations} />,
      {},
      [{ event: "submit", handler: args.onRevoke, preventDefault: true, selector: "form" }],
    ),
  tags: ["autodocs"],
  title: "Components/Reference App/Organisms/AdminInvitationsList",
} satisfies Meta<AdminInvitationsListStoryArgs>;

export default meta;
type Story = StoryObj<AdminInvitationsListStoryArgs>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("new.walker@example.com")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Revoke" }));
  },
};

export const Empty: Story = {
  args: {
    state: "empty",
  },
};
