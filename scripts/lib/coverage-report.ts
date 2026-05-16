import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { normalizePath, root } from "./paths";

export interface CoverageFileSummary {
  coveredFunctions: number;
  coveredLines: number;
  functionRate: number;
  lineRate: number;
  path: string;
  totalFunctions: number;
  totalLines: number;
}

export interface CoverageThresholds {
  functions: number;
  lines: number;
}

export interface CoverageThresholdFailure {
  actual: number;
  expected: number;
  metric: "functions" | "lines";
  path: string;
}

export class LcovCoverageReport {
  readonly files: CoverageFileSummary[];

  constructor(lcov: string) {
    this.files = parseLcov(lcov);
  }

  get summary(): CoverageFileSummary {
    const totalFunctions = this.files.reduce((total, file) => total + file.totalFunctions, 0);
    const coveredFunctions = this.files.reduce((total, file) => total + file.coveredFunctions, 0);
    const totalLines = this.files.reduce((total, file) => total + file.totalLines, 0);
    const coveredLines = this.files.reduce((total, file) => total + file.coveredLines, 0);

    return {
      coveredFunctions,
      coveredLines,
      functionRate: totalFunctions === 0 ? 1 : coveredFunctions / totalFunctions,
      lineRate: totalLines === 0 ? 0 : coveredLines / totalLines,
      path: "All files",
      totalFunctions,
      totalLines,
    };
  }

  thresholdFailures(thresholds: CoverageThresholds): CoverageThresholdFailure[] {
    return this.files.flatMap((file) => {
      const failures: CoverageThresholdFailure[] = [];

      if (file.functionRate < thresholds.functions) {
        failures.push({
          actual: file.functionRate,
          expected: thresholds.functions,
          metric: "functions",
          path: file.path,
        });
      }

      if (file.lineRate < thresholds.lines) {
        failures.push({
          actual: file.lineRate,
          expected: thresholds.lines,
          metric: "lines",
          path: file.path,
        });
      }

      return failures;
    });
  }

  assertThresholds(thresholds: CoverageThresholds): void {
    const failures = this.thresholdFailures(thresholds);
    if (failures.length === 0) return;

    throw new Error(formatCoverageFailures(failures));
  }
}

export class CoverageHtmlReport {
  constructor(private readonly report: LcovCoverageReport) {}

  render(): string {
    const rows = this.report.files
      .sort((left, right) => left.path.localeCompare(right.path))
      .map((file) => tableRow(file))
      .join("\n");

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Coverage Report</title>
  <style>
    body { font: 16px/1.5 system-ui, sans-serif; margin: 2rem auto; max-width: 64rem; padding: 0 1rem; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border-bottom: 1px solid #d0d7de; padding: 0.5rem; text-align: left; }
    td:last-child, th:last-child { text-align: right; }
    .summary { font-size: 1.25rem; font-weight: 700; margin-block: 1rem; }
  </style>
</head>
<body>
  <h1>Coverage Report</h1>
  <p class="summary">${formatPercent(this.report.summary.functionRate)} function coverage, ${formatPercent(this.report.summary.lineRate)} line coverage</p>
  <table>
    <thead>
      <tr><th>File</th><th>Covered funcs</th><th>Total funcs</th><th>Functions</th><th>Covered lines</th><th>Total lines</th><th>Lines</th></tr>
    </thead>
    <tbody>
${rows}
    </tbody>
  </table>
</body>
</html>`;
  }
}

export async function writeCoverageHtmlReport(
  lcovPath = path.join(root, "coverage/lcov.info"),
  outputPath = path.join(root, "coverage/index.html"),
) {
  const report = new LcovCoverageReport(await readFile(lcovPath, "utf8"));
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, new CoverageHtmlReport(report).render());
  return outputPath;
}

function parseLcov(lcov: string): CoverageFileSummary[] {
  const files: CoverageFileSummary[] = [];
  let filePath = "";
  let totalFunctions = 0;
  let coveredFunctions = 0;
  let totalLines = 0;
  let coveredLines = 0;

  for (const line of lcov.split("\n")) {
    if (line.startsWith("SF:")) filePath = normalizePath(path.relative(root, line.slice(3)));
    if (line.startsWith("FNF:")) totalFunctions = Number(line.slice(4));
    if (line.startsWith("FNH:")) coveredFunctions = Number(line.slice(4));
    if (line.startsWith("LF:")) totalLines = Number(line.slice(3));
    if (line.startsWith("LH:")) coveredLines = Number(line.slice(3));
    if (line === "end_of_record" && filePath) {
      files.push({
        coveredFunctions,
        coveredLines,
        functionRate: totalFunctions === 0 ? 1 : coveredFunctions / totalFunctions,
        lineRate: totalLines === 0 ? 0 : coveredLines / totalLines,
        path: filePath,
        totalFunctions,
        totalLines,
      });
      filePath = "";
      totalFunctions = 0;
      coveredFunctions = 0;
      totalLines = 0;
      coveredLines = 0;
    }
  }

  return files;
}

function tableRow(file: CoverageFileSummary) {
  return `      <tr><td>${escapeHtml(file.path)}</td><td>${file.coveredFunctions}</td><td>${file.totalFunctions}</td><td>${formatPercent(file.functionRate)}</td><td>${file.coveredLines}</td><td>${file.totalLines}</td><td>${formatPercent(file.lineRate)}</td></tr>`;
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function formatCoverageFailures(failures: CoverageThresholdFailure[]) {
  const details = failures
    .map(
      (failure) =>
        `${failure.path} ${failure.metric}: ${formatPercent(failure.actual)} below ${formatPercent(
          failure.expected,
        )}`,
    )
    .join("\n");

  return `Coverage thresholds were not met:\n${details}`;
}
