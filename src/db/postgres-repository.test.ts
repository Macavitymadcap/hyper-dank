import { describe, expect, test } from "bun:test";
import { createPostgresDatabaseProvider } from "./postgres-provider";

const postgresConnectionString = process.env.TEST_DATABASE_URL ?? "";
const postgresTest = postgresConnectionString ? test : test.skip;

describe("PostgresWalkRepository", () => {
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
