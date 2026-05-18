import { describe, expect, test } from "bun:test";
import { dynamicPortCandidate, waitForHttp } from "./local-server";

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
});
