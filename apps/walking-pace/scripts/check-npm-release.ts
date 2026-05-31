#!/usr/bin/env bun
import path from "node:path";
import { root } from "./lib/paths";
import { fetchWithTimeout, readJsonFile, responseJson } from "./lib/script-guards";

const packageDirs = ["libs/components", "libs/database", "libs/http", "libs/scripts"] as const;
const registryBaseUrl = process.env.NPM_REGISTRY_URL ?? "https://registry.npmjs.org";

interface PackageManifest {
  name: string;
  version: string;
}

interface RegistryPackument {
  "dist-tags"?: {
    latest?: string;
  };
  versions?: Record<string, unknown>;
}

const packageManifests = await Promise.all(
  packageDirs.map(async (dir) => {
    const packagePath = path.join(root, dir, "package.json");
    const manifest = await readJsonFile<PackageManifest>(packagePath);
    return { dir, manifest };
  }),
);

const releaseRows = await Promise.all(
  packageManifests.map(async ({ dir, manifest }) => {
    const registry = await fetchRegistryPackage(manifest.name);
    const publishedVersion = registry.latestVersion ?? "not published";
    const status = classifyReleaseStatus(manifest.version, registry.latestVersion);
    const exactVersionExists = registry.versions.has(manifest.version);

    return {
      dir,
      exactVersionExists,
      localVersion: manifest.version,
      name: manifest.name,
      publishedVersion,
      status,
    };
  }),
);

const statusPriority = {
  "release needed": 0,
  "local behind npm": 1,
  "local matches npm": 2,
} as const;

releaseRows.sort((left, right) => {
  const priority = statusPriority[left.status] - statusPriority[right.status];
  return priority === 0 ? left.name.localeCompare(right.name) : priority;
});

const columns = [
  ["Package", ...releaseRows.map((row) => row.name)],
  ["Local", ...releaseRows.map((row) => row.localVersion)],
  ["npm latest", ...releaseRows.map((row) => row.publishedVersion)],
  ["Status", ...releaseRows.map((row) => row.status)],
];

console.log(formatTable(columns));

const releaseNeeded = releaseRows.filter((row) => row.status === "release needed");
const exactLocalPublished = releaseRows.filter((row) => row.exactVersionExists);
const localBehindNpm = releaseRows.filter((row) => row.status === "local behind npm");

if (releaseNeeded.length > 0) {
  console.log("\nRelease needed for:");
  for (const row of releaseNeeded) {
    console.log(`- ${row.name}: local ${row.localVersion}, npm latest ${row.publishedVersion}`);
  }

  console.log("\nRelease process:");
  console.log("1. Run `bun run check:publishing` and `bun run test:packages`.");
  console.log(
    "2. Use the GitHub Actions `Publish npm packages` workflow with `release_mode=stage-unpublished-packages`, or publish the Release Please GitHub release.",
  );
  console.log("3. Approve the staged npm packages in npm after the workflow stages them.");
  console.log(
    "4. Re-run `bun run check:npm-release` and confirm every package matches npm latest.",
  );

  process.exitCode = 1;
}

if (localBehindNpm.length > 0) {
  console.log("\nLocal package versions are behind npm for:");
  for (const row of localBehindNpm) {
    console.log(`- ${row.name}: local ${row.localVersion}, npm latest ${row.publishedVersion}`);
  }
  console.log("\nUpdate the local release metadata before publishing another package set.");
  process.exitCode = 1;
}

if (exactLocalPublished.length > 0 && releaseNeeded.length > 0) {
  console.log("\nAlready-published local versions will be skipped by the publish workflow:");
  for (const row of exactLocalPublished) {
    console.log(`- ${row.name}@${row.localVersion}`);
  }
}

if (releaseNeeded.length === 0 && localBehindNpm.length === 0) {
  console.log("\nNo npm release needed: all local package versions match npm latest.");
}

async function fetchRegistryPackage(packageName: string) {
  const registryUrl = `${registryBaseUrl.replace(/\/$/, "")}/${encodeURIComponent(packageName)}`;
  let response: Response;

  try {
    response = await fetchWithTimeout(registryUrl, {
      headers: {
        Accept: "application/vnd.npm.install-v1+json, application/json",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Could not reach npm registry for ${packageName}: ${message}`);
  }

  if (response.status === 404) {
    return { latestVersion: null, versions: new Set<string>() };
  }

  if (!response.ok) {
    throw new Error(`npm registry returned ${response.status} for ${packageName}.`);
  }

  const packument = await responseJson<RegistryPackument>(response, registryUrl);
  return {
    latestVersion: packument["dist-tags"]?.latest ?? null,
    versions: new Set(Object.keys(packument.versions ?? {})),
  };
}

function classifyReleaseStatus(localVersion: string, latestVersion: string | null) {
  if (!latestVersion) return "release needed" as const;

  const comparison = compareSemver(localVersion, latestVersion);
  if (comparison > 0) return "release needed" as const;
  if (comparison < 0) return "local behind npm" as const;
  return "local matches npm" as const;
}

function compareSemver(left: string, right: string) {
  const leftParts = semverParts(left);
  const rightParts = semverParts(right);

  for (const index of [0, 1, 2] as const) {
    const difference = leftParts[index] - rightParts[index];
    if (difference !== 0) return difference;
  }

  return 0;
}

function semverParts(version: string): [number, number, number] {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) throw new Error(`Expected a semver version, got ${version}.`);
  const [, major, minor, patch] = match;
  return [Number(major), Number(minor), Number(patch)] as const;
}

function formatTable(columns: string[][]) {
  const widths = columns.map((column) => Math.max(...column.map((cell) => cell.length)));
  const firstColumn = columns.at(0) ?? [];
  const rows = firstColumn.map((_, rowIndex) =>
    columns
      .map((column, columnIndex) => (column.at(rowIndex) ?? "").padEnd(widths.at(columnIndex) ?? 0))
      .join("  "),
  );

  return rows.join("\n");
}
