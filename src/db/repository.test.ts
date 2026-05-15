import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { Repository } from "./repository";

let repository: Repository;

beforeEach(() => {
  repository = new Repository({ filename: ":memory:" });
});

afterEach(() => {
  repository?.close();
});

describe("Repository", () => {
  test("adds walks and returns calculated stats newest first", () => {
    repository.addWalk({ miles: 1, minutes: 20, seconds: 0 });
    repository.addWalk({ miles: 2, minutes: 30, seconds: 0 });

    const walks = repository.getAllWalks();

    expect(walks).toHaveLength(2);
    expect(walks[0]?.miles).toBe(2);
    expect(walks[0]?.speed).toBeCloseTo(4);
    expect(walks[0]?.pace).toBeCloseTo(15);
  });

  test("deletes walks and reports whether a row changed", () => {
    repository.addWalk({ miles: 1, minutes: 20, seconds: 0 });

    const [walk] = repository.getAllWalks();
    if (!walk) throw new Error("Expected inserted walk");

    expect(repository.deleteWalk(walk.id)).toBe(true);
    expect(repository.deleteWalk(walk.id)).toBe(false);
    expect(repository.getAllWalks()).toHaveLength(0);
  });

  test("clears all walks and reports how many rows changed", () => {
    repository.addWalk({ miles: 1, minutes: 20, seconds: 0 });
    repository.addWalk({ miles: 2, minutes: 30, seconds: 0 });

    expect(repository.clearWalks()).toBe(2);
    expect(repository.clearWalks()).toBe(0);
    expect(repository.getAllWalks()).toHaveLength(0);
  });

  test("calculates aggregate stats from persisted walks", () => {
    repository.addWalk({ miles: 1, minutes: 20, seconds: 0 });
    repository.addWalk({ miles: 2, minutes: 30, seconds: 0 });

    const stats = repository.getStats();

    expect(stats.count).toBe(2);
    expect(stats.avgSpeed).toBeCloseTo(3.5);
    expect(stats.medianPace).toBeCloseTo(17.5);
  });

  test("enforces database constraints", () => {
    expect(() => repository.addWalk({ miles: -1, minutes: 20, seconds: 0 })).toThrow();
    expect(() => repository.addWalk({ miles: 1, minutes: 0, seconds: 60 })).toThrow();
    expect(() => repository.addWalk({ miles: 1, minutes: 0, seconds: 0 })).toThrow();
  });
});
