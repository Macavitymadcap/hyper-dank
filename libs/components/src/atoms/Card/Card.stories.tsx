import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
import { renderStory } from "../../stories/render";
import { Card, type CardElement } from "./Card";

interface CardStoryArgs {
  as: CardElement;
  fill: boolean;
  radius: string;
  shadow: string;
  title: string;
  width: string;
}

const meta = {
  argTypes: {
    as: { control: "select", options: ["article", "div", "main", "section"] },
    fill: { control: "boolean" },
    radius: { control: "text" },
    shadow: { control: "text" },
    title: { control: "text" },
    width: { control: "text" },
  },
  args: {
    as: "section",
    fill: false,
    radius: "var(--radius-3)",
    shadow: "var(--shadow-3)",
    title: "Card surface",
    width: "22rem",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Reusable surface primitive that can render semantic container elements and expose sizing through CSS custom properties.",
      },
    },
    layout: "fullscreen",
  },
  render: (args) =>
    renderStory(
      <Card
        as={args.as}
        fill={args.fill}
        radius={args.radius}
        shadow={args.shadow}
        width={args.width}
      >
        <h3 class="section-title">{args.title}</h3>
        <p class="storybook-note">A quiet container for grouped content.</p>
      </Card>,
      { size: "compact" },
    ),
  tags: ["autodocs"],
  title: "Components/Atoms/Card",
} satisfies Meta<CardStoryArgs>;

export default meta;
type Story = StoryObj<CardStoryArgs>;

export const Playground: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(args.title)).toBeInTheDocument();
  },
};

export const Fill: Story = {
  args: {
    fill: true,
    title: "Fill card",
    width: "",
  },
};
