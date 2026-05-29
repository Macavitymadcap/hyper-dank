import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { Panel } from "../atoms/Panel";
import { Accordion } from "../molecules/Accordion";
import { CodeBlock } from "../molecules/CodeBlock";
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
      <article class="storybook-doc" aria-labelledby="metadata-heading">
        <header class="storybook-doc__header">
          <p class="storybook-doc__eyebrow">Surface and metadata contract</p>
          <h1 id="metadata-heading" class="storybook-doc__title">
            Surfaces and metadata
          </h1>
          <p class="storybook-doc__lede">
            Use Panel, Badge, and CompactList when a consuming app needs a small labelled surface,
            short status tags, and compact definition rows without inventing product-specific
            layout.
          </p>
        </header>
        <div class="storybook-doc__grid">
          <section class="storybook-doc__section" aria-labelledby="metadata-preview-heading">
            <h2 id="metadata-preview-heading">Rendered output</h2>
            <Panel ariaLabelledBy="metadata-preview-title">
              <h3 id="metadata-preview-title">Metadata</h3>
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
            </Panel>
          </section>
          <section class="storybook-doc__section" aria-labelledby="metadata-contract-heading">
            <h2 id="metadata-contract-heading">Contract</h2>
            <ul>
              <li>Panel receives a labelled heading id and renders a bounded section.</li>
              <li>Badge tone communicates neutral, accent, warning, or success state.</li>
              <li>CompactList renders label/value metadata as a definition list.</li>
              <li>The app owns the words, ordering, and meaning of each metadata row.</li>
            </ul>
          </section>
        </div>
        <CodeBlock
          language="tsx"
          code={`import { Badge, CompactList, Panel } from "@macavitymadcap/hyper-dank-ui";

export function MetadataPanel() {
  return (
    <Panel ariaLabelledBy="metadata-heading">
      <h2 id="metadata-heading">Metadata</h2>
      <Badge tone="accent">Ready</Badge>
      <CompactList
        items={[
          { label: "Owner", value: "Ada" },
          { label: "Status", value: "Ready", meta: "Reviewed" },
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
    await expect(
      canvas.getByRole("heading", { name: "Surfaces and metadata" }),
    ).toBeInTheDocument();
    await expect(canvas.getByText("Accent")).toBeInTheDocument();
    await expect(canvas.getByText("Reviewed")).toBeInTheDocument();
  },
};

export const DisclosureAndMenu: Story = {
  render: () =>
    renderStory(
      <article class="storybook-doc" aria-labelledby="disclosure-heading">
        <header class="storybook-doc__header">
          <p class="storybook-doc__eyebrow">Disclosure and menu contract</p>
          <h1 id="disclosure-heading" class="storybook-doc__title">
            Disclosure and menu
          </h1>
          <p class="storybook-doc__lede">
            Use Accordion for native details disclosure and PopoverMenu for a compact action or
            navigation menu. Both keep keyboard-reachable controls and leave route behaviour to the
            app.
          </p>
        </header>
        <div class="storybook-doc__grid">
          <section class="storybook-doc__section" aria-labelledby="disclosure-preview-heading">
            <h2 id="disclosure-preview-heading">Rendered output</h2>
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
          </section>
          <section class="storybook-doc__section" aria-labelledby="disclosure-contract-heading">
            <h2 id="disclosure-contract-heading">Contract</h2>
            <ul>
              <li>Accordion items render native disclosure controls with stable ids.</li>
              <li>PopoverMenu items are links or POST fallback forms, depending on method.</li>
              <li>Visible labels name each control; consuming apps own destinations and auth.</li>
              <li>Theme colours inherit from the shared CSS token layer.</li>
            </ul>
          </section>
        </div>
        <CodeBlock
          language="tsx"
          code={`import { Accordion, PopoverMenu } from "@macavitymadcap/hyper-dank-ui";

export function ActionsMenu() {
  return (
    <>
      <Accordion
        name="examples"
        items={[{ id: "notes", title: "Component notes", body: "Review before publishing." }]}
      />
      <PopoverMenu
        id="actions"
        label="Open actions"
        items={[
          { current: true, href: "/overview", label: "Overview" },
          { href: "/archive", label: "Archive", method: "post" },
        ]}
      />
    </>
  );
}`}
        />
      </article>,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Disclosure and menu" })).toBeInTheDocument();
    await expect(canvas.getByText("Component notes")).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Open example menu" })).toBeInTheDocument();
  },
};
