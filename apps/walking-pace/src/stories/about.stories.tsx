import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
import { renderStory } from "./render";

const meta = {
  parameters: {
    docs: {
      description: {
        component: "About page for Hyper-Dank and the included reference app.",
      },
    },
    layout: "fullscreen",
  },
  title: "Guides/About",
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const About: Story = {
  render: () =>
    renderStory(
      <article className="storybook-doc" aria-labelledby="about-heading">
        <header className="storybook-doc__header">
          <p className="storybook-doc__eyebrow">Hyper-Dank</p>
          <h1 id="about-heading" className="storybook-doc__title">
            About Hyper-Dank
          </h1>
          <p className="storybook-doc__lede">
            Hyper-Dank is a hypermedia-first toolkit for building server-rendered Hono, HTMX,
            TypeScript, and Bun applications.
          </p>
        </header>

        <div className="storybook-doc__grid">
          <section className="storybook-doc__section" aria-labelledby="about-toolkit-heading">
            <h2 id="about-toolkit-heading">Toolkit</h2>
            <p>
              Shared packages provide reusable component, database, and HTTP primitives without
              turning app-specific domains into framework code.
            </p>
          </section>

          <section className="storybook-doc__section" aria-labelledby="about-example-heading">
            <h2 id="about-example-heading">Reference app</h2>
            <p>
              Walking Pace Tracker remains the first app in the monorepo and demonstrates the
              toolkit in a small authenticated Hono + HTMX workflow without turning that domain into
              shared package logic.
            </p>
          </section>
        </div>
      </article>,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "About Hyper-Dank" })).toBeInTheDocument();
    await expect(canvas.getByText(/Walking Pace Tracker/)).toBeInTheDocument();
  },
};
