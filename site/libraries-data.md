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
  createProviderRegistry,
  type DatabaseProviderBase,
  type Migration,
  type MigrationStore,
  planMigrations,
  runPendingMigrations,
} from "@macavitymadcap/hyper-dank-data";

type Repositories = {
  entries: EntryRepository;
};

export type AppDatabaseProvider = DatabaseProviderBase<Repositories>;

const migrations: Migration[] = [{ id: "0001_create_entries", sql: "create table entries (...)" }];

export async function migrate(store: MigrationStore) {
  const plan = await planMigrations(store, migrations);
  console.log(`${plan.pending.length} migrations pending`);
  return runPendingMigrations(store, migrations);
}

export const providers = createProviderRegistry({
  sqlite: ({ path }: { path: string }) => createSqliteProvider(path),
  postgres: ({ databaseUrl }: { databaseUrl: string }) => createPostgresProvider(databaseUrl),
});
```

## Data API

| Export | Purpose |
| --- | --- |
| `DatabaseAdapterKind` | Built-in adapter names, currently `sqlite` and `postgres`, while allowing app-specific string kinds. |
| `MaybePromise<T>` | Helper type for lifecycle methods that may be sync or async. |
| `ReadableRepository<TRecord, TId>` | Structural read contract for app repositories with `findById()` and `list()`. |
| `WritableRepository<TRecord, TId>` | Structural write contract for app repositories with `save()` and `delete()`. |
| `RepositoryContract<TRecord, TId>` | Combined readable and writable repository shape for conventional app-owned stores. |
| `DatabaseLifecycle` | Provider contract for `kind`, `migrate()`, and `close()`. |
| `RepositoryFactory<TRepositories>` | Contract for creating app-owned repositories from a provider. |
| `DatabaseProviderBase<TRepositories, TKind>` | Combined lifecycle and repository factory shape for app providers. |
| `DatabaseProviderFactory<TProvider, TEnvironment>` | Factory type for constructing an app provider from app-owned environment input. |
| `ProviderRegistry<TFactories>` | Typed registry returned by `createProviderRegistry()`. |
| `createProviderRegistry` | Selects an app-owned provider factory by adapter kind and reports missing kinds clearly. |
| `Migration` | Immutable migration id plus SQL body. |
| `MigrationStore` | Adapter contract for checking, running, and recording migrations. |
| `SkippedMigration` | Dry-run metadata for a migration skipped because it is already applied. |
| `MigrationPlan` | Dry-run result containing applied, pending, and skipped migration entries. |
| `validateMigrations` | Validates migration ids and rejects blank or duplicate ids before execution. |
| `planMigrations` | Builds a dry-run migration plan without executing SQL or recording migrations. |
| `runPendingMigrations` | Validates, plans, and runs pending migrations in order, skipping ids already recorded by the store. |

`ReadableRepository`, `WritableRepository`, and `RepositoryContract` are type contracts only. Apps
still own repository method names beyond these conventional operations, query implementation,
schema design, transaction policy, and seed data.

`createProviderRegistry()` does not read `process.env`. Pass it factories that accept environment
objects already parsed by your app, then call `registry.create(kind, environment)` once the app has
decided which adapter kind to use.

`planMigrations()` is the dry-run helper. It calls only `hasMigration(id)` on the store and returns
pending migrations plus skipped records such as `{ id: "0001", reason: "already-applied" }`.
`runPendingMigrations()` uses the same validation and planning path, then executes and records the
pending migrations. Existing callers that only awaited completion can keep doing so.

The testing subpath exports a Bun test contract:

```ts
import {
  type DatabaseLifecycleHarness,
  runRepositoryHarness,
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

`RepositoryHarness<TRepository>` describes an app-owned repository plus optional cleanup.
`runRepositoryHarness()` runs app assertions and then calls cleanup in a `finally` block, so adapter
contract suites can share the same setup pattern without importing application internals into the
shared package.

## Boundary

| Shared Package | Consuming App |
| --- | --- |
| Provider lifecycle shape. | Concrete provider construction and connection strings. |
| Provider registry selection by app-provided kind. | Environment parsing and adapter construction. |
| Generic repository read/write type contracts. | Domain repository methods, queries, schemas, and transaction policy. |
| Migration ordering and recording contract. | Schema definitions and migration SQL content. |
| Migration validation and dry-run planning. | Migration file format, SQL execution details, and release policy. |
| Lifecycle and harness cleanup helpers. | Domain repository behaviour and adapter-specific contract assertions. |

</div>
</div>
