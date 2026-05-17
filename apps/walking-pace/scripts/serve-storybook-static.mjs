#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, normalize, resolve, sep } from "node:path";

const [portValue, staticDirValue] = process.argv.slice(2);
const port = Number(portValue);
const staticDir = resolve(staticDirValue);
const staticIndex = resolve(staticDir, "index.html");
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`Invalid port: ${portValue}`);
}

const server = createServer(async (request, response) => {
  try {
    const { pathname } = new URL(request.url ?? "/", `http://127.0.0.1:${port}`);
    const requestPath = decodeURIComponent(pathname);
    const relativePath = requestPath === "/" ? "index.html" : requestPath.replace(/^\/+/, "");
    let filePath = resolve(staticDir, normalize(relativePath));

    if (filePath !== staticDir && !filePath.startsWith(`${staticDir}${sep}`)) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    let body;
    try {
      body = await readFile(filePath);
    } catch {
      filePath = staticIndex;
      body = await readFile(staticIndex);
    }

    response.writeHead(200, {
      "Content-Type": contentTypes[extname(filePath)] ?? "application/octet-stream",
    });
    response.end(body);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(error instanceof Error ? error.message : "Internal server error");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Serving Storybook static files on http://127.0.0.1:${port}`);
});

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});
