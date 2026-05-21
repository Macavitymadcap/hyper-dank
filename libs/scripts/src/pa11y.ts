import { type RunOptions, runAsync } from "./process";

export interface RunPa11yOptions extends Pick<RunOptions, "cwd" | "env" | "stdio"> {
  configPath?: string;
  cookie?: string;
  executable?: string;
}

export interface A11yTarget {
  cookie?: string;
  name: string;
  path?: string;
  url?: string;
}

export interface RunPa11yTargetsOptions extends RunPa11yOptions {
  baseUrl?: string;
  runner?: (url: string, options?: RunPa11yOptions) => Promise<unknown>;
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

export async function runPa11yTargets(targets: A11yTarget[], options: RunPa11yTargetsOptions = {}) {
  const results: Array<{ name: string; url: string }> = [];
  const { baseUrl, runner = runPa11y, ...runOptions } = options;

  for (const target of targets) {
    const url = target.url ?? new URL(target.path ?? "/", baseUrl).toString();
    await runner(url, {
      ...runOptions,
      cookie: target.cookie ?? runOptions.cookie,
    });
    results.push({ name: target.name, url });
  }

  return results;
}
