import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { createAppHarness, htmxHeaders } from "./test/appHarness";

let harness: ReturnType<typeof createAppHarness>;

beforeEach(() => {
  harness = createAppHarness();
});

afterEach(() => {
  harness?.close();
});

describe("HTMX contracts", () => {
  test("walk form posts return only the walks table fragment", async () => {
    const response = await harness.postWalk(
      { miles: "1.2", minutes: "18", seconds: "55" },
      {
        ...htmxHeaders,
        "HX-Target": "walks-list",
      }
    );
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(harness.repository.getAllWalks()).toHaveLength(1);
    expect(html).toStartWith("<div class=\"walks-history\">");
    expect(html).toContain("<span class=\"history-count\">1 walk</span>");
    expect(html).toContain("<table class=\"scrollable-table walks-table\">");
    expect(html).toContain("<tbody>");
    expect(html).not.toContain("<html");
    expect(html).not.toContain("<main");
  });

  test("stats refresh returns only the stats fragment", async () => {
    harness.repository.addWalk({ miles: 1, minutes: 20, seconds: 0 });

    const response = await harness.app.request("/stats", {
      headers: {
        ...htmxHeaders,
        "HX-Trigger": "refresh",
        "HX-Target": "stats",
      },
    });
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toStartWith("<div class=\"stats\">");
    expect(html).toContain("<output class=\"stat-value\">3.0</output>");
    expect(html).not.toContain("<html");
  });

  test("clear buttons return an updated walks table fragment", async () => {
    harness.repository.addWalk({ miles: 1, minutes: 20, seconds: 0 });
    const [walk] = harness.repository.getAllWalks();
    if (!walk) throw new Error("Expected inserted walk");

    const response = await harness.app.request(`/walks/${walk.id}`, {
      method: "DELETE",
      headers: {
        ...htmxHeaders,
        "HX-Target": "walks-list",
      },
    });
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(harness.repository.getAllWalks()).toHaveLength(0);
    expect(html).toContain("<span class=\"history-count\">0 walks</span>");
    expect(html).toContain("No walks recorded yet.");
    expect(html).not.toContain("<html");
  });

  test("clear all returns an empty walks fragment and leaves stats refreshable", async () => {
    harness.repository.addWalk({ miles: 1, minutes: 20, seconds: 0 });
    harness.repository.addWalk({ miles: 2, minutes: 30, seconds: 0 });

    const response = await harness.app.request("/walks", {
      method: "DELETE",
      headers: {
        ...htmxHeaders,
        "HX-Target": "walks-list",
      },
    });
    const html = await response.text();
    const stats = await harness.app.request("/stats", {
      headers: {
        ...htmxHeaders,
        "HX-Trigger": "refresh",
        "HX-Target": "stats",
      },
    });
    const statsHtml = await stats.text();

    expect(response.status).toBe(200);
    expect(harness.repository.getAllWalks()).toHaveLength(0);
    expect(html).toContain("<span class=\"history-count\">0 walks</span>");
    expect(html).toContain("No walks recorded yet.");
    expect(html).not.toContain("<html");
    expect(statsHtml).toContain("<output class=\"stat-value\">--</output>");
  });
});
