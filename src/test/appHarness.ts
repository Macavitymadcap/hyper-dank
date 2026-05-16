import { createApp } from "../app";
import { TestAuthProvider } from "../auth";
import { createSqliteDatabaseProvider } from "../db";
import { ConsoleEmailSender } from "../email";
import { InvitationService } from "../invitations";

export const htmxHeaders = {
  "HX-Request": "true",
};

export const createAppHarness = async () => {
  const databaseProvider = createSqliteDatabaseProvider({ filename: ":memory:" });
  await databaseProvider.migrate();

  const repository = databaseProvider.createWalkRepository();
  const authProvider = new TestAuthProvider([
    {
      email: "user@example.com",
      name: "Test User",
      password: "password123",
      role: "user",
    },
    {
      email: "admin@example.com",
      name: "Admin User",
      password: "password123",
      role: "admin",
    },
  ]);
  const invitationService = new InvitationService({
    authProvider,
    emailSender: new ConsoleEmailSender(),
    inviteRepository: databaseProvider.createInviteRepository(),
    baseUrl: "http://localhost",
  });
  const app = createApp({ authProvider, invitationService, walksRepository: repository });
  const authHeaders = {
    Cookie: authProvider.createCookie("user@example.com"),
  };
  const adminHeaders = {
    Cookie: authProvider.createCookie("admin@example.com"),
  };

  const postWalk = (values: Record<string, string>, headers: Record<string, string> = {}) => {
    return app.request("/walks", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...authHeaders,
        ...headers,
      },
      body: new URLSearchParams(values),
    });
  };

  const close = () => databaseProvider.close();

  return {
    app,
    adminHeaders,
    authHeaders,
    authProvider,
    close,
    databaseProvider,
    invitationService,
    postWalk,
    repository,
  };
};
