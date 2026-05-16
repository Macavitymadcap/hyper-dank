import { afterEach, beforeEach, describe, expect, test } from "bun:test";
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
  test("creates users, signs in, and reads Better Auth sessions", async () => {
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
    expect(cookie).toContain("better-auth.session_token");

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
});
