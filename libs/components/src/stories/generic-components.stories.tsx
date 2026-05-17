import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
import { Badge } from "../atoms/Badge";
import { Icon } from "../atoms/Icon";
import { Panel } from "../atoms/Panel";
import { Accordion } from "../molecules/Accordion";
import { CompactList } from "../molecules/CompactList";
import { PopoverMenu } from "../molecules/PopoverMenu";
import { renderStory } from "./render";

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "Reusable components extracted from walking-pace and checked against Character Sheet needs.",
      },
    },
    layout: "fullscreen",
  },
  title: "Components/Generic/Character Sheet Reuse",
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const ReuseSet: Story = {
  render: () =>
    renderStory(
      <Panel labelledBy="reuse-heading">
        <h2 id="reuse-heading">Reusable sheet primitives</h2>
        <p>
          <Badge tone="accent">Player</Badge>
          <Icon label="Ready" name="check" tone="success" />
        </p>
        <CompactList
          items={[
            { label: "Armour Class", value: "18" },
            { label: "Hit Points", meta: "temporary 4", value: "27" },
          ]}
        />
        <Accordion
          name="rules"
          items={[{ body: "Feature details", id: "feature-details", title: "Feature" }]}
        />
        <PopoverMenu
          id="sheet-actions"
          label="Open sheet menu"
          items={[
            { current: true, href: "/sheet/lynott", label: "Sheet" },
            { href: "/logout", label: "Sign out", method: "post" },
          ]}
        />
      </Panel>,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: "Reusable sheet primitives" }),
    ).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Open sheet menu" })).toBeInTheDocument();
  },
};
