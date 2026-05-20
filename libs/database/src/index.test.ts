import { describe, expect, test } from "bun:test";
import {
  createProviderRegistry,
  planMigrations,
  type ReadableRepository,
  type RepositoryContract,
  runPendingMigrations,
  validateMigrations,
  type WritableRepository,
} from "./index";

interface Entry {
  id: string;
  title: string;
}

class MemoryEntryRepository implements RepositoryContract<Entry, string> {
  readonly #entries = new Map<string, Entry>();

  async findById(id: string) {
    return this.#entries.get(id) ?? null;
  }

  async list() {
    return Array.from(this.#entries.values());
  }

  async save(record: Entry) {
    this.#entries.set(record.id, record);
    return record;
  }

  async delete(id: string) {
    return this.#entries.delete(id);
  }
}

describe("repository contracts", () => {
  test("allow app-owned repositories to satisfy narrow read and write contracts", async () => {
    const repository = new MemoryEntryRepository();
    const reader: ReadableRepository<Entry, string> = repository;
    const writer: WritableRepository<Entry, string> = repository;

    await writer.save({ id: "entry-1", title: "Release notes" });

    expect(await reader.findById("entry-1")).toEqual({
      id: "entry-1",
      title: "Release notes",
    });
    expect(await reader.list()).toEqual([{ id: "entry-1", title: "Release notes" }]);
    expect(await writer.delete("missing")).toBe(false);
    expect(await writer.delete("entry-1")).toBe(true);
  });
});

describe("provider registry", () => {
  test("selects an app-owned provider factory without parsing environment itself", async () => {
    const registry = createProviderRegistry({
      postgres: ({ databaseUrl }: { databaseUrl: string }) => ({
        close: () => {},
        createRepositories: () => ({ entries: new MemoryEntryRepository() }),
        databaseUrl,
        kind: "postgres" as const,
        migrate: () => {},
      }),
      sqlite: ({ path }: { path: string }) => ({
        close: () => {},
        createRepositories: () => ({ entries: new MemoryEntryRepository() }),
        kind: "sqlite" as const,
        migrate: () => {},
        path,
      }),
    });

    const provider = await registry.create("postgres", { databaseUrl: "postgres://example" });

    expect(provider.kind).toBe("postgres");
    expect(provider.databaseUrl).toBe("postgres://example");
    expect(provider.createRepositories().entries).toBeInstanceOf(MemoryEntryRepository);
    expect(registry.kinds()).toEqual(["postgres", "sqlite"]);
  });

  test("reports missing provider kinds clearly", async () => {
    const registry = createProviderRegistry({
      sqlite: () => ({
        close: () => {},
        createRepositories: () => ({}),
        kind: "sqlite" as const,
        migrate: () => {},
      }),
    });

    await expect(registry.create("postgres", {})).rejects.toThrow(
      'No database provider factory registered for kind "postgres".',
    );
  });
});

describe("migration planning", () => {
  test("validates duplicate migration ids before execution", () => {
    expect(() =>
      validateMigrations([
        { id: "001_create_entries", sql: "create table entries" },
        { id: "001_create_entries", sql: "alter table entries add column title text" },
      ]),
    ).toThrow('Duplicate migration id "001_create_entries".');
  });

  test("describes applied and pending migrations without running them", async () => {
    const store = {
      hasMigration: (id: string) => id === "001_create_entries",
      recordMigration: () => {
        throw new Error("recordMigration should not run during planning");
      },
      runMigration: () => {
        throw new Error("runMigration should not run during planning");
      },
    };

    const plan = await planMigrations(store, [
      { id: "001_create_entries", sql: "create table entries" },
      { id: "002_add_status", sql: "alter table entries add column status text" },
    ]);

    expect(plan).toEqual({
      applied: [{ id: "001_create_entries", sql: "create table entries" }],
      pending: [{ id: "002_add_status", sql: "alter table entries add column status text" }],
      skipped: [{ id: "001_create_entries", reason: "already-applied" }],
    });
  });

  test("keeps runPendingMigrations idempotent while reusing migration validation", async () => {
    const applied: string[] = [];
    const executed: string[] = [];
    const migrations = [
      { id: "001_create_entries", sql: "create table entries" },
      { id: "002_add_status", sql: "alter table entries add column status text" },
    ];

    const store = {
      hasMigration: (id: string) => applied.includes(id),
      recordMigration: (id: string) => {
        applied.push(id);
      },
      runMigration: ({ id }: { id: string }) => {
        executed.push(id);
      },
    };

    expect(await runPendingMigrations(store, migrations)).toEqual({
      applied: migrations,
      pending: migrations,
      skipped: [],
    });
    expect(await runPendingMigrations(store, migrations)).toEqual({
      applied: [],
      pending: [],
      skipped: [
        { id: "001_create_entries", reason: "already-applied" },
        { id: "002_add_status", reason: "already-applied" },
      ],
    });
    expect(executed).toEqual(["001_create_entries", "002_add_status"]);
  });
});
