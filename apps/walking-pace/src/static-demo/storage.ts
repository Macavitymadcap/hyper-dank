import { Calculator } from "../db/calculator";
import type { Stats, WalkInput, WalkWithStats } from "../db/model";
import { validateWalkInput } from "../walks/validation";

export const DEMO_STORAGE_KEY = "hyper-dank:pace-demo:walks:v1";

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface StaticDemoWalk {
  id: number;
  miles: number;
  minutes: number;
  seconds: number;
  created_at: string;
}

export type AddWalkResult = { ok: true; walk: WalkWithStats } | { ok: false; message: string };

interface LocalStoragePaceProviderOptions {
  clock?: () => Date;
  key?: string;
  storage: StorageLike;
}

export class LocalStoragePaceProvider {
  private readonly clock: () => Date;
  private readonly key: string;
  private readonly storage: StorageLike;

  constructor({
    clock = () => new Date(),
    key = DEMO_STORAGE_KEY,
    storage,
  }: LocalStoragePaceProviderOptions) {
    this.clock = clock;
    this.key = key;
    this.storage = storage;
  }

  getAllWalks(): WalkWithStats[] {
    return this.read()
      .map(toWalkWithStats)
      .toSorted((a, b) => b.id - a.id);
  }

  getStats(): Stats {
    const walks = this.getAllWalks();
    const speeds = walks.map((walk) => walk.speed).filter((speed) => speed > 0);
    const paces = walks.map((walk) => walk.pace).filter((pace) => pace > 0);

    return {
      avgSpeed: Calculator.getAverage(speeds),
      medianPace: Calculator.getMedian(paces),
      count: walks.length,
    };
  }

  addWalk(values: Record<string, unknown>): AddWalkResult {
    const validation = validateWalkInput(values);
    if (!validation.ok) return validation;

    const walks = this.read();
    const walk = createWalk(validation.value, walks, this.clock());
    this.write([...walks, walk]);

    return { ok: true, walk: toWalkWithStats(walk) };
  }

  deleteWalk(id: number): boolean {
    const walks = this.read();
    const nextWalks = walks.filter((walk) => walk.id !== id);
    this.write(nextWalks);

    return nextWalks.length !== walks.length;
  }

  clearWalks(): number {
    const count = this.read().length;
    this.write([]);

    return count;
  }

  private read(): StaticDemoWalk[] {
    const raw = this.storage.getItem(this.key);
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return this.recover([]);

      const walks = parsed.filter(isStaticDemoWalk);
      if (walks.length !== parsed.length) return this.recover(walks);

      return walks;
    } catch {
      return this.recover([]);
    }
  }

  private recover(walks: StaticDemoWalk[]) {
    this.write(walks);
    return walks;
  }

  private write(walks: StaticDemoWalk[]) {
    this.storage.setItem(this.key, JSON.stringify(walks));
  }
}

function createWalk(input: WalkInput, walks: StaticDemoWalk[], date: Date): StaticDemoWalk {
  return {
    id: nextWalkId(walks),
    miles: input.miles,
    minutes: input.minutes,
    seconds: input.seconds,
    created_at: date.toISOString(),
  };
}

function nextWalkId(walks: StaticDemoWalk[]) {
  return Math.max(0, ...walks.map((walk) => walk.id)) + 1;
}

function toWalkWithStats(walk: StaticDemoWalk): WalkWithStats {
  return {
    ...walk,
    user_id: "static-demo",
    speed: Calculator.getSpeed(walk.miles, walk.minutes, walk.seconds),
    pace: Calculator.getPace(walk.miles, walk.minutes, walk.seconds),
  };
}

function isStaticDemoWalk(value: unknown): value is StaticDemoWalk {
  if (typeof value !== "object" || value === null) return false;
  const walk = value as Record<string, unknown>;

  return (
    Number.isInteger(walk.id) &&
    Number(walk.id) > 0 &&
    typeof walk.created_at === "string" &&
    Number.isFinite(walk.miles) &&
    Number(walk.miles) > 0 &&
    Number.isInteger(walk.minutes) &&
    Number(walk.minutes) >= 0 &&
    Number.isInteger(walk.seconds) &&
    Number(walk.seconds) >= 0 &&
    Number(walk.seconds) <= 59 &&
    (Number(walk.minutes) > 0 || Number(walk.seconds) > 0)
  );
}
