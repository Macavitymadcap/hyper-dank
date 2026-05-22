---
layout: default
title: UI Library
permalink: /libraries/ui/
---

# UI Library

`@macavitymadcap/hyper-dank-ui` exposes server-rendered Hono JSX primitives plus a small CSS export.
It is for generic structure and HTML contracts, not product-specific screens.

<div class="library-layout">
<details class="library-side-nav" open>
  <summary>Library docs</summary>
  <nav aria-label="Library docs">
    <a href="{{ '/libraries/' | relative_url }}">Overview</a>
    <a aria-current="page" href="{{ '/libraries/ui/' | relative_url }}">UI</a>
    <a href="{{ '/libraries/data/' | relative_url }}">Data</a>
    <a href="{{ '/libraries/transport/' | relative_url }}">Transport</a>
    <a href="{{ '/libraries/automation/' | relative_url }}">Automation</a>
  </nav>
</details>

<div class="library-page">

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
| `Badge`, `BadgeProps` | Compact metadata label with `accent`, `neutral`, or `warning` tone. | `Components/Shared` |
| `Button`, `ButtonProps` | Native button with `primary`, `danger`, `outline`, `text`, and `ghost` variants plus optional HTMX attributes. | `Components/Shared/Button` |
| `ButtonGroup`, `ButtonGroupProps` | Toolbar-style grouping for related buttons or links. | `Components/Shared` |
| `Card`, `CardElement`, `CardProps` | Semantic surface rendered as `article`, `div`, `main`, or `section`, with size custom-property hooks. | `Components/Shared/Card` |
| `Callout`, `CalloutProps` | Highlighted prose block for documentation and product guidance. | `Components/Shared` |
| `CheckboxField`, `CheckboxFieldProps` | Labelled native checkbox with description and error hooks. | `Components/Shared` |
| `Chip`, `ChipProps` | Inline status text with optional class hook. | `Components/Shared/Chip` |
| `CodeBlock`, `CodeBlockProps` | Escaped code sample wrapper with optional language class. | `Components/Shared` |
| `Dialog`, `DialogProps` | Native dialog with trigger, close form, fallback content, and HTMX-friendly hooks. | `Components/Shared` |
| `EmptyState`, `EmptyStateProps` | Blank-state region with optional action slot. | `Components/Shared` |
| `Fieldset`, `FieldsetProps` | Grouped native controls with legend, hint, and error copy. | `Components/Shared` |
| `Icon`, `IconProps` | Decorative or labelled icon span with `muted`, `neutral`, `success`, or `warning` tone. | `Components/Shared` |
| `IconButton`, `IconButtonProps` | Icon-only native button with required accessible label. | `Components/Shared` |
| `LinkButton`, `LinkButtonProps` | Link styled with button variants while preserving normal navigation. | `Components/Shared` |
| `LoadingIndicator`, `LoadingIndicatorProps` | Polite loading status text for async regions. | `Components/Shared` |
| `MetadataList`, `MetadataListItem`, `MetadataListProps` | Definition-list metadata rows for compact summaries. | `Components/Shared` |
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
| `StatusSummary`, `StatusSummaryItem`, `StatusSummaryProps` | Definition-list status rows for review dashboards. | `Components/Shared` |
| `Switch`, `SwitchProps` | Checkbox-backed icon toggle for themes, preferences, and HTMX-enhanced settings. | `Components/Shared/Switch` |
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

Storybook is the canonical rendered reference. Shared package examples are grouped under
`Components/Shared`, while Walking Pace examples are grouped under `Components/Reference App`.
Individual Storybook examples are published at [`/storybook/`]({{ '/storybook/' | relative_url }}).

## Composition Patterns

| App Shape | Useful Exports | Boundary |
| --- | --- | --- |
| Server apps | `HxForm`, `FormField`, `Button`, `Panel` | Routes, validation, auth, and permissions stay local. |
| Static blogs | `Card`, `Panel`, `Badge`, `CompactList` | Content routing and editorial layout stay local. |
| Dashboards | `HxForm`, `ScrollableTable`, `TableCell`, `Badge`, `PopoverMenu`, `BasicGraph` | Domain actions, live data, analytics rules, and role rules stay local. |
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

</div>
</div>
