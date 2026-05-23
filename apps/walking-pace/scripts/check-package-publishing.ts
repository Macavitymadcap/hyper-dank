#!/usr/bin/env bun
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { root } from "./lib/paths";

const packageDirs = ["libs/components", "libs/database", "libs/http", "libs/scripts"] as const;

const requiredKeys = [
  "name",
  "version",
  "description",
  "homepage",
  "license",
  "repository",
  "publishConfig",
  "exports",
] as const;

const packageJsons = await Promise.all(
  packageDirs.map(async (dir) => {
    const packagePath = path.join(root, dir, "package.json");
    return {
      dir,
      json: JSON.parse(await readFile(packagePath, "utf8")) as Record<string, unknown>,
      packagePath,
    };
  }),
);

const versions = new Set(packageJsons.map(({ json }) => json.version));
const errors: string[] = [];

if (versions.size !== 1) {
  errors.push(`Hyper-Dank packages must be lockstep versioned: ${[...versions].join(", ")}`);
}

for (const { dir, json } of packageJsons) {
  for (const key of requiredKeys) {
    if (!json[key]) errors.push(`${dir}/package.json is missing ${key}.`);
  }

  if (json.private === true) errors.push(`${dir}/package.json must not be private.`);

  const name = String(json.name ?? "");
  if (!name.startsWith("@macavitymadcap/hyper-dank-")) {
    errors.push(`${dir}/package.json must use the @macavitymadcap/hyper-dank-* scope.`);
  }

  const homepage = String(json.homepage ?? "");
  if (!homepage.startsWith("https://macavitymadcap.github.io/hyper-dank/libraries/")) {
    errors.push(`${dir}/package.json homepage must point at the public static library docs.`);
  }

  const publishConfig = json.publishConfig as Record<string, unknown> | undefined;
  if (publishConfig?.access !== "public") {
    errors.push(`${dir}/package.json publishConfig.access must be public.`);
  }
  if (Object.hasOwn(publishConfig ?? {}, "provenance")) {
    errors.push(
      `${dir}/package.json publishConfig.provenance is workflow-owned; omit it for manual publish safety.`,
    );
  }

  const repository = json.repository as Record<string, unknown> | undefined;
  if (repository?.url !== "git+https://github.com/Macavitymadcap/hyper-dank.git") {
    errors.push(`${dir}/package.json repository.url must point at the Hyper-Dank GitHub repo.`);
  }
  if (repository?.directory !== dir) {
    errors.push(`${dir}/package.json repository.directory must be ${dir}.`);
  }

  const files = json.files as string[] | undefined;
  for (const file of ["dist", "src", "LICENSE", "README.md"]) {
    if (!files?.includes(file)) errors.push(`${dir}/package.json files must include ${file}.`);
  }

  const readme = await readFile(path.join(root, dir, "README.md"), "utf8");
  if (!readme.includes("npm")) errors.push(`${dir}/README.md must document npm installation.`);
  if (!readme.includes("https://macavitymadcap.github.io/hyper-dank/")) {
    errors.push(`${dir}/README.md must link to the public static docs site.`);
  }
  if (!readme.includes("staged")) {
    errors.push(`${dir}/README.md must mention staged publishing or staged release review.`);
  }
}

const workflowFiles = await readdir(path.join(root, ".github", "workflows"));
if (!workflowFiles.includes("publish-npm.yml")) {
  errors.push("Missing .github/workflows/publish-npm.yml.");
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(
  `Package publishing metadata is ready for ${packageJsons.length} lockstep npm packages at ${[...versions][0]}.`,
);
