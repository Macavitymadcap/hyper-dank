import { setTimeout as delay } from "node:timers/promises";
import { createApp } from "../../src/app";
import { type CreateAuthUserInput, TestAuthProvider } from "../../src/auth";
import {
  createSqliteDatabaseProvider,
  type DatabaseProvider,
  type WalkRepository,
} from "../../src/db";
import { ConsoleEmailSender } from "../../src/services/email";
import { InvitationService } from "../../src/services/invitations";

export interface SampleWalk {
  miles: string;
  minutes: string;
  seconds: string;
}

export interface AppServerTestUser extends CreateAuthUserInput {
  banned?: boolean;
}

export interface InMemoryAppServer {
  authCookie: string;
  authProvider: TestAuthProvider;
  databaseProvider: DatabaseProvider;
  port: number;
  setAuthUser(userId: string | null): string;
  stop(): Promise<void>;
  url: string;
  walksRepository: WalkRepository;
}

interface StartInMemoryAppServerOptions {
  authenticatedUserId?: string | null;
  users?: AppServerTestUser[];
}

const DEFAULT_TEST_USER: AppServerTestUser = {
  email: "user@example.com",
  name: "Test User",
  password: "password123",
  role: "user",
};

export async function startInMemoryAppServer(
  port: number,
  options: StartInMemoryAppServerOptions = {},
): Promise<InMemoryAppServer> {
  const databaseProvider = createSqliteDatabaseProvider({ filename: ":memory:" });
  await databaseProvider.migrate();

  const walksRepository = databaseProvider.createWalkRepository();
  const users = options.users ?? [DEFAULT_TEST_USER];
  const authProvider = new TestAuthProvider(users);
  for (const user of users) {
    if (user.banned) {
      await authProvider.setUserBanned(user.email, true);
    }
  }
  const invitationService = new InvitationService({
    authProvider,
    emailSender: new ConsoleEmailSender(),
    inviteRepository: databaseProvider.createInviteRepository(),
    baseUrl: `http://localhost:${port}`,
  });
  const app = createApp({ authProvider, invitationService, walksRepository });
  const server = Bun.serve({
    port,
    fetch: app.fetch,
  });
  const url = `http://localhost:${port}`;
  const authenticatedUserId =
    options.authenticatedUserId === undefined
      ? DEFAULT_TEST_USER.email
      : options.authenticatedUserId;
  let cookie = "";
  const setAuthUser = (userId: string | null) => {
    if (!userId) {
      cookie = "";
      serverCookies.delete(url);
      return cookie;
    }

    cookie = authProvider.createCookie(userId);
    serverCookies.set(url, cookie);
    return cookie;
  };

  setAuthUser(authenticatedUserId);

  return {
    authProvider,
    databaseProvider,
    port,
    url,
    get authCookie() {
      return cookie;
    },
    setAuthUser,
    walksRepository,
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
      "HX-Request": "true",
      "HX-Target": "walks-list",
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
