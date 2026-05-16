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
});
