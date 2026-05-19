import { createApp } from "../app";
import { TestAuthProvider } from "../auth";
import { createSqliteDatabaseProvider } from "../db";
import { ConsoleEmailSender } from "../services/email";
import { InvitationService } from "../services/invitations";

export const htmxHeaders = {
  "HX-Request": "true",
};

export interface AppHarnessOptions {
  demoMode?: boolean;
}

export const createAppHarness = async ({ demoMode = false }: AppHarnessOptions = {}) => {
  const databaseProvider = createSqliteDatabaseProvider({ filename: ":memory:" });
  await databaseProvider.migrate();

  const repositories = databaseProvider.createRepositories();
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
    demoMode,
    emailSender: new ConsoleEmailSender(),
    inviteRepository: repositories.invites,
    baseUrl: "http://localhost",
  });
  const app = createApp({
    authProvider,
    invitationService,
    walksRepository: repositories.walks,
  });
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
    repository: repositories.walks,
  };
};
