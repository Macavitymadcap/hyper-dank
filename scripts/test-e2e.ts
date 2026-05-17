#!/usr/bin/env bun
import { LOCAL_DEV_PASSWORD, seedLocalDevPresets } from "../src/envs/local/local-presets";
import { startInMemoryAppServer, waitForHttp } from "./lib/app-server";

const port = Number(process.env.E2E_PORT ?? 49150);
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

  const playwright = Bun.spawn(["bun", "x", "playwright", "test", ...process.argv.slice(2)], {
    env: {
      ...process.env,
      PLAYWRIGHT_BASE_URL: server.url.replace("localhost", "127.0.0.1"),
    },
    stderr: "inherit",
    stdout: "inherit",
  });
  const exitCode = await playwright.exited;
  process.exitCode = exitCode;
} finally {
  await server.stop();
}
