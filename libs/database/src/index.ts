export type DatabaseAdapterKind = "sqlite" | "postgres" | (string & {});

export type MaybePromise<T> = T | Promise<T>;

export interface ReadableRepository<TRecord, TId> {
  findById(id: TId): MaybePromise<TRecord | null>;
  list(): MaybePromise<TRecord[]>;
}

export interface WritableRepository<TRecord, TId> {
  delete(id: TId): MaybePromise<boolean>;
  save(record: TRecord): MaybePromise<TRecord>;
}

export type RepositoryContract<TRecord, TId> = ReadableRepository<TRecord, TId> &
  WritableRepository<TRecord, TId>;

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

export type DatabaseProviderFactory<TProvider, TEnvironment = unknown> = (
  environment: TEnvironment,
) => MaybePromise<TProvider>;

export type ProviderFactoryMap = Record<string, (...args: never[]) => MaybePromise<unknown>>;

type ProviderFactoryEnvironment<TFactory> = TFactory extends (
  environment: infer TEnvironment,
) => MaybePromise<unknown>
  ? TEnvironment
  : never;

type ProviderFactoryProvider<TFactory> = TFactory extends (
  ...args: never[]
) => MaybePromise<infer TProvider>
  ? Awaited<TProvider>
  : never;

export interface ProviderRegistry<TFactories extends ProviderFactoryMap> {
  create<TKey extends keyof TFactories & string>(
    kind: TKey,
    environment: ProviderFactoryEnvironment<TFactories[TKey]>,
  ): Promise<ProviderFactoryProvider<TFactories[TKey]>>;
  create(kind: string, environment: unknown): Promise<unknown>;
  has(kind: string): boolean;
  kinds(): Array<keyof TFactories & string>;
}

export function createProviderRegistry<TFactories extends ProviderFactoryMap>(
  factories: TFactories,
): ProviderRegistry<TFactories> {
  return {
    create: (async (kind: string, environment: unknown) => {
      const factory = factories[kind];
      if (!factory) throw new Error(`No database provider factory registered for kind "${kind}".`);

      return (factory as (environment: unknown) => MaybePromise<unknown>)(environment);
    }) as ProviderRegistry<TFactories>["create"],
    has(kind: string) {
      return kind in factories;
    },
    kinds() {
      return Object.keys(factories) as Array<keyof TFactories & string>;
    },
  };
}

export interface Migration {
  id: string;
  sql: string;
}

export interface MigrationStore {
  hasMigration(id: string): MaybePromise<boolean>;
  recordMigration(id: string): MaybePromise<void>;
  runMigration(migration: Migration): MaybePromise<void>;
}

export interface SkippedMigration {
  id: string;
  reason: "already-applied";
}

export interface MigrationPlan {
  applied: Migration[];
  pending: Migration[];
  skipped: SkippedMigration[];
}

export function validateMigrations(migrations: Migration[]) {
  const seen = new Set<string>();

  for (const migration of migrations) {
    if (!migration.id.trim()) throw new Error("Migration id must not be empty.");
    if (seen.has(migration.id)) throw new Error(`Duplicate migration id "${migration.id}".`);
    seen.add(migration.id);
  }

  return migrations;
}

export async function planMigrations(
  store: Pick<MigrationStore, "hasMigration">,
  migrations: Migration[],
): Promise<MigrationPlan> {
  validateMigrations(migrations);

  const pending: Migration[] = [];
  const skipped: SkippedMigration[] = [];

  for (const migration of migrations) {
    if (await store.hasMigration(migration.id)) {
      skipped.push({ id: migration.id, reason: "already-applied" });
      continue;
    }

    pending.push(migration);
  }

  return {
    applied: migrations.filter((migration) =>
      skipped.some((skippedMigration) => skippedMigration.id === migration.id),
    ),
    pending,
    skipped,
  };
}

export async function runPendingMigrations(store: MigrationStore, migrations: Migration[]) {
  const plan = await planMigrations(store, migrations);

  for (const migration of plan.pending) {
    await store.runMigration(migration);
    await store.recordMigration(migration.id);
  }

  return {
    ...plan,
    applied: plan.pending,
  };
}
