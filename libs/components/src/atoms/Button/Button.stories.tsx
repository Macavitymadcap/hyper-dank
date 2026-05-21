import type { Meta, StoryObj } from "@storybook/html-vite";
import { action } from "storybook/actions";
import { expect, userEvent, within } from "storybook/test";
import { renderStory, renderStoryWithActions, type StoryActionHandler } from "../../stories/render";
import { Button } from "./Button";

interface ButtonStoryArgs {
  label: string;
  onClick: StoryActionHandler;
  size: "default" | "compact";
  type: "button" | "reset" | "submit";
  variant: "primary" | "danger" | "outline" | "text" | "ghost";
}

const meta = {
  argTypes: {
    label: { control: "text" },
    onClick: { control: false },
    size: { control: "select", options: ["default", "compact"] },
    type: { control: "select", options: ["button", "reset", "submit"] },
    variant: { control: "select", options: ["primary", "danger", "outline", "text", "ghost"] },
  },
  args: {
    label: "Save",
    onClick: action("button clicked"),
    size: "default",
    type: "button",
    variant: "primary",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Primitive button with size, variant, native type, disabled state, accessible labelling, and HTMX attribute support. Outputs a native button with stable data-size and data-variant hooks; events remain standard click or form-submit browser behaviour.",
      },
    },
    layout: "fullscreen",
  },
  render: (args) =>
    renderStoryWithActions(
      <Button type={args.type} size={args.size} variant={args.variant}>
        {args.label}
      </Button>,
      { size: "compact" },
      [{ event: "click", handler: args.onClick, selector: "button" }],
    ),
  tags: ["autodocs"],
  title: "Components/Shared/Atoms/Button",
} satisfies Meta<ButtonStoryArgs>;

export default meta;
type Story = StoryObj<ButtonStoryArgs>;

export const Playground: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: args.label });
    await expect(button).toBeInTheDocument();
    await userEvent.click(button);
  },
};

export const Variants: Story = {
  render: () =>
    renderStory(
      <div class="storybook-row">
        <Button type="button">Primary</Button>
        <Button type="button" variant="outline">
          Outline
        </Button>
        <Button type="button" variant="danger">
          Danger
        </Button>
        <Button type="button" variant="text">
          Text
        </Button>
        <Button type="button" variant="ghost">
          Ghost
        </Button>
      </div>,
    ),
};
