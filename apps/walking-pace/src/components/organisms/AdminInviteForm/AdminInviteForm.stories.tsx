import type { Meta, StoryObj } from "@storybook/html-vite";
import { action } from "storybook/actions";
import { expect, userEvent, within } from "storybook/test";
import { renderStoryWithActions, type StoryActionHandler } from "../../../stories/render";
import { AdminInviteForm } from "./AdminInviteForm";

interface AdminInviteFormStoryArgs {
  defaultEmail: string;
  defaultRole: "admin" | "user";
  onSubmit: StoryActionHandler;
  submitLabel: string;
}

const meta = {
  argTypes: {
    defaultEmail: { control: "text" },
    defaultRole: { control: "select", options: ["user", "admin"] },
    onSubmit: { control: false },
    submitLabel: { control: "text" },
  },
  args: {
    defaultEmail: "",
    defaultRole: "user",
    onSubmit: action("admin invite submitted"),
    submitLabel: "Send invite",
  },
  parameters: {
    docs: {
      description: {
        component: "Admin form for creating role-scoped user invitations.",
      },
    },
    layout: "fullscreen",
  },
  render: (args) =>
    renderStoryWithActions(
      <AdminInviteForm
        defaultEmail={args.defaultEmail}
        defaultRole={args.defaultRole}
        submitLabel={args.submitLabel}
      />,
      { size: "compact" },
      [{ event: "submit", handler: args.onSubmit, preventDefault: true, selector: "form" }],
    ),
  tags: ["autodocs"],
  title: "Components/Reference App/Organisms/AdminInviteForm",
} satisfies Meta<AdminInviteFormStoryArgs>;

export default meta;
type Story = StoryObj<AdminInviteFormStoryArgs>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText("Email"), "new.walker@example.com");
    const inviteButton = canvas.getByRole("button", { name: "Send invite" });
    await expect(inviteButton).toBeInTheDocument();
    await userEvent.click(inviteButton);
  },
};

export const AdminRole: Story = {
  args: {
    defaultEmail: "new.admin@example.com",
    defaultRole: "admin",
  },
};
