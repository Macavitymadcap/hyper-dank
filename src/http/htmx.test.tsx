import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { createAppHarness, htmxHeaders } from "../test/appHarness";

let harness: Awaited<ReturnType<typeof createAppHarness>>;

beforeEach(async () => {
  harness = await createAppHarness();
});

afterEach(async () => {
  await harness?.close();
});

describe("HTMX contracts", () => {
  test("walk form posts return only the walks table fragment", async () => {
    const response = await harness.postWalk(
      { miles: "1.2", minutes: "18", seconds: "55" },
      {
        ...htmxHeaders,
        "HX-Target": "walks-list",
      },
    );
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(await harness.repository.getAllWalks("user@example.com")).toHaveLength(1);
    expect(html).toStartWith('<div class="walks-history">');
    expect(html).toContain('<span class="chip history-count">1 walk</span>');
    expect(html).toContain('<table class="scrollable-table walks-table">');
    expect(html).toContain("<tbody>");
    expect(html).not.toContain("<html");
    expect(html).not.toContain("<main");
  });

  test("stats refresh returns only the stats fragment", async () => {
    await harness.repository.addWalk("user@example.com", { miles: 1, minutes: 20, seconds: 0 });

    const response = await harness.app.request("/stats", {
      headers: {
        ...harness.authHeaders,
        ...htmxHeaders,
        "HX-Trigger": "refresh",
        "HX-Target": "stats",
      },
    });
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toStartWith('<div class="stats">');
    expect(html).toContain('<output class="labelled-output-value">3.0</output>');
    expect(html).not.toContain("<html");
  });

  test("clear buttons return an updated walks table fragment", async () => {
    await harness.repository.addWalk("user@example.com", { miles: 1, minutes: 20, seconds: 0 });
    const [walk] = await harness.repository.getAllWalks("user@example.com");
    if (!walk) throw new Error("Expected inserted walk");

    const response = await harness.app.request(`/walks/${walk.id}`, {
      method: "DELETE",
      headers: {
        ...harness.authHeaders,
        ...htmxHeaders,
        "HX-Target": "walks-list",
      },
    });
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(await harness.repository.getAllWalks("user@example.com")).toHaveLength(0);
    expect(html).toContain('<span class="chip history-count">0 walks</span>');
    expect(html).toContain("No walks recorded yet.");
    expect(html).not.toContain("<html");
  });

  test("clear buttons cannot mutate another user's walks", async () => {
    await harness.repository.addWalk("other@example.com", { miles: 1, minutes: 20, seconds: 0 });
    const [walk] = await harness.repository.getAllWalks("other@example.com");
    if (!walk) throw new Error("Expected inserted walk");

    const response = await harness.app.request(`/walks/${walk.id}`, {
      method: "DELETE",
      headers: {
        ...harness.authHeaders,
        ...htmxHeaders,
        "HX-Target": "walks-list",
      },
    });

    expect(response.status).toBe(200);
    expect(await harness.repository.getAllWalks("other@example.com")).toHaveLength(1);
  });

  test("clear all returns an empty walks fragment and leaves stats refreshable", async () => {
    await harness.repository.addWalk("user@example.com", { miles: 1, minutes: 20, seconds: 0 });
    await harness.repository.addWalk("user@example.com", { miles: 2, minutes: 30, seconds: 0 });

    const response = await harness.app.request("/walks", {
      method: "DELETE",
      headers: {
        ...harness.authHeaders,
        ...htmxHeaders,
        "HX-Target": "walks-list",
      },
    });
    const html = await response.text();
    const stats = await harness.app.request("/stats", {
      headers: {
        ...harness.authHeaders,
        ...htmxHeaders,
        "HX-Trigger": "refresh",
        "HX-Target": "stats",
      },
    });
    const statsHtml = await stats.text();

    expect(response.status).toBe(200);
    expect(await harness.repository.getAllWalks("user@example.com")).toHaveLength(0);
    expect(html).toContain('<span class="chip history-count">0 walks</span>');
    expect(html).toContain("No walks recorded yet.");
    expect(html).not.toContain("<html");
    expect(statsHtml).toContain('<output class="labelled-output-value">--</output>');
  });

  test("login failures return only the login form fragment", async () => {
    const response = await harness.app.request("/login", {
      method: "POST",
      headers: {
        ...htmxHeaders,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ email: "user@example.com", password: "wrong" }),
    });
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toStartWith('<form action="/login"');
    expect(html).toContain("Invalid email or password.");
    expect(html).toContain('hx-post="/login"');
    expect(html).not.toContain("<html");
  });

  test("successful login redirects HTMX through HX-Redirect", async () => {
    const response = await harness.app.request("/login", {
      method: "POST",
      headers: {
        ...htmxHeaders,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ email: "user@example.com", password: "password123" }),
    });

    expect(response.status).toBe(204);
    expect(response.headers.get("HX-Redirect")).toBe("/");
    expect(response.headers.get("set-cookie")).toContain("pace_test_session=");
  });

  test("invite failures return only the invite form fragment", async () => {
    const response = await harness.app.request("/invite/missing-token", {
      method: "POST",
      headers: {
        ...htmxHeaders,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ name: "Invited User", password: "password123" }),
    });
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toStartWith('<form action="/invite/missing-token"');
    expect(html).toContain("This invitation is invalid");
    expect(html).not.toContain("<html");
  });

  test("admin invite errors return only the admin dashboard fragment", async () => {
    const response = await harness.app.request("/admin/invites", {
      method: "POST",
      headers: {
        ...harness.adminHeaders,
        ...htmxHeaders,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ email: "not-an-email", role: "user" }),
    });
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toStartWith('<div id="admin-panel"');
    expect(html).toContain("A valid email address is required.");
    expect(html).toContain('hx-post="/admin/invites"');
    expect(html).not.toContain("<html");
  });
});
