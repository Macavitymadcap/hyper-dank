#!/usr/bin/env bun
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  renderVerificationReport,
  runVerification,
  type VerificationGate,
} from "@macavitymadcap/hyper-dank-scripts";
import { root } from "./lib/paths";

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
    id: "static-demo",
    name: "Static Pace Demo",
    tooling: "Vite static build and Playwright smoke",
    command: "bun",
    args: ["run", "test:static-demo"],
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

const results = await runVerification(gates, {
  cwd: root,
  env: process.env,
  onResult: async (currentResults) => {
    const result = currentResults.findLast((currentResult) => currentResult.status !== "not run");
    if (!result) return;
    const index = currentResults.indexOf(result);
    console.log(`\n[verify] ${index + 1}/${currentResults.length} ${result.name}`);
    await writeReport(currentResults);
  },
});

const report = renderVerificationReport(results, root);
console.log(`\n${report}`);
console.log(`\nVerification report written to ${reportPath}`);

if (results.some((result) => result.status === "fail")) process.exit(1);

async function writeReport(results: Parameters<typeof renderVerificationReport>[0]) {
  await mkdir(path.dirname(reportPath), { recursive: true });
  await writeFile(reportPath, renderVerificationReport(results, root));
}
