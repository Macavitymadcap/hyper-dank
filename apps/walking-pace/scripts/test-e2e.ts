#!/usr/bin/env bun
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { runAsync, waitForHttp } from "@macavitymadcap/hyper-dank-automation";
import { LOCAL_DEV_PASSWORD, seedLocalDevPresets } from "../src/envs/local/local-presets";
import { startInMemoryAppServer } from "./lib/app-server";

const repoRoot = fileURLToPath(new URL("../../..", import.meta.url));
const playwrightConfig = fileURLToPath(
  new URL("../../../e2e/playwright.config.ts", import.meta.url),
);
const storybookIndex = fileURLToPath(
  new URL("../../../storybook-static/index.html", import.meta.url),
);

if (!existsSync(storybookIndex)) {
  await runAsync("bun", ["run", "storybook:build"], { cwd: repoRoot, stdio: "inherit" });
}

const port = Number(process.env.E2E_PORT ?? 0);
const server = await startInMemoryAppServer(port, {
  authenticatedUserId: null,
  users: [],
});

try {
  await seedLocalDevPresets({
    authProvider: server.authProvider,
    walksRepository: server.walksRepository,
  });
  await waitForHttp(`${server.url}/healthz`);

  console.log(`E2E app server running at ${server.url}`);
  console.log(`E2E preset password: ${LOCAL_DEV_PASSWORD}`);

  const playwright = Bun.spawn(
    ["bun", "x", "playwright", "test", "--config", playwrightConfig, ...process.argv.slice(2)],
    {
      env: {
        ...process.env,
        PLAYWRIGHT_BASE_URL: server.url.replace("localhost", "127.0.0.1"),
      },
      stderr: "inherit",
      stdout: "inherit",
    },
  );
  const exitCode = await playwright.exited;
  process.exitCode = exitCode;
} finally {
  await server.stop();
}
