---
layout: default
title: Libraries
---

# Libraries

Hyper-Dank is split into small Bun workspace packages so applications can consume only the contracts
they need. The packages are designed for server-rendered Hono JSX, progressive HTMX enhancement,
explicit database lifecycles, and consumer-style compatibility tests.

## Components

`@macavitymadcap/hyper-dank-components` exposes server-rendered Hono JSX primitives plus a small
CSS export. Import the CSS from the browser asset pipeline, then render components from server JSX.

```ts
import { Button, Card, FormField, HxForm, Switch } from "@macavitymadcap/hyper-dank-components";
import "@macavitymadcap/hyper-dank-components/styles.css";

export function InviteForm() {
  return (
    <Card as="section">
      <HxForm action="/admin/invitations" method="post" hx-post="/admin/invitations" hx-target="#admin-panel">
        <FormField id="email" label="Email" name="email" required type="email" />
        <Switch id="notify" label="Send email" name="notify" value="yes" />
        <Button>Invite user</Button>
      </HxForm>
    </Card>
  );
}
```

The CSS export is a baseline contract. App-specific layout and product styling should layer on top.
`Button`, `Switch`, `HxForm`, and any component that accepts `HtmxProps` keep the JSX prop names
identical to rendered `hx-*` attributes, so the HTML contract remains visible.

### Component API

| Export | Purpose | Demonstration |
| --- | --- | --- |
| `Badge`, `BadgeProps` | Compact metadata label with `accent`, `neutral`, or `warning` tone. | Character Sheet reuse story |
| `Button`, `ButtonProps` | Native button with `primary`, `danger`, `outline`, `text`, and `ghost` variants plus optional HTMX attributes. | `Components/Atoms/Button` |
| `Card`, `CardElement`, `CardProps` | Semantic surface rendered as `article`, `div`, `main`, or `section`, with size custom-property hooks. | `Components/Atoms/Card` |
| `Chip`, `ChipProps` | Inline status text with optional class hook. | `Components/Atoms/Chip` |
| `Icon`, `IconProps` | Decorative or labelled icon span with `muted`, `neutral`, `success`, or `warning` tone. | Character Sheet reuse story |
| `Panel`, `PanelProps` | Labelled section wrapper with default or narrow width. | Character Sheet reuse story |
| `Switch`, `SwitchProps` | Checkbox-backed icon toggle for themes, preferences, and HTMX-enhanced settings. | `Components/Atoms/Switch` |
| `TableCell`, `TableCellProps` | Reusable table cell for string and number values. | `Components/Atoms/TableCell` |
| `HtmxProps` | Shared prop interface for supported `hx-*` attributes such as `hx-post`, `hx-target`, `hx-swap`, and `hx-trigger`. | Button, Switch, and HxForm stories |
| `Accordion`, `AccordionItem`, `AccordionProps` | Grouped `details` disclosure list with optional metadata and controls. | Character Sheet reuse story |
| `CompactList`, `CompactListItem`, `CompactListProps` | Definition-list style rows for label, value, metadata, and controls. | Character Sheet reuse story |
| `FormField`, `FormFieldProps` | Labelled native input wrapper, or a label/control wrapper when children are supplied. | `Components/Molecules/FormField` |
| `HxForm`, `HxFormProps` | Native `action`/`method` form wrapper that also spreads HTMX attributes for enhanced submissions. | `Components/Molecules/HxForm` |
| `InputGroup`, `InputGroupProps` | Numeric/text input group used by the pace form pattern. | `Components/Molecules/InputGroup` |
| `LabelledOutput`, `LabelledOutputProps` | Label/value output pair with placeholder behaviour for empty numbers. | `Components/Molecules/LabelledOutput` |
| `PopoverMenu`, `PopoverMenuItem`, `PopoverMenuProps` | Button-controlled menu that can render links or small POST forms. | Character Sheet reuse story |
| `ScrollableTable`, `ScrollableTableColumn`, `ScrollableTableProps` | Sticky-header, scrollable table shell with responsive column and row sizing hooks. | `Components/Molecules/ScrollableTable` |

Individual Storybook examples are published at [`/storybook/`]({{ '/storybook/' | relative_url }}).
`Badge`, `Icon`, `Panel`, `Accordion`, `CompactList`, and `PopoverMenu` are demonstrated together in
`Components/Generic/Character Sheet Reuse`; the other public components have standalone component
stories.

### HTMX Form Pattern

Use `HxForm` when a control must work as normal HTML first and become fragment-driven when HTMX is
available.

```tsx
<HxForm
  action="/walks"
  method="post"
  hx-post="/walks"
  hx-target="#walks-list"
  hx-swap="outerHTML"
>
  <FormField id="miles" label="Miles" min={0.01} name="miles" required step="0.01" type="number" />
  <Button>Add walk</Button>
</HxForm>
```

Without JavaScript, the browser submits `POST /walks` through the native `action` and `method`.
With HTMX, the same form posts to `hx-post` and swaps the fragment named by `hx-target`.

## Database

`@macavitymadcap/hyper-dank-database` contains provider lifecycle and migration primitives. Apps keep
their domain repositories and schemas local, then use conformance tests to keep adapters honest.

```ts
import {
  type DatabaseProviderBase,
  type Migration,
  type MigrationStore,
  runPendingMigrations,
} from "@macavitymadcap/hyper-dank-database";

type Repositories = {
  walks: WalkRepository;
};

export type AppDatabaseProvider = DatabaseProviderBase<Repositories>;

const migrations: Migration[] = [{ id: "0001_create_walks", sql: "create table walks (...)" }];

export async function migrate(store: MigrationStore) {
  await runPendingMigrations(store, migrations);
}
```

### Database API

| Export | Purpose |
| --- | --- |
| `DatabaseAdapterKind` | Built-in adapter names, currently `sqlite` and `postgres`, while allowing app-specific string kinds. |
| `MaybePromise<T>` | Helper type for lifecycle methods that may be sync or async. |
| `DatabaseLifecycle` | Provider contract for `kind`, `migrate()`, and `close()`. |
| `RepositoryFactory<TRepositories>` | Contract for creating app-owned repositories from a provider. |
| `DatabaseProviderBase<TRepositories, TKind>` | Combined lifecycle and repository factory shape for app providers. |
| `Migration` | Immutable migration id plus SQL body. |
| `MigrationStore` | Adapter contract for checking, running, and recording migrations. |
| `runPendingMigrations` | Runs migrations in order, skipping ids already recorded by the store. |

The testing subpath exports a Bun test contract:

```ts
import {
  type DatabaseLifecycleHarness,
  describeDatabaseLifecycleContract,
} from "@macavitymadcap/hyper-dank-database/testing";

describeDatabaseLifecycleContract("SqliteDatabaseProvider", "sqlite", async () => {
  const provider = createSqliteProvider(":memory:");
  return {
    provider,
    cleanup: () => provider.close(),
  } satisfies DatabaseLifecycleHarness<typeof provider>;
});
```

`DatabaseLifecycleHarness` describes the provider and optional cleanup callback. `describeDatabaseLifecycleContract`
asserts that the provider exposes the expected kind, can migrate idempotently, and closes after the
contract run.

## HTTP

`@macavitymadcap/hyper-dank-http` contains generic form parsing, route parameter, error-message, and
HTMX response helpers. Auth, permissions, and product routes stay in the consuming app.

```ts
import { FormValues, HttpResponder, errorMessage, routeParam } from "@macavitymadcap/hyper-dank-http";

const responder = new HttpResponder();

app.post("/walks/:id", async (context) => {
  const id = routeParam(context, "id");
  const values = await FormValues.from(context);

  try {
    await saveWalk(id, {
      miles: values.string("miles"),
      minutes: values.string("minutes"),
    });
    return responder.redirectAfterAction(context, "/");
  } catch (error) {
    return context.text(errorMessage(error), 400);
  }
});
```

### HTTP API

| Export | Purpose |
| --- | --- |
| `FormValues` | Wraps parsed Hono form bodies and normalises missing or repeated values through `string(key)`. |
| `errorMessage` | Converts unknown thrown values into a safe message string. |
| `routeParam` | Reads a route parameter from a Hono context and returns an empty string when it is absent. |
| `HttpResponder` | Detects HTMX requests and centralises action redirects. |

`HttpResponder.redirectAfterAction()` returns `HX-Redirect` for HTMX requests and a normal redirect
for native requests. `redirectWithAuthCookies()` preserves cookies from an auth response while using
the same HTMX-aware redirect behaviour.
