import type { Pool } from "pg";
import { Calculator } from "../calculator";
import type { Stats, WalkInput, WalkRepository, WalkWithStats } from "../model";

export interface PostgresWalkRepositoryOptions {
  pool: Pool;
}

interface PostgresWalkRow {
  id: number;
  user_id: string;
  miles: number | string;
  minutes: number;
  seconds: number;
  created_at: Date | string;
}

export class PostgresWalkRepository implements WalkRepository {
  private readonly pool: Pool;

  constructor({ pool }: PostgresWalkRepositoryOptions) {
    this.pool = pool;
  }

  async getAllWalks(userId: string): Promise<WalkWithStats[]> {
    const result = await this.pool.query<PostgresWalkRow>(
      `
      SELECT id, user_id, miles, minutes, seconds, created_at
      FROM walks
      WHERE user_id = $1
      ORDER BY created_at DESC, id DESC
    `,
      [userId],
    );

    return result.rows.map((row) => {
      const miles = Number(row.miles);
      const minutes = Number(row.minutes);
      const seconds = Number(row.seconds);

      return {
        id: Number(row.id),
        user_id: row.user_id,
        miles,
        minutes,
        seconds,
        created_at: this.toTimestamp(row.created_at),
        speed: Calculator.getSpeed(miles, minutes, seconds),
        pace: Calculator.getPace(miles, minutes, seconds),
      };
    });
  }

  async addWalk(userId: string, { miles, minutes, seconds }: WalkInput): Promise<void> {
    await this.pool.query(
      "INSERT INTO walks (user_id, miles, minutes, seconds) VALUES ($1, $2, $3, $4)",
      [userId, miles, minutes, seconds],
    );
  }

  async deleteWalk(userId: string, id: number): Promise<boolean> {
    const result = await this.pool.query("DELETE FROM walks WHERE id = $1 AND user_id = $2", [
      id,
      userId,
    ]);
    return Number(result.rowCount ?? 0) > 0;
  }

  async clearWalks(userId: string): Promise<number> {
    const result = await this.pool.query("DELETE FROM walks WHERE user_id = $1", [userId]);
    return Number(result.rowCount ?? 0);
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

    const speeds = walks.map((walk) => walk.speed).filter((speed) => speed > 0);
    const paces = walks.map((walk) => walk.pace).filter((pace) => pace > 0);

    return {
      avgSpeed: Calculator.getAverage(speeds),
      medianPace: Calculator.getMedian(paces),
      count,
    };
  }

  private toTimestamp(value: Date | string): string {
    return value instanceof Date ? value.toISOString() : value;
  }
}
