import { Callout, CompactList } from "@macavitymadcap/hyper-dank-ui";
import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
import { renderStory } from "./render";

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "Start here for the Hyper-Dank component contracts, composition rules, and consumer reference map.",
      },
    },
    layout: "fullscreen",
  },
  title: "Introduction/Component Contracts",
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const AtomicDesign: Story = {
  render: () =>
    renderStory(
      <article class="storybook-doc" aria-labelledby="component-system-heading">
        <header class="storybook-doc__header">
          <p class="storybook-doc__eyebrow">Consumer reference</p>
          <h1 id="component-system-heading" class="storybook-doc__title">
            Component contracts
          </h1>
          <p class="storybook-doc__lede">
            Hyper-Dank keeps components small, progressively composable, and close to the
            server-rendered workflows they support. Shared primitives document reusable guarantees;
            reference-app stories show one complete composition.
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
              forms, output pairs, scrollable tables, and compact record rows.
            </p>
          </section>

          <section class="storybook-doc__section" aria-labelledby="organisms-heading">
            <h2 id="organisms-heading">Organisms</h2>
            <p>
              Organisms compose real product sections: entry forms, stats blocks, admin lists,
              invitation flows, and account review panels in the reference app.
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
              server-rendered state fit together in a Hono and HTMX app.
            </p>
          </section>
        </div>

        <Callout title="Extraction rule">
          <p>
            New UI should usually start as a page or organism story. Extract lower-level atoms or
            molecules only when a pattern repeats or needs a stable testing surface.
          </p>
        </Callout>
      </article>,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Component contracts" })).toBeInTheDocument();
  },
};

export const ReferenceMap: Story = {
  render: () =>
    renderStory(
      <article class="storybook-doc" aria-labelledby="reference-map-heading">
        <header class="storybook-doc__header">
          <p class="storybook-doc__eyebrow">Component reference</p>
          <h1 id="reference-map-heading" class="storybook-doc__title">
            Reference map
          </h1>
          <p class="storybook-doc__lede">
            Component pages should explain the contract a consuming app relies on: inputs, rendered
            output, events, HTMX attributes, accessibility expectations, and ownership boundaries.
          </p>
        </header>

        <section class="storybook-doc__section" aria-labelledby="reference-rules-heading">
          <h2 id="reference-rules-heading">Documentation rules</h2>
          <CompactList
            className="storybook-reference-rules"
            items={[
              {
                label: "Inputs",
                value: "Props, child content, CSS custom properties, and HTMX attributes.",
              },
              {
                label: "Outputs",
                value: "Semantic HTML, data attributes, and class hooks.",
              },
              {
                label: "Events",
                value: "Native form, button, link, disclosure, and table interactions.",
              },
              {
                label: "Accessibility",
                value: "Labels, keyboard behaviour, landmarks, and focus targets.",
              },
              {
                label: "Ownership",
                value: "What stays app-specific rather than shared package logic.",
              },
            ]}
          />
        </section>

        <div class="storybook-doc__table-scroll" tabindex={0}>
          <table class="storybook-doc__table">
            <thead>
              <tr>
                <th scope="col">Group</th>
                <th scope="col">Use for</th>
                <th scope="col">Reference focus</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Atoms</td>
                <td>Single native elements or compact primitives.</td>
                <td>Props, native semantics, variants, class hooks, and keyboard expectations.</td>
              </tr>
              <tr>
                <td>Molecules</td>
                <td>Small reusable patterns such as forms, fields, outputs, and tables.</td>
                <td>
                  Child structure, HTMX contracts, responsive behaviour, and focus management.
                </td>
              </tr>
              <tr>
                <td>Organisms</td>
                <td>Product sections that compose multiple primitives into a task.</td>
                <td>
                  Workflow state, fragment targets, permission assumptions, and empty/error states.
                </td>
              </tr>
              <tr>
                <td>Pages and templates</td>
                <td>Full document or route-level examples.</td>
                <td>Landmarks, asset loading, route context, and complete user journeys.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="storybook-doc__table-scroll" tabindex={0}>
          <table class="storybook-doc__table">
            <thead>
              <tr>
                <th scope="col">Component</th>
                <th scope="col">Inputs</th>
                <th scope="col">Output and events</th>
                <th scope="col">Accessibility contract</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Button</td>
                <td>Variant, size, native type, optional HTMX attributes, disabled state.</td>
                <td>
                  Native button with data hooks; click and submit semantics remain browser-owned.
                </td>
                <td>Visible text or aria-label; disabled state must block interaction.</td>
              </tr>
              <tr>
                <td>HxForm</td>
                <td>Native action/method plus HTMX target, swap, trigger, and post attributes.</td>
                <td>
                  Progressive form that submits natively without JavaScript and swaps with HTMX.
                </td>
                <td>Children must provide labelled fields and a reachable submit control.</td>
              </tr>
              <tr>
                <td>ScrollableTable</td>
                <td>Column model, row children, scroll row counts, desktop/mobile sizing.</td>
                <td>Semantic table wrapped in a responsive scroll container.</td>
                <td>Column headers use scope; scrollable bodies receive keyboard focus.</td>
              </tr>
              <tr>
                <td>Reference app form</td>
                <td>Default field values, submit label, app-owned validation messages.</td>
                <td>HTMX-ready entry form targeting an app-owned history fragment.</td>
                <td>Numeric inputs keep short labels and native form fallback.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Reference map" })).toBeInTheDocument();
    await expect(canvas.getByRole("columnheader", { name: "Reference focus" })).toBeInTheDocument();
  },
};
