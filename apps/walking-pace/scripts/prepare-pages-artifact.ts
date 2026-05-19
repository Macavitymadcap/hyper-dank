#!/usr/bin/env bun
import { existsSync } from "node:fs";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { appRoot, root } from "./lib/paths";

const siteDir = path.resolve(process.env.PAGES_SITE_DIR ?? path.join(root, ".cache/pages/site"));
const demoDir = path.resolve(process.env.PACE_DEMO_DIST ?? path.join(appRoot, "dist/static-demo"));
const storybookDir = path.resolve(
  process.env.STORYBOOK_DIST ?? path.join(root, "storybook-static"),
);

assertFile(path.join(siteDir, "index.html"), "docs site index");
assertFile(path.join(demoDir, "index.html"), "static pace demo index");
assertFile(path.join(storybookDir, "index.html"), "Storybook index");

await copyIntoArtifact(demoDir, path.join(siteDir, "pace"));
await copyIntoArtifact(storybookDir, path.join(siteDir, "storybook"));
await writeFile(path.join(siteDir, ".nojekyll"), "");

console.log(`Prepared Pages artifact at ${siteDir}`);
console.log(`- copied pace demo from ${demoDir}`);
console.log(`- copied Storybook from ${storybookDir}`);

async function copyIntoArtifact(source: string, destination: string) {
  await rm(destination, { force: true, recursive: true });
  await mkdir(path.dirname(destination), { recursive: true });
  await cp(source, destination, { recursive: true });
}

function assertFile(filePath: string, label: string) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing ${label}: ${filePath}`);
  }
}
