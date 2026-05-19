#!/usr/bin/env bun
import { appendFile } from "node:fs/promises";
import path from "node:path";
import { buildDocsSite } from "./lib/docs-build";
import {
  githubOutputForPagesBasePath,
  paceDemoBaseFromPagesBasePath,
  resolvePagesBasePath,
} from "./lib/pages-base";
import { root } from "./lib/paths";

type PreparePagesSourceOptions = {
  basePath?: string;
  destinationDir?: string;
  sourceDir?: string;
};

if (import.meta.main) {
  await main();
}

export async function preparePagesSource({
  basePath = resolvePagesBasePath(),
  destinationDir = process.env.PAGES_SITE_DIR ?? path.join(root, ".cache/pages/site"),
  sourceDir = process.env.PAGES_SOURCE_DIR ?? path.join(root, "site"),
}: PreparePagesSourceOptions = {}) {
  await buildDocsSite({
    basePath,
    destinationDir: path.resolve(destinationDir),
    sourceDir: path.resolve(sourceDir),
  });

  console.log(`Built docs site at ${path.resolve(destinationDir)}`);
  console.log(`- baseurl ${basePath || "/"}`);
  console.log(`- pace demo base ${paceDemoBaseFromPagesBasePath(basePath)}`);
}

async function main() {
  const basePath = resolvePagesBasePath();

  if (process.argv.includes("--github-output")) {
    const output = githubOutputForPagesBasePath(basePath);

    if (process.env.GITHUB_OUTPUT) {
      await appendFile(process.env.GITHUB_OUTPUT, output);
    } else {
      process.stdout.write(output);
    }

    console.log(`Resolved Pages base path ${basePath || "/"}`);
    return;
  }

  await preparePagesSource({ basePath });
}
