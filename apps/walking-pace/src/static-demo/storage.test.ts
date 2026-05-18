import { describe, expect, test } from "bun:test";
import { DEMO_STORAGE_KEY, LocalStoragePaceProvider, type StorageLike } from "./storage";

class MemoryStorage implements StorageLike {
  private readonly values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

const fixedClock = () => new Date("2026-05-18T12:00:00.000Z");

describe("LocalStoragePaceProvider", () => {
  test("adds walks, calculates stats, and reloads persisted data", () => {
    const storage = new MemoryStorage();
    const provider = new LocalStoragePaceProvider({ clock: fixedClock, storage });

    const result = provider.addWalk({ miles: "1.2", minutes: "18", seconds: "55" });

    expect(result.ok).toBe(true);
    expect(provider.getAllWalks()).toHaveLength(1);
    expect(provider.getStats().count).toBe(1);
    expect(provider.getStats().avgSpeed).toBeCloseTo(3.8, 1);

    const reloaded = new LocalStoragePaceProvider({ storage });
    expect(reloaded.getAllWalks()).toHaveLength(1);
    expect(reloaded.getAllWalks()[0]?.created_at).toBe("2026-05-18T12:00:00.000Z");
  });

  test("rejects invalid input without mutating storage", () => {
    const storage = new MemoryStorage();
    const provider = new LocalStoragePaceProvider({ storage });

    const result = provider.addWalk({ miles: "0", minutes: "0", seconds: "0" });

    expect(result).toEqual({ ok: false, message: "Miles must be greater than zero." });
    expect(provider.getAllWalks()).toEqual([]);
    expect(storage.getItem(DEMO_STORAGE_KEY)).toBeNull();
  });

  test("deletes and clears walks", () => {
    const storage = new MemoryStorage();
    const provider = new LocalStoragePaceProvider({ clock: fixedClock, storage });

    provider.addWalk({ miles: "1", minutes: "15", seconds: "0" });
    provider.addWalk({ miles: "2", minutes: "30", seconds: "0" });

    expect(provider.deleteWalk(1)).toBe(true);
    expect(provider.getAllWalks()).toHaveLength(1);
    expect(provider.deleteWalk(123)).toBe(false);
    expect(provider.clearWalks()).toBe(1);
    expect(provider.getAllWalks()).toEqual([]);
  });

  test("recovers from invalid stored data", () => {
    const storage = new MemoryStorage();
    storage.setItem(DEMO_STORAGE_KEY, JSON.stringify([{ id: "bad" }]));

    const provider = new LocalStoragePaceProvider({ storage });

    expect(provider.getAllWalks()).toEqual([]);
    expect(storage.getItem(DEMO_STORAGE_KEY)).toBe("[]");
  });

  test("recovers from invalid JSON", () => {
    const storage = new MemoryStorage();
    storage.setItem(DEMO_STORAGE_KEY, "not-json");

    const provider = new LocalStoragePaceProvider({ storage });

    expect(provider.getStats()).toEqual({ avgSpeed: 0, count: 0, medianPace: 0 });
    expect(storage.getItem(DEMO_STORAGE_KEY)).toBe("[]");
  });
});
