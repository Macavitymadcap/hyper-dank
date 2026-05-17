import type { Meta, StoryObj } from "@storybook/html-vite";
import { action } from "storybook/actions";
import { expect, userEvent, within } from "storybook/test";
import { renderStoryWithActions, type StoryActionHandler } from "../../stories/render";
import { InputGroup } from "./InputGroup";

interface InputGroupStoryArgs {
  label: string;
  max: number;
  min: number;
  name: string;
  onInput: StoryActionHandler;
  placeholder: string;
  step: number;
  type: string;
  value: string;
}

const meta = {
  argTypes: {
    label: { control: "text" },
    max: { control: { min: 0, step: 1, type: "number" } },
    min: { control: { min: 0, step: 1, type: "number" } },
    name: { control: "text" },
    onInput: { control: false },
    placeholder: { control: "text" },
    step: { control: { min: 0.1, step: 0.1, type: "number" } },
    type: { control: "select", options: ["number", "text", "email", "password"] },
    value: { control: "text" },
  },
  args: {
    label: "Mi",
    max: 100,
    min: 0,
    name: "storybook-distance",
    onInput: action("input changed"),
    placeholder: "0.0",
    step: 0.1,
    type: "number",
    value: "",
  },
  parameters: {
    docs: {
      description: {
        component: "Compact label plus input group used by the walk-entry form.",
      },
    },
    layout: "fullscreen",
  },
  render: (args) =>
    renderStoryWithActions(
      <InputGroup
        label={args.label}
        max={args.max}
        min={args.min}
        name={args.name}
        placeholder={args.placeholder}
        step={args.step}
        type={args.type}
        value={args.value}
      />,
      { size: "compact" },
      [{ event: "input", handler: args.onInput, selector: "input" }],
    ),
  tags: ["autodocs"],
  title: "Components/Molecules/InputGroup",
} satisfies Meta<InputGroupStoryArgs>;

export default meta;
type Story = StoryObj<InputGroupStoryArgs>;

export const Playground: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(args.label);
    await expect(input).toBeInTheDocument();
    await userEvent.type(input, "1.2");
  },
};
