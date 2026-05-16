import { describe, expect, test } from "bun:test";
import { CoverageHtmlReport, LcovCoverageReport } from "./coverage-report";

const lcov = `TN:
SF:/Users/dank/Code/personal/web/pace-calculator/src/app.tsx
LF:10
LH:8
end_of_record
SF:/Users/dank/Code/personal/web/pace-calculator/src/components/Button.tsx
LF:5
LH:5
end_of_record`;

describe("coverage report", () => {
  test("parses lcov summaries", () => {
    const report = new LcovCoverageReport(lcov);

    expect(report.files).toHaveLength(2);
    expect(report.summary.coveredLines).toBe(13);
    expect(report.summary.totalLines).toBe(15);
    expect(report.summary.lineRate).toBeCloseTo(0.866, 2);
  });

  test("renders a browsable html summary", () => {
    const html = new CoverageHtmlReport(new LcovCoverageReport(lcov)).render();

    expect(html).toContain("<title>Coverage Report</title>");
    expect(html).toContain("86.7% line coverage");
    expect(html).toContain("src/app.tsx");
  });
});
