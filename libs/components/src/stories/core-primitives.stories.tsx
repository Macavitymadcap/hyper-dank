import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, within } from "storybook/test";
import { Button } from "../atoms/Button";
import { Icon } from "../atoms/Icon";
import { IconButton } from "../atoms/IconButton";
import { LinkButton } from "../atoms/LinkButton";
import { ButtonGroup } from "../molecules/ButtonGroup";
import { CheckboxField } from "../molecules/CheckboxField";
import { CodeBlock } from "../molecules/CodeBlock";
import { Combobox } from "../molecules/Combobox";
import { Command } from "../molecules/Command";
import { DateField } from "../molecules/DateField";
import { Fieldset } from "../molecules/Fieldset";
import { FileField } from "../molecules/FileField";
import { NumberField } from "../molecules/NumberField";
import { PopoverMenu } from "../molecules/PopoverMenu";
import { RadioGroup } from "../molecules/RadioGroup";
import { RangeField } from "../molecules/RangeField";
import { SegmentedControl } from "../molecules/SegmentedControl";
import { SelectField } from "../molecules/SelectField";
import { TextareaField } from "../molecules/TextareaField";
import { ValidationSummary } from "../molecules/ValidationSummary";
import { renderStory } from "./render";
import { sharedIconStoryNames } from "./storybook-coverage";

const iconGroups = [
  {
    id: "actions",
    label: "Actions",
    names: ["add", "delete", "download", "edit", "filter", "save", "search", "settings", "upload"],
  },
  {
    id: "navigation",
    label: "Navigation",
    names: ["close", "external-link", "home", "map", "menu"],
  },
  {
    id: "status",
    label: "Status",
    names: ["check", "lock", "shield", "sparkles", "star", "warning"],
  },
  {
    id: "objects-theme",
    label: "Objects and theme",
    names: [
      "book",
      "calendar",
      "database",
      "dice",
      "document",
      "folder",
      "moon",
      "sun",
      "tag",
      "user",
    ],
  },
] as const;

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
          <NumberField
            id="estimate"
            label="Estimate"
            helpText="Native number input; unit conversion stays in the app."
            min={1}
            step={1}
            value={3}
          />
          <DateField
            id="publish-date"
            label="Publish date"
            helpText="Date-range logic and parsing stay app-owned."
            value="2026-05-27"
          />
          <FileField
            id="attachment"
            label="Attachment"
            helpText="Upload handling and async validation stay in route code."
            accept=".md,text/markdown"
          />
          <RangeField
            id="confidence"
            label="Confidence"
            helpText="Value formatting stays in the app."
            min={0}
            max={100}
            step={5}
            value={75}
            valueLabel="75%"
          />
          <SelectField
            id="status"
            label="Status"
            options={[
              { label: "Draft", value: "draft" },
              { label: "Published", value: "published" },
            ]}
          />
          <CheckboxField id="featured" label="Featured" helpText="Show in highlighted lists." />
          <NumberField
            id="compact-estimate"
            label="Compact estimate"
            density="compact"
            disabled
            value={2}
          />
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
    await expect(canvasElement.querySelector("#estimate")).toHaveAttribute("type", "number");
    await expect(canvasElement.querySelector("#publish-date")).toHaveAttribute("type", "date");
    await expect(canvasElement.querySelector("#attachment")).toHaveAttribute("type", "file");
    await expect(canvasElement.querySelector("#confidence")).toHaveAttribute("type", "range");
    await expect(canvas.getByRole("button", { name: "Search" })).toBeInTheDocument();
    await expect(canvas.getByRole("link", { name: "View examples" })).toBeInTheDocument();
    await expect(canvas.getAllByRole("alert")).toHaveLength(2);
  },
};

export const SelectionAndCommands: Story = {
  render: () =>
    renderStory(
      <article class="storybook-doc" aria-labelledby="selection-heading">
        <header class="storybook-doc__header">
          <p class="storybook-doc__eyebrow">Selection and command contract</p>
          <h1 id="selection-heading" class="storybook-doc__title">
            Selection and commands
          </h1>
          <p class="storybook-doc__lede">
            Use native select controls for short fixed sets, Combobox for native datalist
            suggestions, PopoverMenu for compact actions, and Command when an app owns search,
            filtering, loading, and persistence.
          </p>
        </header>
        <div class="storybook-doc__grid storybook-doc__grid--two">
          <section class="storybook-doc__section" aria-labelledby="selection-preview-heading">
            <h2 id="selection-preview-heading">Rendered output</h2>
            <SelectField
              id="selection-status"
              label="Status"
              value="planned"
              options={[
                { label: "Planned", value: "planned" },
                { label: "In progress", value: "in-progress" },
                { label: "Done", value: "done" },
              ]}
            />
            <Combobox
              id="selection-owner"
              label="Owner"
              helpText="Native datalist suggestions; the app supplies and validates values."
              placeholder="Start typing a name"
              options={[
                { label: "Ada Lovelace", value: "Ada" },
                { label: "Grace Hopper", value: "Grace" },
              ]}
            />
            <Command
              id="selection-command"
              label="Command search"
              query="pub"
              helpText="Filtering, remote loading, and persistence stay in app code."
              items={[
                {
                  current: true,
                  description: "Open the active publishing queue",
                  href: "/publishing",
                  label: "Open publishing queue",
                  value: "publishing",
                },
                {
                  description: "Create a draft from the current route",
                  href: "/drafts/new",
                  label: "Create draft",
                  value: "draft",
                },
              ]}
            />
            <Command
              id="selection-command-empty"
              label="Empty command search"
              emptyText="No commands match this app-owned query."
              items={[]}
            />
            <PopoverMenu
              id="selection-actions"
              label="Open selection actions"
              items={[
                { current: true, href: "/items", label: "View items" },
                { href: "/items/export", label: "Export items" },
                { href: "/items/archive", label: "Archive selected", method: "post" },
              ]}
            />
          </section>
          <section class="storybook-doc__section" aria-labelledby="selection-contract-heading">
            <h2 id="selection-contract-heading">Contract</h2>
            <ul>
              <li>SelectField is the default for short, fixed option sets.</li>
              <li>Combobox renders a labelled input and native datalist fallback.</li>
              <li>Command renders accessible search and results markup but owns no filtering.</li>
              <li>PopoverMenu is the menu-style action selector for links and POST fallbacks.</li>
              <li>Apps own loading, validation, permissions, selected values, and persistence.</li>
            </ul>
          </section>
          <CodeBlock
            className="storybook-doc__section storybook-doc__section--span-all"
            language="tsx"
            code={`import { Combobox, Command, PopoverMenu, SelectField } from "@macavitymadcap/hyper-dank-ui";

export function SelectionTools() {
  return (
    <>
      <SelectField
        id="status"
        label="Status"
        options={[
          { label: "Planned", value: "planned" },
          { label: "Done", value: "done" },
        ]}
      />
      <Combobox
        id="owner"
        label="Owner"
        options={[{ label: "Ada Lovelace", value: "Ada" }]}
      />
      <Command
        id="command"
        label="Command search"
        items={[{ href: "/publishing", label: "Open publishing queue", value: "publishing" }]}
      />
      <PopoverMenu
        id="actions"
        label="Open actions"
        items={[{ href: "/archive", label: "Archive selected", method: "post" }]}
      />
    </>
  );
}`}
          />
        </div>
      </article>,
      { size: "full" },
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: "Selection and commands" }),
    ).toBeInTheDocument();
    await expect(canvasElement.querySelector("#selection-owner")).toHaveAttribute(
      "list",
      "selection-owner-list",
    );
    await expect(canvas.getByRole("searchbox", { name: "Command search" })).toBeInTheDocument();
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "No commands match this app-owned query.",
    );
    await expect(
      canvas.getByRole("button", { name: "Open selection actions" }),
    ).toBeInTheDocument();
  },
};

export const IconCatalogue: Story = {
  render: () =>
    renderStory(
      <div class="storybook-doc">
        <header class="storybook-doc__header">
          <p class="storybook-doc__eyebrow">Shared icon contract</p>
          <h1 class="storybook-doc__title">Icon catalogue</h1>
          <p class="storybook-doc__lede">
            Every published generic icon renders through the shared Icon primitive with a stable
            name, accessible label support, and theme-aware colour inheritance.
          </p>
        </header>

        <div class="storybook-icon-catalogue">
          {iconGroups.map((group) => (
            <section class="storybook-doc__section" aria-labelledby={`icon-group-${group.id}`}>
              <h2 id={`icon-group-${group.id}`}>{group.label}</h2>
              <ul class="storybook-icon-grid">
                {group.names.map((name) => (
                  <li class="storybook-icon-card" data-icon-name={name}>
                    <Icon name={name} label={name} />
                    <code class="storybook-icon-name">{name}</code>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { name: "Icon catalogue" })).toBeInTheDocument();
    await expect(canvas.getAllByRole("listitem")).toHaveLength(sharedIconStoryNames.length);
    await expect(canvas.getByRole("img", { name: "save" })).toBeInTheDocument();
    await expect(canvas.getByRole("img", { name: "dice" })).toBeInTheDocument();
    await expect(canvas.getByRole("img", { name: "sun" })).toBeInTheDocument();
    await expect(canvas.getByRole("img", { name: "moon" })).toBeInTheDocument();
  },
};
