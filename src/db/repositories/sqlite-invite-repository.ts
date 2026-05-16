import type { Database } from "bun:sqlite";
import type { UserRole } from "../../auth/model";
import type {
  CreateInvitationRecordInput,
  Invitation,
  InvitationStatus,
  InviteRepository,
} from "../../services/invitations/model";

interface SqliteInvitationRow {
  id: string;
  email: string;
  role: string;
  status: string;
  invited_by_user_id: string;
  accepted_by_user_id?: string | null;
  expires_at: string;
  created_at: string;
  accepted_at?: string | null;
  revoked_at?: string | null;
}

export class SqliteInviteRepository implements InviteRepository {
  private readonly db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async createInvitation(input: CreateInvitationRecordInput): Promise<Invitation> {
    const createdAt = new Date().toISOString();
    const expiresAt = input.expiresAt.toISOString();

    this.db
      .query(
        `INSERT INTO invitations (
          id,
          email,
          role,
          token_hash,
          status,
          invited_by_user_id,
          expires_at,
          created_at
        ) VALUES (?, ?, ?, ?, 'pending', ?, ?, ?)`,
      )
      .run(
        input.id,
        input.email.toLowerCase(),
        input.role,
        input.tokenHash,
        input.invitedByUserId,
        expiresAt,
        createdAt,
      );

    return {
      id: input.id,
      email: input.email.toLowerCase(),
      role: input.role,
      status: "pending",
      invitedByUserId: input.invitedByUserId,
      expiresAt,
      createdAt,
    };
  }

  async listInvitations(): Promise<Invitation[]> {
    const rows = this.db
      .query(
        `SELECT id, email, role, status, invited_by_user_id, accepted_by_user_id,
          expires_at, created_at, accepted_at, revoked_at
        FROM invitations
        ORDER BY created_at DESC`,
      )
      .all() as SqliteInvitationRow[];

    return rows.map(toInvitation);
  }

  async findPendingByTokenHash(tokenHash: string): Promise<Invitation | null> {
    const row = this.db
      .query(
        `SELECT id, email, role, status, invited_by_user_id, accepted_by_user_id,
          expires_at, created_at, accepted_at, revoked_at
        FROM invitations
        WHERE token_hash = ? AND status = 'pending'
        LIMIT 1`,
      )
      .get(tokenHash) as SqliteInvitationRow | null;

    return row ? toInvitation(row) : null;
  }

  async acceptInvitation(invitationId: string, userId: string): Promise<void> {
    this.db
      .query(
        `UPDATE invitations
        SET status = 'accepted',
          accepted_by_user_id = ?,
          accepted_at = ?
        WHERE id = ? AND status = 'pending'`,
      )
      .run(userId, new Date().toISOString(), invitationId);
  }

  async revokeInvitation(invitationId: string): Promise<boolean> {
    const result = this.db
      .query(
        `UPDATE invitations
        SET status = 'revoked',
          revoked_at = ?
        WHERE id = ? AND status = 'pending'`,
      )
      .run(new Date().toISOString(), invitationId) as { changes?: number };

    return Number(result.changes ?? 0) > 0;
  }

  async countPendingInvitations(): Promise<number> {
    const row = this.db
      .query("SELECT COUNT(*) AS count FROM invitations WHERE status = 'pending'")
      .get() as { count: number };

    return Number(row.count);
  }
}

function toInvitation(row: SqliteInvitationRow): Invitation {
  return {
    id: row.id,
    email: row.email,
    role: row.role as UserRole,
    status: row.status as InvitationStatus,
    invitedByUserId: row.invited_by_user_id,
    acceptedByUserId: row.accepted_by_user_id ?? undefined,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    acceptedAt: row.accepted_at ?? undefined,
    revokedAt: row.revoked_at ?? undefined,
  };
}
