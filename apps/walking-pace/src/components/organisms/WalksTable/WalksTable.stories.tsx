import type { Meta, StoryObj } from "@storybook/html-vite";
import { action } from "storybook/actions";
import { expect, userEvent, within } from "storybook/test";
import type { WalkWithStats } from "../../../db";
import { renderStoryWithActions, type StoryActionHandler } from "../../../stories/render";
import { storyWalks } from "../../../stories/sample-data";
import { WalksTable } from "./WalksTable";

interface WalksTableStoryArgs {
  canMutate: boolean;
  onClearAll: StoryActionHandler;
  onClearWalk: StoryActionHandler;
  rows: "empty" | "few" | "many";
}

const firstWalk = storyWalks[0] as WalkWithStats;
const secondWalk = storyWalks[1] as WalkWithStats;

const walkOptions: Record<WalksTableStoryArgs["rows"], WalkWithStats[]> = {
  empty: [],
  few: storyWalks.slice(0, 2),
  many: [
    ...storyWalks,
    {
      ...firstWalk,
      created_at: "2026-05-14T07:10:00.000Z",
      id: 4,
      miles: 1.4,
    },
    {
      ...secondWalk,
      created_at: "2026-05-13T07:10:00.000Z",
      id: 5,
      miles: 2.4,
    },
  ],
};

const meta = {
  argTypes: {
    canMutate: { control: "boolean" },
    onClearAll: { control: false },
    onClearWalk: { control: false },
    rows: { control: "select", options: ["empty", "few", "many"] },
  },
  args: {
    canMutate: true,
    onClearAll: action("all walks clear requested"),
    onClearWalk: action("walk clear requested"),
    rows: "few",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Walk-history region with count chip, empty state, responsive table, and mutation controls.",
      },
    },
    layout: "fullscreen",
  },
  render: (args) =>
    renderStoryWithActions(
      <WalksTable walks={walkOptions[args.rows]} canMutate={args.canMutate} />,
      { size: "full" },
      [
        {
          event: "click",
          handler: args.onClearAll,
          preventDefault: true,
          selector: ".clear-walks-btn",
        },
        {
          event: "click",
          handler: args.onClearWalk,
          preventDefault: true,
          selector: ".clear-walk-btn",
        },
      ],
    ),
  tags: ["autodocs"],
  title: "Components/Reference App/Organisms/WalksTable",
} satisfies Meta<WalksTableStoryArgs>;

export default meta;
type Story = StoryObj<WalksTableStoryArgs>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Walk history")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Clear all" }));
  },
};

export const Empty: Story = {
  args: {
    rows: "empty",
  },
};

export const ReadOnly: Story = {
  args: {
    canMutate: false,
  },
};
