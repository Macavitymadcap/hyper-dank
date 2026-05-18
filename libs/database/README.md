# Hyper-Dank Database

Database lifecycle and adapter-test primitives for Hyper-Dank apps.

App packages own their domain schemas and repositories. This package only defines shared provider
shape, migration helpers, and conformance checks that future adapters can reuse.

## Public Exports

- Main export: `DatabaseAdapterKind`, `MaybePromise`, `DatabaseLifecycle`, `RepositoryFactory`,
  `DatabaseProviderBase`, `Migration`, `MigrationStore`, and `runPendingMigrations`.
- Testing export: `DatabaseLifecycleHarness` and `describeDatabaseLifecycleContract` from
  `@macavitymadcap/hyper-dank-data/testing`.

The public docs site includes examples for provider typing, migration stores, and lifecycle contract
tests.
