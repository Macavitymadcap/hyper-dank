#!/usr/bin/env bun
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { appRoot, root } from "./lib/paths";

const port = Number(process.env.HEALTHCHECK_PORT ?? dynamicPortCandidate());
const dbPath = path.join(root, ".cache", `healthcheck-${process.pid}.sqlite3`);
const healthUrl = `http://127.0.0.1:${port}/healthz`;

await mkdir(path.dirname(dbPath), { recursive: true });

const startCommand = ["bun", "run", "--cwd", appRoot, "src/index.ts"];
const child = Bun.spawn(startCommand, {
  cwd: root,
  env: {
    ...process.env,
    DATABASE_URL: "",
    DB_PATH: dbPath,
    HOST: "127.0.0.1",
    NODE_ENV: "production",
    PORT: String(port),
  },
  stderr: "pipe",
  stdout: "pipe",
});

let stdout = "";
let stderr = "";
const stdoutPromise = new Response(child.stdout).text().then((text) => {
  stdout = text;
});
const stderrPromise = new Response(child.stderr).text().then((text) => {
  stderr = text;
});

let failure: unknown;

try {
  await waitForHealthcheck();
  console.log(`Production start healthcheck passed at ${healthUrl}`);
} catch (error) {
  failure = error;
} finally {
  child.kill();
  await child.exited.catch(() => undefined);
  await Promise.all([stdoutPromise, stderrPromise]);
  await rm(dbPath, { force: true });
  await rm(`${dbPath}-shm`, { force: true });
  await rm(`${dbPath}-wal`, { force: true });
}

if (failure) {
  console.error("Production start stdout:");
  console.error(stdout.trim() || "(empty)");
  console.error("Production start stderr:");
  console.error(stderr.trim() || "(empty)");
  throw failure;
}

async function waitForHealthcheck() {
  const deadline = Date.now() + 20_000;

  while (Date.now() < deadline) {
    const exitCode = await Promise.race([child.exited, delay(250).then(() => undefined)]);

    if (exitCode !== undefined) {
      throw new Error(`Production start exited before healthcheck responded: ${exitCode}`);
    }

    try {
      const response = await fetch(healthUrl);
      if (!response.ok) throw new Error(`Healthcheck returned ${response.status}`);

      const body = await response.json();
      if (body?.ok !== true) throw new Error(`Healthcheck returned unexpected body.`);

      return;
    } catch {}
  }

  throw new Error(`Timed out waiting for ${healthUrl}`);
}

function dynamicPortCandidate() {
  return 45_000 + (Math.abs(process.pid) % 20_000);
}
