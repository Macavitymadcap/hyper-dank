export interface Walk {
  id: number;
  miles: number;
  minutes: number;
  seconds: number;
  created_at: string;
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