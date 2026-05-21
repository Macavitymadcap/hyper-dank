import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
import { Badge } from "../atoms/Badge";
import { Icon } from "../atoms/Icon";
import { Panel } from "../atoms/Panel";
import { Accordion } from "../molecules/Accordion";
import { BasicGraph } from "../molecules/BasicGraph";
import { CompactList } from "../molecules/CompactList";
import { PopoverMenu } from "../molecules/PopoverMenu";
import { renderStory } from "./render";

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "Reusable composition patterns for app screens, dashboards, static blogs, and demos. These examples show generic Hyper-Dank primitives working together; product routes, state, and domain copy stay in the consuming app.",
      },
    },
    layout: "fullscreen",
  },
  title: "Components/Shared/Reusable Patterns",
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const ReuseSet: Story = {
  render: () =>
    renderStory(
      <Panel labelledBy="reuse-heading">
        <h2 id="reuse-heading">Reusable app primitives</h2>
        <p>
          <Badge tone="accent">Player</Badge>
          <Icon label="Ready" name="check" tone="success" />
        </p>
        <CompactList
          items={[
            { label: "Published posts", value: "18" },
            { label: "Draft pages", meta: "needs review", value: "4" },
          ]}
        />
        <BasicGraph
          id="content-activity"
          title="Content activity"
          summary="Published content is trending upwards across three review periods."
          kind="line"
          data={[
            { label: "Week 1", value: 8 },
            { label: "Week 2", value: 13 },
            { label: "Week 3", value: 18 },
          ]}
        />
        <Accordion
          name="rules"
          items={[{ body: "Feature details", id: "feature-details", title: "Feature" }]}
        />
        <PopoverMenu
          id="app-actions"
          label="Open app menu"
          items={[
            { current: true, href: "/docs", label: "Docs" },
            { href: "/logout", label: "Sign out", method: "post" },
          ]}
        />
      </Panel>,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: "Reusable app primitives" }),
    ).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Open app menu" })).toBeInTheDocument();
  },
};
