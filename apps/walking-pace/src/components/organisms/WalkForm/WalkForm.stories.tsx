import { Card } from "@macavitymadcap/hyper-dank-ui";
import type { Meta, StoryObj } from "@storybook/html-vite";
import { action } from "storybook/actions";
import { expect, userEvent, within } from "storybook/test";
import { renderStoryWithActions, type StoryActionHandler } from "../../../stories/render";
import { WalkForm } from "./WalkForm";

interface WalkFormStoryArgs {
  miles: string;
  minutes: string;
  onSubmit: StoryActionHandler;
  seconds: string;
  submitLabel: string;
}

const meta = {
  argTypes: {
    miles: { control: "text" },
    minutes: { control: "text" },
    onSubmit: { control: false },
    seconds: { control: "text" },
    submitLabel: { control: "text" },
  },
  args: {
    miles: "",
    minutes: "",
    onSubmit: action("walk submitted"),
    seconds: "",
    submitLabel: "Add",
  },
  parameters: {
    docs: {
      description: {
        component: "Progressively enhanced walk-entry form targeting the walk-history fragment.",
      },
    },
    layout: "fullscreen",
  },
  render: (args) =>
    renderStoryWithActions(
      <Card className="section-card form-section" radius="var(--radius-2)" shadow="none">
        <WalkForm
          defaultValues={{
            miles: args.miles,
            minutes: args.minutes,
            seconds: args.seconds,
          }}
          submitLabel={args.submitLabel}
        />
      </Card>,
      { size: "compact" },
      [{ event: "submit", handler: args.onSubmit, preventDefault: true, selector: "form" }],
    ),
  tags: ["autodocs"],
  title: "Components/Organisms/WalkForm",
} satisfies Meta<WalkFormStoryArgs>;

export default meta;
type Story = StoryObj<WalkFormStoryArgs>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText("Mi"), "1.2");
    await userEvent.type(canvas.getByLabelText("Min"), "18");
    await userEvent.type(canvas.getByLabelText("Sec"), "55");
    const addButton = canvas.getByRole("button", { name: "Add" });
    await expect(addButton).toBeInTheDocument();
    await userEvent.click(addButton);
  },
};

export const Filled: Story = {
  args: {
    miles: "1.2",
    minutes: "18",
    seconds: "55",
  },
};
