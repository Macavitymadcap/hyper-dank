import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
import { renderDocumentStory } from "../../../stories/render";
import { InvitePage } from "./Invite";

interface InvitePageStoryArgs {
  error: string;
  token: string;
}

const meta = {
  argTypes: {
    error: { control: "text" },
    token: { control: "text" },
  },
  args: {
    error: "",
    token: "demo-token",
  },
  parameters: {
    docs: {
      description: {
        component: "Invitation acceptance page composed from the document layout and invite form.",
      },
    },
    layout: "fullscreen",
  },
  render: (args) =>
    renderDocumentStory(<InvitePage token={args.token} error={args.error || undefined} />, {
      size: "full",
    }),
  tags: ["autodocs"],
  title: "Components/Reference App/Pages/Invite",
} satisfies Meta<InvitePageStoryArgs>;

export default meta;
type Story = StoryObj<InvitePageStoryArgs>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Create account" })).toBeInTheDocument();
  },
};

export const WithError: Story = {
  args: {
    error: "Invitation has expired.",
  },
};
