import { describe, expect, test } from "bun:test";
import { runPa11yTargets } from "./pa11y";

describe("pa11y helpers", () => {
  test("runs named a11y targets with base URLs and per-target cookies", async () => {
    const calls: Array<{ cookie?: string; url: string }> = [];
    const results = await runPa11yTargets(
      [
        { name: "Home", path: "/" },
        { name: "Admin", path: "/admin", cookie: "session=admin" },
      ],
      {
        baseUrl: "http://example.test",
        cookie: "session=user",
        runner: async (url, options) => {
          calls.push({ cookie: options?.cookie, url });
        },
      },
    );

    expect(results).toEqual([
      { name: "Home", url: "http://example.test/" },
      { name: "Admin", url: "http://example.test/admin" },
    ]);
    expect(calls).toEqual([
      { cookie: "session=user", url: "http://example.test/" },
      { cookie: "session=admin", url: "http://example.test/admin" },
    ]);
  });
});
