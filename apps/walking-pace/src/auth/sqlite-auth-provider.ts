import type { Database } from "bun:sqlite";
import type {
  AuthProvider,
  AuthSession,
  AuthUser,
  CreateAuthUserInput,
  SignInInput,
  UserRole,
} from "./model";

const SESSION_COOKIE = "pace_local_session";
const SESSION_TTL_DAYS = 30;

interface LocalAuthUserRow {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: string;
  banned: number;
}

export class SqliteAuthProvider implements AuthProvider {
  private readonly db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  handler(_request: Request): Promise<Response> {
    return Promise.resolve(
      new Response("Local SQLite auth does not expose API routes.", { status: 404 }),
    );
  }

  async getSession(request: Request): Promise<AuthSession | null> {
    const token = getCookie(request.headers.get("cookie") ?? "", SESSION_COOKIE);
    if (!token) return null;

    this.deleteExpiredSessions();

    const row = this.db
      .query(
        `SELECT users.id, users.email, users.name, users.password_hash, users.role, users.banned
        FROM local_auth_sessions sessions
        JOIN local_auth_users users ON users.id = sessions.user_id
        WHERE sessions.token = ?
          AND sessions.expires_at > ?`,
      )
      .get(token, new Date().toISOString()) as LocalAuthUserRow | null;

    if (!row || row.banned) return null;

    return {
      user: toAuthUser(row),
    };
  }

  async signIn(input: SignInInput, _request: Request): Promise<Response> {
    const email = normalizeEmail(input.email);
    const row = this.db
      .query(
        `SELECT id, email, name, password_hash, role, banned
        FROM local_auth_users
        WHERE email = ?
        LIMIT 1`,
      )
      .get(email) as LocalAuthUserRow | null;

    if (!row || row.banned || !(await verifyPassword(input.password, row.password_hash))) {
      return Response.json({ message: "Invalid email or password." }, { status: 401 });
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
    this.db
      .query(
        `INSERT INTO local_auth_sessions (token, user_id, expires_at)
        VALUES (?, ?, ?)`,
      )
      .run(token, row.id, expiresAt.toISOString());

    return Response.json(
      { ok: true },
      {
        headers: {
          "set-cookie": `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${
            SESSION_TTL_DAYS * 24 * 60 * 60
          }`,
        },
      },
    );
  }

  async signOut(request: Request): Promise<Response> {
    const token = getCookie(request.headers.get("cookie") ?? "", SESSION_COOKIE);
    if (token) {
      this.db.query("DELETE FROM local_auth_sessions WHERE token = ?").run(token);
    }

    return Response.json(
      { ok: true },
      {
        headers: {
          "set-cookie": `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
        },
      },
    );
  }

  async createUser(input: CreateAuthUserInput): Promise<AuthUser> {
    const id = crypto.randomUUID();
    const email = normalizeEmail(input.email);
    const passwordHash = await hashPassword(input.password);
    const now = new Date().toISOString();

    this.db
      .query(
        `INSERT INTO local_auth_users (
          id,
          email,
          name,
          password_hash,
          role,
          banned,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, 0, ?, ?)`,
      )
      .run(id, email, input.name, passwordHash, input.role, now, now);

    return {
      id,
      email,
      name: input.name,
      role: input.role,
      banned: false,
    };
  }

  async listUsers(): Promise<AuthUser[]> {
    const rows = this.db
      .query(
        `SELECT id, email, name, password_hash, role, banned
        FROM local_auth_users
        ORDER BY created_at ASC`,
      )
      .all() as LocalAuthUserRow[];

    return rows.map(toAuthUser);
  }

  async countUsers(): Promise<number> {
    const row = this.db.query("SELECT COUNT(*) AS count FROM local_auth_users").get() as {
      count: number;
    };

    return Number(row.count);
  }

  async setUserRole(userId: string, role: UserRole): Promise<void> {
    this.db
      .query("UPDATE local_auth_users SET role = ?, updated_at = ? WHERE id = ?")
      .run(role, new Date().toISOString(), userId);
  }

  async setUserBanned(userId: string, banned: boolean): Promise<void> {
    this.db
      .query("UPDATE local_auth_users SET banned = ?, updated_at = ? WHERE id = ?")
      .run(banned ? 1 : 0, new Date().toISOString(), userId);
  }

  private deleteExpiredSessions(): void {
    this.db
      .query("DELETE FROM local_auth_sessions WHERE expires_at <= ?")
      .run(new Date().toISOString());
  }
}

async function hashPassword(password: string): Promise<string> {
  return Bun.password.hash(password);
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  try {
    return await Bun.password.verify(password, storedHash);
  } catch {
    return false;
  }
}

function getCookie(cookieHeader: string, name: string): string | null {
  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const prefix = `${name}=`;
  const cookie = cookies.find((value) => value.startsWith(prefix));
  return cookie ? cookie.slice(prefix.length) : null;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeRole(role: string): UserRole {
  return role === "admin" ? "admin" : "user";
}

function toAuthUser(row: LocalAuthUserRow): AuthUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: normalizeRole(row.role),
    banned: Boolean(row.banned),
  };
}
