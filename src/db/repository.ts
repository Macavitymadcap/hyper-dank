import { Database } from 'bun:sqlite';
import type { Stats, Walk, WalkInput, WalkRepository, WalkWithStats } from './model';
import { Calculator } from './calculator';

export interface RepositoryOptions {
  db?: Database;
  filename?: string;
}

const DEFAULT_DATABASE_FILENAME = 'walking-pace-db';

export class Repository implements WalkRepository {
  private readonly db: Database;

  constructor({ db, filename = DEFAULT_DATABASE_FILENAME }: RepositoryOptions = {}) {
    this.db = db ?? new Database(filename, { create: true });
    this.initDb();
  }
  
  private initDb() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS walks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        miles REAL NOT NULL CHECK (miles > 0),
        minutes INTEGER NOT NULL CHECK (minutes >= 0),
        seconds INTEGER NOT NULL CHECK (seconds >= 0 AND seconds < 60),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        CHECK (minutes > 0 OR seconds > 0)
      )
    `);
  }

  getAllWalks(): WalkWithStats[] {
    const query = this.db.query(`
      SELECT id, miles, minutes, seconds, created_at
      FROM walks
      ORDER BY created_at DESC, id DESC
    `);
    const walks = query.all() as Walk[];
    
    return walks.map(walk => ({
      ...walk,
      speed: Calculator.getSpeed(walk.miles, walk.minutes, walk.seconds),
      pace: Calculator.getPace(walk.miles, walk.minutes, walk.seconds)
    }));
  }

  addWalk({ miles, minutes, seconds }: WalkInput): void {
    const query = this.db.query('INSERT INTO walks (miles, minutes, seconds) VALUES (?, ?, ?)');
    query.run(miles, minutes, seconds);
  }
  
  deleteWalk(id: number): boolean {
    const query = this.db.query('DELETE FROM walks WHERE id = ?');
    const result = query.run(id) as { changes?: number };
    return Number(result.changes ?? 0) > 0;
  }

  clearWalks(): number {
    const result = this.db.query('DELETE FROM walks').run() as { changes?: number };
    return Number(result.changes ?? 0);
  }
  
  getStats(): Stats {
    const walks = this.getAllWalks();
    const count = walks.length;
    
    if (count === 0) {
      return {
        avgSpeed: 0,
        medianPace: 0,
        count
      };
    }
    
    const speeds = walks.map(w => w.speed).filter(s => s > 0);
    const paces = walks.map(w => w.pace).filter(p => p > 0);
    
    const avgSpeed = Calculator.getAverage(speeds);
    const medianPace = Calculator.getMedian(paces);
    
    return {
      avgSpeed,
      medianPace,
      count
    };
  }

  close(): void {
    this.db.close();
  }
}
