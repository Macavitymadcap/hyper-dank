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
  `ChipProps`, `Icon`, `IconProps`, `Panel`, `PanelProps`, `Switch`, `SwitchProps`, `TableCell`,
  `TableCellProps`.
- Molecules: `Accordion`, `AccordionItem`, `AccordionProps`, `CompactList`, `CompactListItem`,
  `CompactListProps`, `FormField`, `FormFieldProps`, `HxForm`, `HxFormProps`, `InputGroup`,
  `InputGroupProps`, `LabelledOutput`, `LabelledOutputProps`, `PopoverMenu`, `PopoverMenuItem`,
  `PopoverMenuProps`, `ScrollableTable`, `ScrollableTableColumn`, `ScrollableTableProps`.
- Shared types: `HtmxProps`.
- CSS: `@macavitymadcap/hyper-dank-ui/styles.css`.

Compatibility coverage exercises these exports in Character Sheet-style, static blog,
dashboard/admin, static-demo, and server-app compositions. The public docs site documents every
export and points to Storybook examples for each component.

## Composition Patterns

- Server apps should pair `HxForm`, `FormField`, `Button`, and `Panel` with app-owned routes,
  validation, auth, and permissions.
- Static blogs can use `Card`, `Panel`, `Badge`, and `CompactList` for article summaries and
  metadata while keeping content routing in the static-site app.
- Dashboards and admin tools should combine `HxForm`, `ScrollableTable`, `TableCell`, `Badge`, and
  `PopoverMenu` for dense, progressively enhanced screens.
- Static demos can use `InputGroup`, `LabelledOutput`, `Button`, and `Panel` without importing
  server-only app code.

The shared components deliberately stop at generic structure and CSS contracts. Product language,
feature organisms, route paths, permissions, and persistence stay in the consuming application.
