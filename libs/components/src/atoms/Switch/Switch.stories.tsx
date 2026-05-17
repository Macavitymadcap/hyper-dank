import type { Meta, StoryObj } from "@storybook/html-vite";
import { action } from "storybook/actions";
import { expect, within } from "storybook/test";
import { renderStoryWithActions, type StoryActionHandler } from "../../stories/render";
import { Switch } from "./Switch";

interface SwitchStoryArgs {
  checked: boolean;
  dataThemeToggle: boolean;
  id: string;
  label: string;
  onChange: StoryActionHandler;
}

const meta = {
  argTypes: {
    checked: { control: "boolean" },
    dataThemeToggle: { control: "boolean" },
    id: { control: "text" },
    label: { control: "text" },
    onChange: { control: false },
  },
  args: {
    checked: false,
    dataThemeToggle: false,
    id: "storybook-switch",
    label: "Color mode",
    onChange: action("switch changed"),
  },
  parameters: {
    docs: {
      description: {
        component: "Checkbox-backed switch with accessible state and optional theme-toggle marker.",
      },
    },
    layout: "fullscreen",
  },
  render: (args) =>
    renderStoryWithActions(
      <Switch
        id={args.id}
        label={args.label}
        checked={args.checked}
        dataThemeToggle={args.dataThemeToggle}
      />,
      { size: "compact" },
      [{ event: "change", handler: args.onChange, selector: "input" }],
    ),
  tags: ["autodocs"],
  title: "Components/Atoms/Switch",
} satisfies Meta<SwitchStoryArgs>;

export default meta;
type Story = StoryObj<SwitchStoryArgs>;

export const Playground: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const colorSwitch = canvas.getByRole("switch", { name: args.label });
    await expect(colorSwitch).toBeInTheDocument();
    if (args.checked) {
      await expect(colorSwitch).toBeChecked();
      return;
    }

    await expect(colorSwitch).not.toBeChecked();
  },
};

export const DarkChecked: Story = {
  args: {
    checked: true,
    id: "storybook-switch-dark",
  },
};
