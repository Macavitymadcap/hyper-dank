import type { Meta, StoryObj } from "@storybook/html-vite";
import { action } from "storybook/actions";
import { expect, userEvent, within } from "storybook/test";
import { renderStoryWithActions, type StoryActionHandler } from "../../../stories/render";
import { WalksRow } from "./WalksRow";

interface WalksRowStoryArgs {
  canMutate: boolean;
  miles: number;
  minutes: number;
  onClear: StoryActionHandler;
  pace: number;
  seconds: number;
  speed: number;
}

const meta = {
  argTypes: {
    canMutate: { control: "boolean" },
    miles: { control: { min: 0, step: 0.1, type: "number" } },
    minutes: { control: { min: 0, step: 1, type: "number" } },
    onClear: { control: false },
    pace: { control: { min: 0, step: 0.1, type: "number" } },
    seconds: { control: { max: 59, min: 0, step: 1, type: "number" } },
    speed: { control: { min: 0, step: 0.1, type: "number" } },
  },
  args: {
    canMutate: true,
    miles: 1.2,
    minutes: 18,
    onClear: action("walk clear requested"),
    pace: 15.8,
    seconds: 55,
    speed: 3.8,
  },
  parameters: {
    docs: {
      description: {
        component:
          "Walk-history table row with formatted date/time, calculated metrics, and optional mutation control.",
      },
    },
    layout: "fullscreen",
  },
  render: (args) =>
    renderStoryWithActions(
      <table class="scrollable-table walks-table storybook-table-preview">
        <tbody>
          <WalksRow
            id={1}
            createdAt="2026-05-17T08:15:00.000Z"
            miles={args.miles}
            minutes={args.minutes}
            seconds={args.seconds}
            speed={args.speed}
            pace={args.pace}
            canMutate={args.canMutate}
          />
        </tbody>
      </table>,
      { size: "full" },
      [{ event: "submit", handler: args.onClear, preventDefault: true, selector: "form" }],
    ),
  tags: ["autodocs"],
  title: "Components/Molecules/WalksRow",
} satisfies Meta<WalksRowStoryArgs>;

export default meta;
type Story = StoryObj<WalksRowStoryArgs>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("cell", { name: "1.2" })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Clear" }));
  },
};

export const ReadOnly: Story = {
  args: {
    canMutate: false,
  },
};
