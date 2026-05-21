import type { Meta, StoryObj } from "@storybook/html-vite";
import { action } from "storybook/actions";
import { expect, userEvent, within } from "storybook/test";
import { Button } from "../../atoms/Button";
import { renderStoryWithActions, type StoryActionHandler } from "../../stories/render";
import { HxForm } from "./HxForm";

interface HxFormStoryArgs {
  action: string;
  hxPost: string;
  method: "get" | "post";
  onSubmit: StoryActionHandler;
}

const meta = {
  argTypes: {
    action: { control: "text" },
    hxPost: { control: "text" },
    method: { control: "select", options: ["get", "post"] },
    onSubmit: { control: false },
  },
  args: {
    action: "/example",
    hxPost: "/example",
    method: "post",
    onSubmit: action("form submitted"),
  },
  parameters: {
    docs: {
      description: {
        component:
          "Progressive-enhancement form wrapper that renders native action/method plus HTMX attributes. Inputs are the fallback route, method, labelled children, and optional hx-* contract; output is a form that submits without JavaScript and swaps fragments when HTMX is available.",
      },
    },
    layout: "fullscreen",
  },
  render: (args) =>
    renderStoryWithActions(
      <HxForm
        action={args.action}
        method={args.method}
        hx-post={args.hxPost}
        hx-target="#storybook-result"
        hx-swap="innerHTML"
      >
        <div class="storybook-row">
          <input name="example" placeholder="Example" />
          <Button type="submit">Submit</Button>
        </div>
      </HxForm>,
      { size: "compact" },
      [{ event: "submit", handler: args.onSubmit, preventDefault: true, selector: "form" }],
    ),
  tags: ["autodocs"],
  title: "Components/Shared/Molecules/HxForm",
} satisfies Meta<HxFormStoryArgs>;

export default meta;
type Story = StoryObj<HxFormStoryArgs>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submitButton = canvas.getByRole("button", { name: "Submit" });
    await expect(submitButton).toBeInTheDocument();
    await userEvent.click(submitButton);
  },
};
