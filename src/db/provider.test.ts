import { describe, expect, test } from "bun:test";
import { PostgresDatabaseProvider } from "./postgres-provider";
import { createDatabaseProvider } from "./provider";
import { SqliteDatabaseProvider } from "./sqlite-provider";

describe("createDatabaseProvider", () => {
  test("creates a SQLite provider when no DATABASE_URL is configured", async () => {
    const provider = createDatabaseProvider({ DB_PATH: ":memory:" });

    expect(provider).toBeInstanceOf(SqliteDatabaseProvider);
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
