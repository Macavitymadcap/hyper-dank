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
                content="Publishes the current draft when validation passes."
              >
                Publish help
              </Tooltip>
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
            <ul>
              <li>Tooltip renders static help with a described, focusable trigger wrapper.</li>
              <li>Skeleton exposes a labelled status while the app owns loading timing.</li>
              <li>Separator defaults to decorative output and can opt into semantic separation.</li>
              <li>Kbd, Avatar, and AspectRatio provide small stable hooks for common reuse.</li>
              <li>
                The app owns progressive enhancement, real user images, and final content state.
              </li>
            </ul>
          </section>
        </div>
        <CodeBlock
          language="tsx"
          code={`import { Avatar, Kbd, Skeleton, Tooltip } from "@macavitymadcap/hyper-dank-ui";

export function DraftToolbar({ isLoading }: { isLoading: boolean }) {
  return (
    <div>
      <Avatar name="Ada Lovelace" />
      <Tooltip id="publish-help" content="Publishes the current draft when validation passes.">
        Publish help
      </Tooltip>
      <span>Press <Kbd>Esc</Kbd> to close.</span>
      {isLoading ? <Skeleton width="10rem" label="Loading draft status" /> : undefined}
    </div>
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
