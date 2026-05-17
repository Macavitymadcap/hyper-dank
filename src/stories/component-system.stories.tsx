import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
import { renderStory } from "./render";

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "Base documentation for how the template uses atomic design to organize reusable UI.",
      },
    },
    layout: "fullscreen",
  },
  title: "Components/Overview",
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const AtomicDesign: Story = {
  render: () =>
    renderStory(
      <article class="storybook-doc" aria-labelledby="component-system-heading">
        <header class="storybook-doc__header">
          <p class="storybook-doc__eyebrow">Component system</p>
          <h1 id="component-system-heading" class="storybook-doc__title">
            Atomic design in this template
          </h1>
          <p class="storybook-doc__lede">
            Pace Calculator keeps components small, progressively composable, and close to the
            server-rendered workflows they support.
          </p>
        </header>

        <div class="storybook-doc__grid">
          <section class="storybook-doc__section" aria-labelledby="atoms-heading">
            <h2 id="atoms-heading">Atoms</h2>
            <p>
              Atoms are the reusable visual primitives: buttons, cards, chips, switches, and table
              cells. They own stable CSS contracts and native accessibility semantics.
            </p>
          </section>

          <section class="storybook-doc__section" aria-labelledby="molecules-heading">
            <h2 id="molecules-heading">Molecules</h2>
            <p>
              Molecules group atoms into small interface patterns such as labelled form fields, HTMX
              forms, output pairs, scrollable tables, and walk-history rows.
            </p>
          </section>

          <section class="storybook-doc__section" aria-labelledby="organisms-heading">
            <h2 id="organisms-heading">Organisms</h2>
            <p>
              Organisms compose real product sections: the walk form, stats block, admin lists,
              invitation flows, and account review panels.
            </p>
          </section>

          <section class="storybook-doc__section" aria-labelledby="templates-heading">
            <h2 id="templates-heading">Templates</h2>
            <p>
              Templates define document chrome, asset loading, and layout boundaries. They are kept
              thin so pages can own workflow-specific composition.
            </p>
          </section>

          <section class="storybook-doc__section" aria-labelledby="pages-heading">
            <h2 id="pages-heading">Pages</h2>
            <p>
              Pages are included in Storybook as complete examples of how primitives, sections, and
              server-rendered state fit together in the app.
            </p>
          </section>
        </div>

        <aside class="storybook-doc__callout">
          <p>
            New UI should usually start as a page or organism story. Extract lower-level atoms or
            molecules only when a pattern repeats or needs a stable testing surface.
          </p>
        </aside>
      </article>,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: "Atomic design in this template" }),
    ).toBeInTheDocument();
  },
};
