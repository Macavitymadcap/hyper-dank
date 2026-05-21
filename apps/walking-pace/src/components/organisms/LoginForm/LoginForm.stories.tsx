import { Card } from "@macavitymadcap/hyper-dank-ui";
import type { Meta, StoryObj } from "@storybook/html-vite";
import { action } from "storybook/actions";
import { expect, userEvent, within } from "storybook/test";
import { renderStoryWithActions, type StoryActionHandler } from "../../../stories/render";
import { LoginForm } from "./LoginForm";

interface LoginFormStoryArgs {
  error?: string;
  onSubmit: StoryActionHandler;
}

const meta = {
  argTypes: {
    error: { control: "text" },
    onSubmit: { control: false },
  },
  args: {
    error: "",
    onSubmit: action("login submitted"),
  },
  parameters: {
    docs: {
      description: {
        component: "Sign-in form with native POST fallback and HTMX fragment error handling.",
      },
    },
    layout: "fullscreen",
  },
  render: (args) =>
    renderStoryWithActions(
      <Card className="auth-card" radius="var(--radius-3)">
        <LoginForm error={args.error || undefined} />
      </Card>,
      { size: "compact" },
      [{ event: "submit", handler: args.onSubmit, preventDefault: true, selector: "form" }],
    ),
  tags: ["autodocs"],
  title: "Components/Reference App/Organisms/LoginForm",
} satisfies Meta<LoginFormStoryArgs>;

export default meta;
type Story = StoryObj<LoginFormStoryArgs>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText("Email"), "walker@example.com");
    await userEvent.type(canvas.getByLabelText("Password"), "password123");
    const signInButton = canvas.getByRole("button", { name: "Sign in" });
    await expect(signInButton).toBeInTheDocument();
    await userEvent.click(signInButton);
  },
};

export const WithError: Story = {
  args: {
    error: "Invalid email or password.",
  },
};
