import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
import type { WalkWithStats } from "../../../db";
import { renderDocumentStory } from "../../../stories/render";
import {
  emptyStats,
  storyAdmin,
  storyStats,
  storyUser,
  storyWalks,
} from "../../../stories/sample-data";
import { Home } from "./Home";

interface HomeStoryArgs {
  role: "admin" | "user";
  rows: "empty" | "few" | "many";
}

const firstWalk = storyWalks[0] as WalkWithStats;
const secondWalk = storyWalks[1] as WalkWithStats;
const manyWalks = [
  ...storyWalks,
  { ...firstWalk, created_at: "2026-05-14T07:10:00.000Z", id: 4, miles: 1.4 },
  { ...secondWalk, created_at: "2026-05-13T07:10:00.000Z", id: 5, miles: 2.4 },
];

const meta = {
  argTypes: {
    role: { control: "select", options: ["user", "admin"] },
    rows: { control: "select", options: ["empty", "few", "many"] },
  },
  args: {
    role: "user",
    rows: "few",
  },
  parameters: {
    docs: {
      description: {
        component:
          "Authenticated tracker page composing the app header, summary, walk entry, and history sections.",
      },
    },
    layout: "fullscreen",
  },
  render: (args) => {
    const walks = args.rows === "empty" ? [] : args.rows === "many" ? manyWalks : storyWalks;
    return renderDocumentStory(
      <Home
        walks={walks}
        stats={args.rows === "empty" ? emptyStats : storyStats}
        user={args.role === "admin" ? storyAdmin : storyUser}
      />,
      { size: "full" },
    );
  },
  tags: ["autodocs"],
  title: "Components/Pages/Home",
} satisfies Meta<HomeStoryArgs>;

export default meta;
type Story = StoryObj<HomeStoryArgs>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Walking Pace Tracker" })).toBeInTheDocument();
    await expect(canvas.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/storybook/?path=/story/guides-about--about",
    );
  },
};

export const Empty: Story = {
  args: {
    rows: "empty",
  },
};

export const AdminUser: Story = {
  args: {
    role: "admin",
  },
};
