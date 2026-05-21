import type { Meta, StoryObj } from "@storybook/html-vite";
import { action } from "storybook/actions";
import { expect, userEvent, within } from "storybook/test";
import { renderStoryWithActions, type StoryActionHandler } from "../../stories/render";
import { FormField } from "./FormField";

interface FormFieldStoryArgs {
  htmlFor: string;
  label: string;
  onInput: StoryActionHandler;
  placeholder: string;
}

const meta = {
  argTypes: {
    htmlFor: { control: "text" },
    label: { control: "text" },
    onInput: { control: false },
    placeholder: { control: "text" },
  },
  args: {
    htmlFor: "storybook-field",
    label: "Email",
    onInput: action("field input changed"),
    placeholder: "walker@example.com",
  },
  parameters: {
    docs: {
      description: {
        component: "Labelled form-control wrapper that keeps label text connected to its input.",
      },
    },
    layout: "fullscreen",
  },
  render: (args) =>
    renderStoryWithActions(
      <FormField htmlFor={args.htmlFor} label={args.label}>
        <input id={args.htmlFor} name={args.htmlFor} placeholder={args.placeholder} />
      </FormField>,
      { size: "compact" },
      [{ event: "input", handler: args.onInput, selector: "input" }],
    ),
  tags: ["autodocs"],
  title: "Components/Shared/Molecules/FormField",
} satisfies Meta<FormFieldStoryArgs>;

export default meta;
type Story = StoryObj<FormFieldStoryArgs>;

export const Playground: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(args.label);
    await expect(input).toBeInTheDocument();
    await userEvent.type(input, "walker@example.com");
  },
};
