import { describe, expect, test } from "bun:test";
import type { Pool, PoolClient } from "pg";
import { PostgresInviteRepository } from "../repositories/postgres-invite-repository";
import { PostgresWalkRepository } from "../repositories/postgres-walk-repository";
import { PostgresDatabaseProvider } from "./postgres-provider";
import { createDatabaseProvider } from "./provider";
import { SqliteDatabaseProvider } from "./sqlite-provider";

describe("createDatabaseProvider", () => {
  test("creates a SQLite provider when no DATABASE_URL is configured", async () => {
    const provider = createDatabaseProvider({ DB_PATH: ":memory:" });
    const repositories = provider.createRepositories();

    expect(provider).toBeInstanceOf(SqliteDatabaseProvider);
    expect(repositories.walks).toBeTruthy();
    expect(repositories.invites).toBeTruthy();
    await provider.close();
  });

  test("creates a Postgres provider when DATABASE_URL is configured", async () => {
    const provider = createDatabaseProvider({
      DATABASE_URL: "postgres://user:password@localhost:5432/pace_test",
    });

    expect(provider).toBeInstanceOf(PostgresDatabaseProvider);
    await provider.close();
  });
});

describe("PostgresDatabaseProvider", () => {
  test("creates repositories, exposes its pool, runs migrations, and closes", async () => {
    const client = createPoolClient();
    const pool = createProviderPool(client, [{ rowCount: 1 }, { rowCount: 0 }]);
    const provider = new PostgresDatabaseProvider({ pool });
    const repositories = provider.createRepositories();

    expect(provider.createWalkRepository()).toBeInstanceOf(PostgresWalkRepository);
    expect(provider.createInviteRepository()).toBeInstanceOf(PostgresInviteRepository);
    expect(repositories.walks).toBeInstanceOf(PostgresWalkRepository);
    expect(repositories.invites).toBeInstanceOf(PostgresInviteRepository);
    expect(provider.getPool()).toBe(pool);

    await provider.migrate();
    await provider.close();

    expect(client.queries).toContain("BEGIN");
    expect(client.queries).toContain("COMMIT");
    expect(client.released).toBe(true);
    expect(pool.ended).toBe(true);
  });

  test("rolls back failed migrations and requires connection details", async () => {
    expect(() => new PostgresDatabaseProvider({})).toThrow(
      "PostgresDatabaseProvider requires a connection string or pool.",
    );

    const client = createPoolClient(new Error("migration failed"));
    const provider = createPostgresDatabaseProviderForTest(client, [{ rowCount: 0 }]);

    await expect(provider.migrate()).rejects.toThrow("migration failed");
    expect(client.queries).toContain("ROLLBACK");
    expect(client.released).toBe(true);
  });
});

interface TestPool extends Pool {
  ended: boolean;
}

interface TestClient extends PoolClient {
  queries: string[];
  released: boolean;
}

function createPostgresDatabaseProviderForTest(
  client: TestClient,
  appliedResults: { rowCount: number }[],
) {
  return new PostgresDatabaseProvider({
    pool: createProviderPool(client, appliedResults),
  });
}

function createProviderPool(client: TestClient, appliedResults: { rowCount: number }[]): TestPool {
  const appliedQueue = [...appliedResults];
  const pool = {
    ended: false,
    connect: async () => client,
    end: async () => {
      pool.ended = true;
    },
    query: async (sql: string) => {
      if (sql.includes("SELECT version FROM schema_migrations")) {
        return appliedQueue.shift() ?? { rowCount: 0 };
      }

      return { rowCount: 0 };
    },
  };

  return pool as unknown as TestPool;
}

function createPoolClient(error?: Error): TestClient {
  const client = {
    queries: [] as string[],
    released: false,
    query: async (sql: string) => {
      client.queries.push(sql);
      if (error && !["BEGIN", "ROLLBACK"].includes(sql)) throw error;
      return { rowCount: 1 };
    },
    release: () => {
      client.released = true;
    },
  };

  return client as unknown as TestClient;
}
