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
| `Card`, `CardElement`, `CardProps` | Semantic surface rendered as `article`, `div`, `main`, or `section`, with size custom-property hooks. | `Components/Shared/Card` |
| `Chip`, `ChipProps` | Inline status text with optional class hook. | `Components/Shared/Chip` |
| `Icon`, `IconProps` | Decorative or labelled icon span with `muted`, `neutral`, `success`, or `warning` tone. | `Components/Shared` |
| `Panel`, `PanelProps` | Labelled section wrapper with default or narrow width. | `Components/Shared` |
| `Switch`, `SwitchProps` | Checkbox-backed icon toggle for themes, preferences, and HTMX-enhanced settings. | `Components/Shared/Switch` |
| `TableCell`, `TableCellProps` | Reusable table cell for string and number values. | `Components/Shared/TableCell` |
| `HtmxProps` | Shared prop interface for supported `hx-*` attributes such as `hx-post`, `hx-target`, `hx-swap`, and `hx-trigger`. | Shared form and control stories |
| `Accordion`, `AccordionItem`, `AccordionProps` | Grouped `details` disclosure list with optional metadata and controls. | `Components/Shared` |
| `CompactList`, `CompactListItem`, `CompactListProps` | Definition-list style rows for label, value, metadata, and controls. | `Components/Shared` |
| `FormField`, `FormFieldProps` | Labelled native input wrapper, or a label/control wrapper when children are supplied. | `Components/Shared/FormField` |
| `HxForm`, `HxFormProps` | Native `action`/`method` form wrapper that also spreads HTMX attributes for enhanced submissions. | `Components/Shared/HxForm` |
| `InputGroup`, `InputGroupProps` | Labelled input group for compact numeric or text-entry forms. | `Components/Shared/InputGroup` |
| `LabelledOutput`, `LabelledOutputProps` | Label/value output pair with placeholder behaviour for empty numbers. | `Components/Shared/LabelledOutput` |
| `PopoverMenu`, `PopoverMenuItem`, `PopoverMenuProps` | Button-controlled menu that can render links or small POST forms. | `Components/Shared` |
| `ScrollableTable`, `ScrollableTableColumn`, `ScrollableTableProps` | Sticky-header, scrollable table shell with responsive column and row sizing hooks. | `Components/Shared/ScrollableTable` |

Storybook is the canonical rendered reference. Shared package examples are grouped under
`Components/Shared`, while Walking Pace examples are grouped under `Components/Reference App`.
Individual Storybook examples are published at [`/storybook/`]({{ '/storybook/' | relative_url }}).

## Composition Patterns

| App Shape | Useful Exports | Boundary |
| --- | --- | --- |
| Server apps | `HxForm`, `FormField`, `Button`, `Panel` | Routes, validation, auth, and permissions stay local. |
| Static blogs | `Card`, `Panel`, `Badge`, `CompactList` | Content routing and editorial layout stay local. |
| Dashboards | `HxForm`, `ScrollableTable`, `TableCell`, `Badge`, `PopoverMenu` | Domain actions and role rules stay local. |
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

</div>
</div>
