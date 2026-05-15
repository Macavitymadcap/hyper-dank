import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import type { DatabaseProvider, WalkRepository } from "./model";
import { createSqliteDatabaseProvider } from "./sqlite-provider";

let databaseProvider: DatabaseProvider;
let repository: WalkRepository;

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
    await repository.addWalk({ miles: 1, minutes: 20, seconds: 0 });
    await repository.addWalk({ miles: 2, minutes: 30, seconds: 0 });

    const walks = await repository.getAllWalks();

    expect(walks).toHaveLength(2);
    expect(walks[0]?.miles).toBe(2);
    expect(walks[0]?.speed).toBeCloseTo(4);
    expect(walks[0]?.pace).toBeCloseTo(15);
  });

  test("deletes walks and reports whether a row changed", async () => {
    await repository.addWalk({ miles: 1, minutes: 20, seconds: 0 });

    const [walk] = await repository.getAllWalks();
    if (!walk) throw new Error("Expected inserted walk");

    expect(await repository.deleteWalk(walk.id)).toBe(true);
    expect(await repository.deleteWalk(walk.id)).toBe(false);
    expect(await repository.getAllWalks()).toHaveLength(0);
  });

  test("clears all walks and reports how many rows changed", async () => {
    await repository.addWalk({ miles: 1, minutes: 20, seconds: 0 });
    await repository.addWalk({ miles: 2, minutes: 30, seconds: 0 });

    expect(await repository.clearWalks()).toBe(2);
    expect(await repository.clearWalks()).toBe(0);
    expect(await repository.getAllWalks()).toHaveLength(0);
  });

  test("calculates aggregate stats from persisted walks", async () => {
    await repository.addWalk({ miles: 1, minutes: 20, seconds: 0 });
    await repository.addWalk({ miles: 2, minutes: 30, seconds: 0 });

    const stats = await repository.getStats();

    expect(stats.count).toBe(2);
    expect(stats.avgSpeed).toBeCloseTo(3.5);
    expect(stats.medianPace).toBeCloseTo(17.5);
  });

  test("enforces database constraints", async () => {
    await expect(repository.addWalk({ miles: -1, minutes: 20, seconds: 0 })).rejects.toThrow();
    await expect(repository.addWalk({ miles: 1, minutes: 0, seconds: 60 })).rejects.toThrow();
    await expect(repository.addWalk({ miles: 1, minutes: 0, seconds: 0 })).rejects.toThrow();
  });
});
