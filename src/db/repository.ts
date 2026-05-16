import { Database } from "bun:sqlite";
import { Calculator } from "./calculator";
import type { Stats, Walk, WalkInput, WalkRepository, WalkWithStats } from "./model";

export interface SqliteWalkRepositoryOptions {
  db?: Database;
  filename?: string;
}

const DEFAULT_DATABASE_FILENAME = "walking-pace-db";

export class SqliteWalkRepository implements WalkRepository {
  private readonly db: Database;

  constructor({ db, filename = DEFAULT_DATABASE_FILENAME }: SqliteWalkRepositoryOptions = {}) {
    this.db = db ?? new Database(filename, { create: true });
  }

  migrate(): void {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS walks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL DEFAULT 'local-user',
        miles REAL NOT NULL CHECK (miles > 0),
        minutes INTEGER NOT NULL CHECK (minutes >= 0),
        seconds INTEGER NOT NULL CHECK (seconds >= 0 AND seconds < 60),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        CHECK (minutes > 0 OR seconds > 0)
      )
    `);
  }

  async getAllWalks(userId: string): Promise<WalkWithStats[]> {
    const query = this.db.query(`
      SELECT id, user_id, miles, minutes, seconds, created_at
      FROM walks
      WHERE user_id = ?
      ORDER BY created_at DESC, id DESC
    `);
    const walks = query.all(userId) as Walk[];

    return walks.map((walk) => ({
      ...walk,
      speed: Calculator.getSpeed(walk.miles, walk.minutes, walk.seconds),
      pace: Calculator.getPace(walk.miles, walk.minutes, walk.seconds),
    }));
  }

  async addWalk(userId: string, { miles, minutes, seconds }: WalkInput): Promise<void> {
    const query = this.db.query(
      "INSERT INTO walks (user_id, miles, minutes, seconds) VALUES (?, ?, ?, ?)",
    );
    query.run(userId, miles, minutes, seconds);
  }

  async deleteWalk(userId: string, id: number): Promise<boolean> {
    const query = this.db.query("DELETE FROM walks WHERE id = ? AND user_id = ?");
    const result = query.run(id, userId) as { changes?: number };
    return Number(result.changes ?? 0) > 0;
  }

  async clearWalks(userId: string): Promise<number> {
    const result = this.db.query("DELETE FROM walks WHERE user_id = ?").run(userId) as {
      changes?: number;
    };
    return Number(result.changes ?? 0);
  }

  async getStats(userId: string): Promise<Stats> {
    const walks = await this.getAllWalks(userId);
    const count = walks.length;

    if (count === 0) {
      return {
        avgSpeed: 0,
        medianPace: 0,
        count,
      };
    }

    const speeds = walks.map((w) => w.speed).filter((s) => s > 0);
    const paces = walks.map((w) => w.pace).filter((p) => p > 0);

    const avgSpeed = Calculator.getAverage(speeds);
    const medianPace = Calculator.getMedian(paces);

    return {
      avgSpeed,
      medianPace,
      count,
    };
  }

  close(): void {
    this.db.close();
  }
}

export { SqliteWalkRepository as Repository };
