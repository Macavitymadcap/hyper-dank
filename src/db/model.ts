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
  getAllWalks(): Promise<WalkWithStats[]>;
  addWalk(walk: WalkInput): Promise<void>;
  deleteWalk(id: number): Promise<boolean>;
  clearWalks(): Promise<number>;
  getStats(): Promise<Stats>;
}

export interface DatabaseProvider {
  createWalkRepository(): WalkRepository;
  migrate(): Promise<void>;
  close(): Promise<void>;
}
