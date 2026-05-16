import { createApp } from "./app";
import { createAuthProvider } from "./auth";
import { createDatabaseProvider } from "./db";
import { createEmailSender } from "./services/email";
import { InvitationService } from "./services/invitations";

const port = Number(process.env.PORT ?? 3000);
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

console.log(`🚶 Walking Pace Tracker running at http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};
