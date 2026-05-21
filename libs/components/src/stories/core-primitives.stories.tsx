import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
import { Button } from "../atoms/Button";
import { Icon } from "../atoms/Icon";
import { IconButton } from "../atoms/IconButton";
import { LinkButton } from "../atoms/LinkButton";
import { ButtonGroup } from "../molecules/ButtonGroup";
import { CheckboxField } from "../molecules/CheckboxField";
import { Fieldset } from "../molecules/Fieldset";
import { RadioGroup } from "../molecules/RadioGroup";
import { SegmentedControl } from "../molecules/SegmentedControl";
import { SelectField } from "../molecules/SelectField";
import { TextareaField } from "../molecules/TextareaField";
import { ValidationSummary } from "../molecules/ValidationSummary";
import { renderStory } from "./render";
import { sharedIconStoryNames } from "./storybook-coverage";

const meta = {
  parameters: {
    docs: {
      description: {
        component:
          "Core app-builder primitives for actions, native form controls, validation, and the expanded icon catalogue. Components keep native fallbacks and expose stable class hooks for consuming apps.",
      },
    },
    layout: "fullscreen",
  },
  title: "Components/Shared/Core Primitives",
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const ActionsAndForms: Story = {
  render: () =>
    renderStory(
      <form class="storybook-doc__section" action="/examples" method="post">
        <ValidationSummary items={[{ href: "#title", message: "Enter a title" }]} />
        <Fieldset legend="Publishing options" description="Native form controls with shared hooks.">
          <TextareaField id="title" label="Title" error="Enter a title" />
          <SelectField
            id="status"
            label="Status"
            options={[
              { label: "Draft", value: "draft" },
              { label: "Published", value: "published" },
            ]}
          />
          <CheckboxField id="featured" label="Featured" helpText="Show in highlighted lists." />
          <RadioGroup
            legend="Format"
            name="format"
            value="article"
            options={[
              { label: "Article", value: "article" },
              { label: "Note", value: "note" },
            ]}
          />
          <SegmentedControl
            legend="View"
            name="view"
            value="preview"
            options={[
              { label: "Edit", value: "edit" },
              { label: "Preview", value: "preview" },
            ]}
          />
        </Fieldset>
        <ButtonGroup ariaLabel="Example actions">
          <Button type="submit">Save</Button>
          <IconButton icon="search" label="Search" variant="ghost" />
          <LinkButton href="/examples" variant="outline">
            View examples
          </LinkButton>
        </ButtonGroup>
      </form>,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Save" })).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Search" })).toBeInTheDocument();
    await expect(canvas.getByRole("link", { name: "View examples" })).toBeInTheDocument();
    await expect(canvas.getAllByRole("alert")).toHaveLength(2);
  },
};

export const IconCatalogue: Story = {
  render: () =>
    renderStory(
      <div class="storybook-doc__section">
        <div class="storybook-row">
          {sharedIconStoryNames.map((name) => (
            <span class="storybook-icon-sample">
              <Icon name={name} label={name} />
              <span>{name}</span>
            </span>
          ))}
        </div>
      </div>,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("img", { name: "save" })).toBeInTheDocument();
    await expect(canvas.getByRole("img", { name: "dice" })).toBeInTheDocument();
    await expect(canvas.getByRole("img", { name: "sun" })).toBeInTheDocument();
    await expect(canvas.getByRole("img", { name: "moon" })).toBeInTheDocument();
  },
};
