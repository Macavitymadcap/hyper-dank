#!/usr/bin/env bun
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runAsync, waitForHttp } from "@macavitymadcap/hyper-dank-automation";
import { root } from "./lib/paths";

const portFlag = process.argv.indexOf("--port");
const portValue =
  portFlag >= 0 ? process.argv[portFlag + 1] : (process.env.TEST_STORYBOOK_PORT ?? "6006");
const port = Number(portValue);
const url = `http://127.0.0.1:${port}`;
const staticDir = resolve(root, "storybook-static");
const staticIndex = resolve(staticDir, "index.html");
const staticServerScript = fileURLToPath(new URL("./serve-storybook-static.mjs", import.meta.url));

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`Invalid Storybook test port: ${portValue}`);
}

if (!existsSync(staticIndex)) {
  await runAsync("bun", ["run", "storybook:build"]);
}

const storybook = Bun.spawn(["node", staticServerScript, String(port), staticDir], {
  env: process.env,
  stderr: "inherit",
  stdout: "inherit",
});

try {
  await Promise.race([
    waitForHttp(url, { attempts: 60, delayMs: 1000 }),
    storybook.exited.then((exitCode) => {
      throw new Error(`Storybook static server exited before tests started: ${exitCode}`);
    }),
  ]);

  const runner = Bun.spawn(["bun", "x", "test-storybook", "--url", url, "--maxWorkers=2"], {
    env: process.env,
    stderr: "inherit",
    stdout: "inherit",
  });
  process.exitCode = await runner.exited;
} finally {
  storybook.kill();
  await storybook.exited.catch(() => {});
}
