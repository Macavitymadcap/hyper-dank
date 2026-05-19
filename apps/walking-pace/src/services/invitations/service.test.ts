import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { TestAuthProvider } from "../../auth";
import { createSqliteDatabaseProvider, type DatabaseProvider } from "../../db";
import { ConsoleEmailSender } from "../email";
import { hashInvitationToken, InvitationService } from "./service";

let databaseProvider: DatabaseProvider;
let authProvider: TestAuthProvider;
let emailSender: ConsoleEmailSender;

beforeEach(async () => {
  databaseProvider = createSqliteDatabaseProvider({ filename: ":memory:" });
  await databaseProvider.migrate();
  authProvider = new TestAuthProvider([
    {
      email: "admin@example.com",
      name: "Admin User",
      password: "password123",
      role: "admin",
    },
  ]);
  emailSender = new ConsoleEmailSender();
});

afterEach(async () => {
  await databaseProvider.close();
});

describe("InvitationService", () => {
  test("creates and accepts invitations", async () => {
    const service = createService();
    const result = await service.createInvitation({
      email: "Invited@Example.com",
      role: "user",
      invitedByUserId: "admin@example.com",
    });

    expect(result.invitation.email).toBe("invited@example.com");
    expect(result.delivery.status).toBe("sent");
    expect(result.inviteUrl).toContain(`/invite/${result.token}`);
    expect(emailSender.sentInvitations[0]?.to).toBe("invited@example.com");

    const user = await service.acceptInvitation({
      token: result.token,
      name: "Invited User",
      password: "password123",
    });

    expect(user.email).toBe("invited@example.com");
    expect(await authProvider.countUsers()).toBe(2);
    expect((await service.listInvitations())[0]?.status).toBe("accepted");
  });

  test("simulates delivery without sending email in demo mode", async () => {
    const service = createService(10, true);
    const result = await service.createInvitation({
      email: "reviewer@example.com",
      role: "user",
      invitedByUserId: "admin@example.com",
    });

    expect(result.delivery.status).toBe("simulated");
    expect(result.delivery.message).toContain("Demo mode is on");
    expect(result.delivery.message).toContain(result.inviteUrl);
    expect(emailSender.sentInvitations).toHaveLength(0);
    expect((await service.listInvitations())[0]?.email).toBe("reviewer@example.com");
  });

  test("enforces the user cap across users and pending invitations", async () => {
    const service = createService(1);

    await expect(
      service.createInvitation({
        email: "blocked@example.com",
        role: "user",
        invitedByUserId: "admin@example.com",
      }),
    ).rejects.toThrow("User limit reached");
  });

  test("revokes invitations and enforces capacity before acceptance", async () => {
    const service = createService(2);
    const result = await service.createInvitation({
      email: "capacity@example.com",
      role: "user",
      invitedByUserId: "admin@example.com",
    });
    await authProvider.createUser({
      email: "existing@example.com",
      name: "Existing User",
      password: "password123",
      role: "user",
    });

    await expect(
      service.acceptInvitation({
        name: "Capacity User",
        password: "password123",
        token: result.token,
      }),
    ).rejects.toThrow("User limit reached");
    expect(await service.revokeInvitation(result.invitation.id)).toBe(true);
  });

  test("rejects expired invitations", async () => {
    const service = createService();
    const token = "expired-token";
    await databaseProvider.createInviteRepository().createInvitation({
      email: "expired@example.com",
      expiresAt: new Date("2000-01-01T00:00:00.000Z"),
      id: "expired-invite",
      invitedByUserId: "admin@example.com",
      role: "user",
      tokenHash: await hashInvitationToken(token),
    });

    await expect(
      service.acceptInvitation({
        name: "Expired User",
        password: "password123",
        token,
      }),
    ).rejects.toThrow("This invitation has expired.");
  });
});

function createService(userLimit = 10, demoMode = false) {
  return new InvitationService({
    authProvider,
    demoMode,
    emailSender,
    inviteRepository: databaseProvider.createInviteRepository(),
    baseUrl: "http://localhost",
    userLimit,
  });
}
