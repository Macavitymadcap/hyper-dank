import { describe, expect, test } from "bun:test";
import type { Pool } from "pg";
import { describeInviteRepositoryContract } from "../contracts/repository-contracts";
import { createPostgresDatabaseProvider } from "../providers/postgres-provider";
import { PostgresInviteRepository } from "./postgres-invite-repository";

const postgresConnectionString = process.env.TEST_DATABASE_URL ?? "";

const row = {
  accepted_at: null,
  accepted_by_user_id: null,
  created_at: new Date("2026-01-01T00:00:00.000Z"),
  email: "invited@example.com",
  expires_at: "2026-01-08T00:00:00.000Z",
  id: "invite-1",
  invited_by_user_id: "admin-1",
  revoked_at: null,
  role: "user",
  status: "pending",
};

describe("PostgresInviteRepository", () => {
  test("creates, lists, finds, accepts, revokes, and counts invitations", async () => {
    const pool = createInvitePool([
      { rows: [{ ...row, email: "mixed@example.com" }] },
      {
        rows: [
          {
            ...row,
            accepted_at: new Date("2026-01-02T00:00:00.000Z"),
            accepted_by_user_id: "user-1",
            revoked_at: "2026-01-03T00:00:00.000Z",
          },
        ],
      },
      { rows: [row] },
      { rows: [] },
      { rowCount: 1, rows: [] },
      { rows: [{ count: "3" }] },
      { rowCount: 0, rows: [] },
      { rows: [] },
    ]);
    const repository = new PostgresInviteRepository(pool);

    await expect(
      repository.createInvitation({
        email: "Mixed@Example.com",
        expiresAt: new Date("2026-01-08T00:00:00.000Z"),
        id: "invite-1",
        invitedByUserId: "admin-1",
        role: "user",
        tokenHash: "token-hash",
      }),
    ).resolves.toMatchObject({
      createdAt: "2026-01-01T00:00:00.000Z",
      email: "mixed@example.com",
      expiresAt: "2026-01-08T00:00:00.000Z",
    });
    expect(await repository.listInvitations()).toEqual([
      {
        acceptedAt: "2026-01-02T00:00:00.000Z",
        acceptedByUserId: "user-1",
        createdAt: "2026-01-01T00:00:00.000Z",
        email: "invited@example.com",
        expiresAt: "2026-01-08T00:00:00.000Z",
        id: "invite-1",
        invitedByUserId: "admin-1",
        revokedAt: "2026-01-03T00:00:00.000Z",
        role: "user",
        status: "pending",
      },
    ]);
    expect(await repository.findPendingByTokenHash("token-hash")).toMatchObject({
      id: "invite-1",
    });
    expect(await repository.findPendingByTokenHash("missing")).toBeNull();

    await repository.acceptInvitation("invite-1", "user-1");
    expect(await repository.countPendingInvitations()).toBe(3);
    expect(await repository.revokeInvitation("invite-1")).toBe(false);
    expect(await repository.countPendingInvitations()).toBe(0);
  });

  test("throws when create returns no row", async () => {
    const repository = new PostgresInviteRepository(createInvitePool([{ rows: [] }]));

    await expect(
      repository.createInvitation({
        email: "missing@example.com",
        expiresAt: new Date("2026-01-08T00:00:00.000Z"),
        id: "invite-1",
        invitedByUserId: "admin-1",
        role: "user",
        tokenHash: "token-hash",
      }),
    ).rejects.toThrow("Failed to create invitation.");
  });
});

if (postgresConnectionString) {
  describeInviteRepositoryContract("PostgresInviteRepository contract", async () => {
    const databaseProvider = createPostgresDatabaseProvider({
      connectionString: postgresConnectionString,
    });
    await databaseProvider.migrate();
    await databaseProvider
      .getPool()
      .query("DELETE FROM invitations WHERE id LIKE $1", ["contract-%"]);

    return {
      repository: databaseProvider.createInviteRepository(),
      cleanup: async () => {
        await databaseProvider
          .getPool()
          .query("DELETE FROM invitations WHERE id LIKE $1", ["contract-%"]);
        await databaseProvider.close();
      },
    };
  });
} else {
  describe.skip("PostgresInviteRepository contract", () => {
    test("requires TEST_DATABASE_URL", () => {});
  });
}

function createInvitePool(results: { rowCount?: number; rows: Record<string, unknown>[] }[]): Pool {
  const queue = [...results];

  return {
    query: async () => queue.shift() ?? { rows: [] },
  } as unknown as Pool;
}
