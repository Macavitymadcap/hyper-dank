import type {
  AuthProvider,
  AuthSession,
  AuthUser,
  CreateAuthUserInput,
  SignInInput,
  UserRole,
} from "./model";

const SESSION_COOKIE = "pace_test_session";

export class TestAuthProvider implements AuthProvider {
  private readonly users = new Map<string, AuthUser>();
  private readonly passwords = new Map<string, string>();
  private readonly sessions = new Map<string, string>();

  constructor(users: CreateAuthUserInput[] = []) {
    for (const user of users) {
      this.seedUser(user);
    }
  }

  handler(): Promise<Response> {
    return Promise.resolve(
      new Response("Test auth provider does not expose API routes.", { status: 404 }),
    );
  }

  async getSession(request: Request): Promise<AuthSession | null> {
    const token = getCookie(request.headers.get("cookie") ?? "", SESSION_COOKIE);
    if (!token) return null;

    const userId = this.sessions.get(token);
    if (!userId) return null;

    const user = this.users.get(userId);
    return user && !user.banned ? { user } : null;
  }

  async signIn(input: SignInInput): Promise<Response> {
    const user = [...this.users.values()].find((candidate) => candidate.email === input.email);
    if (!user || this.passwords.get(user.id) !== input.password || user.banned) {
      return Response.json({ message: "Invalid email or password." }, { status: 401 });
    }

    return Response.json({ ok: true }, { headers: this.createSetCookieHeader(user.id) });
  }

  async signOut(request: Request): Promise<Response> {
    const token = getCookie(request.headers.get("cookie") ?? "", SESSION_COOKIE);
    if (token) this.sessions.delete(token);

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
    return this.seedUser(input);
  }

  async listUsers(): Promise<AuthUser[]> {
    return [...this.users.values()];
  }

  async countUsers(): Promise<number> {
    return this.users.size;
  }

  async setUserRole(userId: string, role: UserRole): Promise<void> {
    const user = this.users.get(userId);
    if (!user) return;
    this.users.set(userId, { ...user, role });
  }

  async setUserBanned(userId: string, banned: boolean): Promise<void> {
    const user = this.users.get(userId);
    if (!user) return;
    this.users.set(userId, { ...user, banned });
  }

  seedUser(input: CreateAuthUserInput): AuthUser {
    const id = input.email;
    const user: AuthUser = {
      id,
      email: input.email,
      name: input.name,
      role: input.role,
      banned: false,
    };

    this.users.set(id, user);
    this.passwords.set(id, input.password);

    return user;
  }

  createCookie(userId: string): string {
    const token = crypto.randomUUID();
    this.sessions.set(token, userId);
    return `${SESSION_COOKIE}=${token}`;
  }

  createSetCookieHeader(userId: string): Headers {
    return new Headers({
      "set-cookie": `${this.createCookie(userId)}; Path=/; HttpOnly; SameSite=Lax`,
    });
  }
}

function getCookie(cookieHeader: string, name: string): string | null {
  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const prefix = `${name}=`;
  const cookie = cookies.find((value) => value.startsWith(prefix));
  return cookie ? cookie.slice(prefix.length) : null;
}
