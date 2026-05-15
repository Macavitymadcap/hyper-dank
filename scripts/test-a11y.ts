#!/usr/bin/env bun
import { addWalk, startInMemoryAppServer, waitForHttp } from "./lib/app-server";
import { run } from "./lib/process";

const port = Number(process.env.A11Y_PORT ?? 3999);
const server = startInMemoryAppServer(port);

try {
  await waitForHttp(server.url, 30, 1000);
  await addWalk(server.url, { miles: "1.2", minutes: "18", seconds: "55" });

  run("pa11y", [server.url, "--config", ".pa11yrc.json"], {
    stdio: "inherit",
  });
} finally {
  server.stop();
}
