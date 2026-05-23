import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
import { AspectRatio } from "../atoms/AspectRatio";
import { Avatar } from "../atoms/Avatar";
import { Kbd } from "../atoms/Kbd";
import { Separator } from "../atoms/Separator";
import { Skeleton } from "../atoms/Skeleton";
import { Tooltip } from "../atoms/Tooltip";
import { CodeBlock } from "../molecules/CodeBlock";
import { renderStory } from "./render";

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "Low-state primitives for temporary, supporting, and media-layout UI: hints, placeholders, keyboard affordances, identity fallback, separators, and fixed-ratio frames.",
      },
    },
    layout: "fullscreen",
  },
  title: "Components/Shared/Low State Primitives",
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const LowStateSet: Story = {
  render: () =>
    renderStory(
      <article class="storybook-doc" aria-labelledby="low-state-heading">
        <header class="storybook-doc__header">
          <p class="storybook-doc__eyebrow">Low-state primitive contract</p>
          <h1 id="low-state-heading" class="storybook-doc__title">
            Low-state primitives
          </h1>
          <p class="storybook-doc__lede">
            Use these pieces for supporting interface states that users still need to understand:
            pending content, keyboard hints, compact identity, separators, media frames, and
            contextual help.
          </p>
        </header>
        <div class="storybook-doc__grid">
          <section class="storybook-doc__section" aria-labelledby="low-state-preview-heading">
            <h2 id="low-state-preview-heading">Rendered output</h2>
            <div class="storybook-low-state-demo">
              <div class="storybook-low-state-row">
                <Avatar name="Ada Lovelace" />
                <div>
                  <strong>Ada Lovelace</strong>
                  <p>Fallback avatar and compact keyboard hint.</p>
                  <p>
                    Press <Kbd>Esc</Kbd> to close transient panels.
                  </p>
                </div>
              </div>
              <Separator />
              <Tooltip
                id="publish-help"
                label="Publish help"
                content="Publishes the current draft when validation passes."
              />
              <div class="storybook-low-state-stack">
                <Skeleton width="10rem" label="Loading title" />
                <Skeleton width="100%" />
                <Skeleton width="70%" />
              </div>
              <AspectRatio ratio="16 / 9">
                <div class="storybook-low-state-media">Preview frame</div>
              </AspectRatio>
            </div>
          </section>
          <section class="storybook-doc__section" aria-labelledby="low-state-contract-heading">
            <h2 id="low-state-contract-heading">Contract</h2>
            <div class="storybook-low-state-contracts">
              <section aria-labelledby="tooltip-contract">
                <h3 id="tooltip-contract">Tooltip</h3>
                <p>
                  Inputs: <code>id</code>, <code>label</code>, <code>content</code>, and optional
                  side.
                </p>
                <p>
                  Output: a native help button described by static tooltip content. The trigger
                  label is plain text so consumers do not nest buttons.
                </p>
                <p>
                  Theme and ownership: uses system colours for contrast. Apps own placement checks,
                  disclosure copy, and richer popover behaviour.
                </p>
              </section>
              <section aria-labelledby="skeleton-contract">
                <h3 id="skeleton-contract">Skeleton</h3>
                <p>
                  Inputs: optional <code>label</code>, <code>width</code>, <code>height</code>, and
                  line, block, or circle shape.
                </p>
                <p>
                  Output: labelled skeletons expose a polite status; unlabelled decorative
                  placeholders are hidden from assistive technology.
                </p>
                <p>
                  Theme and ownership: uses low-state surface tokens. Apps own loading timing, final
                  content, and avoiding long-lived skeleton screens.
                </p>
              </section>
              <section aria-labelledby="separator-contract">
                <h3 id="separator-contract">Separator</h3>
                <p>
                  Inputs: optional orientation and <code>decorative</code> flag.
                </p>
                <p>
                  Output: decorative divider by default; semantic separators opt into
                  <code>role="separator"</code>.
                </p>
                <p>
                  Theme and ownership: inherits subtle border tokens. Apps own whether a divider
                  genuinely improves grouping.
                </p>
              </section>
              <section aria-labelledby="kbd-contract">
                <h3 id="kbd-contract">Kbd</h3>
                <p>Inputs: inline children for the key or key chord.</p>
                <p>Output: native keyboard text for command hints and shortcut labels.</p>
                <p>
                  Theme and ownership: inherits monospace and low-state tokens. Apps own matching
                  real keyboard support.
                </p>
              </section>
              <section aria-labelledby="avatar-contract">
                <h3 id="avatar-contract">Avatar</h3>
                <p>
                  Inputs: required <code>name</code>, optional <code>src</code>, initials, and size.
                </p>
                <p>
                  Output: image avatars use image alt text; fallback avatars expose the name while
                  hiding decorative initials.
                </p>
                <p>
                  Theme and ownership: uses circular surface tokens. Apps own real image URLs,
                  privacy choices, and collision handling for initials.
                </p>
              </section>
              <section aria-labelledby="aspect-ratio-contract">
                <h3 id="aspect-ratio-contract">AspectRatio</h3>
                <p>Inputs: children, optional class, and ratio string such as 16 / 9.</p>
                <p>Output: a stable frame so media and previews do not shift surrounding UI.</p>
                <p>
                  Theme and ownership: uses a neutral background hook. Apps own alt text, captions,
                  loading, and object-fit overrides.
                </p>
              </section>
            </div>
          </section>
        </div>
        <CodeBlock
          language="tsx"
          code={`import { Avatar, Kbd, Skeleton, Tooltip } from "@macavitymadcap/hyper-dank-ui";

export function DraftToolbar({ isLoading }: { isLoading: boolean }) {
  return (
    <div>
      <Avatar name="Ada Lovelace" />
      <Tooltip
        id="publish-help"
        label="Publish help"
        content="Publishes the current draft when validation passes."
      />
      <span>Press <Kbd>Esc</Kbd> to close.</span>
      {isLoading ? <Skeleton width="10rem" label="Loading draft status" /> : undefined}
    </div>
  );
}`}
        />
        <CodeBlock
          language="tsx"
          code={`import { AspectRatio, Separator, Skeleton } from "@macavitymadcap/hyper-dank-ui";

export function MediaPreview({ isLoading }: { isLoading: boolean }) {
  return (
    <section aria-labelledby="preview-heading">
      <h2 id="preview-heading">Preview</h2>
      <Separator />
      {isLoading ? (
        <Skeleton shape="block" height="12rem" label="Loading preview" />
      ) : (
        <AspectRatio ratio="16 / 9">
          <img src="/preview.png" alt="Generated preview" />
        </AspectRatio>
      )}
    </section>
  );
}`}
        />
      </article>,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Low-state primitives" })).toBeInTheDocument();
    await expect(canvas.getByText("Ada Lovelace")).toBeInTheDocument();
    await expect(canvas.getByRole("tooltip")).toHaveTextContent("Publishes the current draft");
    await expect(canvas.getByRole("status")).toBeInTheDocument();
  },
};
