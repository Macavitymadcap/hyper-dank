import { setTimeout as delay } from "node:timers/promises";
import { createApp } from "../../src/app";
import { TestAuthProvider } from "../../src/auth";
import { createSqliteDatabaseProvider } from "../../src/db";
import { ConsoleEmailSender } from "../../src/email";
import { InvitationService } from "../../src/invitations";

export interface SampleWalk {
  miles: string;
  minutes: string;
  seconds: string;
}

export async function startInMemoryAppServer(port: number) {
  const databaseProvider = createSqliteDatabaseProvider({ filename: ":memory:" });
  await databaseProvider.migrate();

  const walksRepository = databaseProvider.createWalkRepository();
  const authProvider = new TestAuthProvider([
    {
      email: "user@example.com",
      name: "Test User",
      password: "password123",
      role: "user",
    },
  ]);
  const invitationService = new InvitationService({
    authProvider,
    emailSender: new ConsoleEmailSender(),
    inviteRepository: databaseProvider.createInviteRepository(),
    baseUrl: `http://localhost:${port}`,
  });
  const cookie = authProvider.createCookie("user@example.com");
  const app = createApp({ authProvider, invitationService, walksRepository });
  const server = Bun.serve({
    port,
    fetch: app.fetch,
  });
  const url = `http://localhost:${port}`;
  serverCookies.set(url, cookie);

  return {
    port,
    url,
    authCookie: cookie,
    stop: async () => {
      server.stop(true);
      serverCookies.delete(url);
      await databaseProvider.close();
    },
  };
}

export async function waitForHttp(url: string, attempts = 40, delayMs = 500) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}

    await delay(delayMs);
  }

  throw new Error(`Timed out waiting for ${url}`);
}

export async function clearWalks(baseUrl: string) {
  const response = await fetch(`${baseUrl}/walks`, {
    method: "DELETE",
    headers: authHeaders(baseUrl),
    redirect: "manual",
  });
  if (!response.ok) throw new Error(`Failed to clear walks: ${response.status}`);
}

export async function addWalk(baseUrl: string, walk: SampleWalk | undefined) {
  if (!walk) throw new Error("Missing sample walk");

  const body = new URLSearchParams();
  body.set("miles", walk.miles);
  body.set("minutes", walk.minutes);
  body.set("seconds", walk.seconds);
  const response = await fetch(`${baseUrl}/walks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...authHeaders(baseUrl),
    },
    body,
    redirect: "manual",
  });

  if (!response.ok) throw new Error(`Failed to add walk: ${response.status}`);
}

const serverCookies = new Map<string, string>();

function authHeaders(baseUrl: string): Record<string, string> {
  const cookie = serverCookies.get(baseUrl);
  return cookie ? { Cookie: cookie } : {};
}
