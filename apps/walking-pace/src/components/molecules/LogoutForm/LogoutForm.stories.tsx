import type { Meta, StoryObj } from "@storybook/html-vite";
import { action } from "storybook/actions";
import { expect, userEvent, within } from "storybook/test";
import { renderStoryWithActions, type StoryActionHandler } from "../../../stories/render";
import { LogoutForm } from "./LogoutForm";

interface LogoutFormStoryArgs {
  label: string;
  onSubmit: StoryActionHandler;
}

const meta = {
  argTypes: {
    label: { control: "text" },
    onSubmit: { control: false },
  },
  args: {
    label: "Sign out",
    onSubmit: action("sign out submitted"),
  },
  parameters: {
    docs: {
      description: {
        component: "Native and HTMX sign-out form used in authenticated page headers.",
      },
    },
    layout: "fullscreen",
  },
  render: (args) =>
    renderStoryWithActions(<LogoutForm label={args.label} />, { size: "compact" }, [
      { event: "submit", handler: args.onSubmit, preventDefault: true, selector: "form" },
    ]),
  tags: ["autodocs"],
  title: "Components/Reference App/Molecules/LogoutForm",
} satisfies Meta<LogoutFormStoryArgs>;

export default meta;
type Story = StoryObj<LogoutFormStoryArgs>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const signOutButton = canvas.getByRole("button", { name: "Sign out" });
    await expect(signOutButton).toBeInTheDocument();
    await userEvent.click(signOutButton);
  },
};
