import { describe, expect, test } from "bun:test";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { CoverageHtmlReport, LcovCoverageReport, writeCoverageHtmlReport } from "./coverage-report";
import { root } from "./paths";

const lcov = `TN:
SF:${path.join(root, "src/app.tsx")}
FNF:2
FNH:2
LF:10
LH:8
end_of_record
SF:${path.join(root, "src/components/Button.tsx")}
FNF:3
FNH:3
LF:5
LH:5
end_of_record`;

describe("coverage report", () => {
  test("parses lcov summaries", () => {
    const report = new LcovCoverageReport(lcov);

    expect(report.files).toHaveLength(2);
    expect(report.summary.coveredFunctions).toBe(5);
    expect(report.summary.totalFunctions).toBe(5);
    expect(report.summary.functionRate).toBe(1);
    expect(report.summary.coveredLines).toBe(13);
    expect(report.summary.totalLines).toBe(15);
    expect(report.summary.lineRate).toBeCloseTo(0.866, 2);
  });

  test("renders a browsable html summary", () => {
    const html = new CoverageHtmlReport(new LcovCoverageReport(lcov)).render();

    expect(html).toContain("<title>Coverage Report</title>");
    expect(html).toContain("100.0% function coverage");
    expect(html).toContain("86.7% line coverage");
    expect(html).toContain("src/app.tsx");
  });

  test("reports threshold failures", () => {
    const report = new LcovCoverageReport(lcov);

    expect(report.thresholdFailures({ functions: 1, lines: 0.9 })).toEqual([
      {
        actual: 0.8,
        expected: 0.9,
        metric: "lines",
        path: "src/app.tsx",
      },
    ]);
    expect(() => report.assertThresholds({ functions: 1, lines: 0.9 })).toThrow(
      "Coverage thresholds were not met",
    );
  });

  test("writes the html report to disk", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "pace-coverage-"));

    try {
      const lcovPath = path.join(directory, "lcov.info");
      const outputPath = path.join(directory, "index.html");
      await writeFile(lcovPath, lcov);

      expect(await writeCoverageHtmlReport(lcovPath, outputPath)).toBe(outputPath);
      expect(await readFile(outputPath, "utf8")).toContain("Coverage Report");
    } finally {
      await rm(directory, { force: true, recursive: true });
    }
  });
});
