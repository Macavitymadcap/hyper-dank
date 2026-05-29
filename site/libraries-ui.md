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
import { Button, Card, FormField, HxForm, StagedForm, Switch } from "@macavitymadcap/hyper-dank-ui";
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

Dense dashboards and admin regions can reduce visual gloss without replacing component CSS:

```tsx
<section data-hd-surface="quiet" data-hd-density="compact">
  <Card as="section">
    <SectionHeader title="Publishing queue" actions={<Button size="compact">Sync</Button>} />
    <StatusSummary title="Review" items={[{ label: "Checks", value: "Passed", tone: "success" }]} />
  </Card>
</section>
```

`data-hd-surface="quiet"` flattens shared gradients and softens surface, button, card, panel, form,
and low-state shadows through custom properties. `data-hd-density="compact"` tightens shared gaps,
padding, and default control rhythm for repeated operational screens.

## Component API

| Export | Purpose | Demonstration |
| --- | --- | --- |
| `AlertDialog`, `AlertDialogProps`, `AlertDialogTone` | Native alert dialog wrapper for destructive confirmation with fallback, cancel, confirm, and HTMX form hooks. | `Components/Shared/App Surfaces And Feedback` |
| `AspectRatio`, `AspectRatioProps` | Fixed-ratio media/content frame with `--aspect-ratio` styling hook. | `Components/Shared/Low State Primitives` |
| `Avatar`, `AvatarProps` | Compact user identity image or initials fallback with size hooks. | `Components/Shared/Low State Primitives` |
| `Badge`, `BadgeProps` | Compact metadata label with `accent`, `neutral`, or `warning` tone. | `Components/Shared/Existing Primitives` |
| `Button`, `ButtonProps` | Native button with `primary`, `danger`, `outline`, `text`, and `ghost` variants plus optional HTMX attributes. | `Components/Shared/Core Primitives` |
| `ButtonGroup`, `ButtonGroupProps` | Toolbar-style grouping for related buttons or links. | `Components/Shared/Core Primitives` |
| `Card`, `CardElement`, `CardProps` | Semantic surface rendered as `article`, `div`, `main`, or `section`, with size custom-property hooks. | `Components/Shared/Atoms/Card` |
| `Callout`, `CalloutProps` | Highlighted prose block for documentation and product guidance. | `Components/Shared/App Surfaces And Feedback` |
| `CheckboxField`, `CheckboxFieldProps` | Labelled native checkbox with description and error hooks. | `Components/Shared/Core Primitives` |
| `Chip`, `ChipProps` | Inline status text with optional class hook. | `Components/Shared/Atoms/Chip` |
| `CodeBlock`, `CodeBlockProps` | Escaped code sample wrapper with optional language class. | `Components/Shared/App Surfaces And Feedback` |
| `Combobox`, `ComboboxOption`, `ComboboxProps` | Labelled native datalist input for app-owned suggestions and validation. | `Components/Shared/Core Primitives` |
| `Command`, `CommandItem`, `CommandProps` | Search landmark and result options for app-owned command filtering and loading. | `Components/Shared/Core Primitives` |
| `Container`, `ContainerElement`, `ContainerProps`, `ContainerWidth` | Width-constrained semantic wrapper for small reusable composition regions. | `Components/Shared/Layout And Typography Utilities` |
| `DateField`, `DateFieldDensity`, `DateFieldProps` | Labelled native date input with hint, error, disabled, and compact-density hooks. | `Components/Shared/Core Primitives` |
| `Dialog`, `DialogProps` | Native dialog with trigger, close form, fallback content, and HTMX-friendly hooks. | `Components/Shared/App Surfaces And Feedback` |
| `Drawer`, `DrawerPlacement`, `DrawerProps` | Native dialog side panel for compact navigation, filters, and mobile panel composition. | `Components/Shared/App Surfaces And Feedback` |
| `EmptyState`, `EmptyStateProps` | Blank-state region with optional action slot. | `Components/Shared/App Surfaces And Feedback` |
| `Fieldset`, `FieldsetProps` | Grouped native controls with legend, hint, and error copy. | `Components/Shared/Core Primitives` |
| `FileField`, `FileFieldDensity`, `FileFieldProps` | Labelled native file input with accept, multiple, capture, hint, error, and disabled hooks. | `Components/Shared/Core Primitives` |
| `Grid`, `GridElement`, `GridProps` | Simple responsive grid helper with column, gap, and minimum-width custom-property hooks. | `Components/Shared/Layout And Typography Utilities` |
| `Heading`, `HeadingLevel`, `HeadingProps` | Semantic heading helper with separate visual-level hooks. | `Components/Shared/Layout And Typography Utilities` |
| `Icon`, `IconProps` | Decorative or labelled icon span with `muted`, `neutral`, `success`, or `warning` tone. | `Components/Shared/Core Primitives` |
| `IconButton`, `IconButtonProps` | Icon-only native button with required accessible label. | `Components/Shared/Core Primitives` |
| `Kbd`, `KbdProps` | Inline keyboard input hint for shortcuts and command help. | `Components/Shared/Low State Primitives` |
| `Link`, `LinkProps` | Native link helper with current-page and external-link affordances. | `Components/Shared/Layout And Typography Utilities` |
| `LinkButton`, `LinkButtonProps` | Link styled with button variants while preserving normal navigation. | `Components/Shared/Core Primitives` |
| `LoadingIndicator`, `LoadingIndicatorProps` | Polite loading status text for async regions. | `Components/Shared/App Surfaces And Feedback` |
| `MetadataList`, `MetadataListItem`, `MetadataListProps` | Definition-list metadata rows for compact summaries. | `Components/Shared/App Surfaces And Feedback` |
| `NotificationBanner`, `NotificationBannerProps`, `NotificationSeverity` | Page-level feedback banner with severity roles, shape hooks, and static live-region semantics. | `Components/Shared/App Surfaces And Feedback` |
| `Notice`, `NoticeProps` | Tonal feedback block with appropriate status or alert semantics. | `Components/Shared/App Surfaces And Feedback` |
| `NumberField`, `NumberFieldDensity`, `NumberFieldProps` | Labelled native number input with min, max, step, input mode, hint, error, disabled, and compact-density hooks. | `Components/Shared/Core Primitives` |
| `PageHeader`, `PageHeaderProps` | Page title, description, metadata, and action slots. | `Components/Shared/App Surfaces And Feedback` |
| `Pagination`, `PaginationProps` | Link-backed page navigation with current-state output. | `Components/Shared/App Surfaces And Feedback` |
| `Panel`, `PanelProps` | Labelled section wrapper with default or narrow width. | `Components/Shared/Existing Primitives` |
| `Progress`, `ProgressProps` | Native progress output with accessible label. | `Components/Shared/App Surfaces And Feedback` |
| `Prose`, `ProseProps` | Article wrapper for readable documentation or editorial content. | `Components/Shared/App Surfaces And Feedback` |
| `RadioGroup`, `RadioGroupOption`, `RadioGroupProps` | Fieldset-backed radio options with help and error hooks. | `Components/Shared/Core Primitives` |
| `RangeField`, `RangeFieldDensity`, `RangeFieldProps` | Labelled native range input with optional app-formatted visible value text. | `Components/Shared/Core Primitives` |
| `SectionHeader`, `SectionHeaderProps` | Section title, optional copy, and action slot. | `Components/Shared/App Surfaces And Feedback` |
| `SegmentedControl`, `SegmentedControlOption`, `SegmentedControlProps` | Radio-backed mode switcher for mutually exclusive choices. | `Components/Shared/Core Primitives` |
| `SelectField`, `SelectFieldOption`, `SelectFieldProps` | Labelled native select with options, hint, and error hooks. | `Components/Shared/Core Primitives` |
| `SideNav`, `SideNavItem`, `SideNavProps` | Labelled section navigation with current-state output. | `Components/Shared/App Surfaces And Feedback` |
| `StatBlock`, `StatBlockProps` | Definition-list metric block for dashboard summaries. | `Components/Shared/App Surfaces And Feedback` |
| `StagedForm`, `StagedFormProps`, `StagedFormStep`, `StagedFormStepStatus` | Ordered multi-stage form layout with current, complete, unavailable, and error step states. | `Components/Shared/App Surfaces And Feedback` |
| `StatusSymbol`, `StatusSymbolProps`, `StatusTone` | Inline status marker that pairs label, shape, and severity without relying on colour alone. | `Components/Shared/App Surfaces And Feedback` |
| `StatusSummary`, `StatusSummaryItem`, `StatusSummaryProps` | Definition-list status rows for review dashboards. | `Components/Shared/App Surfaces And Feedback` |
| `Switch`, `SwitchProps` | Checkbox-backed icon toggle for themes, preferences, and HTMX-enhanced settings. | `Components/Shared/Atoms/Switch` |
| `TableFilterSummary`, `TableFilterSummaryItem`, `TableFilterSummaryProps` | Polite table status region for result counts, active filters, and reset links. | `Components/Shared/Molecules/ScrollableTable` |
| `TableCell`, `TableCellProps` | Reusable table cell for string and number values. | `Components/Shared/Atoms/TableCell` |
| `Tabs`, `TabItem`, `TabsProps` | Link-backed tabs with current-state semantics. | `Components/Shared/App Surfaces And Feedback` |
| `TextareaField`, `TextareaFieldProps` | Labelled native textarea with hint and error hooks. | `Components/Shared/Core Primitives` |
| `TimelineList`, `TimelineListItem`, `TimelineListProps` | Ordered event list with optional time and metadata. | `Components/Shared/App Surfaces And Feedback` |
| `Toolbar`, `ToolbarProps` | Compact labelled action region for dense screens. | `Components/Shared/App Surfaces And Feedback` |
| `ValidationSummary`, `ValidationSummaryItem`, `ValidationSummaryProps` | Alert region linking validation messages to form controls. | `Components/Shared/Core Primitives` |
| `HtmxProps` | Shared prop interface for supported `hx-*` attributes such as `hx-post`, `hx-target`, `hx-swap`, and `hx-trigger`. | Shared form and control stories |
| `Accordion`, `AccordionItem`, `AccordionProps` | Grouped `details` disclosure list with optional metadata and controls. | `Components/Shared/Reusable Patterns` |
| `AppShell`, `AppShellProps` | Landmark shell with header, navigation, and main content slots. | `Components/Shared/App Surfaces And Feedback` |
| `BasicGraph`, `BasicGraphDatum`, `BasicGraphProps` | Small accessible SVG graph for static dashboard, docs, and content examples. | `Components/Shared/Reusable Patterns` |
| `Breadcrumbs`, `BreadcrumbItem`, `BreadcrumbsProps` | Ordered breadcrumb navigation for docs and app sections. | `Components/Shared/Molecules/Breadcrumbs` |
| `CompactList`, `CompactListItem`, `CompactListProps` | Definition-list style rows for label, value, metadata, and controls. | `Components/Shared/Reusable Patterns` |
| `FormField`, `FormFieldProps` | Labelled native input wrapper, or a label/control wrapper when children are supplied. | `Components/Shared/Molecules/FormField` |
| `HxForm`, `HxFormProps` | Native `action`/`method` form wrapper that also spreads HTMX attributes for enhanced submissions. | `Components/Shared/Molecules/HxForm` |
| `InputGroup`, `InputGroupProps` | Labelled input group for compact numeric or text-entry forms. | `Components/Shared/Molecules/InputGroup` |
| `LabelledOutput`, `LabelledOutputProps` | Label/value output pair with placeholder behaviour for empty numbers. | `Components/Shared/Molecules/LabelledOutput` |
| `PopoverMenu`, `PopoverMenuItem`, `PopoverMenuProps` | Button-controlled menu that can render links or small POST forms. | `Components/Shared/Reusable Patterns` |
| `ScrollableTable`, `ScrollableTableColumn`, `ScrollableTableProps` | Sticky-header, scrollable table shell with responsive column and row sizing hooks. | `Components/Shared/Molecules/ScrollableTable` |
| `Separator`, `SeparatorProps` | Decorative or semantic separator for grouping dense controls and content. | `Components/Shared/Low State Primitives` |
| `Skeleton`, `SkeletonProps` | Labelled loading placeholder with line, block, and circle shapes. | `Components/Shared/Low State Primitives` |
| `Stack`, `StackAlign`, `StackElement`, `StackProps` | Vertical spacing helper for compact local composition. | `Components/Shared/Layout And Typography Utilities` |
| `Text`, `TextElement`, `TextProps`, `TextSize`, `TextTone`, `TextWeight` | Readable text helper with size, tone, and weight hooks. | `Components/Shared/Layout And Typography Utilities` |
| `Tooltip`, `TooltipProps` | Static contextual help with an explicit text label and focusable described trigger. | `Components/Shared/Low State Primitives` |
| `VisuallyHidden`, `VisuallyHiddenProps` | Accessible hidden text helper for labels and summaries that should not be visible. | `Components/Shared/Layout And Typography Utilities` |

Storybook is the canonical rendered reference. Shared package examples are grouped under
`Components/Shared`, while Walking Pace examples are grouped under `Components/Reference App`.
This API table stays aligned with the current public exports and Storybook group names; `hd-0045`
owns the richer visual catalogue, and `hd-0053` owns deeper Storybook documentation shape work.
Individual Storybook examples are published at [`/storybook/`]({{ '/storybook/' | relative_url }}).

## Composition Patterns

| App Shape | Useful Exports | Boundary |
| --- | --- | --- |
| Server apps | `HxForm`, `FormField`, `Button`, `Panel` | Routes, validation, auth, and permissions stay local. |
| Static blogs | `Card`, `Panel`, `Badge`, `CompactList` | Content routing and editorial layout stay local. |
| Dashboards | `HxForm`, `ScrollableTable`, `TableFilterSummary`, `TableCell`, `Badge`, `PopoverMenu`, `Command`, `BasicGraph` | Domain actions, query construction, sorting, filtering, column preferences, row mutations, live data, analytics rules, and role rules stay local. Add `data-hd-surface="quiet"` or `data-hd-density="compact"` to dense regions when repeated surfaces need less gloss. |
| Dense forms | `NumberField`, `DateField`, `FileField`, `RangeField`, `SelectField`, `Combobox`, `PopoverMenu`, `Command`, `StagedForm` | Use native controls for common entry types, datalist suggestions for open text, menu actions for compact choices, command search only when the app owns filtering/loading, and staged forms when app routes own sequential step state. Upload handling, date-range logic, formatting/parsing, unit conversion, and async validation stay local. |
| Overlays and panels | `Dialog`, `AlertDialog`, `Drawer`, `SideNav`, `AppShell` | Use native dialogs for modal content and confirmations, and drawer panels for compact navigation or filters. Routes still own permissions, mutations, redirects, loaded content, and product navigation structure. |
| Feedback | `StatusSymbol`, `NotificationBanner`, `Notice`, `ValidationSummary`, `Progress`, `StatusSummary`, `Badge` | Status copy, notification timing, toast queues, dismissal, persistence, and escalation rules stay local. |
| Static demos | `InputGroup`, `LabelledOutput`, `Button`, `Panel` | Demo state and calculation logic stay local. |
| Utility composition | `Container`, `Stack`, `Grid`, `Heading`, `Text`, `Link`, `VisuallyHidden` | Use for small repeated spacing, width, readable text, and accessible-label glue. Product page layout, responsive breakpoints, route models, and brand typography stay local. |

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
