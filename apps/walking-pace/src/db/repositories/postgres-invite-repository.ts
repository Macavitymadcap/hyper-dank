import type { Pool } from "pg";
import type { UserRole } from "../../auth/model";
import type {
  CreateInvitationRecordInput,
  Invitation,
  InvitationStatus,
  InviteRepository,
} from "../../services/invitations/model";

interface PostgresInvitationRow {
  id: string;
  email: string;
  role: string;
  status: string;
  invited_by_user_id: string;
  accepted_by_user_id?: string | null;
  expires_at: Date | string;
  created_at: Date | string;
  accepted_at?: Date | string | null;
  revoked_at?: Date | string | null;
}

export class PostgresInviteRepository implements InviteRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async createInvitation(input: CreateInvitationRecordInput): Promise<Invitation> {
    const result = await this.pool.query<PostgresInvitationRow>(
      `INSERT INTO invitations (
        id,
        email,
        role,
        token_hash,
        status,
        invited_by_user_id,
        expires_at
      ) VALUES ($1, $2, $3, $4, 'pending', $5, $6)
      RETURNING id, email, role, status, invited_by_user_id, accepted_by_user_id,
        expires_at, created_at, accepted_at, revoked_at`,
      [
        input.id,
        input.email.toLowerCase(),
        input.role,
        input.tokenHash,
        input.invitedByUserId,
        input.expiresAt,
      ],
    );

    const row = result.rows[0];
    if (!row) throw new Error("Failed to create invitation.");

    return toInvitation(row);
  }

  async listInvitations(): Promise<Invitation[]> {
    const result = await this.pool.query<PostgresInvitationRow>(
      `SELECT id, email, role, status, invited_by_user_id, accepted_by_user_id,
        expires_at, created_at, accepted_at, revoked_at
      FROM invitations
      ORDER BY created_at DESC`,
    );

    return result.rows.map(toInvitation);
  }

  async findPendingByTokenHash(tokenHash: string): Promise<Invitation | null> {
    const result = await this.pool.query<PostgresInvitationRow>(
      `SELECT id, email, role, status, invited_by_user_id, accepted_by_user_id,
        expires_at, created_at, accepted_at, revoked_at
      FROM invitations
      WHERE token_hash = $1 AND status = 'pending'
      LIMIT 1`,
      [tokenHash],
    );

    return result.rows[0] ? toInvitation(result.rows[0]) : null;
  }

  async acceptInvitation(invitationId: string, userId: string): Promise<void> {
    await this.pool.query(
      `UPDATE invitations
      SET status = 'accepted',
        accepted_by_user_id = $1,
        accepted_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND status = 'pending'`,
      [userId, invitationId],
    );
  }

  async revokeInvitation(invitationId: string): Promise<boolean> {
    const result = await this.pool.query(
      `UPDATE invitations
      SET status = 'revoked',
        revoked_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND status = 'pending'`,
      [invitationId],
    );

    return Number(result.rowCount ?? 0) > 0;
  }

  async countPendingInvitations(): Promise<number> {
    const result = await this.pool.query<{ count: string }>(
      "SELECT COUNT(*) AS count FROM invitations WHERE status = 'pending'",
    );

    return Number(result.rows[0]?.count ?? 0);
  }
}

function toInvitation(row: PostgresInvitationRow): Invitation {
  return {
    id: row.id,
    email: row.email,
    role: row.role as UserRole,
    status: row.status as InvitationStatus,
    invitedByUserId: row.invited_by_user_id,
    acceptedByUserId: row.accepted_by_user_id ?? undefined,
    expiresAt: toTimestamp(row.expires_at),
    createdAt: toTimestamp(row.created_at),
    acceptedAt: row.accepted_at ? toTimestamp(row.accepted_at) : undefined,
    revokedAt: row.revoked_at ? toTimestamp(row.revoked_at) : undefined,
  };
}

function toTimestamp(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : value;
}
