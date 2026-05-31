import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { LinkButton } from "../atoms/LinkButton";
import { CodeBlock } from "../molecules/CodeBlock";
import { renderStory } from "../stories/render";
import { ActionPanel } from "./ActionPanel";
import { CopyField } from "./CopyField";
import { LiveRegionPanel } from "./LiveRegionPanel";

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "Workflow organisms for app-owned copy/share values, action regions, and live fragments. They render semantic regions and stable hooks while routes, permissions, events, and clipboard wiring stay with the consuming app.",
      },
    },
    layout: "fullscreen",
  },
  title: "Components/Shared/Organisms/Workflow",
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const ShareActionsAndLiveFragment: Story = {
  render: () =>
    renderStory(
      <article class="storybook-doc" aria-labelledby="workflow-organisms-heading">
        <header class="storybook-doc__header">
          <p class="storybook-doc__eyebrow">Shared organisms</p>
          <h1 id="workflow-organisms-heading" class="storybook-doc__title">
            Workflow regions
          </h1>
          <p class="storybook-doc__lede">
            Compose share links, action sets, and live-updated fragments without moving route,
            permission, clipboard, or event-stream decisions into the component library.
          </p>
        </header>
        <div class="storybook-doc__grid storybook-doc__grid--two">
          <section class="storybook-doc__section" aria-labelledby="workflow-preview-heading">
            <h2 id="workflow-preview-heading">Rendered output</h2>
            <CopyField
              id="example-share-link"
              label="Share link"
              helpText="The app owns who can use the link and how copy feedback is wired."
              status="Ready to copy"
              value="https://example.test/session/demo"
            />
            <ActionPanel
              id="example-actions"
              title="Session actions"
              meta={<Badge tone="accent">Host tools</Badge>}
              primaryActions={
                <Button hx-post="/session/start" hx-target="#live-session">
                  Start
                </Button>
              }
              secondaryActions={<LinkButton href="/session/preview">Preview</LinkButton>}
              destructiveActions={
                <Button variant="danger" hx-delete="/session" hx-confirm="End this session?">
                  End
                </Button>
              }
            >
              Actions are supplied by the app, including native links, forms, and HTMX attributes.
            </ActionPanel>
            <LiveRegionPanel
              id="live-session"
              title="Live session"
              status="Last refreshed just now"
              hx-get="/session/fragment"
              hx-trigger="load, every 15s"
              hx-swap="outerHTML"
              sse-connect="/session/events"
              sse-swap="session"
            >
              <p>3 participants connected. Waiting for the next server update.</p>
            </LiveRegionPanel>
          </section>
          <section class="storybook-doc__section" aria-labelledby="workflow-boundary-heading">
            <h2 id="workflow-boundary-heading">Boundary</h2>
            <ul>
              <li>CopyField renders a labelled read-only value, action slot, and live status.</li>
              <li>ActionPanel groups app-owned primary, secondary, and destructive controls.</li>
              <li>
                LiveRegionPanel exposes a stable fragment target with HTMX and SSE attributes.
              </li>
              <li>Apps own clipboard scripts, permissions, event routing, and persistence.</li>
            </ul>
          </section>
          <CodeBlock
            className="storybook-doc__section storybook-doc__section--span-all"
            language="tsx"
            code={`import { Button, LinkButton } from "@macavitymadcap/hyper-dank-ui";
import { ActionPanel, CopyField, LiveRegionPanel } from "@macavitymadcap/hyper-dank-ui/organisms";

export function SessionWorkflow({ shareUrl }) {
  return (
    <>
      <CopyField id="share-link" label="Share link" value={shareUrl} status="Ready to copy" />
      <ActionPanel
        title="Session actions"
        primaryActions={<Button hx-post="/session/start" hx-target="#live-session">Start</Button>}
        secondaryActions={<LinkButton href="/session/preview">Preview</LinkButton>}
      />
      <LiveRegionPanel id="live-session" hx-get="/session/fragment" hx-trigger="load, every 15s">
        <p>Waiting for the next server update.</p>
      </LiveRegionPanel>
    </>
  );
}`}
          />
        </div>
      </article>,
      { size: "full" },
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const preview = within(canvas.getByRole("region", { name: "Rendered output" }));
    await expect(canvas.getByRole("heading", { name: "Workflow regions" })).toBeInTheDocument();
    await expect(preview.getByRole("textbox", { name: "Share link" })).toBeInTheDocument();
    await expect(preview.getByRole("button", { name: "Start" })).toBeInTheDocument();
    await expect(preview.getByRole("status", { name: "Live session" })).toBeInTheDocument();
  },
};
