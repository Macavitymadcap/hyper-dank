import type { Meta, StoryObj } from "@storybook/html-vite";
import { expect, userEvent, within } from "storybook/test";
import { Button } from "../atoms/Button";
import { Icon } from "../atoms/Icon";
import { IconButton } from "../atoms/IconButton";
import { LinkButton } from "../atoms/LinkButton";
import { ButtonGroup } from "../molecules/ButtonGroup";
import { CheckboxField } from "../molecules/CheckboxField";
import { CodeBlock } from "../molecules/CodeBlock";
import { Combobox } from "../molecules/Combobox";
import { Command } from "../molecules/Command";
import { Fieldset } from "../molecules/Fieldset";
import { PopoverMenu } from "../molecules/PopoverMenu";
import { RadioGroup } from "../molecules/RadioGroup";
import { SegmentedControl } from "../molecules/SegmentedControl";
import { SelectField } from "../molecules/SelectField";
import { TextareaField } from "../molecules/TextareaField";
import { ValidationSummary } from "../molecules/ValidationSummary";
import { ComponentReference } from "./component-reference";
import { renderStory, renderStoryWithActions } from "./render";
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
    renderStoryWithActions(
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
      {},
      [{ event: "submit", handler: () => undefined, preventDefault: true, selector: "form" }],
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Save" })).toBeInTheDocument();
    await expect(canvas.getByRole("button", { name: "Search" })).toBeInTheDocument();
    await expect(canvas.getByRole("link", { name: "View examples" })).toBeInTheDocument();
    await expect(canvas.getAllByRole("alert")).toHaveLength(2);
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await userEvent.click(canvas.getByRole("button", { name: "Search" }));
  },
};

export const SelectionAndCommands: Story = {
  render: () =>
    renderStoryWithActions(
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
          <ComponentReference
            className="storybook-doc__section--span-all"
            id="selection-reference"
            sections={{
              Purpose: [
                "Document the decision line between short fixed choices, native suggestions, compact actions, and app-owned command search.",
                "Show how selection controls compose while leaving state and filtering outside the shared package.",
              ],
              "Inputs and slots": [
                "SelectField and Radio-style controls receive labelled option arrays and native form names.",
                "Combobox receives datalist options; Command receives query, result items, and empty/loading copy; PopoverMenu receives link or POST action items.",
              ],
              "Rendered output": [
                "SelectField renders a labelled select, Combobox renders a labelled input plus datalist, and Command renders a search landmark with result links.",
                "PopoverMenu renders a trigger and a popover menu whose items remain native links or forms.",
              ],
              Accessibility: [
                "Every control is labelled, and help/error text stays connected to the relevant field.",
                "Command empty state uses a status region; PopoverMenu keeps controls keyboard reachable.",
              ],
              "App-owned behaviour": [
                "Apps own selected values, suggestion sources, filtering, remote loading, permissions, persistence, and destructive action handling.",
                "The shared primitives do not debounce, fetch, search, or infer menu permissions.",
              ],
              "CSS hooks": [
                ".select-field, .combobox, .command, .command-results, .command-empty, .popover-menu, .popover-menu-trigger, .popover-menu-panel, and .popover-menu-item.",
                "Apps can layer density, menu placement, and product search styling after the package CSS.",
              ],
            }}
          />
        </div>
      </article>,
      { size: "full" },
      [{ event: "submit", handler: () => undefined, preventDefault: true, selector: "form" }],
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
    await userEvent.click(canvas.getByRole("button", { name: "Open selection actions" }));
    await userEvent.click(canvas.getByRole("menuitem", { name: "Archive selected" }));
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
