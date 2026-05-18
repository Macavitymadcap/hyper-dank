#!/usr/bin/env bun
import { existsSync } from "node:fs";
import { createServer, type Server } from "node:http";
import { extname, resolve } from "node:path";
import { runAsync } from "@macavitymadcap/hyper-dank-automation";
import { chromium, expect } from "@playwright/test";
import { appRoot } from "./lib/paths";

const staticRoot = resolve(appRoot, "dist/static-demo");
const staticIndex = resolve(staticRoot, "index.html");
const requestedPort = Number(process.env.STATIC_DEMO_PORT ?? 4301);
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

if (!existsSync(staticIndex)) {
  throw new Error(`Missing static demo build at ${staticIndex}`);
}

const server = await startStaticServer(requestedPort);
const address = server.address();
if (typeof address !== "object" || address === null) {
  throw new Error("Static demo server did not expose a TCP address.");
}
const baseUrl = `http://127.0.0.1:${address.port}`;

const browser = await chromium.launch();

try {
  const page = await browser.newPage();
  const serverMutations: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (["/walks", "/stats", "/login", "/api/auth"].some((path) => url.pathname.startsWith(path))) {
      serverMutations.push(`${request.method()} ${url.pathname}`);
    }
  });

  await page.goto(`${baseUrl}/pace/`);
  await expect(page.getByRole("heading", { name: "Walking Pace Demo" })).toBeVisible();
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
  await new Promise<void>((resolve) => server.close(() => resolve()));
}

function serveStaticDemo(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname === "/" ? "/pace/" : url.pathname;
  if (!pathname.startsWith("/pace/")) return new Response("Not found", { status: 404 });

  const relative = pathname.replace(/^\/pace\/?/, "") || "index.html";
  const filePath = resolve(staticRoot, relative);
  if (!filePath.startsWith(staticRoot)) return new Response("Not found", { status: 404 });
  if (!existsSync(filePath)) return new Response("Not found", { status: 404 });

  const file = Bun.file(filePath);
  return new Response(file, {
    headers: {
      "Content-Type": contentTypes[extname(filePath)] ?? "application/octet-stream",
    },
  });
}

async function startStaticServer(port: number): Promise<Server> {
  const attempts = process.env.STATIC_DEMO_PORT ? 1 : 50;
  let lastError: unknown;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const candidate = port + attempt;
    const server = createServer(async (request, response) => {
      const demoResponse = await serveStaticDemo(
        new Request(`http://127.0.0.1:${candidate}${request.url ?? "/"}`),
      );
      const headers: Record<string, string> = {};
      demoResponse.headers.forEach((value, key) => {
        headers[key] = value;
      });
      response.writeHead(demoResponse.status, headers);
      response.end(Buffer.from(await demoResponse.arrayBuffer()));
    });

    try {
      await listen(server, candidate);
      return server;
    } catch (error) {
      lastError = error;
      if (!isAddressInUseError(error)) throw error;
    }
  }

  throw new Error(`Unable to start static demo server. Last error: ${lastError}`);
}

async function listen(server: Server, port: number) {
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => {
      server.off("error", reject);
      resolve();
    });
  });
}

function isAddressInUseError(error: unknown) {
  return (
    typeof error === "object" && error !== null && "code" in error && error.code === "EADDRINUSE"
  );
}
