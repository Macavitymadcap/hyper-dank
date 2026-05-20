#!/usr/bin/env bun
import { runPa11yTargets, waitForHttp } from "@macavitymadcap/hyper-dank-automation";
import { addWalk, startInMemoryAppServer } from "./lib/app-server";
import { appRoot } from "./lib/paths";

const port = Number(process.env.A11Y_PORT ?? 0);
const server = await startInMemoryAppServer(port);

try {
  await waitForHttp(server.url, { attempts: 30, delayMs: 1000 });
  await addWalk(server.url, { miles: "1.2", minutes: "18", seconds: "55" });

  await runPa11yTargets([{ name: "Home", path: "/" }], {
    baseUrl: server.url,
    configPath: `${appRoot}/scripts/pa11y-config.cjs`,
    cookie: server.authCookie,
  });
} finally {
  await server.stop();
}
