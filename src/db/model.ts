export interface Walk {
  id: number;
  miles: number;
  minutes: number;
  seconds: number;
  created_at: string;
}

export interface WalkInput {
  miles: number;
  minutes: number;
  seconds: number;
}

export interface WalkWithStats extends Walk {
  speed: number;
  pace: number;
}

export interface Stats {
  avgSpeed: number;
  medianPace?: number;
  count: number;
}

export interface WalkRepository {
  getAllWalks(): WalkWithStats[];
  addWalk(walk: WalkInput): void;
  deleteWalk(id: number): boolean;
  clearWalks(): number;
  getStats(): Stats;
  close?(): void;
}
