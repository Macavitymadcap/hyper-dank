import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
import { Badge } from "../atoms/Badge";
import { Icon } from "../atoms/Icon";
import { Panel } from "../atoms/Panel";
import { Accordion } from "../molecules/Accordion";
import { BasicGraph } from "../molecules/BasicGraph";
import { Callout } from "../molecules/Callout";
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
              <h3 id="reuse-preview-title">Release desk</h3>
              <p>
                <Badge tone="accent">Live docs</Badge> <Badge tone="warning">4 drafts</Badge>{" "}
                <Icon label="Ready for package review" name="check" tone="success" />
              </p>
              <Callout title="Review focus">
                Release copy, npm links, and consumer smoke checks are ready for sign-off.
              </Callout>
              <CompactList
                items={[
                  { label: "Packages", value: "4" },
                  { label: "Install tabs", meta: "npm, bun, yarn, pnpm", value: "4" },
                  { label: "Review notes", meta: "needs owner", value: "2" },
                ]}
              />
              <BasicGraph
                id="release-checks"
                title="Weekly adoption checks"
                summary="Consumer install checks rose from eight on Monday to eighteen on Friday."
                kind="line"
                valueFormatter={(value) => `${value}`}
                data={[
                  { label: "Mon", value: 8 },
                  { label: "Wed", value: 13 },
                  { label: "Fri", value: 18 },
                ]}
              />
              <Accordion
                name="release-details"
                items={[
                  {
                    body: "Evidence includes package exports, README install tabs, Storybook coverage, and the public docs links a consuming app needs before adopting the primitives.",
                    id: "release-evidence",
                    meta: "4 checks",
                    title: "Evidence bundle",
                  },
                ]}
              />
              <PopoverMenu
                id="app-actions"
                label="Open release actions"
                items={[
                  { current: true, href: "/docs", label: "Open public docs" },
                  { href: "/storybook/", label: "Review Storybook" },
                  { href: "/sign-off", label: "Request sign-off", method: "post" },
                ]}
              />
            </Panel>
          </section>
          <section class="storybook-doc__section" aria-labelledby="reuse-contract-heading">
            <h2 id="reuse-contract-heading">Contract</h2>
            <ul>
              <li>Each primitive keeps its own semantic HTML and class hooks.</li>
              <li>
                BasicGraph renders visible labels and a labelled figure; the app owns real data and
                units.
              </li>
              <li>Accordion and PopoverMenu stay native and keyboard-reachable.</li>
              <li>Extract a new component only when this composition repeats in product code.</li>
            </ul>
          </section>
        </div>
        <CodeBlock
          language="tsx"
          code={`import { Badge, BasicGraph, Callout, CompactList, Panel } from "@macavitymadcap/hyper-dank-ui";

export function ReleaseDesk() {
  return (
    <Panel labelledBy="release-heading">
      <h2 id="release-heading">Release desk</h2>
      <Badge tone="accent">Live docs</Badge>
      <Callout title="Review focus">
        Release copy, npm links, and consumer smoke checks are ready for sign-off.
      </Callout>
      <CompactList
        items={[
          { label: "Packages", value: "4" },
          { label: "Install tabs", meta: "npm, bun, yarn, pnpm", value: "4" },
        ]}
      />
      <BasicGraph
        id="release-checks"
        title="Weekly adoption checks"
        summary="Consumer install checks rose from eight on Monday to eighteen on Friday."
        kind="line"
        valueFormatter={(value) => String(value)}
        data={[
          { label: "Mon", value: 8 },
          { label: "Wed", value: 13 },
          { label: "Fri", value: 18 },
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
    await expect(canvas.getByRole("heading", { name: "Release desk" })).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Open release actions" })).toBeInTheDocument();
  },
};
