---
layout: default
title: UI Library
permalink: /libraries/ui/
---

# UI Library

`@macavitymadcap/hyper-dank-ui` exposes server-rendered Hono JSX primitives plus a small CSS export.
It is for generic structure and HTML contracts, not product-specific screens.

<div class="library-layout">
<details class="docs-side-nav library-side-nav" open>
  <summary aria-label="Toggle library docs navigation"><span class="docs-side-nav__icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M4 5.5c3 0 5 .7 8 2.2 3-1.5 5-2.2 8-2.2v12c-3 0-5 .7-8 2.2-3-1.5-5-2.2-8-2.2z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"/></svg></span><span class="docs-side-nav__label">Library docs</span><span class="docs-side-nav__mobile-label">Libraries</span></summary>
  <nav aria-label="Library docs">
    <a href="{{ '/libraries/' | relative_url }}">Overview</a>
    <a href="{{ '/libraries/consumer-setup/' | relative_url }}">Consumer setup</a>
    <a href="{{ '/libraries/publication-evidence/' | relative_url }}">Publication evidence</a>
    <a aria-current="page" href="{{ '/libraries/ui/' | relative_url }}">UI</a>
    <a href="{{ '/libraries/data/' | relative_url }}">Data</a>
    <a href="{{ '/libraries/transport/' | relative_url }}">Transport</a>
    <a href="{{ '/libraries/automation/' | relative_url }}">Automation</a>
  </nav>
</details>

<div class="library-page">

## Install

Install from npm with the JSX and type tooling peers:

```bash
npm install @macavitymadcap/hyper-dank-ui hono typescript
```

Package: [view on npm](https://www.npmjs.com/package/@macavitymadcap/hyper-dank-ui).

Import components from server JSX and import the CSS through the browser asset pipeline. Importing a
component in server code does not automatically load browser styles.

```ts
import { Button, Card, FormField, HxForm, Switch } from "@macavitymadcap/hyper-dank-ui";
import "@macavitymadcap/hyper-dank-ui/styles.css";

export function SettingsForm() {
  return (
    <Card as="section">
      <HxForm action="/settings" method="post" hx-post="/settings" hx-target="#settings-panel">
        <FormField id="display-name" label="Display name" name="displayName" required />
        <Switch id="notifications" label="Notifications" name="notifications" value="enabled" />
        <Button>Save settings</Button>
      </HxForm>
    </Card>
  );
}
```

The CSS export preserves generic hooks such as `.button[data-variant="ghost"]`,
`.switch[data-variant="compact"]`, and `.form-field`. Product layout and visual identity should
layer after the package CSS.

## Component API

| Export | Purpose | Demonstration |
| --- | --- | --- |
| `AspectRatio`, `AspectRatioProps` | Fixed-ratio media/content frame with `--aspect-ratio` styling hook. | `Components/Shared/Low State Primitives` |
| `Avatar`, `AvatarProps` | Compact user identity image or initials fallback with size hooks. | `Components/Shared/Low State Primitives` |
| `Badge`, `BadgeProps` | Compact metadata label with `accent`, `neutral`, or `warning` tone. | `Components/Shared` |
| `Button`, `ButtonProps` | Native button with `primary`, `danger`, `outline`, `text`, and `ghost` variants plus optional HTMX attributes. | `Components/Shared/Button` |
| `ButtonGroup`, `ButtonGroupProps` | Toolbar-style grouping for related buttons or links. | `Components/Shared` |
| `Card`, `CardElement`, `CardProps` | Semantic surface rendered as `article`, `div`, `main`, or `section`, with size custom-property hooks. | `Components/Shared/Card` |
| `Callout`, `CalloutProps` | Highlighted prose block for documentation and product guidance. | `Components/Shared` |
| `CheckboxField`, `CheckboxFieldProps` | Labelled native checkbox with description and error hooks. | `Components/Shared` |
| `Chip`, `ChipProps` | Inline status text with optional class hook. | `Components/Shared/Chip` |
| `CodeBlock`, `CodeBlockProps` | Escaped code sample wrapper with optional language class. | `Components/Shared` |
| `Combobox`, `ComboboxOption`, `ComboboxProps` | Labelled native datalist input for app-owned suggestions and validation. | `Components/Shared/Core Primitives` |
| `Command`, `CommandItem`, `CommandProps` | Search landmark and result options for app-owned command filtering and loading. | `Components/Shared/Core Primitives` |
| `Dialog`, `DialogProps` | Native dialog with trigger, close form, fallback content, and HTMX-friendly hooks. | `Components/Shared` |
| `EmptyState`, `EmptyStateProps` | Blank-state region with optional action slot. | `Components/Shared` |
| `Fieldset`, `FieldsetProps` | Grouped native controls with legend, hint, and error copy. | `Components/Shared` |
| `Icon`, `IconProps` | Decorative or labelled icon span with `muted`, `neutral`, `success`, or `warning` tone. | `Components/Shared` |
| `IconButton`, `IconButtonProps` | Icon-only native button with required accessible label. | `Components/Shared` |
| `Kbd`, `KbdProps` | Inline keyboard input hint for shortcuts and command help. | `Components/Shared/Low State Primitives` |
| `LinkButton`, `LinkButtonProps` | Link styled with button variants while preserving normal navigation. | `Components/Shared` |
| `LoadingIndicator`, `LoadingIndicatorProps` | Polite loading status text for async regions. | `Components/Shared` |
| `MetadataList`, `MetadataListItem`, `MetadataListProps` | Definition-list metadata rows for compact summaries. | `Components/Shared` |
| `NotificationBanner`, `NotificationBannerProps`, `NotificationSeverity` | Page-level feedback banner with severity roles, shape hooks, and static live-region semantics. | `Components/Shared/App Surfaces And Feedback` |
| `Notice`, `NoticeProps` | Tonal feedback block with appropriate status or alert semantics. | `Components/Shared` |
| `PageHeader`, `PageHeaderProps` | Page title, description, metadata, and action slots. | `Components/Shared` |
| `Pagination`, `PaginationProps` | Link-backed page navigation with current-state output. | `Components/Shared` |
| `Panel`, `PanelProps` | Labelled section wrapper with default or narrow width. | `Components/Shared` |
| `Progress`, `ProgressProps` | Native progress output with accessible label. | `Components/Shared` |
| `Prose`, `ProseProps` | Article wrapper for readable documentation or editorial content. | `Components/Shared` |
| `RadioGroup`, `RadioGroupOption`, `RadioGroupProps` | Fieldset-backed radio options with help and error hooks. | `Components/Shared` |
| `SectionHeader`, `SectionHeaderProps` | Section title, optional copy, and action slot. | `Components/Shared` |
| `SegmentedControl`, `SegmentedControlOption`, `SegmentedControlProps` | Radio-backed mode switcher for mutually exclusive choices. | `Components/Shared` |
| `SelectField`, `SelectFieldOption`, `SelectFieldProps` | Labelled native select with options, hint, and error hooks. | `Components/Shared` |
| `SideNav`, `SideNavItem`, `SideNavProps` | Labelled section navigation with current-state output. | `Components/Shared` |
| `StatBlock`, `StatBlockProps` | Definition-list metric block for dashboard summaries. | `Components/Shared` |
| `StatusSymbol`, `StatusSymbolProps`, `StatusTone` | Inline status marker that pairs label, shape, and severity without relying on colour alone. | `Components/Shared/App Surfaces And Feedback` |
| `StatusSummary`, `StatusSummaryItem`, `StatusSummaryProps` | Definition-list status rows for review dashboards. | `Components/Shared` |
| `Switch`, `SwitchProps` | Checkbox-backed icon toggle for themes, preferences, and HTMX-enhanced settings. | `Components/Shared/Switch` |
| `TableFilterSummary`, `TableFilterSummaryItem`, `TableFilterSummaryProps` | Polite table status region for result counts, active filters, and reset links. | `Components/Shared/Molecules/ScrollableTable` |
| `TableCell`, `TableCellProps` | Reusable table cell for string and number values. | `Components/Shared/TableCell` |
| `Tabs`, `TabItem`, `TabsProps` | Link-backed tabs with current-state semantics. | `Components/Shared` |
| `TextareaField`, `TextareaFieldProps` | Labelled native textarea with hint and error hooks. | `Components/Shared` |
| `TimelineList`, `TimelineListItem`, `TimelineListProps` | Ordered event list with optional time and metadata. | `Components/Shared` |
| `Toolbar`, `ToolbarProps` | Compact labelled action region for dense screens. | `Components/Shared` |
| `ValidationSummary`, `ValidationSummaryItem`, `ValidationSummaryProps` | Alert region linking validation messages to form controls. | `Components/Shared` |
| `HtmxProps` | Shared prop interface for supported `hx-*` attributes such as `hx-post`, `hx-target`, `hx-swap`, and `hx-trigger`. | Shared form and control stories |
| `Accordion`, `AccordionItem`, `AccordionProps` | Grouped `details` disclosure list with optional metadata and controls. | `Components/Shared/Reusable Patterns` |
| `AppShell`, `AppShellProps` | Landmark shell with header, navigation, and main content slots. | `Components/Shared` |
| `BasicGraph`, `BasicGraphDatum`, `BasicGraphProps` | Small accessible SVG graph for static dashboard, docs, and content examples. | `Components/Shared/Reusable Patterns` |
| `Breadcrumbs`, `BreadcrumbItem`, `BreadcrumbsProps` | Ordered breadcrumb navigation for docs and app sections. | `Components/Shared` |
| `CompactList`, `CompactListItem`, `CompactListProps` | Definition-list style rows for label, value, metadata, and controls. | `Components/Shared/Reusable Patterns` |
| `FormField`, `FormFieldProps` | Labelled native input wrapper, or a label/control wrapper when children are supplied. | `Components/Shared/FormField` |
| `HxForm`, `HxFormProps` | Native `action`/`method` form wrapper that also spreads HTMX attributes for enhanced submissions. | `Components/Shared/HxForm` |
| `InputGroup`, `InputGroupProps` | Labelled input group for compact numeric or text-entry forms. | `Components/Shared/InputGroup` |
| `LabelledOutput`, `LabelledOutputProps` | Label/value output pair with placeholder behaviour for empty numbers. | `Components/Shared/LabelledOutput` |
| `PopoverMenu`, `PopoverMenuItem`, `PopoverMenuProps` | Button-controlled menu that can render links or small POST forms. | `Components/Shared/Reusable Patterns` |
| `ScrollableTable`, `ScrollableTableColumn`, `ScrollableTableProps` | Sticky-header, scrollable table shell with responsive column and row sizing hooks. | `Components/Shared/ScrollableTable` |
| `Separator`, `SeparatorProps` | Decorative or semantic separator for grouping dense controls and content. | `Components/Shared/Low State Primitives` |
| `Skeleton`, `SkeletonProps` | Labelled loading placeholder with line, block, and circle shapes. | `Components/Shared/Low State Primitives` |
| `Tooltip`, `TooltipProps` | Static contextual help with an explicit text label and focusable described trigger. | `Components/Shared/Low State Primitives` |

## Organism API

Import reusable app-region organisms from `@macavitymadcap/hyper-dank-ui/organisms`.

| Export | Purpose | Demonstration |
| --- | --- | --- |
| `ActionPanel`, `ActionPanelProps` | Grouped primary, secondary, and destructive workflow actions with app-owned controls and permission copy. | `Components/Shared/Organisms/Workflow` |
| `CopyField`, `CopyFieldProps` | Labelled read-only value with app-owned copy action hooks and accessible status output. | `Components/Shared/Organisms/Workflow` |
| `LiveRegionPanel`, `LiveRegionPanelProps` | Stable live-fragment target for HTMX/SSE-refreshed server state with loading and empty states. | `Components/Shared/Organisms/Workflow` |
| `StagedForm`, `StagedFormProps`, `StagedFormStep`, `StagedFormStepStatus` | Ordered multi-stage form layout with current, complete, unavailable, and error step states. | `Components/Shared/Organisms/StagedForm` |

Storybook is the canonical rendered reference. Shared package examples are grouped under
`Components/Shared`, while Walking Pace examples are grouped under `Components/Reference App`.
Individual Storybook examples are published at [`/storybook/`]({{ '/storybook/' | relative_url }}).

## Composition Patterns

| App Shape | Useful Exports | Boundary |
| --- | --- | --- |
| Server apps | `HxForm`, `FormField`, `Button`, `Panel` | Routes, validation, auth, and permissions stay local. |
| Static blogs | `Card`, `Panel`, `Badge`, `CompactList` | Content routing and editorial layout stay local. |
| Dashboards | `HxForm`, `ScrollableTable`, `TableFilterSummary`, `TableCell`, `Badge`, `PopoverMenu`, `Command`, `BasicGraph` | Domain actions, query construction, sorting, filtering, column preferences, row mutations, live data, analytics rules, and role rules stay local. |
| Dense forms | `SelectField`, `Combobox`, `PopoverMenu`, `Command`, `StagedForm` | Use native selects for short fixed sets, datalist suggestions for open text, menu actions for compact choices, command search only when the app owns filtering/loading, and staged forms when app routes own sequential step state. |
| Workflow regions | `CopyField`, `ActionPanel`, `LiveRegionPanel` | Share/copy behaviour, route permissions, event streams, persistence, and fragment content stay local. |
| Feedback | `StatusSymbol`, `NotificationBanner`, `Notice`, `ValidationSummary`, `Progress`, `StatusSummary`, `Badge` | Status copy, notification timing, toast queues, dismissal, persistence, and escalation rules stay local. |
| Static demos | `InputGroup`, `LabelledOutput`, `Button`, `Panel` | Demo state and calculation logic stay local. |

Use `HxForm` when a control must work as normal HTML first and become fragment-driven when HTMX is
available.

```tsx
<HxForm
  action="/items"
  method="post"
  hx-post="/items"
  hx-target="#items-list"
  hx-swap="outerHTML"
>
  <FormField id="title" label="Title" name="title" required />
  <Button>Add item</Button>
</HxForm>
```

## Staged Forms

Use `StagedForm` inside `HxForm` when a long form needs a shared progress list and current-step
panel, but the app still owns which steps are available. Steps accept `complete`, `current`,
`available`, `unavailable`, and `error` states plus optional native `href` and `hx-*` attributes.
The current panel can compose `Fieldset`, `FormField`, `ValidationSummary`, `ButtonGroup`, and
native submit buttons.

```tsx
import { StagedForm } from "@macavitymadcap/hyper-dank-ui/organisms";

<HxForm action="/articles/new" method="post" hx-post="/articles/new/stage" hx-target="#stages">
  <StagedForm
    id="stages"
    currentStepId="content"
    steps={[
      { id: "basics", label: "Basics", status: "complete", href: "/articles/new?stage=basics" },
      { id: "content", label: "Content", status: "current" },
      { id: "review", label: "Review", status: "unavailable" },
    ]}
    actions={<Button type="submit">Continue</Button>}
  >
    <FormField id="body" label="Body" name="body" />
  </StagedForm>
</HxForm>
```

Validation rules, dependent-step eligibility, saved data, permissions, and redirects stay in the
route or service layer. Branching workflows and client-side wizard engines are deliberately outside
the shared UI contract.

## BasicGraph

Use `BasicGraph` when a page needs a small static chart for comparison or trend context. It renders
an SVG with `role="img"`, a connected title and description, and a visible caption. The component is
for already-prepared values; apps still own analytics queries, aggregation, permissions, live data,
and any interactive exploration.

```tsx
<BasicGraph
  id="content-activity"
  title="Content activity"
  summary="Published content is trending upwards across three review periods."
  kind="line"
  data={[
    { label: "Week 1", value: 8 },
    { label: "Week 2", value: 13 },
    { label: "Week 3", value: 18 },
  ]}
/>
```

The component accepts `kind`, `data`, `max`, `summary`, `valueFormatter`, `width`, `height`, and
`className`. Its CSS uses `currentColor` and `--hd-accent`, so the graph can follow light, dark, or
app-specific themes without changing the JSX contract.

## Data Tables

Use `ScrollableTable` for semantic table markup that needs responsive column tracks, sticky headers,
scrollable bodies, loading and empty composition, pagination, and row-action columns. Column metadata
can expose `sortDirection` as `aria-sort`, while header content can be a normal link to an
app-owned sorted route. `TableFilterSummary` provides a polite summary of result counts, active
filters, and reset links.

Hyper-Dank does not sort, filter, persist column preferences, store selected rows, or run mutations.
Build those behaviours in the consuming app, then pass the resulting rows, links, labels, and
preferences into the shared markup primitives.

## Feedback Vocabulary

Use `info`, `success`, `warning`, and `danger` for page-level notification severity.
`StatusSymbol` also accepts `neutral` for compact inline metadata. Each marker exposes a shape hook,
not only a colour: circle for information, check for success, triangle for warning, octagon for
danger, and dot for neutral.

`NotificationBanner` maps `warning` and `danger` to assertive alerts, while `info` and `success`
remain polite status regions. Use it for page-level events. Use `Notice` for local panel or form
feedback, `ValidationSummary` for linked form errors, `Progress` and `LoadingIndicator` for async
work, and `StatusSummary` or `Badge` for compact dashboard metadata. Toast-style regions should stay
static landmarks in shared markup; client queues, timers, dismissal, stores, and persistence belong
in the consuming app.

</div>
</div>
