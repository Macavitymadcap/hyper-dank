# Hyper-Dank Components

Server-rendered Hono JSX components for Hyper-Dank apps. Use this package for reusable controls,
feedback, navigation, tables, panels, and small content patterns; keep product screens and domain
copy in the consuming app.

## Installation

`@macavitymadcap/hyper-dank-ui` is public on npm:

```bash
npm install @macavitymadcap/hyper-dank-ui hono typescript
```

Package page: <https://www.npmjs.com/package/@macavitymadcap/hyper-dank-ui>

Static docs: <https://macavitymadcap.github.io/hyper-dank/libraries/ui/>

Consumer setup: <https://macavitymadcap.github.io/hyper-dank/libraries/consumer-setup/>

For local package development, pack the Hyper-Dank workspace and install the tarball into a
downstream app:

```bash
# from hyper-dank
bun run pack:packages

# from a downstream app
bun add ../hyper-dank/.cache/packages/macavitymadcap-hyper-dank-ui-0.1.1.tgz
bun add hono typescript
```

The package peers on `hono` for server-rendered JSX and `typescript` for declaration-aware tooling.
The tarball route is verified by `bun run test:packages`, which installs the package into a clean
temporary app outside this workspace and imports it by package name.

Future npm releases use trusted publishing with provenance and staged package approval so a
maintainer can review the release before it becomes public.

```ts
import {
  BasicGraph,
  Button,
  Card,
  HxForm,
  Panel,
  ScrollableTable,
  Switch,
} from "@macavitymadcap/hyper-dank-ui";
```

The package publishes source for Bun/workspace consumers and declaration files in `dist/`.
Import `@macavitymadcap/hyper-dank-ui/styles.css` when an app wants the baseline
component class contracts.

```ts
import "@macavitymadcap/hyper-dank-ui/styles.css";
```

The CSS export is intentionally small. It preserves generic class and variant hooks such as
`.button[data-variant="ghost"]`, `.switch[data-variant="compact"]`, and `.form-field`; consuming apps
own their product layout and can layer app-specific styling after the package import.

Vite-backed consumers can import the CSS from their browser entry. Bun/Hono consumers that render
server-side JSX should still include the CSS through the browser bundle or another static asset
pipeline; importing the package in server code does not automatically load styles in the browser.

## Public Exports

- Atoms: `Badge`, `BadgeProps`, `Button`, `ButtonProps`, `Card`, `CardElement`, `CardProps`, `Chip`,
  `ChipProps`, `Icon`, `IconProps`, `IconButton`, `IconButtonProps`, `LinkButton`,
  `LinkButtonProps`, `Panel`, `PanelProps`, `Switch`, `SwitchProps`, `TableCell`,
  `TableCellProps`.
- Molecules: `Accordion`, `AccordionItem`, `AccordionProps`, `AppShell`, `AppShellProps`,
  `BasicGraph`, `BasicGraphDatum`, `BasicGraphProps`, `Breadcrumbs`, `BreadcrumbItem`,
  `BreadcrumbsProps`, `ButtonGroup`, `ButtonGroupProps`, `Callout`, `CalloutProps`,
  `CheckboxField`, `CheckboxFieldProps`, `CodeBlock`, `CodeBlockProps`, `Combobox`,
  `ComboboxOption`, `ComboboxProps`, `Command`, `CommandItem`, `CommandProps`, `CompactList`,
  `CompactListItem`, `CompactListProps`, `Dialog`, `DialogProps`, `EmptyState`,
  `EmptyStateProps`, `Fieldset`, `FieldsetProps`, `FormField`, `FormFieldProps`, `HxForm`,
  `HxFormProps`, `InputGroup`, `InputGroupProps`, `LabelledOutput`,
  `LabelledOutputProps`, `LoadingIndicator`, `LoadingIndicatorProps`, `MetadataList`,
  `MetadataListItem`, `MetadataListProps`, `Notice`, `NoticeProps`, `PageHeader`,
  `PageHeaderProps`, `Pagination`, `PaginationProps`, `PopoverMenu`, `PopoverMenuItem`,
  `PopoverMenuProps`, `Progress`, `ProgressProps`, `Prose`, `ProseProps`, `RadioGroup`,
  `RadioGroupOption`, `RadioGroupProps`, `ScrollableTable`, `ScrollableTableColumn`,
  `ScrollableTableProps`, `SectionHeader`, `SectionHeaderProps`, `SegmentedControl`,
  `SegmentedControlOption`, `SegmentedControlProps`, `SelectField`, `SelectFieldOption`,
  `SelectFieldProps`, `SideNav`, `SideNavItem`, `SideNavProps`, `StatBlock`, `StatBlockProps`,
  `StatusSummary`, `StatusSummaryItem`, `StatusSummaryProps`, `Tabs`, `TabItem`, `TabsProps`,
  `TextareaField`, `TextareaFieldProps`, `TimelineList`, `TimelineListItem`,
  `TimelineListProps`, `Toolbar`, `ToolbarProps`, `ValidationSummary`, `ValidationSummaryItem`,
  `ValidationSummaryProps`.
- Shared types: `HtmxProps`.
- CSS: `@macavitymadcap/hyper-dank-ui/styles.css`.

Compatibility coverage exercises these exports in server-app, static blog, dashboard/admin,
static-demo, and script-consumer compositions. Storybook is the canonical component reference for
rendered states, accessibility notes, and interaction examples.

For the public docs API page, see <https://macavitymadcap.github.io/hyper-dank/libraries/ui/>.
For rendered component contracts, see the published Storybook route at
<https://macavitymadcap.github.io/hyper-dank/storybook/>.

## Composition Patterns

- Server apps should pair `HxForm`, `FormField`, `Button`, and `Panel` with app-owned routes,
  validation, auth, and permissions.
- Static blogs can use `Card`, `Panel`, `Badge`, and `CompactList` for article summaries and
  metadata while keeping content routing in the static-site app.
- Dashboards and admin tools should combine `HxForm`, `ScrollableTable`, `TableCell`, `Badge`, and
  `PopoverMenu` with `AppShell`, `PageHeader`, `Toolbar`, `Tabs`, `Pagination`, `StatBlock`,
  `StatusSummary`, and `BasicGraph` for dense, progressively enhanced screens with small static
  data visualisations.
- Dense forms should use `SelectField` for short fixed sets, `Combobox` when native datalist
  suggestions help but submitted values remain app-owned, `PopoverMenu` for compact actions, and
  `Command` for app-wide command search where filtering and loading stay in the consuming app.
- Static demos can use `InputGroup`, `LabelledOutput`, `Button`, and `Panel` without importing
  server-only app code.
- Docs and static blogs can use `Prose`, `CodeBlock`, `Callout`, `MetadataList`, `TimelineList`,
  `Breadcrumbs`, and `SideNav` while keeping routing and content collections app-owned.

The shared components deliberately stop at generic structure and CSS contracts. Product language,
feature organisms, route paths, permissions, and persistence stay in the consuming application.

## BasicGraph Contract

`BasicGraph` renders a static SVG chart inside a `<figure>` for small dashboard, documentation, and
content-summary views. It is intentionally not an analytics engine: the consuming app owns data
queries, aggregation, live updates, interactivity, and domain labels.

| Prop | Contract |
| --- | --- |
| `id` | Required stable id used to connect the SVG title and description. Use a unique value per page. |
| `title` | Required human-readable chart title. Rendered in the SVG `<title>` and visible caption. |
| `data` | Required array of `{ label, value }` points. Labels appear in the accessible summary. Values are non-negative numbers scaled against `max` or the largest data value. |
| `kind` | Optional `"bar"` or `"line"` chart. Defaults to `"bar"`. |
| `summary` | Optional accessible summary. When omitted, the component builds one from labels and formatted values. |
| `valueFormatter` | Optional formatter for values in generated summaries. It does not change graph geometry. |
| `max` | Optional scale maximum. Use it when several graphs must share a visual scale. |
| `width`, `height` | Optional SVG viewBox dimensions. Defaults to `320` by `160`; CSS keeps the graph responsive. |
| `className` | Optional extra class for app styling. Baseline hooks include `.basic-graph`, `.basic-graph-svg`, `.basic-graph-bar`, `.basic-graph-line`, `.basic-graph-point`, and `.basic-graph-caption`. |

The graph uses `role="img"` with labelled title and description, and the visible caption repeats the
summary so sighted users get the same context. Colours inherit from `currentColor` through the
`--hd-accent` custom property, so apps can make it respond to light, dark, or product themes without
changing component markup.

For app-shape guidance, see the public recipes under `site/recipes.md` and `site/recipes-*.md`.
