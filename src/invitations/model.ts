import type { UserRole } from "../auth/model";

export type InvitationStatus = "pending" | "accepted" | "revoked";

export interface Invitation {
  id: string;
  email: string;
  role: UserRole;
  status: InvitationStatus;
  invitedByUserId: string;
  acceptedByUserId?: string;
  expiresAt: string;
  createdAt: string;
  acceptedAt?: string;
  revokedAt?: string;
}

export interface CreateInvitationRecordInput {
  id: string;
  email: string;
  role: UserRole;
  tokenHash: string;
  invitedByUserId: string;
  expiresAt: Date;
}

export interface InviteRepository {
  createInvitation(input: CreateInvitationRecordInput): Promise<Invitation>;
  listInvitations(): Promise<Invitation[]>;
  findPendingByTokenHash(tokenHash: string): Promise<Invitation | null>;
  acceptInvitation(invitationId: string, userId: string): Promise<void>;
  revokeInvitation(invitationId: string): Promise<boolean>;
  countPendingInvitations(): Promise<number>;
}
