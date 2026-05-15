import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { createApp } from "./app";
import { Repository } from "./db";

let repository: Repository;
let app: ReturnType<typeof createApp>;

const postWalk = (values: Record<string, string>) => {
  return app.request("/walks", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
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

describe("app", () => {
  test("renders the home page", async () => {
    const response = await app.request("/");
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain("<title>Walking Pace Tracker</title>");
    expect(html).toContain("Summary");
    expect(html).toContain("Add walk");
    expect(html).toContain("Walk history");
  });

  test("returns the stats fragment", async () => {
    repository.addWalk({ miles: 1, minutes: 20, seconds: 0 });

    const response = await app.request("/stats");
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(html).toContain("<div class=\"stats\">");
    expect(html).toContain("3.0");
  });

  test("posts valid walks and returns the updated list fragment", async () => {
    const response = await postWalk({ miles: "1.2", minutes: "18", seconds: "55" });
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(repository.getAllWalks()).toHaveLength(1);
    expect(html).toContain("<table class=\"walks-table\">");
    expect(html).toContain("15.8");
  });

  test("rejects invalid walks without mutating storage", async () => {
    const response = await postWalk({ miles: "-1", minutes: "18", seconds: "55" });

    expect(response.status).toBe(400);
    expect(await response.text()).toContain("Miles must be greater than zero.");
    expect(repository.getAllWalks()).toHaveLength(0);
  });

  test("deletes walks and rejects invalid ids", async () => {
    repository.addWalk({ miles: 1, minutes: 20, seconds: 0 });

    const [walk] = repository.getAllWalks();
    if (!walk) throw new Error("Expected inserted walk");

    const invalid = await app.request("/walks/nope", { method: "DELETE" });
    const deleted = await app.request(`/walks/${walk.id}`, { method: "DELETE" });
    const html = await deleted.text();

    expect(invalid.status).toBe(400);
    expect(deleted.status).toBe(200);
    expect(repository.getAllWalks()).toHaveLength(0);
    expect(html).toContain("No walks recorded yet.");
  });
});
