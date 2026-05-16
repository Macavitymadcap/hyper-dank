import { describe, expect, test } from "bun:test";
import type { Pool } from "pg";
import { createPostgresDatabaseProvider } from "../providers/postgres-provider";
import { PostgresWalkRepository } from "./postgres-walk-repository";

const postgresConnectionString = process.env.TEST_DATABASE_URL ?? "";
const postgresTest = postgresConnectionString ? test : test.skip;

describe("PostgresWalkRepository", () => {
  test("maps rows, mutations, and aggregate stats with a pool client", async () => {
    const pool = createWalkPool([
      {
        created_at: new Date("2026-01-02T03:04:05.000Z"),
        id: 2,
        miles: "2",
        minutes: 30,
        seconds: 0,
        user_id: "user@example.com",
      },
      {
        created_at: "2026-01-01T03:04:05.000Z",
        id: 1,
        miles: 1,
        minutes: 20,
        seconds: 0,
        user_id: "user@example.com",
      },
    ]);
    const repository = new PostgresWalkRepository({ pool });

    const walks = await repository.getAllWalks("user@example.com");

    expect(walks).toMatchObject([
      {
        created_at: "2026-01-02T03:04:05.000Z",
        id: 2,
        miles: 2,
        pace: 15,
        speed: 4,
      },
      {
        created_at: "2026-01-01T03:04:05.000Z",
        id: 1,
        miles: 1,
        pace: 20,
        speed: 3,
      },
    ]);
    await repository.addWalk("user@example.com", { miles: 3, minutes: 45, seconds: 0 });
    expect(await repository.deleteWalk("user@example.com", 2)).toBe(true);
    expect(await repository.deleteWalk("user@example.com", 2)).toBe(false);
    expect(await repository.clearWalks("user@example.com")).toBe(2);
    expect(await repository.clearWalks("user@example.com")).toBe(0);
    expect(await repository.getStats("user@example.com")).toMatchObject({
      avgSpeed: 3.5,
      count: 2,
      medianPace: 17.5,
    });
  });

  test("returns empty stats when no rows exist", async () => {
    const repository = new PostgresWalkRepository({ pool: createWalkPool([]) });

    expect(await repository.getStats("empty@example.com")).toEqual({
      avgSpeed: 0,
      count: 0,
      medianPace: 0,
    });
  });

  postgresTest("implements the walk repository contract", async () => {
    const databaseProvider = createPostgresDatabaseProvider({
      connectionString: postgresConnectionString,
    });

    try {
      await databaseProvider.migrate();
      const repository = databaseProvider.createWalkRepository();
      const userId = "postgres-test@example.com";
      await repository.clearWalks(userId);

      await repository.addWalk(userId, { miles: 1, minutes: 20, seconds: 0 });
      await repository.addWalk(userId, { miles: 2, minutes: 30, seconds: 0 });

      const walks = await repository.getAllWalks(userId);
      const stats = await repository.getStats(userId);

      expect(walks).toHaveLength(2);
      expect(walks[0]?.miles).toBe(2);
      expect(stats.count).toBe(2);
      expect(stats.avgSpeed).toBeCloseTo(3.5);
      expect(stats.medianPace).toBeCloseTo(17.5);
    } finally {
      await databaseProvider.close();
    }
  });
});

function createWalkPool(rows: Record<string, unknown>[]): Pool {
  let deleteCalls = 0;
  let clearCalls = 0;

  return {
    query: async (sql: string) => {
      if (sql.includes("SELECT id, user_id")) return { rows };
      if (sql.includes("DELETE FROM walks WHERE id")) {
        deleteCalls += 1;
        return { rowCount: deleteCalls === 1 ? 1 : 0 };
      }
      if (sql.includes("DELETE FROM walks WHERE user_id")) {
        clearCalls += 1;
        return { rowCount: clearCalls === 1 ? 2 : 0 };
      }

      return { rowCount: 1, rows: [] };
    },
  } as unknown as Pool;
}
