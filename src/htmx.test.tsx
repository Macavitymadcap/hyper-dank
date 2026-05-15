import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { createApp } from "./app";
import { Repository } from "./db";

let repository: Repository;
let app: ReturnType<typeof createApp>;

const htmxHeaders = {
  "HX-Request": "true",
};

const postWalkFromHtmx = (values: Record<string, string>) => {
  return app.request("/walks", {
    method: "POST",
    headers: {
      ...htmxHeaders,
      "HX-Target": "walks-list",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(values),
  });
};

beforeEach(() => {
  repository = new Repository({ filename: ":memory:" });
  app = createApp({ walksRepository: repository });
});

afterEach(() => {
  repository?.close();
});

describe("HTMX contracts", () => {
  test("walk form posts return only the walks table fragment", async () => {
    const response = await postWalkFromHtmx({ miles: "1.2", minutes: "18", seconds: "55" });
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(repository.getAllWalks()).toHaveLength(1);
    expect(html).toStartWith("<div class=\"table-container\">");
    expect(html).toContain("<table class=\"walks-table\">");
    expect(html).toContain("<tbody>");
    expect(html).not.toContain("<html");
    expect(html).not.toContain("<main");
  });

  test("stats refresh returns only the stats fragment after an HTMX form post", async () => {
    await postWalkFromHtmx({ miles: "1", minutes: "20", seconds: "0" });

    const response = await app.request("/stats", {
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

  test("delete buttons return an updated walks table fragment", async () => {
    await postWalkFromHtmx({ miles: "1", minutes: "20", seconds: "0" });
    const [walk] = repository.getAllWalks();
    if (!walk) throw new Error("Expected inserted walk");

    const response = await app.request(`/walks/${walk.id}`, {
      method: "DELETE",
      headers: {
        ...htmxHeaders,
        "HX-Target": "walks-list",
      },
    });
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(repository.getAllWalks()).toHaveLength(0);
    expect(html).toContain("No walks recorded yet.");
    expect(html).not.toContain("<html");
  });

  test("clear all returns an empty walks fragment and leaves stats refreshable", async () => {
    await postWalkFromHtmx({ miles: "1", minutes: "20", seconds: "0" });
    await postWalkFromHtmx({ miles: "2", minutes: "30", seconds: "0" });

    const response = await app.request("/walks", {
      method: "DELETE",
      headers: {
        ...htmxHeaders,
        "HX-Target": "walks-list",
      },
    });
    const html = await response.text();
    const stats = await app.request("/stats", {
      headers: {
        ...htmxHeaders,
        "HX-Trigger": "refresh",
        "HX-Target": "stats",
      },
    });
    const statsHtml = await stats.text();

    expect(response.status).toBe(200);
    expect(repository.getAllWalks()).toHaveLength(0);
    expect(html).toContain("No walks recorded yet.");
    expect(html).not.toContain("<html");
    expect(statsHtml).toContain("<output class=\"stat-value\">--</output>");
  });
});
