export type DatabaseAdapterKind = "sqlite" | "postgres" | (string & {});

export type MaybePromise<T> = T | Promise<T>;

export interface DatabaseLifecycle<TKind extends string = DatabaseAdapterKind> {
  readonly kind: TKind;
  close(): MaybePromise<void>;
  migrate(): MaybePromise<void>;
}

export interface RepositoryFactory<TRepositories> {
  createRepositories(): TRepositories;
}

export type DatabaseProviderBase<
  TRepositories,
  TKind extends string = DatabaseAdapterKind,
> = DatabaseLifecycle<TKind> & RepositoryFactory<TRepositories>;

export interface Migration {
  id: string;
  sql: string;
}

export interface MigrationStore {
  hasMigration(id: string): MaybePromise<boolean>;
  recordMigration(id: string): MaybePromise<void>;
  runMigration(migration: Migration): MaybePromise<void>;
}

export async function runPendingMigrations(store: MigrationStore, migrations: Migration[]) {
  for (const migration of migrations) {
    if (await store.hasMigration(migration.id)) continue;

    await store.runMigration(migration);
    await store.recordMigration(migration.id);
  }
}
