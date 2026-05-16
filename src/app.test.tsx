import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { createAppHarness } from "./test/appHarness";

let harness: Awaited<ReturnType<typeof createAppHarness>>;

beforeEach(async () => {
  harness = await createAppHarness();
});

afterEach(async () => {
  await harness?.close();
});

describe("app", () => {
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

  test("rejects invalid delete ids", async () => {
    const response = await harness.app.request("/walks/nope", {
      method: "DELETE",
      headers: harness.authHeaders,
    });

    expect(response.status).toBe(400);
    expect(await response.text()).toContain("Walk id must be a positive integer.");
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
