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
      { current: true, href: "/docs/breadcrumbs", label: "Breadcrumbs" },
    ],
  },
  parameters: {
    docs: {
      description: {
        component:
          "Ordered breadcrumb navigation with CSS-generated visual separators between sibling items.",
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
    const links = breadcrumb.getAllByRole("link");
    const secondItem = links[1]?.parentElement;

    if (!secondItem) throw new Error("Breadcrumb story must render at least two items.");

    const separator = getComputedStyle(secondItem, "::before").content;

    await expect(canvas.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    await expect(canvas.getByRole("link", { name: "Breadcrumbs" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(separator).toBe('"/"');
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
