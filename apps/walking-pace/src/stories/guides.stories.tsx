import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
import { renderStory } from "./render";

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "General template documentation for usage, application flow, and the development pipeline.",
      },
    },
    layout: "fullscreen",
  },
  title: "Guides/Template",
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Usage: Story = {
  render: () =>
    renderStory(
      <article class="storybook-doc" aria-labelledby="usage-heading">
        <header class="storybook-doc__header">
          <p class="storybook-doc__eyebrow">Template guide</p>
          <h1 id="usage-heading" class="storybook-doc__title">
            Usage
          </h1>
          <p class="storybook-doc__lede">
            Hyper-Dank is a server-rendered Bun, Hono, HTMX, and JSX toolkit with Storybook
            documentation for the reusable UI surface.
          </p>
        </header>

        <div class="storybook-doc__grid">
          <section class="storybook-doc__section" aria-labelledby="usage-start-heading">
            <h2 id="usage-start-heading">Start locally</h2>
            <ol>
              <li>
                Install dependencies with <code class="storybook-doc__code">bun install</code>.
              </li>
              <li>
                Run the app with <code class="storybook-doc__code">bun run dev</code>.
              </li>
              <li>
                Run Storybook with <code class="storybook-doc__code">bun run storybook</code>.
              </li>
            </ol>
          </section>

          <section class="storybook-doc__section" aria-labelledby="usage-structure-heading">
            <h2 id="usage-structure-heading">Project structure</h2>
            <p>
              Application entrypoints live in <code class="storybook-doc__code">src/app.tsx</code>,
              component primitives live under{" "}
              <code class="storybook-doc__code">src/components</code>, and reusable story data lives
              in <code class="storybook-doc__code">src/stories</code>.
            </p>
          </section>

          <section class="storybook-doc__section" aria-labelledby="usage-theme-heading">
            <h2 id="usage-theme-heading">Theme model</h2>
            <p>
              Components consume shared CSS variables from the app stylesheet. Use the Storybook
              color-mode switch to review every page and docs panel in light or dark mode.
            </p>
          </section>
        </div>

        <aside class="storybook-doc__callout">
          <p>
            The Storybook catalog is intentionally component-first: each atom, molecule, organism,
            template, and page owns its controls, docs, and interaction checks beside the
            implementation.
          </p>
        </aside>
      </article>,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Usage" })).toBeInTheDocument();
    await expect(canvas.getByText("bun run storybook")).toBeInTheDocument();
  },
};

export const ApplicationFlow: Story = {
  render: () =>
    renderStory(
      <article class="storybook-doc" aria-labelledby="flow-heading">
        <header class="storybook-doc__header">
          <p class="storybook-doc__eyebrow">Template guide</p>
          <h1 id="flow-heading" class="storybook-doc__title">
            Application flow
          </h1>
          <p class="storybook-doc__lede">
            The template keeps request handling, auth, persistence, service logic, and UI rendering
            in clear layers so new vertical slices have an obvious path through the app.
          </p>
        </header>

        <div class="storybook-doc__grid">
          <section class="storybook-doc__section" aria-labelledby="flow-request-heading">
            <h2 id="flow-request-heading">Request boundary</h2>
            <p>
              Hono routes receive browser requests, call service functions, and return JSX-rendered
              HTML fragments that HTMX can swap into the current page.
            </p>
          </section>

          <section class="storybook-doc__section" aria-labelledby="flow-state-heading">
            <h2 id="flow-state-heading">Server state</h2>
            <p>
              Repositories own database access behind typed app contracts and adapters. Services
              compose those adapters into user-facing behaviors such as walks, invitations, and
              admin review.
            </p>
          </section>

          <section class="storybook-doc__section" aria-labelledby="flow-ui-heading">
            <h2 id="flow-ui-heading">UI composition</h2>
            <p>
              Atoms provide stable interaction primitives, molecules group local form and table
              structure, and organisms compose full product workflows.
            </p>
          </section>
        </div>

        <section class="storybook-doc__section" aria-labelledby="flow-add-heading">
          <h2 id="flow-add-heading">Adding a new workflow</h2>
          <ol>
            <li>Start with the route and service contract the browser needs.</li>
            <li>Add or adapt persistence through the database layer.</li>
            <li>Compose the UI from existing components before adding new primitives.</li>
            <li>Document the component path in Storybook with controls and a play test.</li>
          </ol>
        </section>
      </article>,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Application flow" })).toBeInTheDocument();
    await expect(canvas.getByText("Adding a new workflow")).toBeInTheDocument();
  },
};

export const TestingPipeline: Story = {
  render: () =>
    renderStory(
      <article class="storybook-doc" aria-labelledby="testing-heading">
        <header class="storybook-doc__header">
          <p class="storybook-doc__eyebrow">Template guide</p>
          <h1 id="testing-heading" class="storybook-doc__title">
            Testing pipeline
          </h1>
          <p class="storybook-doc__lede">
            The template uses a layered pipeline so fast checks stay cheap while Storybook and
            browser coverage protect the out-of-the-box experience.
          </p>
        </header>

        <div class="storybook-doc__grid">
          <section class="storybook-doc__section" aria-labelledby="testing-static-heading">
            <h2 id="testing-static-heading">Static checks</h2>
            <p>
              <code class="storybook-doc__code">bun run check</code> and{" "}
              <code class="storybook-doc__code">bun run typecheck</code> catch formatting, lint, and
              TypeScript regressions before runtime tests begin.
            </p>
          </section>

          <section class="storybook-doc__section" aria-labelledby="testing-unit-heading">
            <h2 id="testing-unit-heading">Unit and service tests</h2>
            <p>
              <code class="storybook-doc__code">bun run test</code> exercises core calculations,
              database adapters, auth paths, and service behavior without a browser.
            </p>
          </section>

          <section class="storybook-doc__section" aria-labelledby="testing-storybook-heading">
            <h2 id="testing-storybook-heading">Storybook tests</h2>
            <p>
              <code class="storybook-doc__code">bun run test:storybook</code> runs every story play
              function against the built Storybook so component docs double as UI smoke tests.
            </p>
          </section>
        </div>

        <aside class="storybook-doc__callout">
          <p>
            Component stories should include the smallest useful play check: assert the landmark,
            control output, form field, or table row that proves the documented state actually
            rendered.
          </p>
        </aside>
      </article>,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Testing pipeline" })).toBeInTheDocument();
    await expect(canvas.getByText("bun run test:storybook")).toBeInTheDocument();
  },
};
