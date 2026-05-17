import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Context } from "hono";

const clientDistRoot = fileURLToPath(new URL("../../dist/client", import.meta.url));
const publicRoot = fileURLToPath(new URL("../../public", import.meta.url));
const storybookRoot = fileURLToPath(new URL("../../storybook-static", import.meta.url));

const contentTypes: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
};

export async function serveClientAsset(context: Context) {
  return serveStaticFile(context, clientDistRoot, context.req.path.slice(1), {
    "Cache-Control": "public, max-age=31536000, immutable",
  });
}

export async function servePublicFile(context: Context, filename: string) {
  return serveStaticFile(context, publicRoot, filename, {
    "Cache-Control": "public, max-age=3600",
  });
}

export async function serveStorybookFile(context: Context) {
  const relativePath = context.req.path.replace(/^\/storybook\/?/, "") || "index.html";
  const response = await serveStaticFile(context, storybookRoot, relativePath, {
    "Cache-Control": relativePath.endsWith(".html")
      ? "no-cache"
      : "public, max-age=31536000, immutable",
  });

  if (response.status !== 404) return response;
  return serveStaticFile(context, storybookRoot, "index.html", {
    "Cache-Control": "no-cache",
  });
}

async function serveStaticFile(
  context: Context,
  root: string,
  relativePath: string,
  headers: Record<string, string>,
) {
  const absolutePath = safeJoin(root, relativePath);
  if (!absolutePath || !existsSync(absolutePath)) {
    return context.notFound();
  }

  const file = Bun.file(absolutePath);
  if (!(await file.exists())) {
    return context.notFound();
  }

  const contentType = contentTypes[path.extname(absolutePath)];
  return new Response(file, {
    headers: contentType ? { ...headers, "Content-Type": contentType } : headers,
  });
}

function safeJoin(root: string, relativePath: string) {
  const target = path.resolve(root, relativePath);
  const relative = path.relative(root, target);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return null;
  }

  return target;
}
