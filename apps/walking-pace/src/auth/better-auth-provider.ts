import type { Database } from "bun:sqlite";
import { betterAuth } from "better-auth";
import { memoryAdapter } from "better-auth/adapters/memory";
import { admin } from "better-auth/plugins/admin";
import { PostgresDialect } from "kysely";
import type { Pool } from "pg";
import type { DatabaseProvider } from "../db";
import type {
  AuthProvider,
  AuthSession,
  AuthUser,
  CreateAuthUserInput,
  SignInInput,
  UserRole,
} from "./model";
import { SqliteAuthProvider } from "./sqlite-auth-provider";

export interface BetterAuthProviderOptions {
  databaseProvider: DatabaseProvider;
  baseUrl?: string;
  secret?: string;
}

interface BetterAuthRuntime {
  handler(request: Request): Promise<Response>;
  api: {
    getSession(input: { headers: Headers }): Promise<{ user: Record<string, unknown> } | null>;
    signInEmail(input: {
      asResponse: true;
      headers: Headers;
      body: {
        email: string;
        password: string;
        callbackURL: string;
        rememberMe: boolean;
      };
    }): Promise<Response>;
    signOut(input: { asResponse: true; headers: Headers }): Promise<Response>;
    createUser(input: {
      body: {
        email: string;
        name: string;
        password: string;
        role: UserRole;
      };
    }): Promise<{ user: Record<string, unknown> }>;
  };
  $context: Promise<{
    internalAdapter: {
      listUsers(
        limit?: number,
        offset?: number,
        sortBy?: { field: string; direction: "asc" | "desc" },
      ): Promise<Record<string, unknown>[]>;
      countTotalUsers(): Promise<number>;
      updateUser(userId: string, data: Record<string, unknown>): Promise<Record<string, unknown>>;
    };
  }>;
}

interface PoolBackedDatabaseProvider extends DatabaseProvider {
  readonly kind: "postgres";
  getPool(): Pool;
}

interface SqliteBackedDatabaseProvider extends DatabaseProvider {
  readonly kind: "sqlite";
  getDatabase(): Database;
}

export const createAuthProvider = ({
  databaseProvider,
  baseUrl = process.env.BETTER_AUTH_URL,
  secret = process.env.BETTER_AUTH_SECRET,
}: BetterAuthProviderOptions): AuthProvider => {
  if (isSqliteBackedProvider(databaseProvider)) {
    return new SqliteAuthProvider(databaseProvider.getDatabase());
  }

  const auth = betterAuth({
    basePath: "/api/auth",
    baseURL: baseUrl,
    secret,
    database: createAuthDatabase(databaseProvider),
    user: {
      modelName: "users",
    },
    session: {
      modelName: "sessions",
    },
    account: {
      modelName: "accounts",
    },
    verification: {
      modelName: "verifications",
    },
    emailAndPassword: {
      enabled: true,
      disableSignUp: true,
      minPasswordLength: 8,
    },
    plugins: [
      admin({
        defaultRole: "user",
        adminRoles: ["admin"],
      }),
    ],
  });

  return new BetterAuthProvider(auth as unknown as BetterAuthRuntime);
};

class BetterAuthProvider implements AuthProvider {
  private readonly auth: BetterAuthRuntime;

  constructor(auth: BetterAuthRuntime) {
    this.auth = auth;
  }

  async handler(request: Request): Promise<Response> {
    return this.auth.handler(request);
  }

  async getSession(request: Request): Promise<AuthSession | null> {
    const session = await this.auth.api.getSession({
      headers: request.headers,
    });

    if (!session) return null;

    return {
      user: toAuthUser(session.user),
    };
  }

  async signIn(input: SignInInput, request: Request): Promise<Response> {
    return this.auth.api.signInEmail({
      asResponse: true,
      headers: request.headers,
      body: {
        email: input.email,
        password: input.password,
        callbackURL: "/",
        rememberMe: true,
      },
    });
  }

  async signOut(request: Request): Promise<Response> {
    return this.auth.api.signOut({
      asResponse: true,
      headers: request.headers,
    });
  }

  async createUser(input: CreateAuthUserInput): Promise<AuthUser> {
    const result = await this.auth.api.createUser({
      body: {
        email: input.email,
        name: input.name,
        password: input.password,
        role: input.role,
      },
    });

    return toAuthUser(result.user);
  }

  async listUsers(): Promise<AuthUser[]> {
    const context = await this.auth.$context;
    const users = await context.internalAdapter.listUsers(100, 0, {
      field: "createdAt",
      direction: "asc",
    });

    return users.map(toAuthUser);
  }

  async countUsers(): Promise<number> {
    const context = await this.auth.$context;
    return context.internalAdapter.countTotalUsers();
  }

  async setUserRole(userId: string, role: UserRole): Promise<void> {
    const context = await this.auth.$context;
    await context.internalAdapter.updateUser(userId, { role });
  }

  async setUserBanned(userId: string, banned: boolean): Promise<void> {
    const context = await this.auth.$context;
    await context.internalAdapter.updateUser(userId, {
      banned,
      banReason: null,
      banExpires: null,
    });
  }
}

function createAuthDatabase(databaseProvider: DatabaseProvider) {
  if (isPoolBackedProvider(databaseProvider)) {
    return {
      dialect: new PostgresDialect({
        pool: databaseProvider.getPool(),
      }),
      type: "postgres" as const,
    };
  }

  return memoryAdapter({
    users: [],
    sessions: [],
    accounts: [],
    verifications: [],
  });
}

function isPoolBackedProvider(
  databaseProvider: DatabaseProvider,
): databaseProvider is PoolBackedDatabaseProvider {
  return databaseProvider.kind === "postgres" && "getPool" in databaseProvider;
}

function isSqliteBackedProvider(
  databaseProvider: DatabaseProvider,
): databaseProvider is SqliteBackedDatabaseProvider {
  return databaseProvider.kind === "sqlite" && "getDatabase" in databaseProvider;
}

function toAuthUser(user: Record<string, unknown>): AuthUser {
  return {
    id: String(user.id),
    email: String(user.email),
    name: String(user.name ?? user.email),
    role: normalizeRole(user.role),
    banned: Boolean(user.banned),
  };
}

function normalizeRole(role: unknown): UserRole {
  return role === "admin" ? "admin" : "user";
}
