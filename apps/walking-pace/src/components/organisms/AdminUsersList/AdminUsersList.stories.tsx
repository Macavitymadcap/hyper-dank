import type { Meta, StoryObj } from "@storybook/html-vite";
import { action } from "storybook/actions";
import { expect, userEvent, within } from "storybook/test";
import { renderStoryWithActions, type StoryActionHandler } from "../../../stories/render";
import { storyAdmin, storyUser } from "../../../stories/sample-data";
import { AdminUsersList } from "./AdminUsersList";

interface AdminUsersListStoryArgs {
  onBanToggle: StoryActionHandler;
  onRoleToggle: StoryActionHandler;
  onSelectUser: StoryActionHandler;
  selectedUserId: string;
}

const users = [
  storyAdmin,
  storyUser,
  {
    ...storyUser,
    banned: true,
    email: "banned@example.com",
    id: "banned@example.com",
    name: "Banned User",
  },
];

const meta = {
  argTypes: {
    onBanToggle: { control: false },
    onRoleToggle: { control: false },
    onSelectUser: { control: false },
    selectedUserId: {
      control: "select",
      options: users.map((user) => user.id),
    },
  },
  args: {
    onBanToggle: action("account ban toggled"),
    onRoleToggle: action("account role toggled"),
    onSelectUser: action("account selected"),
    selectedUserId: storyUser.id,
  },
  parameters: {
    docs: {
      description: {
        component: "Admin account list with selected state and progressive role/ban actions.",
      },
    },
    layout: "fullscreen",
  },
  render: (args) =>
    renderStoryWithActions(
      <AdminUsersList users={users} selectedUserId={args.selectedUserId} />,
      {},
      [
        { event: "click", handler: args.onSelectUser, preventDefault: true, selector: "a" },
        {
          event: "submit",
          handler: args.onRoleToggle,
          preventDefault: true,
          selector: 'form[action$="/role"]',
        },
        {
          event: "submit",
          handler: args.onBanToggle,
          preventDefault: true,
          selector: 'form[action$="/ban"], form[action$="/unban"]',
        },
      ],
    ),
  tags: ["autodocs"],
  title: "Components/Reference App/Organisms/AdminUsersList",
} satisfies Meta<AdminUsersListStoryArgs>;

export default meta;
type Story = StoryObj<AdminUsersListStoryArgs>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("banned@example.com")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("link", { name: storyUser.email }));
    const selectedUserRow = canvas.getByText(storyUser.email).closest("article");
    if (!selectedUserRow) throw new Error("Expected selected user row to render");
    await userEvent.click(
      within(selectedUserRow as HTMLElement).getByRole("button", { name: "Make admin" }),
    );
    await userEvent.click(canvas.getByRole("button", { name: "Unban" }));
  },
};
