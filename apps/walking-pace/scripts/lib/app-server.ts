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

const DYNAMIC_PORT_ATTEMPTS = 50;
const DYNAMIC_PORT_BASE = 45_000;
const DYNAMIC_PORT_RANGE = 20_000;

export async function startInMemoryAppServer(
  port: number,
  options: StartInMemoryAppServerOptions = {},
): Promise<InMemoryAppServer> {
  const databaseProvider = createSqliteDatabaseProvider({ filename: ":memory:" });
  await databaseProvider.migrate();

  const repositories = databaseProvider.createRepositories();
  const users = options.users ?? [DEFAULT_TEST_USER];
  const authProvider = new TestAuthProvider(users);
  for (const user of users) {
    if (user.banned) {
      await authProvider.setUserBanned(user.email, true);
    }
  }
  let fetchApp: ((request: Request) => Response | Promise<Response>) | undefined;
  const { port: actualPort, server } = startBunServer(port, {
    fetch(request) {
      if (!fetchApp) return new Response("Server is not ready.", { status: 503 });

      return fetchApp(request);
    },
  });
  const url = `http://localhost:${actualPort}`;
  const invitationService = new InvitationService({
    authProvider,
    emailSender: new ConsoleEmailSender(),
    inviteRepository: repositories.invites,
    baseUrl: url,
  });
  const app = createApp({
    authProvider,
    invitationService,
    walksRepository: repositories.walks,
  });
  fetchApp = (request) => app.fetch(request);
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
    port: actualPort,
    url,
    get authCookie() {
      return cookie;
    },
    setAuthUser,
    walksRepository: repositories.walks,
    stop: async () => {
      server.stop(true);
      serverCookies.delete(url);
      await databaseProvider.close();
    },
  };
}

function startBunServer(
  requestedPort: number,
  options: { fetch: (request: Request) => Response | Promise<Response> },
) {
  let lastError: unknown;
  const attempts = requestedPort > 0 ? 1 : DYNAMIC_PORT_ATTEMPTS;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const candidatePort = requestedPort > 0 ? requestedPort : dynamicPortCandidate(attempt);

    try {
      const server = Bun.serve({
        port: candidatePort,
        fetch: options.fetch,
      });

      return {
        port: server.port ?? candidatePort,
        server,
      };
    } catch (error) {
      lastError = error;
      if (requestedPort > 0 || !isAddressInUseError(error)) throw error;
    }
  }

  throw new Error(`Unable to start test server on an available port. Last error: ${lastError}`);
}

function dynamicPortCandidate(attempt: number) {
  const start = Math.abs(process.pid) % DYNAMIC_PORT_RANGE;
  return DYNAMIC_PORT_BASE + ((start + attempt) % DYNAMIC_PORT_RANGE);
}

function isAddressInUseError(error: unknown) {
  return (
    typeof error === "object" && error !== null && "code" in error && error.code === "EADDRINUSE"
  );
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
