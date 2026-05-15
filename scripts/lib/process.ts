import { spawnSync } from "node:child_process";
import { root } from "./paths";

interface RunOptions {
  allowFailure?: boolean;
  cwd?: string;
  input?: string;
  stdio?: "inherit" | "pipe";
}

export function run(command: string, commandArgs: string[], options: RunOptions = {}) {
  const result = spawnSync(command, commandArgs, {
    cwd: options.cwd ?? root,
    encoding: "utf8",
    input: options.input,
    stdio: options.stdio === "inherit" ? "inherit" : "pipe",
  });

  if (result.status !== 0 && !options.allowFailure) {
    const stderr = typeof result.stderr === "string" ? result.stderr : "";
    throw new Error(`${command} ${commandArgs.join(" ")} failed:\n${stderr}`);
  }

  return typeof result.stdout === "string" ? result.stdout.trim() : "";
}
