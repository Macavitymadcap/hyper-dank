import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import type { InviteRepository } from "../services/invitations";
import type { DatabaseProvider } from "./index";
import { createSqliteDatabaseProvider } from "./sqlite-provider";

let provider: DatabaseProvider;
let repository: InviteRepository;

beforeEach(async () => {
  provider = createSqliteDatabaseProvider({ filename: ":memory:" });
  await provider.migrate();
  repository = provider.createInviteRepository();
});

afterEach(async () => {
  await provider.close();
});

describe("SqliteInviteRepository", () => {
  test("handles pending, accepted, revoked, and missing invitations", async () => {
    const invitation = await repository.createInvitation({
      email: "Invited@Example.com",
      expiresAt: new Date("2026-01-08T00:00:00.000Z"),
      id: "invite-1",
      invitedByUserId: "admin-1",
      role: "user",
      tokenHash: "token-hash",
    });

    expect(invitation).toMatchObject({
      email: "invited@example.com",
      status: "pending",
    });
    expect(await repository.countPendingInvitations()).toBe(1);
    expect(await repository.findPendingByTokenHash("missing")).toBeNull();
    expect(await repository.findPendingByTokenHash("token-hash")).toMatchObject({
      id: "invite-1",
    });

    await repository.acceptInvitation("invite-1", "user-1");
    expect((await repository.listInvitations())[0]).toMatchObject({
      acceptedByUserId: "user-1",
      status: "accepted",
    });
    expect(await repository.revokeInvitation("invite-1")).toBe(false);

    await repository.createInvitation({
      email: "Second@Example.com",
      expiresAt: new Date("2026-01-08T00:00:00.000Z"),
      id: "invite-2",
      invitedByUserId: "admin-1",
      role: "admin",
      tokenHash: "token-hash-2",
    });

    expect(await repository.revokeInvitation("invite-2")).toBe(true);
    const revoked = (await repository.listInvitations()).find(
      (candidate) => candidate.id === "invite-2",
    );

    expect(revoked).toMatchObject({
      revokedAt: expect.any(String),
      status: "revoked",
    });
  });
});
