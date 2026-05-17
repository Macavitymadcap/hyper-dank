import type { DatabaseProviderBase } from "@macavitymadcap/hyper-dank-database";
import type { InviteRepository } from "../services/invitations/model";

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

export type DatabaseKind = "sqlite" | "postgres";

export interface DatabaseRepositories {
  invites: InviteRepository;
  walks: WalkRepository;
}

export interface DatabaseProvider extends DatabaseProviderBase<DatabaseRepositories, DatabaseKind> {
  createInviteRepository(): InviteRepository;
  createWalkRepository(): WalkRepository;
}
