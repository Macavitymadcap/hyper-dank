#!/usr/bin/env bun
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { root } from "./lib/paths";

type VerificationStatus = "pass" | "fail" | "not run";

interface VerificationGate {
  args: string[];
  command: string;
  id: string;
  name: string;
  tooling: string;
}

interface VerificationResult extends VerificationGate {
  durationMs?: number;
  exitCode?: number | null;
  stderr: string;
  stdout: string;
  status: VerificationStatus;
}

const reportPath =
  process.env.VERIFY_REPORT_PATH ?? path.join(root, ".cache", "verification-report.md");

const gates: VerificationGate[] = [
  {
    id: "check",
    name: "Static Checks",
    tooling: "Biome and deprecated TypeScript API scanner",
    command: "bun",
    args: ["run", "check"],
  },
  {
    id: "typecheck",
    name: "Typecheck",
    tooling: "TypeScript",
    command: "bun",
    args: ["run", "typecheck"],
  },
  {
    id: "unit",
    name: "Unit And Contract Tests",
    tooling: "Bun test",
    command: "bun",
    args: ["test"],
  },
  {
    id: "diff-check",
    name: "Patch Whitespace",
    tooling: "git diff --check",
    command: "git",
    args: ["diff", "--check"],
  },
  {
    id: "build",
    name: "Workspace Build",
    tooling: "Package declarations, Vite, and Storybook build",
    command: "bun",
    args: ["run", "build"],
  },
  {
    id: "healthcheck",
    name: "Production Healthcheck",
    tooling: "Root start command and HTTP healthcheck",
    command: "bun",
    args: ["run", "test:healthcheck"],
  },
  {
    id: "compat",
    name: "Package Compatibility",
    tooling: "Packed package smoke test",
    command: "bun",
    args: ["run", "test:compat"],
  },
  {
    id: "storybook",
    name: "Storybook Browser Tests",
    tooling: "Storybook test runner",
    command: "bun",
    args: ["run", "test:storybook"],
  },
  {
    id: "e2e",
    name: "Browser E2E",
    tooling: "Playwright",
    command: "bun",
    args: ["run", "test:e2e"],
  },
  {
    id: "a11y",
    name: "Accessibility",
    tooling: "Pa11y",
    command: "bun",
    args: ["run", "test:a11y"],
  },
];

const results: VerificationResult[] = gates.map((gate) => ({
  ...gate,
  status: "not run",
  stderr: "",
  stdout: "",
}));

let failed = false;

for (let index = 0; index < results.length; index += 1) {
  const result = results[index];
  if (!result) continue;

  console.log(`\n[verify] ${index + 1}/${results.length} ${result.name}`);
  Object.assign(result, await runGate(result));
  await writeReport(results);

  if (result.status === "fail") {
    failed = true;
    break;
  }
}

const report = renderReport(results);
console.log(`\n${report}`);
console.log(`\nVerification report written to ${reportPath}`);

if (failed) process.exit(1);

async function runGate(gate: VerificationGate) {
  const startedAt = Date.now();

  try {
    const child = Bun.spawn([gate.command, ...gate.args], {
      cwd: root,
      env: process.env,
      stderr: "pipe",
      stdout: "pipe",
    });

    const [stdout, stderr, exitCode] = await Promise.all([
      new Response(child.stdout).text(),
      new Response(child.stderr).text(),
      child.exited,
    ]);

    return {
      durationMs: Date.now() - startedAt,
      exitCode,
      stderr,
      stdout,
      status: exitCode === 0 ? "pass" : "fail",
    } satisfies Partial<VerificationResult>;
  } catch (error) {
    return {
      durationMs: Date.now() - startedAt,
      exitCode: 1,
      stderr: error instanceof Error ? (error.stack ?? error.message) : String(error),
      stdout: "",
      status: "fail",
    } satisfies Partial<VerificationResult>;
  }
}

async function writeReport(results: VerificationResult[]) {
  await mkdir(path.dirname(reportPath), { recursive: true });
  await writeFile(reportPath, renderReport(results));
}

function renderReport(results: VerificationResult[]) {
  const failedGate = results.find((result) => result.status === "fail");
  const completedAt = new Date().toISOString();
  const overallStatus = failedGate ? "FAILED" : results.every(isPassed) ? "PASSED" : "INCOMPLETE";

  const tableRows = results
    .map((result, index) =>
      [
        index + 1,
        result.name,
        result.tooling,
        statusLabel(result.status),
        formatDuration(result.durationMs),
        result.exitCode ?? "",
      ].join(" | "),
    )
    .map((row) => `| ${row} |`)
    .join("\n");

  const executedSections = results
    .filter((result) => result.status !== "not run")
    .map(renderResultSection)
    .join("\n\n");

  return `# Verification Report

Generated: ${completedAt}
Root: \`${root}\`
Overall status: **${overallStatus}**
${failedGate ? `Stopped after: **${failedGate.name}**` : ""}

| # | Gate | Tooling | Status | Duration | Exit |
| --- | --- | --- | --- | --- | --- |
${tableRows}

${executedSections || "No gates have run yet."}
`;
}

function renderResultSection(result: VerificationResult) {
  const command = [result.command, ...result.args].join(" ");
  return `## ${result.name}: ${statusLabel(result.status)}

Command: \`${command}\`
Duration: ${formatDuration(result.durationMs)}
Exit code: ${result.exitCode ?? ""}

### stdout

\`\`\`\`text
${result.stdout.trim() || "(empty)"}
\`\`\`\`

### stderr

\`\`\`\`text
${result.stderr.trim() || "(empty)"}
\`\`\`\``;
}

function isPassed(result: VerificationResult) {
  return result.status === "pass";
}

function statusLabel(status: VerificationStatus) {
  return status.toUpperCase();
}

function formatDuration(durationMs: number | undefined) {
  if (durationMs === undefined) return "";
  if (durationMs < 1_000) return `${durationMs}ms`;

  return `${(durationMs / 1_000).toFixed(1)}s`;
}
