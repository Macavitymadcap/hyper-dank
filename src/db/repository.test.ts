import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import type { DatabaseProvider, WalkRepository } from "./model";
import { createSqliteDatabaseProvider } from "./sqlite-provider";

let databaseProvider: DatabaseProvider;
let repository: WalkRepository;
const userId = "user@example.com";
const otherUserId = "other@example.com";

beforeEach(async () => {
  databaseProvider = createSqliteDatabaseProvider({ filename: ":memory:" });
  await databaseProvider.migrate();
  repository = databaseProvider.createWalkRepository();
});

afterEach(async () => {
  await databaseProvider?.close();
});

describe("Repository", () => {
  test("adds walks and returns calculated stats newest first", async () => {
    await repository.addWalk(userId, { miles: 1, minutes: 20, seconds: 0 });
    await repository.addWalk(userId, { miles: 2, minutes: 30, seconds: 0 });

    const walks = await repository.getAllWalks(userId);

    expect(walks).toHaveLength(2);
    expect(walks[0]?.miles).toBe(2);
    expect(walks[0]?.speed).toBeCloseTo(4);
    expect(walks[0]?.pace).toBeCloseTo(15);
  });

  test("deletes walks and reports whether a row changed", async () => {
    await repository.addWalk(userId, { miles: 1, minutes: 20, seconds: 0 });

    const [walk] = await repository.getAllWalks(userId);
    if (!walk) throw new Error("Expected inserted walk");

    expect(await repository.deleteWalk(userId, walk.id)).toBe(true);
    expect(await repository.deleteWalk(userId, walk.id)).toBe(false);
    expect(await repository.getAllWalks(userId)).toHaveLength(0);
  });

  test("clears all walks and reports how many rows changed", async () => {
    await repository.addWalk(userId, { miles: 1, minutes: 20, seconds: 0 });
    await repository.addWalk(userId, { miles: 2, minutes: 30, seconds: 0 });

    expect(await repository.clearWalks(userId)).toBe(2);
    expect(await repository.clearWalks(userId)).toBe(0);
    expect(await repository.getAllWalks(userId)).toHaveLength(0);
  });

  test("calculates aggregate stats from persisted walks", async () => {
    await repository.addWalk(userId, { miles: 1, minutes: 20, seconds: 0 });
    await repository.addWalk(userId, { miles: 2, minutes: 30, seconds: 0 });

    const stats = await repository.getStats(userId);

    expect(stats.count).toBe(2);
    expect(stats.avgSpeed).toBeCloseTo(3.5);
    expect(stats.medianPace).toBeCloseTo(17.5);
  });

  test("enforces database constraints", async () => {
    await expect(
      repository.addWalk(userId, { miles: -1, minutes: 20, seconds: 0 }),
    ).rejects.toThrow();
    await expect(
      repository.addWalk(userId, { miles: 1, minutes: 0, seconds: 60 }),
    ).rejects.toThrow();
    await expect(
      repository.addWalk(userId, { miles: 1, minutes: 0, seconds: 0 }),
    ).rejects.toThrow();
  });

  test("scopes walks to the requested user", async () => {
    await repository.addWalk(userId, { miles: 1, minutes: 20, seconds: 0 });
    await repository.addWalk(otherUserId, { miles: 2, minutes: 30, seconds: 0 });

    expect(await repository.getAllWalks(userId)).toHaveLength(1);
    expect(await repository.getAllWalks(otherUserId)).toHaveLength(1);

    const [otherWalk] = await repository.getAllWalks(otherUserId);
    if (!otherWalk) throw new Error("Expected other user's walk");

    expect(await repository.deleteWalk(userId, otherWalk.id)).toBe(false);
    expect(await repository.clearWalks(userId)).toBe(1);
    expect(await repository.getAllWalks(otherUserId)).toHaveLength(1);
  });
});
