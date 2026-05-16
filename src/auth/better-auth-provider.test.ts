import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createSqliteDatabaseProvider, type DatabaseProvider } from "../db";
import { createAuthProvider } from "./better-auth-provider";

let databaseProvider: DatabaseProvider;

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
      secret: "test-secret-for-better-auth",
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
        secret: "test-secret-for-better-auth",
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
        secret: "test-secret-for-better-auth",
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
});
