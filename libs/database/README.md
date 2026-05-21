# Hyper-Dank Database

Database lifecycle and adapter-test primitives for Hyper-Dank apps.

App packages own their domain schemas and repositories. This package only defines shared provider
shape, migration helpers, and conformance checks that future adapters can reuse.

## Public Exports

- Main export: `DatabaseAdapterKind`, `MaybePromise`, `DatabaseLifecycle`, `RepositoryFactory`,
  `DatabaseProviderBase`, `ReadableRepository`, `WritableRepository`, `RepositoryContract`,
  `DatabaseProviderFactory`, `ProviderRegistry`, `createProviderRegistry`, `Migration`,
  `MigrationStore`, `MigrationPlan`, `SkippedMigration`, `validateMigrations`, `planMigrations`,
  and `runPendingMigrations`.
- Testing export: `DatabaseLifecycleHarness`, `ProviderHarness`, `RepositoryHarness`,
  `runRepositoryHarness`, `runWithProviderHarness`, and `describeDatabaseLifecycleContract` from
  `@macavitymadcap/hyper-dank-data/testing`.

## Repository Contracts

`ReadableRepository<TRecord, TId>` and `WritableRepository<TRecord, TId>` are small structural
contracts for app-owned repositories. They are useful when a dashboard, admin tool, or server app
has a conventional `findById`, `list`, `save`, and `delete` shape, but they do not require apps to
rename richer domain methods or hide SQL behind this package.

`RepositoryContract<TRecord, TId>` combines the readable and writable contracts. It is only a type:
there is no runtime base class and no schema, query builder, transaction, or model mapping layer.

## Provider Registry

`createProviderRegistry()` accepts app-owned provider factories keyed by adapter kind. The helper
selects the right factory and reports missing kinds clearly, while the app still parses environment
variables, constructs adapters, and decides which kind to request.

```ts
import { createProviderRegistry } from "@macavitymadcap/hyper-dank-data";

const providers = createProviderRegistry({
  sqlite: ({ path }: { path: string }) => createSqliteProvider(path),
  postgres: ({ databaseUrl }: { databaseUrl: string }) => createPostgresProvider(databaseUrl),
});

const provider = await providers.create("sqlite", { path: "./local.db" });
```

## Migration Planning

`validateMigrations()` checks migration ids before a store executes anything. It throws when a
migration id is blank or duplicated.

`planMigrations()` asks a `MigrationStore` which migrations are already recorded and returns a
`MigrationPlan` containing `pending` migrations plus `skipped` entries marked as
`already-applied`. It never calls `runMigration()` or `recordMigration()`, so apps can use it for
dry-run output.

`runPendingMigrations()` now validates and plans first, then executes only the pending migrations.
It remains backwards compatible for callers that ignore the return value, and callers that need
reporting can inspect the returned plan.

## Testing Harnesses

`runRepositoryHarness()` and `runWithProviderHarness()` centralise the setup/assertion/cleanup shape
used by adapter conformance tests. Provider harnesses close the provider before optional cleanup
runs. Repository harnesses leave domain assertions in the app test suite while keeping cleanup
predictable after both successful and failing assertions.

The public docs site includes examples for provider typing, migration stores, planning, and
lifecycle contract tests.

For app-shape guidance, see the public recipes in `site/recipes.md`.
