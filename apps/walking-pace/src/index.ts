import { createApp } from "./app";
import { createAuthProvider } from "./auth";
import { createDatabaseProvider } from "./db";
import { createEmailSender } from "./services/email";
import { InvitationService } from "./services/invitations";

const port = Number(process.env.PORT ?? 3000);
const hostname = process.env.HOST ?? "0.0.0.0";
const databaseProvider = createDatabaseProvider();
await databaseProvider.migrate();

const repositories = databaseProvider.createRepositories();
const authProvider = createAuthProvider({ databaseProvider });
const emailSender = createEmailSender();
const invitationService = new InvitationService({
  authProvider,
  emailSender,
  inviteRepository: repositories.invites,
});
const app = createApp({
  authProvider,
  invitationService,
  walksRepository: repositories.walks,
});

Bun.serve({
  fetch: app.fetch,
  hostname,
  port,
});

console.log(`🚶 Walking Pace Tracker running at http://${hostname}:${port}`);
