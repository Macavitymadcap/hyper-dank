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
<details class="docs-side-nav library-side-nav" open>
  <summary aria-label="Toggle library docs navigation"><span class="docs-side-nav__icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M4 5.5c3 0 5 .7 8 2.2 3-1.5 5-2.2 8-2.2v12c-3 0-5 .7-8 2.2-3-1.5-5-2.2-8-2.2z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"/></svg></span><span class="docs-side-nav__label">Library docs</span><span class="docs-side-nav__mobile-label">Libraries</span></summary>
  <nav aria-label="Library docs">
    <a href="{{ '/libraries/' | relative_url }}">Overview</a>
    <a href="{{ '/libraries/ui/' | relative_url }}">UI</a>
    <a aria-current="page" href="{{ '/libraries/data/' | relative_url }}">Data</a>
    <a href="{{ '/libraries/transport/' | relative_url }}">Transport</a>
    <a href="{{ '/libraries/automation/' | relative_url }}">Automation</a>
  </nav>
</details>

<div class="library-page">

## Install

Install from npm with TypeScript-aware tooling:

```bash
npm install @macavitymadcap/hyper-dank-data typescript
```

Package: [view on npm](https://www.npmjs.com/package/@macavitymadcap/hyper-dank-data).

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
| `MaybePromise` | Ungeneric export name for the maybe-sync helper type. |
| `ReadableRepository<TRecord, TId>` | Structural read contract for app repositories with `findById()` and `list()`. |
| `WritableRepository<TRecord, TId>` | Structural write contract for app repositories with `save()` and `delete()`. |
| `RepositoryContract<TRecord, TId>` | Combined readable and writable repository shape for conventional app-owned stores. |
| `DatabaseLifecycle` | Provider contract for `kind`, `migrate()`, and `close()`. |
| `RepositoryFactory<TRepositories>` | Contract for creating app-owned repositories from a provider. |
| `RepositoryFactory` | Ungeneric export name for repository factory contracts. |
| `DatabaseProviderBase<TRepositories, TKind>` | Combined lifecycle and repository factory shape for app providers. |
| `DatabaseProviderBase` | Ungeneric export name for app provider lifecycle plus repository factory contracts. |
| `DatabaseProviderFactory<TProvider, TEnvironment>` | Factory type for constructing an app provider from app-owned environment input. |
| `DatabaseProviderFactory` | Ungeneric export name for provider factory contracts. |
| `ProviderFactoryMap` | Internal registry constraint exposed for advanced typed registries. Most apps use inference through `createProviderRegistry()`. |
| `ProviderRegistry<TFactories>` | Typed registry returned by `createProviderRegistry()`. |
| `ProviderRegistry` | Ungeneric export name for typed provider registry results. |
| `createProviderRegistry` | Selects an app-owned provider factory by adapter kind and reports missing kinds clearly. |
| `Migration` | Immutable migration id plus SQL body. |
| `MigrationStore` | Adapter contract for checking, running, and recording migrations. |
| `SkippedMigration` | Dry-run metadata for a migration skipped because it is already applied. |
| `MigrationPlan` | Dry-run result containing applied, pending, and skipped migration entries. |
| `validateMigrations` | Validates migration ids and rejects blank or duplicate ids before execution. |
| `planMigrations` | Builds a dry-run migration plan without executing SQL or recording migrations. |
| `runPendingMigrations` | Validates, plans, and runs pending migrations in order, skipping ids already recorded by the store. |

## Function Reference

### `createProviderRegistry(factories)`

Creates a typed provider registry from app-owned provider factories.

| Contract | Detail |
| --- | --- |
| Parameters | `factories`: an object keyed by adapter kind, where each value accepts an app-owned environment object and returns a provider or promise. |
| Returns | `ProviderRegistry<TFactories>` with `create(kind, environment)`, `has(kind)`, and `kinds()`. |
| Throws | `create()` throws when the requested kind is not registered. |
| Side effects | None; provider factories run only when `create()` is called. |

### `validateMigrations(migrations)`

Checks migration identity before a store runs SQL.

| Contract | Detail |
| --- | --- |
| Parameters | `migrations`: ordered `Migration[]`. |
| Returns | The same migration array for convenient composition. |
| Throws | Blank ids and duplicate ids throw before any adapter work begins. |
| Side effects | None. |

### `planMigrations(store, migrations)`

Builds a dry-run migration plan.

| Contract | Detail |
| --- | --- |
| Parameters | `store`: any object with `hasMigration(id)`; `migrations`: ordered `Migration[]`. |
| Returns | `MigrationPlan` with `pending`, `applied`, and `skipped` entries. |
| Throws | Validation errors from `validateMigrations()` or errors raised by the store. |
| Side effects | Calls `hasMigration()` only; it does not run SQL or record migrations. |

### `runPendingMigrations(store, migrations)`

Executes pending migrations in order.

| Contract | Detail |
| --- | --- |
| Parameters | `store`: full `MigrationStore`; `migrations`: ordered `Migration[]`. |
| Returns | `MigrationPlan` where `applied` contains the migrations run during this call. |
| Throws | Validation errors or adapter errors from `hasMigration()`, `runMigration()`, or `recordMigration()`. |
| Side effects | Runs each pending migration and records its id after successful execution. |

`ReadableRepository`, `WritableRepository`, and `RepositoryContract` are type contracts only. Apps
still own repository method names beyond these conventional operations, query implementation,
schema design, transaction policy, and seed data.

Use the repository contracts when a reusable app surface only needs conventional operations:
`findById(id)`, `list()`, `save(record)`, and `delete(id)`. Pass the record and id types explicitly
so callers keep domain-specific field names and identifier types. If a domain needs richer verbs
such as `publishPost()`, `acceptInvite()`, or `recordPayment()`, keep those methods on the app
repository instead of forcing them into the generic contract.

`createProviderRegistry()` does not read `process.env`. Pass it factories that accept environment
objects already parsed by your app, then call `registry.create(kind, environment)` once the app has
decided which adapter kind to use. The registry preserves each factory's environment type, so
`registry.create("sqlite", { path })` and `registry.create("postgres", { databaseUrl })` can have
different input shapes. A missing kind throws a normal error that names the requested adapter.

`DatabaseProviderBase<TRepositories, TKind>` combines lifecycle and repository creation. A provider
should expose its `kind`, run its app migrations through `migrate()`, return repositories from
`createRepositories()`, and release connections in `close()`. The package does not define how many
repositories an app should have or whether they share a transaction boundary.

`planMigrations()` is the dry-run helper. It calls only `hasMigration(id)` on the store and returns
pending migrations plus skipped records such as `{ id: "0001", reason: "already-applied" }`.
`runPendingMigrations()` uses the same validation and planning path, then executes and records the
pending migrations. Existing callers that only awaited completion can keep doing so.

Migration ids are treated as immutable public history within an app. `validateMigrations()` rejects
blank and duplicate ids before any store work begins. A `MigrationStore` should make
`recordMigration(id)` durable only after `runMigration(migration)` succeeds, so a failed migration
can be retried by the app's normal deployment process.

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

`DatabaseLifecycleHarness` and its alias `ProviderHarness` describe the provider and optional cleanup callback.
`describeDatabaseLifecycleContract` asserts that the provider exposes the expected kind, can migrate
idempotently, and closes after the contract run.

`RepositoryHarness<TRepository>` describes an app-owned repository plus optional cleanup.
`runRepositoryHarness()` runs app assertions and then calls cleanup in a `finally` block, so adapter
contract suites can share the same setup pattern without importing application internals into the
shared package.

`runWithProviderHarness()` is the provider-level equivalent. It runs the assertion, calls
`provider.close()`, and then runs optional harness cleanup even when assertions fail.

| Testing Export | Purpose |
| --- | --- |
| `DatabaseLifecycleHarness` | Provider plus optional cleanup callback for lifecycle contract tests. |
| `ProviderHarness` | Alias for `DatabaseLifecycleHarness` where the provider naming reads better. |
| `RepositoryHarness` | Repository plus optional cleanup callback for app-owned repository contract tests. |
| `runRepositoryHarness` | Runs repository setup, assertions, and cleanup with a `finally` block. |
| `runWithProviderHarness` | Runs provider setup, assertions, provider close, and cleanup. |
| `describeDatabaseLifecycleContract` | Registers Bun tests for kind, idempotent migration, and close behaviour. |

Use `describeDatabaseLifecycleContract()` for provider-level behaviour and keep domain assertions in
your app test suite. The shared contract can prove that an adapter migrates, closes, and reports the
expected kind; the app still needs tests for constraints, query shape, ownership scoping, and
rollback or retry behaviour.

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
