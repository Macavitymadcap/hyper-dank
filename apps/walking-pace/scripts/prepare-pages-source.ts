#!/usr/bin/env bun
import { existsSync } from "node:fs";
import { appendFile, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  githubOutputForPagesBasePath,
  paceDemoBaseFromPagesBasePath,
  resolvePagesBasePath,
  withJekyllBaseUrl,
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
  destinationDir = process.env.PAGES_JEKYLL_SOURCE ?? path.join(root, ".cache/pages/source"),
  sourceDir = process.env.PAGES_SOURCE_DIR ?? path.join(root, "site"),
}: PreparePagesSourceOptions = {}) {
  const resolvedSourceDir = path.resolve(sourceDir);
  const resolvedDestinationDir = path.resolve(destinationDir);

  assertFile(path.join(resolvedSourceDir, "_config.yml"), "Jekyll source config");

  await rm(resolvedDestinationDir, { force: true, recursive: true });
  await mkdir(path.dirname(resolvedDestinationDir), { recursive: true });
  await cp(resolvedSourceDir, resolvedDestinationDir, { recursive: true });

  const configPath = path.join(resolvedDestinationDir, "_config.yml");
  const config = await readFile(configPath, "utf8");

  await writeFile(configPath, withJekyllBaseUrl(config, basePath));

  console.log(`Prepared Jekyll source at ${resolvedDestinationDir}`);
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

function assertFile(filePath: string, label: string) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing ${label}: ${filePath}`);
  }
}
