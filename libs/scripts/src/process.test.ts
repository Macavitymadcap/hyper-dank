import { describe, expect, test } from "bun:test";
import { run, runAsync, runResult } from "./process";

describe("process helpers", () => {
  test("captures trimmed command output", () => {
    expect(run("bun", ["-e", "console.log('hello')"])).toBe("hello");
  });

  test("returns result details when allowFailure is set", () => {
    const result = runResult("bun", ["-e", "console.error('nope'); process.exit(7)"], {
      allowFailure: true,
    });

    expect(result.exitCode).toBe(7);
    expect(result.stderr).toContain("nope");
  });

  test("throws for failing sync commands by default", () => {
    expect(() => run("bun", ["-e", "process.exit(2)"])).toThrow("failed");
  });

  test("returns async exit code", async () => {
    await expect(
      runAsync("bun", ["-e", "process.exit(3)"], { allowFailure: true, stdio: "pipe" }),
    ).resolves.toBe(3);
  });
});
