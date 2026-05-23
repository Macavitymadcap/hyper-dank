import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
import { Badge } from "../atoms/Badge";
import { Icon } from "../atoms/Icon";
import { Panel } from "../atoms/Panel";
import { Accordion } from "../molecules/Accordion";
import { BasicGraph } from "../molecules/BasicGraph";
import { CodeBlock } from "../molecules/CodeBlock";
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
      <article class="storybook-doc" aria-labelledby="reuse-heading">
        <header class="storybook-doc__header">
          <p class="storybook-doc__eyebrow">Reusable pattern contract</p>
          <h1 id="reuse-heading" class="storybook-doc__title">
            Reuse set
          </h1>
          <p class="storybook-doc__lede">
            This composition shows small primitives working together without becoming a product
            template. Use it as a copyable starting point for compact status and activity panels.
          </p>
        </header>
        <div class="storybook-doc__grid">
          <section class="storybook-doc__section" aria-labelledby="reuse-preview-heading">
            <h2 id="reuse-preview-heading">Rendered output</h2>
            <Panel labelledBy="reuse-preview-title">
              <h3 id="reuse-preview-title">Reusable app primitives</h3>
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
            </Panel>
          </section>
          <section class="storybook-doc__section" aria-labelledby="reuse-contract-heading">
            <h2 id="reuse-contract-heading">Contract</h2>
            <ul>
              <li>Each primitive keeps its own semantic HTML and class hooks.</li>
              <li>BasicGraph renders a labelled figure; the app owns real data and units.</li>
              <li>Accordion and PopoverMenu stay native and keyboard-reachable.</li>
              <li>Extract a new component only when this composition repeats in product code.</li>
            </ul>
          </section>
        </div>
        <CodeBlock
          language="tsx"
          code={`import { Badge, BasicGraph, CompactList, Panel } from "@macavitymadcap/hyper-dank-ui";

export function ActivityPanel() {
  return (
    <Panel labelledBy="activity-heading">
      <h2 id="activity-heading">Reusable app primitives</h2>
      <Badge tone="accent">Player</Badge>
      <CompactList items={[{ label: "Published posts", value: "18" }]} />
      <BasicGraph
        id="content-activity"
        title="Content activity"
        kind="line"
        data={[
          { label: "Week 1", value: 8 },
          { label: "Week 2", value: 13 },
          { label: "Week 3", value: 18 },
        ]}
      />
    </Panel>
  );
}`}
        />
      </article>,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Reuse set" })).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Open app menu" })).toBeInTheDocument();
  },
};
