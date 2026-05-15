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

  test("posts valid walks and persists them", async () => {
    const response = await postWalk({ miles: "1.2", minutes: "18", seconds: "55" });

    expect(response.status).toBe(200);
    expect(repository.getAllWalks()).toHaveLength(1);
  });

  test("rejects invalid walks without mutating storage", async () => {
    const response = await postWalk({ miles: "-1", minutes: "18", seconds: "55" });

    expect(response.status).toBe(400);
    expect(await response.text()).toContain("Miles must be greater than zero.");
    expect(repository.getAllWalks()).toHaveLength(0);
  });

  test("deletes walks and persists the change", async () => {
    repository.addWalk({ miles: 1, minutes: 20, seconds: 0 });

    const [walk] = repository.getAllWalks();
    if (!walk) throw new Error("Expected inserted walk");

    const deleted = await app.request(`/walks/${walk.id}`, { method: "DELETE" });

    expect(deleted.status).toBe(200);
    expect(repository.getAllWalks()).toHaveLength(0);
  });

  test("rejects invalid delete ids", async () => {
    const response = await app.request("/walks/nope", { method: "DELETE" });

    expect(response.status).toBe(400);
    expect(await response.text()).toContain("Walk id must be a positive integer.");
  });

  test("clears all walks and persists the change", async () => {
    repository.addWalk({ miles: 1, minutes: 20, seconds: 0 });
    repository.addWalk({ miles: 2, minutes: 30, seconds: 0 });

    const response = await app.request("/walks", { method: "DELETE" });

    expect(response.status).toBe(200);
    expect(repository.getAllWalks()).toHaveLength(0);
  });
});
