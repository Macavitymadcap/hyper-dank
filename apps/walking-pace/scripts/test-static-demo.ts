#!/usr/bin/env bun
import { existsSync } from "node:fs";
import { extname, relative, resolve } from "node:path";
import { runAsync, smokeStaticSite } from "@macavitymadcap/hyper-dank-automation";
import { DEMO_STORAGE_KEY } from "../src/static-demo/storage";
import { appRoot } from "./lib/paths";

const staticRoot = resolve(appRoot, "dist/static-demo");
const baseUrl = "http://static-demo.test";
const contentTypes: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
};

await runAsync("bun", ["run", "build:demo"], {
  cwd: appRoot,
  env: { ...process.env, PACE_DEMO_BASE: "/pace/" },
});

await smokeStaticSite({
  root: staticRoot,
  routes: [{ path: "index.html", includes: "Walking Pace Demo" }],
});

const { chromium, expect } = await import("@playwright/test");
const browser = await chromium.launch();

try {
  const page = await browser.newPage();
  await page.route(`${baseUrl}/**`, async (route) => {
    const response = serveStaticDemo(new Request(route.request().url()));
    const body = Buffer.from(await response.arrayBuffer());
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    await route.fulfill({
      body,
      headers,
      status: response.status,
    });
  });
  const serverMutations: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (["/walks", "/stats", "/login", "/api/auth"].some((path) => url.pathname.startsWith(path))) {
      serverMutations.push(`${request.method()} ${url.pathname}`);
    }
  });

  await page.goto(`${baseUrl}/pace/`);
  await page.evaluate((storageKey) => {
    window.localStorage.setItem(storageKey, "not-json");
  }, DEMO_STORAGE_KEY);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Walking Pace Demo" })).toBeVisible();
  await expect(page.getByText("No walks recorded yet")).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate((storageKey) => window.localStorage.getItem(storageKey), DEMO_STORAGE_KEY),
    )
    .toBe("[]");

  await page.evaluate((storageKey) => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify([
        {
          created_at: "2026-05-18T12:00:00.000Z",
          id: 1,
          miles: 1.2,
          minutes: 18,
          seconds: 55,
        },
        {
          created_at: `2026-05-18"><img src=x onerror=alert(1)>`,
          id: 2,
          miles: 1,
          minutes: 10,
          seconds: 0,
        },
      ]),
    );
  }, DEMO_STORAGE_KEY);
  await page.reload();
  await expect(page.locator("#walks-list")).toContainText("1 walk");
  await expect(page.locator("#walks-list")).toContainText("1.2");
  await expect(page.locator("#walks-list img")).toHaveCount(0);
  await page.getByRole("button", { name: "Clear all" }).click();
  await expect(page.getByText("No walks recorded yet")).toBeVisible();

  await page.getByRole("spinbutton", { exact: true, name: "Mi" }).fill("1.2");
  await page.getByRole("spinbutton", { exact: true, name: "Min" }).fill("18");
  await page.getByRole("spinbutton", { exact: true, name: "Sec" }).fill("55");
  await page.getByRole("button", { name: "Add" }).click();

  await expect(page.locator("#walks-list")).toContainText("1 walk");
  await expect(page.locator("#stats")).toContainText("3.8");
  await expect(page.locator(".scrollable-table-container")).toHaveCSS("display", "flex");
  await expect(page.locator("thead .scrollable-table-row")).toHaveCSS("display", "grid");
  await expect(page.locator("tbody .scrollable-table-row")).toHaveCSS("display", "grid");

  await page.reload();
  await expect(page.locator("#walks-list")).toContainText("1 walk");
  await expect(page.locator("#walks-list")).toContainText("1.2");

  await page.getByRole("button", { name: "Clear all" }).click();
  await expect(page.locator("#walks-list")).toContainText("No walks recorded yet");
  await expect(page.locator("#stats")).toContainText("--");

  expect(serverMutations).toEqual([]);
  console.log(`Static pace demo smoke passed at ${baseUrl}/pace/`);
} finally {
  await browser.close();
}

function serveStaticDemo(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname === "/" ? "/pace/" : url.pathname;
  if (!pathname.startsWith("/pace/")) return new Response("Not found", { status: 404 });

  const relative = pathname.replace(/^\/pace\/?/, "") || "index.html";
  const filePath = resolve(staticRoot, relative);
  const relativeFilePath = relativePath(staticRoot, filePath);
  if (relativeFilePath === "" || relativeFilePath.startsWith("..")) {
    return new Response("Not found", { status: 404 });
  }
  if (!existsSync(filePath)) return new Response("Not found", { status: 404 });

  const file = Bun.file(filePath);
  return new Response(file, {
    headers: {
      "Content-Type": contentTypes[extname(filePath)] ?? "application/octet-stream",
    },
  });
}

function relativePath(from: string, to: string) {
  return relative(from, to);
}
