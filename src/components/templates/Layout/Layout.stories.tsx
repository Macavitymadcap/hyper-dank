import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
import { renderDocumentStory } from "../../../stories/render";
import { Card } from "../../atoms/Card";
import { Layout } from "./Layout";

interface LayoutStoryArgs {
  heading: string;
}

const meta = {
  argTypes: {
    heading: { control: "text" },
  },
  args: {
    heading: "Document shell",
  },
  parameters: {
    docs: {
      description: {
        component: "HTML document template that applies theme bootstrap and Vite-managed assets.",
      },
    },
    layout: "fullscreen",
  },
  render: (args) =>
    renderDocumentStory(
      <Layout>
        <Card as="main" className="app-card auth-card">
          <header class="auth-header">
            <h1 class="title">{args.heading}</h1>
          </header>
          <p class="storybook-note">
            Layout stories render the document body so Storybook can show the same app chrome
            without nesting a second HTML document.
          </p>
        </Card>
      </Layout>,
      { size: "full" },
    ),
  tags: ["autodocs"],
  title: "Components/Templates/Layout",
} satisfies Meta<LayoutStoryArgs>;

export default meta;
type Story = StoryObj<LayoutStoryArgs>;

export const Playground: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: args.heading })).toBeInTheDocument();
  },
};
