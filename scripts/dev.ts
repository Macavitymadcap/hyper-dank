#!/usr/bin/env bun

const vitePort = Number(process.env.VITE_PORT ?? 5173);
const viteDevServerUrl = process.env.VITE_DEV_SERVER_URL ?? `http://localhost:${vitePort}`;

const env = {
  ...process.env,
  VITE_DEV_SERVER_URL: viteDevServerUrl,
  VITE_PORT: String(vitePort),
};

const assets = Bun.spawn(
  ["bun", "run", "dev:assets", "--host", "127.0.0.1", "--port", String(vitePort)],
  {
    env,
    stderr: "inherit",
    stdout: "inherit",
  },
);
const app = Bun.spawn(["bun", "run", "dev:app"], {
  env,
  stderr: "inherit",
  stdout: "inherit",
});

const stop = () => {
  assets.kill();
  app.kill();
};

process.on("SIGINT", () => {
  stop();
});
process.on("SIGTERM", () => {
  stop();
});

const exitCode = await Promise.race([assets.exited, app.exited]);
stop();
process.exit(exitCode);
