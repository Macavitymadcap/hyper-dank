import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { createAppHarness } from "../test/appHarness";

let harness: Awaited<ReturnType<typeof createAppHarness>>;

beforeEach(async () => {
  harness = await createAppHarness();
});

afterEach(async () => {
  await harness?.close();
});

describe("app", () => {
  test("serves a public health check", async () => {
    const response = await harness.app.request("/healthz");

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });

  test("redirects the Storybook mount to its static root", async () => {
    const response = await harness.app.request("/storybook");

    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe("/storybook/");
  });

  test("proxies auth API routes to the auth provider", async () => {
    const response = await harness.app.request("/api/auth/missing");

    expect(response.status).toBe(404);
    expect(await response.text()).toContain("Test auth provider");
  });

  test("renders the full home page document", async () => {
    const response = await harness.app.request("/", {
      headers: harness.authHeaders,
    });
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain('<html lang="en">');
    expect(html).toContain("<title>Walking Pace Tracker</title>");
    expect(html).toContain("Summary");
    expect(html).toContain("Add walk");
    expect(html).toContain("Walk history");
  });

  test("rejects invalid walk input without mutating storage", async () => {
    const response = await harness.postWalk({ miles: "-1", minutes: "18", seconds: "55" });

    expect(response.status).toBe(400);
    expect(await response.text()).toContain("Miles must be greater than zero.");
    expect(await harness.repository.getAllWalks("user@example.com")).toHaveLength(0);
  });

  test("native walk form posts fall back to a page redirect", async () => {
    const response = await harness.postWalk({ miles: "1.2", minutes: "18", seconds: "55" });

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/");
    expect(await harness.repository.getAllWalks("user@example.com")).toHaveLength(1);
  });

  test("rejects invalid delete ids", async () => {
    const response = await harness.app.request("/walks/nope", {
      method: "DELETE",
      headers: harness.authHeaders,
    });

    expect(response.status).toBe(400);
    expect(await response.text()).toContain("Walk id must be a positive integer.");
  });

  test("native clear buttons fall back to page redirects", async () => {
    await harness.repository.addWalk("user@example.com", { miles: 1, minutes: 20, seconds: 0 });
    await harness.repository.addWalk("user@example.com", { miles: 2, minutes: 30, seconds: 0 });
    const [walk] = await harness.repository.getAllWalks("user@example.com");
    if (!walk) throw new Error("Expected inserted walk");

    const clearOne = await harness.app.request(`/walks/${walk.id}/delete`, {
      method: "POST",
      headers: harness.authHeaders,
    });
    expect(clearOne.status).toBe(303);
    expect(clearOne.headers.get("location")).toBe("/");
    expect(await harness.repository.getAllWalks("user@example.com")).toHaveLength(1);

    const clearAll = await harness.app.request("/walks/delete", {
      method: "POST",
      headers: harness.authHeaders,
    });
    expect(clearAll.status).toBe(303);
    expect(clearAll.headers.get("location")).toBe("/");
    expect(await harness.repository.getAllWalks("user@example.com")).toHaveLength(0);
  });

  test("redirects unauthenticated users to login", async () => {
    const response = await harness.app.request("/");

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/login");
  });

  test("serves auth pages and native auth redirects", async () => {
    const login = await harness.app.request("/login");
    const authenticatedLogin = await harness.app.request("/login", {
      headers: harness.authHeaders,
    });
    const failedLogin = await harness.app.request("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ email: "user@example.com", password: "wrong" }),
    });
    const logout = await harness.app.request("/logout", {
      method: "POST",
      headers: harness.authHeaders,
    });

    expect(login.status).toBe(200);
    expect(await login.text()).toContain("Sign in");
    expect(authenticatedLogin.status).toBe(303);
    expect(authenticatedLogin.headers.get("location")).toBe("/");
    expect(failedLogin.status).toBe(401);
    expect(await failedLogin.text()).toContain("Invalid email or password.");
    expect(logout.status).toBe(303);
    expect(logout.headers.get("location")).toBe("/login");
    expect(logout.headers.get("set-cookie")).toContain("pace_test_session=");
  });

  test("serves invitation pages and native invitation acceptance", async () => {
    const invite = await harness.invitationService.createInvitation({
      email: "invited@example.com",
      invitedByUserId: "admin@example.com",
      role: "user",
    });
    const page = await harness.app.request(`/invite/${invite.token}`);
    const accepted = await harness.app.request(`/invite/${invite.token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ name: "Invited User", password: "password123" }),
    });
    const rejected = await harness.app.request("/invite/missing-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ name: "Missing User", password: "password123" }),
    });

    expect(page.status).toBe(200);
    expect(await page.text()).toContain("Accept invite");
    expect(accepted.status).toBe(303);
    expect(accepted.headers.get("location")).toBe("/");
    expect(accepted.headers.get("set-cookie")).toContain("pace_test_session=");
    expect(rejected.status).toBe(400);
    expect(await rejected.text()).toContain("This invitation is invalid");
  });

  test("restricts admin pages to admin users", async () => {
    const userResponse = await harness.app.request("/admin", {
      headers: harness.authHeaders,
    });
    const adminResponse = await harness.app.request("/admin", {
      headers: harness.adminHeaders,
    });

    expect(userResponse.status).toBe(403);
    expect(adminResponse.status).toBe(200);
    expect(await adminResponse.text()).toContain("Invite user");
  });

  test("admin actions manage invitations and accounts with native fallbacks", async () => {
    const createInvite = await harness.app.request("/admin/invites", {
      method: "POST",
      headers: {
        ...harness.adminHeaders,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ email: "new@example.com", role: "admin" }),
    });
    const [invitation] = await harness.invitationService.listInvitations();
    if (!invitation) throw new Error("Expected invitation");

    const revoke = await harness.app.request(`/admin/invites/${invitation.id}/revoke`, {
      method: "POST",
      headers: harness.adminHeaders,
    });
    const setRole = await harness.app.request("/admin/users/user@example.com/role", {
      method: "POST",
      headers: {
        ...harness.adminHeaders,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ role: "admin" }),
    });
    const ban = await harness.app.request("/admin/users/user@example.com/ban", {
      method: "POST",
      headers: harness.adminHeaders,
    });
    const unban = await harness.app.request("/admin/users/user@example.com/unban", {
      method: "POST",
      headers: harness.adminHeaders,
    });
    const user = (await harness.authProvider.listUsers()).find(
      (candidate) => candidate.id === "user@example.com",
    );

    expect(createInvite.status).toBe(303);
    expect(createInvite.headers.get("location")).toBe("/admin");
    expect(revoke.status).toBe(303);
    expect(setRole.status).toBe(303);
    expect(ban.status).toBe(303);
    expect(unban.status).toBe(303);
    expect(user).toMatchObject({
      banned: false,
      role: "admin",
    });
  });

  test("demo-mode admin invites render the simulated delivery notice", async () => {
    await harness.close();
    harness = await createAppHarness({ demoMode: true });

    const response = await harness.app.request("/admin/invites", {
      method: "POST",
      headers: {
        ...harness.adminHeaders,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ email: "reviewer@example.com", role: "user" }),
    });
    const html = await response.text();
    const [invitation] = await harness.invitationService.listInvitations();

    expect(response.status).toBe(200);
    expect(html).toContain("Demo mode is on, so no email was sent.");
    expect(html).toContain("/invite/");
    expect(invitation?.email).toBe("reviewer@example.com");
  });
});
