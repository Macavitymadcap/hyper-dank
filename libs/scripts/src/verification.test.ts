import { describe, expect, test } from "bun:test";
import { renderVerificationReport, runVerification, type VerificationGate } from "./verification";

const gates: VerificationGate[] = [
  { id: "one", name: "One", tooling: "Bun", command: "bun", args: ["-e", "console.log('one')"] },
  { id: "two", name: "Two", tooling: "Bun", command: "bun", args: ["-e", "process.exit(4)"] },
  {
    id: "three",
    name: "Three",
    tooling: "Bun",
    command: "bun",
    args: ["-e", "console.log('three')"],
  },
];

describe("verification helpers", () => {
  test("runs gates in order and stops on failure by default", async () => {
    const results = await runVerification(gates);

    expect(results.map((result) => result.status)).toEqual(["pass", "fail", "not run"]);
    expect(results[1]?.exitCode).toBe(4);
  });

  test("renders a Markdown report", async () => {
    const results = await runVerification(gates.slice(0, 1));
    const report = renderVerificationReport(results, "/workspace");

    expect(report).toContain("# Verification Report");
    expect(report).toContain("Root: `/workspace`");
    expect(report).toContain("| 1 | One | Bun | PASS |");
    expect(report).toContain("```text\none\n```");
  });
});
