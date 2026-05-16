import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { normalizePath, root } from "./paths";

export interface CoverageFileSummary {
  coveredLines: number;
  lineRate: number;
  path: string;
  totalLines: number;
}

export class LcovCoverageReport {
  readonly files: CoverageFileSummary[];

  constructor(lcov: string) {
    this.files = parseLcov(lcov);
  }

  get summary(): CoverageFileSummary {
    const totalLines = this.files.reduce((total, file) => total + file.totalLines, 0);
    const coveredLines = this.files.reduce((total, file) => total + file.coveredLines, 0);

    return {
      coveredLines,
      lineRate: totalLines === 0 ? 0 : coveredLines / totalLines,
      path: "All files",
      totalLines,
    };
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
  <p class="summary">${formatPercent(this.report.summary.lineRate)} line coverage</p>
  <table>
    <thead>
      <tr><th>File</th><th>Covered</th><th>Total</th><th>Lines</th></tr>
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
  let totalLines = 0;
  let coveredLines = 0;

  for (const line of lcov.split("\n")) {
    if (line.startsWith("SF:")) filePath = normalizePath(path.relative(root, line.slice(3)));
    if (line.startsWith("LF:")) totalLines = Number(line.slice(3));
    if (line.startsWith("LH:")) coveredLines = Number(line.slice(3));
    if (line === "end_of_record" && filePath) {
      files.push({
        coveredLines,
        lineRate: totalLines === 0 ? 0 : coveredLines / totalLines,
        path: filePath,
        totalLines,
      });
      filePath = "";
      totalLines = 0;
      coveredLines = 0;
    }
  }

  return files;
}

function tableRow(file: CoverageFileSummary) {
  return `      <tr><td>${escapeHtml(file.path)}</td><td>${file.coveredLines}</td><td>${file.totalLines}</td><td>${formatPercent(file.lineRate)}</td></tr>`;
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
