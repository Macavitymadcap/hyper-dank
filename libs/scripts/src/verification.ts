export type VerificationStatus = "pass" | "fail" | "not run";

export interface VerificationGate {
  args: string[];
  command: string;
  id: string;
  name: string;
  tooling: string;
}

export interface VerificationResult extends VerificationGate {
  durationMs?: number;
  exitCode?: number | null;
  stderr: string;
  stdout: string;
  status: VerificationStatus;
}

export interface RunVerificationOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  onResult?: (results: VerificationResult[]) => Promise<void> | void;
  spawn?: typeof Bun.spawn;
  stopOnFailure?: boolean;
}

export async function runVerification(
  gates: VerificationGate[],
  options: RunVerificationOptions = {},
) {
  const results: VerificationResult[] = gates.map((gate) => ({
    ...gate,
    status: "not run",
    stderr: "",
    stdout: "",
  }));
  const stopOnFailure = options.stopOnFailure ?? true;

  for (const result of results) {
    Object.assign(result, await runGate(result, options));
    await options.onResult?.(results);
    if (result.status === "fail" && stopOnFailure) break;
  }

  return results;
}

export function renderVerificationReport(results: VerificationResult[], root = process.cwd()) {
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

async function runGate(gate: VerificationGate, options: RunVerificationOptions) {
  const startedAt = Date.now();

  try {
    const child = (options.spawn ?? Bun.spawn)([gate.command, ...gate.args], {
      cwd: options.cwd,
      env: options.env ?? process.env,
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
