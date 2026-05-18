import { type RunOptions, runAsync } from "./process";

export interface RunPa11yOptions extends Pick<RunOptions, "cwd" | "env" | "stdio"> {
  configPath?: string;
  cookie?: string;
  executable?: string;
}

export async function runPa11y(url: string, options: RunPa11yOptions = {}) {
  const args = [url];
  if (options.configPath) args.push("--config", options.configPath);

  return runAsync(options.executable ?? "pa11y", args, {
    cwd: options.cwd,
    env: {
      ...process.env,
      ...options.env,
      ...(options.cookie ? { PA11Y_COOKIE: options.cookie } : {}),
    },
    stdio: options.stdio ?? "inherit",
  });
}
