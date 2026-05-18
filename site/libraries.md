---
layout: default
title: Libraries
---

# Libraries

Hyper-Dank is split into small Bun workspace packages so applications can consume only the contracts
they need. The packages are designed for server-rendered Hono JSX, progressive HTMX enhancement,
explicit database lifecycles, reusable app automation, and consumer-style compatibility tests.

<div class="library-tabs" id="libraries" markdown="1">
  <nav class="library-tab-list" aria-label="Libraries">
    <a class="library-tab" href="#components">Components</a>
    <a class="library-tab" href="#database">Database</a>
    <a class="library-tab" href="#http">HTTP</a>
    <a class="library-tab" href="#scripts">Scripts</a>
  </nav>

  <section class="library-panel" id="components" markdown="1">
    <h2>Components</h2>

`@macavitymadcap/hyper-dank-components` exposes server-rendered Hono JSX primitives plus a small
CSS export. Import the CSS from the browser asset pipeline, then render components from server JSX.

```ts
import { Button, Card, FormField, HxForm, Switch } from "@macavitymadcap/hyper-dank-components";
import "@macavitymadcap/hyper-dank-components/styles.css";

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

The CSS export is a baseline contract. App-specific layout and product styling should layer on top.
`Button`, `Switch`, `HxForm`, and any component that accepts `HtmxProps` keep the JSX prop names
identical to rendered `hx-*` attributes, so the HTML contract remains visible.

### Component API

| Export | Purpose | Demonstration |
| --- | --- | --- |
| `Badge`, `BadgeProps` | Compact metadata label with `accent`, `neutral`, or `warning` tone. | Generic component story |
| `Button`, `ButtonProps` | Native button with `primary`, `danger`, `outline`, `text`, and `ghost` variants plus optional HTMX attributes. | `Components/Atoms/Button` |
| `Card`, `CardElement`, `CardProps` | Semantic surface rendered as `article`, `div`, `main`, or `section`, with size custom-property hooks. | `Components/Atoms/Card` |
| `Chip`, `ChipProps` | Inline status text with optional class hook. | `Components/Atoms/Chip` |
| `Icon`, `IconProps` | Decorative or labelled icon span with `muted`, `neutral`, `success`, or `warning` tone. | Generic component story |
| `Panel`, `PanelProps` | Labelled section wrapper with default or narrow width. | Generic component story |
| `Switch`, `SwitchProps` | Checkbox-backed icon toggle for themes, preferences, and HTMX-enhanced settings. | `Components/Atoms/Switch` |
| `TableCell`, `TableCellProps` | Reusable table cell for string and number values. | `Components/Atoms/TableCell` |
| `HtmxProps` | Shared prop interface for supported `hx-*` attributes such as `hx-post`, `hx-target`, `hx-swap`, and `hx-trigger`. | Button, Switch, and HxForm stories |
| `Accordion`, `AccordionItem`, `AccordionProps` | Grouped `details` disclosure list with optional metadata and controls. | Generic component story |
| `CompactList`, `CompactListItem`, `CompactListProps` | Definition-list style rows for label, value, metadata, and controls. | Generic component story |
| `FormField`, `FormFieldProps` | Labelled native input wrapper, or a label/control wrapper when children are supplied. | `Components/Molecules/FormField` |
| `HxForm`, `HxFormProps` | Native `action`/`method` form wrapper that also spreads HTMX attributes for enhanced submissions. | `Components/Molecules/HxForm` |
| `InputGroup`, `InputGroupProps` | Numeric/text input group used by the pace form pattern. | `Components/Molecules/InputGroup` |
| `LabelledOutput`, `LabelledOutputProps` | Label/value output pair with placeholder behaviour for empty numbers. | `Components/Molecules/LabelledOutput` |
| `PopoverMenu`, `PopoverMenuItem`, `PopoverMenuProps` | Button-controlled menu that can render links or small POST forms. | Generic component story |
| `ScrollableTable`, `ScrollableTableColumn`, `ScrollableTableProps` | Sticky-header, scrollable table shell with responsive column and row sizing hooks. | `Components/Molecules/ScrollableTable` |

Individual Storybook examples are published at [`/storybook/`]({{ '/storybook/' | relative_url }}).
`Badge`, `Icon`, `Panel`, `Accordion`, `CompactList`, and `PopoverMenu` are demonstrated together in
generic component stories; the other public components have standalone component stories.

### HTMX Form Pattern

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

Without JavaScript, the browser submits through the native `action` and `method`.
With HTMX, the same form posts to `hx-post` and swaps the fragment named by `hx-target`.

  </section>

  <section class="library-panel" id="database" markdown="1">
    <h2>Database</h2>

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
  entries: EntryRepository;
};

export type AppDatabaseProvider = DatabaseProviderBase<Repositories>;

const migrations: Migration[] = [{ id: "0001_create_entries", sql: "create table entries (...)" }];

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

  </section>

  <section class="library-panel" id="http" markdown="1">
    <h2>HTTP</h2>

`@macavitymadcap/hyper-dank-http` contains generic form parsing, route parameter, error-message, and
HTMX response helpers. Auth, permissions, and product routes stay in the consuming app.

```ts
import { FormValues, HttpResponder, errorMessage, routeParam } from "@macavitymadcap/hyper-dank-http";

const responder = new HttpResponder();

app.post("/entries/:id", async (context) => {
  const id = routeParam(context, "id");
  const values = await FormValues.from(context);

  try {
    await saveEntry(id, {
      title: values.string("title"),
      status: values.string("status"),
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

  </section>

  <section class="library-panel" id="scripts" markdown="1">
    <h2>Scripts</h2>

`@macavitymadcap/hyper-dank-scripts` is planned in `pace-0030` as the shared automation package for
Hyper-Dank apps. It will collect reusable script behaviour from current Hyper-Dank projects so
future apps can keep their local entrypoints small.

```ts
import {
  getGitHubRepo,
  getGitHubToken,
  runVerification,
  waitForHttp,
} from "@macavitymadcap/hyper-dank-scripts";
```

### Planned Script API

| Group | Purpose |
| --- | --- |
| Process helpers | Run sync and async commands with predictable cwd, env, stdio, captured output, and allow-failure behaviour. |
| GitHub helpers | Parse repository remotes, discover tokens, make REST requests, find pull requests, and update PR bodies. |
| Verification helpers | Run ordered gates, stop on failure, and render Markdown verification reports. |
| Local server helpers | Start Hono/Bun test apps on dynamic ports, wait for health checks, and manage request cookies. |
| Browser helpers | Share Playwright/Puppeteer launch defaults, viewport presets, screenshot flows, and theme setup. |
| PR image helpers | Build and replace Markdown image sections for persisted PR screenshots. |
| A11y and smoke helpers | Run named Pa11y pages and smoke workflows while app-specific routes stay local. |

The first implementation target is this repository's script set. Consuming apps should keep
product-specific routes, fixtures, and smoke flows local while importing the shared automation
building blocks.

  </section>
</div>
