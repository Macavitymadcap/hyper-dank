import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
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
          "Coverage stories for existing shared primitives that support the app-builder component directory. These examples document semantics, stable class hooks, and composition boundaries.",
      },
    },
    layout: "fullscreen",
  },
  title: "Components/Shared/Existing Primitives",
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const SurfacesAndMetadata: Story = {
  render: () =>
    renderStory(
      <Panel labelledBy="metadata-heading" width="narrow">
        <h2 id="metadata-heading">Metadata</h2>
        <div class="storybook-row">
          <Badge>Neutral</Badge>
          <Badge tone="accent">Accent</Badge>
          <Badge tone="warning">Warning</Badge>
        </div>
        <CompactList
          items={[
            { label: "Owner", value: "Ada" },
            { label: "Status", value: "Ready", meta: "Reviewed" },
          ]}
        />
      </Panel>,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Metadata" })).toBeInTheDocument();
    await expect(canvas.getByText("Accent")).toBeInTheDocument();
    await expect(canvas.getByText("Reviewed")).toBeInTheDocument();
  },
};

export const DisclosureAndMenu: Story = {
  render: () =>
    renderStory(
      <div class="storybook-doc__section">
        <Accordion
          name="examples"
          items={[
            {
              body: "A native details disclosure keeps content reachable without JavaScript.",
              controls: <Button variant="ghost">Review</Button>,
              id: "example-disclosure",
              meta: "Native disclosure",
              title: "Component notes",
            },
          ]}
        />
        <PopoverMenu
          id="example-menu"
          label="Open example menu"
          items={[
            { current: true, href: "/overview", label: "Overview" },
            { href: "/settings", label: "Settings" },
            { href: "/archive", label: "Archive", method: "post" },
          ]}
        />
      </div>,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Component notes")).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Open example menu" })).toBeInTheDocument();
  },
};
