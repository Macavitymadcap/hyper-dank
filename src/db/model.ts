import type { InviteRepository } from "../invitations/model";

export interface Walk {
  id: number;
  user_id: string;
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
  getAllWalks(userId: string): Promise<WalkWithStats[]>;
  addWalk(userId: string, walk: WalkInput): Promise<void>;
  deleteWalk(userId: string, id: number): Promise<boolean>;
  clearWalks(userId: string): Promise<number>;
  getStats(userId: string): Promise<Stats>;
}

export interface DatabaseProvider {
  readonly kind: "sqlite" | "postgres";
  createWalkRepository(): WalkRepository;
  createInviteRepository(): InviteRepository;
  migrate(): Promise<void>;
  close(): Promise<void>;
}
