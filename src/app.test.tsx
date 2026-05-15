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
    const response = await harness.app.request("/");
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
    expect(await harness.repository.getAllWalks()).toHaveLength(0);
  });

  test("rejects invalid delete ids", async () => {
    const response = await harness.app.request("/walks/nope", { method: "DELETE" });

    expect(response.status).toBe(400);
    expect(await response.text()).toContain("Walk id must be a positive integer.");
  });
});
