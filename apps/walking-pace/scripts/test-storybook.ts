#!/usr/bin/env bun
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runAsync, waitForHttp } from "@macavitymadcap/hyper-dank-automation";
import { chromium, expect } from "@playwright/test";
import { root } from "./lib/paths";

const portFlag = process.argv.indexOf("--port");
const portValue =
  portFlag >= 0 ? process.argv[portFlag + 1] : (process.env.TEST_STORYBOOK_PORT ?? "6006");
const port = Number(portValue);
const url = `http://127.0.0.1:${port}`;
const staticDir = resolve(root, "storybook-static");
const staticServerScript = fileURLToPath(new URL("./serve-storybook-static.mjs", import.meta.url));

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`Invalid Storybook test port: ${portValue}`);
}

await runAsync("bun", ["run", "storybook:build"]);

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

  await assertUtilityControl(url);

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

async function assertUtilityControl(url: string) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  try {
    await page.goto(`${url}/iframe.html?id=introduction-component-philosophy--atomic-design`, {
      waitUntil: "networkidle",
    });

    await expect(page.getByRole("navigation", { name: "Storybook quick links" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Docs" })).toHaveAttribute("href", "../");
    await expect(page.getByRole("link", { name: "Libraries" })).toHaveAttribute(
      "href",
      "../libraries/",
    );
    await expect(page.getByRole("link", { name: "Demo" })).toHaveAttribute("href", "../pace/");
    await expect(page.getByRole("switch", { name: "Storybook color mode" })).toBeVisible();
  } finally {
    await browser.close();
  }
}
