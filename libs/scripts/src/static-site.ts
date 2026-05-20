import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

export interface StaticArtifactAssertion {
  includes?: string | string[];
  path: string;
}

export interface SmokeStaticSiteOptions {
  root: string;
  routes: StaticArtifactAssertion[];
}

export async function assertStaticArtifact(root: string, assertion: StaticArtifactAssertion) {
  const filePath = safeStaticArtifactPath(root, assertion.path);
  if (!existsSync(filePath)) throw new Error(`Missing static artifact: ${assertion.path}`);

  const includes = Array.isArray(assertion.includes)
    ? assertion.includes
    : assertion.includes
      ? [assertion.includes]
      : [];

  if (includes.length === 0) return filePath;

  const content = await readFile(filePath, "utf8");
  for (const expected of includes) {
    if (!content.includes(expected)) {
      throw new Error(`Static artifact ${assertion.path} did not include: ${expected}`);
    }
  }

  return filePath;
}

export async function smokeStaticSite({ root, routes }: SmokeStaticSiteOptions) {
  const filePaths: string[] = [];
  for (const route of routes) {
    filePaths.push(await assertStaticArtifact(root, route));
  }

  return filePaths;
}

function safeStaticArtifactPath(root: string, relativePath: string) {
  if (path.isAbsolute(relativePath)) {
    throw new Error(`Static artifact path must be relative: ${relativePath}`);
  }

  const normalizedRoot = path.resolve(root);
  const filePath = path.resolve(normalizedRoot, relativePath);
  const relative = path.relative(normalizedRoot, filePath);

  if (relative === "" || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Static artifact path escapes root: ${relativePath}`);
  }

  return filePath;
}
