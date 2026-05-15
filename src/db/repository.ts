import { Database } from 'bun:sqlite';
import type { Stats, Walk, WalkWithStats } from './model';
import { Calculator } from './calculator';

export class Repository {
  db = new Database('walking-pace-db', { create: true });

  constructor() {
    this.initDb();
  }
  
  private initDb() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS walks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        miles REAL NOT NULL,
        minutes INTEGER NOT NULL,
        seconds INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  getAllWalks(): WalkWithStats[] {
    const query = this.db.query('SELECT * FROM walks ORDER BY created_at DESC');
    const walks = query.all() as Walk[];
    
    return walks.map(walk => ({
      ...walk,
      speed: Calculator.getSpeed(walk.miles, walk.minutes, walk.seconds),
      pace: Calculator.getPace(walk.miles, walk.minutes, walk.seconds)
    }));
  }

 addWalk(miles: number, minutes: number, seconds: number): void {
    const query = this.db.query('INSERT INTO walks (miles, minutes, seconds) VALUES (?, ?, ?)');
    query.run(miles, minutes, seconds);
  }
  
  deleteWalk(id: number): void {
    const query = this.db.query('DELETE FROM walks WHERE id = ?');
    query.run(id);
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
}