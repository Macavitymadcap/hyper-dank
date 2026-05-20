import { describe, expect, test } from "bun:test";
import { createAppServerHarness, dynamicPortCandidate, waitForHttp } from "./local-server";

describe("local server helpers", () => {
  test("waits for HTTP readiness with caller-provided fetch", async () => {
    let calls = 0;
    const response = await waitForHttp("http://example.test/healthz", {
      attempts: 3,
      delayMs: 1,
      fetchImpl: async () => {
        calls += 1;

        return new Response(calls === 2 ? "ready" : "warming", {
          status: calls === 2 ? 200 : 503,
        });
      },
    });

    expect(calls).toBe(2);
    expect(await response.text()).toBe("ready");
  });

  test("generates deterministic dynamic port candidates", () => {
    expect(dynamicPortCandidate(0, 45_000, 20_000)).toBeGreaterThanOrEqual(45_000);
    expect(dynamicPortCandidate(1, 45_000, 20_000)).toBe(
      dynamicPortCandidate(0, 45_000, 20_000) + 1,
    );
  });

  test("creates app server harnesses with setup, readiness, and teardown", async () => {
    const events: string[] = [];
    const harness = await createAppServerHarness({
      start: () => {
        events.push("start");
        return { url: "http://example.test" };
      },
      url: (server) => server.url,
      setup: () => {
        events.push("setup");
      },
      stop: () => {
        events.push("stop");
      },
      wait: {
        attempts: 1,
        fetchImpl: async (input) => {
          events.push(String(input));
          return new Response("ready");
        },
      },
    });

    expect(harness.url).toBe("http://example.test");
    await harness.stop();
    expect(events).toEqual(["start", "setup", "http://example.test/", "stop"]);
  });
});
