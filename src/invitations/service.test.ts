import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { TestAuthProvider } from "../auth";
import { createSqliteDatabaseProvider, type DatabaseProvider } from "../db";
import { ConsoleEmailSender } from "../email";
import { InvitationService } from "./service";

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
});

function createService(userLimit = 10) {
  return new InvitationService({
    authProvider,
    emailSender,
    inviteRepository: databaseProvider.createInviteRepository(),
    baseUrl: "http://localhost",
    userLimit,
  });
}
