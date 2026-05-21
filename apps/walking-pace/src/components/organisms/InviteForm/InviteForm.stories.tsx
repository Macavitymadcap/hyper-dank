import { Card } from "@macavitymadcap/hyper-dank-ui";
import type { Meta, StoryObj } from "@storybook/html-vite";
import { action } from "storybook/actions";
import { expect, userEvent, within } from "storybook/test";
import { renderStoryWithActions, type StoryActionHandler } from "../../../stories/render";
import { InviteForm } from "./InviteForm";

interface InviteFormStoryArgs {
  error?: string;
  onSubmit: StoryActionHandler;
  token: string;
}

const meta = {
  argTypes: {
    error: { control: "text" },
    onSubmit: { control: false },
    token: { control: "text" },
  },
  args: {
    error: "",
    onSubmit: action("invite accepted"),
    token: "demo-token",
  },
  parameters: {
    docs: {
      description: {
        component: "Invitation acceptance form for creating an invited account.",
      },
    },
    layout: "fullscreen",
  },
  render: (args) =>
    renderStoryWithActions(
      <Card className="auth-card" radius="var(--radius-3)">
        <InviteForm token={args.token} error={args.error || undefined} />
      </Card>,
      { size: "compact" },
      [{ event: "submit", handler: args.onSubmit, preventDefault: true, selector: "form" }],
    ),
  tags: ["autodocs"],
  title: "Components/Reference App/Organisms/InviteForm",
} satisfies Meta<InviteFormStoryArgs>;

export default meta;
type Story = StoryObj<InviteFormStoryArgs>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText("Name"), "Walker Example");
    await userEvent.type(canvas.getByLabelText("Password"), "password123");
    const createButton = canvas.getByRole("button", { name: "Create account" });
    await expect(createButton).toBeInTheDocument();
    await userEvent.click(createButton);
  },
};

export const WithError: Story = {
  args: {
    error: "Invitation has expired.",
  },
};
