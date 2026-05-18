import { spawn, spawnSync } from "node:child_process";

export interface RunOptions {
  allowFailure?: boolean;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  input?: string;
  stdio?: "inherit" | "pipe";
}

export interface RunResult {
  exitCode: number | null;
  stderr: string;
  stdout: string;
}

export function run(command: string, commandArgs: string[] = [], options: RunOptions = {}) {
  const result = runResult(command, commandArgs, options);
  if (result.exitCode !== 0 && !options.allowFailure) {
    throw new Error(`${formatCommand(command, commandArgs)} failed:\n${result.stderr}`);
  }

  return result.stdout.trim();
}

export function runResult(
  command: string,
  commandArgs: string[] = [],
  options: RunOptions = {},
): RunResult {
  const result = spawnSync(command, commandArgs, {
    cwd: options.cwd,
    encoding: "utf8",
    env: options.env,
    input: options.input,
    stdio: options.stdio === "inherit" ? "inherit" : "pipe",
  });

  return {
    exitCode: result.status,
    stderr: typeof result.stderr === "string" ? result.stderr : "",
    stdout: typeof result.stdout === "string" ? result.stdout : "",
  };
}

export async function runAsync(
  command: string,
  commandArgs: string[] = [],
  options: RunOptions = {},
) {
  const child = spawn(command, commandArgs, {
    cwd: options.cwd,
    env: options.env,
    stdio: options.stdio ?? "inherit",
  });

  const exitCode = await new Promise<number | null>((resolve, reject) => {
    child.on("error", reject);
    child.on("exit", resolve);
  });

  if (exitCode !== 0 && !options.allowFailure) {
    throw new Error(`${formatCommand(command, commandArgs)} failed with exit code ${exitCode}`);
  }

  return exitCode ?? 0;
}

function formatCommand(command: string, commandArgs: string[]) {
  return [command, ...commandArgs].join(" ");
}
