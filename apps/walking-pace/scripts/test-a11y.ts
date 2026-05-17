#!/usr/bin/env bun
import { addWalk, startInMemoryAppServer, waitForHttp } from "./lib/app-server";
import { appRoot } from "./lib/paths";
import { runAsync } from "./lib/process";

const port = Number(process.env.A11Y_PORT ?? 0);
const server = await startInMemoryAppServer(port);

try {
  await waitForHttp(server.url, 30, 1000);
  await addWalk(server.url, { miles: "1.2", minutes: "18", seconds: "55" });

  await runAsync("pa11y", [server.url, "--config", `${appRoot}/scripts/pa11y-config.cjs`], {
    env: {
      ...process.env,
      PA11Y_COOKIE: server.authCookie,
    },
    stdio: "inherit",
  });
} finally {
  await server.stop();
}
