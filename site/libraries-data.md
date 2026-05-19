---
layout: default
title: Data Library
permalink: /libraries/data/
---

# Data Library

`@macavitymadcap/hyper-dank-data` contains database provider lifecycle and migration primitives.
Apps keep their domain schemas and repositories local, then use conformance tests to keep adapters
honest.

<div class="library-layout">
<details class="library-side-nav" open>
  <summary>Library docs</summary>
  <nav aria-label="Library docs">
    <a href="{{ '/libraries/' | relative_url }}">Overview</a>
    <a href="{{ '/libraries/ui/' | relative_url }}">UI</a>
    <a aria-current="page" href="{{ '/libraries/data/' | relative_url }}">Data</a>
    <a href="{{ '/libraries/transport/' | relative_url }}">Transport</a>
    <a href="{{ '/libraries/automation/' | relative_url }}">Automation</a>
  </nav>
</details>

<div class="library-page">

```ts
import {
  type DatabaseProviderBase,
  type Migration,
  type MigrationStore,
  runPendingMigrations,
} from "@macavitymadcap/hyper-dank-data";

type Repositories = {
  entries: EntryRepository;
};

export type AppDatabaseProvider = DatabaseProviderBase<Repositories>;

const migrations: Migration[] = [{ id: "0001_create_entries", sql: "create table entries (...)" }];

export async function migrate(store: MigrationStore) {
  await runPendingMigrations(store, migrations);
}
```

## Data API

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
} from "@macavitymadcap/hyper-dank-data/testing";

describeDatabaseLifecycleContract("SqliteDatabaseProvider", "sqlite", async () => {
  const provider = createSqliteProvider(":memory:");
  return {
    provider,
    cleanup: () => provider.close(),
  } satisfies DatabaseLifecycleHarness<typeof provider>;
});
```

`DatabaseLifecycleHarness` describes the provider and optional cleanup callback.
`describeDatabaseLifecycleContract` asserts that the provider exposes the expected kind, can migrate
idempotently, and closes after the contract run.

## Boundary

| Shared Package | Consuming App |
| --- | --- |
| Provider lifecycle shape. | Concrete provider construction and connection strings. |
| Migration ordering and recording contract. | Schema definitions and migration SQL content. |
| Lifecycle conformance tests. | Domain repository behaviour and transaction policy. |

</div>
</div>
