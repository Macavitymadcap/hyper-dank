#!/usr/bin/env bun
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  createCommandGate,
  renderVerificationReport,
  runVerification,
  type VerificationGate,
} from "@macavitymadcap/hyper-dank-automation";
import { root } from "./lib/paths";

const reportPath =
  process.env.VERIFY_REPORT_PATH ?? path.join(root, ".cache", "verification-report.md");

const gates: VerificationGate[] = [
  createCommandGate(
    "check",
    "Static Checks",
    "bun",
    ["run", "check"],
    "Biome and deprecated TypeScript API scanner",
  ),
  createCommandGate("typecheck", "Typecheck", "bun", ["run", "typecheck"], "TypeScript"),
  createCommandGate("unit", "Unit And Contract Tests", "bun", ["test"], "Bun test"),
  createCommandGate(
    "diff-check",
    "Patch Whitespace",
    "git",
    ["diff", "--check"],
    "git diff --check",
  ),
  createCommandGate(
    "build",
    "Workspace Build",
    "bun",
    ["run", "build"],
    "Package declarations, Vite, and Storybook build",
  ),
  createCommandGate(
    "healthcheck",
    "Production Healthcheck",
    "bun",
    ["run", "test:healthcheck"],
    "Root start command and HTTP healthcheck",
  ),
  createCommandGate(
    "static-demo",
    "Static Pace Demo",
    "bun",
    ["run", "test:static-demo"],
    "Vite static build and Playwright smoke",
  ),
  createCommandGate(
    "compat",
    "Package Compatibility",
    "bun",
    ["run", "test:compat"],
    "Packed package smoke test",
  ),
  createCommandGate(
    "storybook",
    "Storybook Browser Tests",
    "bun",
    ["run", "test:storybook"],
    "Storybook test runner",
  ),
  createCommandGate("e2e", "Browser E2E", "bun", ["run", "test:e2e"], "Playwright"),
  createCommandGate("a11y", "Accessibility", "bun", ["run", "test:a11y"], "Pa11y"),
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
