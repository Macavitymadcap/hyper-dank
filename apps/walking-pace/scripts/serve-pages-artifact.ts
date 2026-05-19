#!/usr/bin/env bun
import { existsSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { createServer, type IncomingMessage } from "node:http";
import type { AddressInfo } from "node:net";
import path from "node:path";
import { normalizePagesBasePath, resolvePagesBasePath } from "./lib/pages-base";
import { root } from "./lib/paths";

const siteDir = path.resolve(process.env.PAGES_SITE_DIR ?? path.join(root, ".cache/pages/site"));
const requestedPort = Number(process.env.PAGES_PORT ?? process.env.PORT ?? 4173);
const hostname = "127.0.0.1";
const basePath = normalizePagesBasePath(process.env.PAGES_BASE_PATH ?? resolvePagesBasePath());

if (!existsSync(path.join(siteDir, "index.html"))) {
  throw new Error(`Missing Pages artifact at ${siteDir}. Run bun run build:pages-assets first.`);
}

const server = await startPagesServer(requestedPort);
const address = server.address() as AddressInfo;

console.log(`Serving Pages artifact from ${siteDir}`);
console.log(`Docs: http://${hostname}:${address.port}/`);
console.log(`Pace demo: http://${hostname}:${address.port}/pace/`);
console.log(`Storybook: http://${hostname}:${address.port}/storybook/`);

async function startPagesServer(port: number) {
  const attempts = port === 0 ? 1 : 20;
  let lastError: unknown;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const candidatePort = port === 0 ? 0 : port + attempt;
    try {
      return await listen(candidatePort);
    } catch (error) {
      lastError = error;
      if (!isAddressInUseError(error)) throw error;
    }
  }

  throw new Error(`Unable to start Pages preview server. Last error: ${lastError}`);
}

async function servePagesRequest(request: IncomingMessage) {
  const url = new URL(request.url ?? "/", `http://${hostname}`);
  const pathname = pathnameWithoutBasePath(decodeURIComponent(url.pathname));
  const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  let filePath = path.resolve(siteDir, relativePath);

  if (existsSync(filePath) && (await stat(filePath)).isFile()) {
    return fileBody(filePath);
  }

  if (!path.extname(filePath)) {
    filePath = path.join(filePath, "index.html");
  }

  if (!filePath.startsWith(`${siteDir}${path.sep}`) && filePath !== siteDir) {
    return {
      body: Buffer.from("Not found"),
      contentType: "text/plain; charset=utf-8",
      status: 404,
    };
  }

  if (!existsSync(filePath)) {
    return {
      body: Buffer.from("Not found"),
      contentType: "text/plain; charset=utf-8",
      status: 404,
    };
  }

  return fileBody(filePath);
}

function pathnameWithoutBasePath(pathname: string) {
  if (basePath && (pathname === basePath || pathname.startsWith(`${basePath}/`))) {
    return pathname.slice(basePath.length) || "/";
  }

  return pathname;
}

async function fileBody(filePath: string) {
  const body = await readFile(filePath);
  return { body, contentType: contentType(filePath), status: 200 };
}

function contentType(filePath: string) {
  switch (path.extname(filePath)) {
    case ".css":
      return "text/css; charset=utf-8";
    case ".html":
      return "text/html; charset=utf-8";
    case ".js":
      return "text/javascript; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".svg":
      return "image/svg+xml";
    case ".woff2":
      return "font/woff2";
    default:
      return "application/octet-stream";
  }
}

function isAddressInUseError(error: unknown) {
  return (
    typeof error === "object" && error !== null && "code" in error && error.code === "EADDRINUSE"
  );
}

async function listen(port: number) {
  const server = createServer(async (request, response) => {
    try {
      const result = await servePagesRequest(request);
      response.writeHead(result.status, { "Content-Type": result.contentType });
      response.end(result.body);
    } catch (error) {
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end(error instanceof Error ? error.message : "Internal server error");
    }
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, hostname, () => {
      server.off("error", reject);
      resolve();
    });
  });

  return server;
}
