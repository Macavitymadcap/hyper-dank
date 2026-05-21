# Hyper-Dank Components

Server-rendered Hono JSX components shared by Hyper-Dank apps.

```ts
import {
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
  `Breadcrumbs`, `BreadcrumbItem`, `BreadcrumbsProps`, `ButtonGroup`, `ButtonGroupProps`,
  `Callout`, `CalloutProps`, `CheckboxField`, `CheckboxFieldProps`, `CodeBlock`,
  `CodeBlockProps`, `CompactList`, `CompactListItem`, `CompactListProps`, `Dialog`,
  `DialogProps`, `EmptyState`, `EmptyStateProps`, `Fieldset`, `FieldsetProps`, `FormField`,
  `FormFieldProps`, `HxForm`, `HxFormProps`, `InputGroup`, `InputGroupProps`, `LabelledOutput`,
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

## Composition Patterns

- Server apps should pair `HxForm`, `FormField`, `Button`, and `Panel` with app-owned routes,
  validation, auth, and permissions.
- Static blogs can use `Card`, `Panel`, `Badge`, and `CompactList` for article summaries and
  metadata while keeping content routing in the static-site app.
- Dashboards and admin tools should combine `HxForm`, `ScrollableTable`, `TableCell`, `Badge`, and
  `PopoverMenu` with `AppShell`, `PageHeader`, `Toolbar`, `Tabs`, `Pagination`, `StatBlock`, and
  `StatusSummary` for dense, progressively enhanced screens.
- Static demos can use `InputGroup`, `LabelledOutput`, `Button`, and `Panel` without importing
  server-only app code.
- Docs and static blogs can use `Prose`, `CodeBlock`, `Callout`, `MetadataList`, `TimelineList`,
  `Breadcrumbs`, and `SideNav` while keeping routing and content collections app-owned.

The shared components deliberately stop at generic structure and CSS contracts. Product language,
feature organisms, route paths, permissions, and persistence stay in the consuming application.

For app-shape guidance, see the public recipes in `site/recipes.md`.
