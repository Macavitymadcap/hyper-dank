import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
import { renderStory } from "../../stories/render";
import { type BreadcrumbItem, Breadcrumbs } from "./Breadcrumbs";

interface BreadcrumbsStoryArgs {
  items: BreadcrumbItem[];
}

const meta = {
  argTypes: {
    items: { control: "object" },
  },
  args: {
    items: [
      { href: "/", label: "Home" },
      { href: "/docs", label: "Docs" },
      { current: true, label: "Breadcrumbs" },
    ],
  },
  parameters: {
    docs: {
      description: {
        component:
          "Ordered breadcrumb navigation for linked ancestor pages and a current page that can render as non-link text.",
      },
    },
    layout: "fullscreen",
  },
  render: (args) =>
    renderStory(
      <section class="storybook-doc__section" aria-labelledby="breadcrumbs-heading">
        <h2 id="breadcrumbs-heading">Breadcrumbs</h2>
        <Breadcrumbs items={args.items} />
      </section>,
      { size: "compact" },
    ),
  tags: ["autodocs"],
  title: "Components/Shared/Molecules/Breadcrumbs",
} satisfies Meta<BreadcrumbsStoryArgs>;

export default meta;
type Story = StoryObj<BreadcrumbsStoryArgs>;

export const Playground: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const breadcrumb = within(canvas.getByRole("navigation", { name: "Breadcrumb" }));
    await expect(canvas.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    await expect(breadcrumb.getByText("Breadcrumbs")).toHaveAttribute("aria-current", "page");
  },
};

export const CurrentText: Story = {
  args: {
    items: [
      { href: "/", label: "Home" },
      { href: "/docs", label: "Docs" },
      { current: true, label: "Breadcrumbs" },
    ],
  },
};

export const LinkedCurrent: Story = {
  args: {
    items: [
      { href: "/", label: "Home" },
      { href: "/docs", label: "Docs" },
      { current: true, href: "/docs/breadcrumbs", label: "Breadcrumbs" },
    ],
  },
};
