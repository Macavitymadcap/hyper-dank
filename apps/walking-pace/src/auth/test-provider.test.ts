import { describe, expect, test } from "bun:test";
import { TestAuthProvider } from "./test-provider";

describe("TestAuthProvider", () => {
  test("implements deterministic auth flows for route tests", async () => {
    const provider = new TestAuthProvider([
      {
        email: "user@example.com",
        name: "User",
        password: "password123",
        role: "user",
      },
    ]);

    expect(await provider.handler()).toMatchObject({ status: 404 });
    expect(await provider.getSession(new Request("http://localhost"))).toBeNull();
    expect(
      await provider.signIn({
        email: "missing@example.com",
        password: "password123",
      }),
    ).toMatchObject({ status: 401 });
    expect(
      await provider.signIn({
        email: "user@example.com",
        password: "wrong-password",
      }),
    ).toMatchObject({ status: 401 });

    const signInResponse = await provider.signIn({
      email: "user@example.com",
      password: "password123",
    });
    const cookie = signInResponse.headers.get("set-cookie") ?? "";

    expect(signInResponse.status).toBe(200);
    expect(
      await provider.getSession(
        new Request("http://localhost", {
          headers: { cookie },
        }),
      ),
    ).toMatchObject({
      user: {
        email: "user@example.com",
      },
    });

    await provider.setUserRole("user@example.com", "admin");
    await provider.setUserRole("missing@example.com", "admin");
    expect((await provider.listUsers())[0]?.role).toBe("admin");
    expect(await provider.countUsers()).toBe(1);

    await provider.signOut(
      new Request("http://localhost", {
        headers: { cookie },
      }),
    );
    expect(
      await provider.getSession(
        new Request("http://localhost", {
          headers: { cookie },
        }),
      ),
    ).toBeNull();

    const bannedCookie = provider.createCookie("user@example.com");
    await provider.setUserBanned("user@example.com", true);
    await provider.setUserBanned("missing@example.com", true);
    expect(
      await provider.signIn({
        email: "user@example.com",
        password: "password123",
      }),
    ).toMatchObject({ status: 401 });
    expect(
      await provider.getSession(
        new Request("http://localhost", {
          headers: { cookie: bannedCookie },
        }),
      ),
    ).toBeNull();
  });
});
