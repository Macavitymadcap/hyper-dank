import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
import { renderDocumentStory } from "../../../stories/render";
import { LoginPage } from "./Login";

interface LoginPageStoryArgs {
  error: string;
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
        component: "Public sign-in page composed from the document layout and login form.",
      },
    },
    layout: "fullscreen",
  },
  render: (args) =>
    renderDocumentStory(<LoginPage error={args.error || undefined} />, { size: "full" }),
  tags: ["autodocs"],
  title: "Components/Pages/Login",
} satisfies Meta<LoginPageStoryArgs>;

export default meta;
type Story = StoryObj<LoginPageStoryArgs>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  },
};

export const WithError: Story = {
  args: {
    error: "Invalid email or password.",
  },
};
