import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createSqliteDatabaseProvider, type DatabaseProvider } from "../db";
import { createAuthProvider } from "./better-auth-provider";

let databaseProvider: DatabaseProvider;
const authSecret = "test-secret-for-better-auth-with-enough-entropy";

beforeEach(async () => {
  databaseProvider = createSqliteDatabaseProvider({ filename: ":memory:" });
  await databaseProvider.migrate();
});

afterEach(async () => {
  await databaseProvider.close();
});

describe("createAuthProvider", () => {
  test("creates users, signs in, and reads SQLite-backed local sessions", async () => {
    const authProvider = createAuthProvider({
      databaseProvider,
      baseUrl: "http://localhost",
      secret: authSecret,
    });
    await authProvider.createUser({
      email: "new@example.com",
      name: "New User",
      password: "password123",
      role: "user",
    });

    const signInResponse = await authProvider.signIn(
      {
        email: "new@example.com",
        password: "password123",
      },
      new Request("http://localhost/login"),
    );
    const cookie = signInResponse.headers.get("set-cookie");

    expect(signInResponse.status).toBe(200);
    expect(cookie).toContain("pace_local_session");

    const session = await authProvider.getSession(
      new Request("http://localhost", {
        headers: {
          Cookie: cookie ?? "",
        },
      }),
    );

    expect(session?.user.email).toBe("new@example.com");
    expect(session?.user.role).toBe("user");
  });

  test("persists SQLite auth users across provider instances", async () => {
    const directory = mkdtempSync(join(tmpdir(), "pace-auth-"));
    const filename = join(directory, "review.sqlite3");
    let secondProvider: DatabaseProvider | undefined;

    try {
      const firstProvider = createSqliteDatabaseProvider({ filename });
      await firstProvider.migrate();
      await createAuthProvider({
        databaseProvider: firstProvider,
        baseUrl: "http://localhost",
        secret: authSecret,
      }).createUser({
        email: "admin@example.com",
        name: "Admin",
        password: "password123",
        role: "admin",
      });
      await firstProvider.close();

      secondProvider = createSqliteDatabaseProvider({ filename });
      await secondProvider.migrate();
      const authProvider = createAuthProvider({
        databaseProvider: secondProvider,
        baseUrl: "http://localhost",
        secret: authSecret,
      });

      const signInResponse = await authProvider.signIn(
        {
          email: "admin@example.com",
          password: "password123",
        },
        new Request("http://localhost/login"),
      );

      expect(signInResponse.status).toBe(200);
      expect((await authProvider.listUsers())[0]).toMatchObject({
        email: "admin@example.com",
        role: "admin",
      });
    } finally {
      await secondProvider?.close();
      rmSync(directory, { force: true, recursive: true });
    }
  });

  test("supports local SQLite account controls and auth failures", async () => {
    const authProvider = createAuthProvider({
      databaseProvider,
      baseUrl: "http://localhost",
      secret: authSecret,
    });
    const user = await authProvider.createUser({
      email: " Local@Example.com ",
      name: "Local User",
      password: "password123",
      role: "user",
    });

    expect(await authProvider.handler(new Request("http://localhost/api/auth/test"))).toMatchObject(
      {
        status: 404,
      },
    );
    expect(await authProvider.getSession(new Request("http://localhost"))).toBeNull();
    expect(await authProvider.countUsers()).toBe(1);

    await authProvider.setUserRole(user.id, "admin");
    expect((await authProvider.listUsers())[0]).toMatchObject({
      email: "local@example.com",
      role: "admin",
    });

    expect(
      await authProvider.signIn(
        { email: "local@example.com", password: "wrong-password" },
        new Request("http://localhost/login"),
      ),
    ).toMatchObject({ status: 401 });
    expect(
      await authProvider.signIn(
        { email: "missing@example.com", password: "password123" },
        new Request("http://localhost/login"),
      ),
    ).toMatchObject({ status: 401 });

    const signInResponse = await authProvider.signIn(
      { email: "local@example.com", password: "password123" },
      new Request("http://localhost/login"),
    );
    const cookie = signInResponse.headers.get("set-cookie") ?? "";

    expect(signInResponse.status).toBe(200);
    expect(
      await authProvider.signOut(
        new Request("http://localhost", {
          headers: { cookie },
        }),
      ),
    ).toMatchObject({ status: 200 });
    expect(await authProvider.signOut(new Request("http://localhost"))).toMatchObject({
      status: 200,
    });

    await authProvider.setUserBanned(user.id, true);
    expect(
      await authProvider.signIn(
        { email: "local@example.com", password: "password123" },
        new Request("http://localhost/login"),
      ),
    ).toMatchObject({ status: 401 });
    expect(
      await authProvider.getSession(
        new Request("http://localhost", {
          headers: { cookie },
        }),
      ),
    ).toBeNull();
  });

  test("wraps Better Auth runtime for non-SQLite providers", async () => {
    const authProvider = createAuthProvider({
      databaseProvider: createMemoryAuthDatabaseProvider(),
      baseUrl: "http://localhost",
      secret: authSecret,
    });
    const user = await authProvider.createUser({
      email: "better@example.com",
      name: "Better User",
      password: "password123",
      role: "admin",
    });
    const signInResponse = await authProvider.signIn(
      {
        email: "better@example.com",
        password: "password123",
      },
      new Request("http://localhost/login"),
    );
    const cookie = signInResponse.headers.get("set-cookie") ?? "";

    expect(
      await authProvider.handler(new Request("http://localhost/api/auth/missing")),
    ).toMatchObject({ status: 404 });
    expect(signInResponse.status).toBe(200);
    expect(
      await authProvider.getSession(
        new Request("http://localhost", {
          headers: { cookie },
        }),
      ),
    ).toMatchObject({
      user: {
        email: "better@example.com",
        role: "admin",
      },
    });
    expect(await authProvider.listUsers()).toHaveLength(1);
    expect(await authProvider.countUsers()).toBe(1);

    await authProvider.setUserRole(user.id, "user");
    await authProvider.setUserBanned(user.id, true);

    expect((await authProvider.listUsers())[0]).toMatchObject({
      banned: true,
      role: "user",
    });
    expect(
      await authProvider.signOut(
        new Request("http://localhost", {
          headers: { cookie },
        }),
      ),
    ).toMatchObject({ status: 200 });
    expect(await authProvider.getSession(new Request("http://localhost"))).toBeNull();
  });
});

function createMemoryAuthDatabaseProvider(): DatabaseProvider {
  return {
    kind: "postgres",
    createInviteRepository() {
      throw new Error("unused");
    },
    createWalkRepository() {
      throw new Error("unused");
    },
    close: async () => {},
    migrate: async () => {},
  };
}
