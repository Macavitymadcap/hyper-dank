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

const releaseConfig = JSON.parse(
  await readFile(path.join(root, ".release-please-config.json"), "utf8"),
) as {
  packages?: Record<string, Record<string, unknown>>;
  plugins?: Array<Record<string, unknown>>;
};
const releaseManifest = JSON.parse(
  await readFile(path.join(root, ".release-please-manifest.json"), "utf8"),
) as Record<string, string>;

const linkedLibraryPlugin = releaseConfig.plugins?.find(
  (plugin) => plugin.type === "linked-versions" && plugin.groupName === "hyper-dank-libraries",
);
const linkedComponents = new Set(
  Array.isArray(linkedLibraryPlugin?.components) ? linkedLibraryPlugin.components : [],
);
const parseLibraryVersion = (version: unknown) =>
  String(version ?? "")
    .split(".")
    .map((part) => Number(part));
const compareLibraryVersions = (left: unknown, right: unknown) => {
  const leftParts = parseLibraryVersion(left);
  const rightParts = parseLibraryVersion(right);
  for (let index = 0; index < 3; index += 1) {
    const difference = (leftParts[index] ?? 0) - (rightParts[index] ?? 0);
    if (difference !== 0) return difference;
  }
  return 0;
};

for (const { dir, json } of packageJsons) {
  const releasePackage = releaseConfig.packages?.[dir];
  if (!releasePackage) {
    errors.push(`Release Please config must include ${dir} as a publishable package.`);
    continue;
  }

  const name = String(json.name ?? "");
  if (releasePackage["package-name"] !== name) {
    errors.push(`Release Please package-name for ${dir} must be ${name}.`);
  }
  if (releasePackage["release-type"] !== "node") {
    errors.push(`Release Please release-type for ${dir} must be node.`);
  }
  if (releasePackage["include-component-in-tag"] !== true) {
    errors.push(`Release Please tags for ${dir} must include the package component.`);
  }

  const component = String(releasePackage.component ?? "");
  if (!linkedComponents.has(component)) {
    errors.push(`${dir} must be part of the hyper-dank-libraries linked release group.`);
  }

  const manifestVersion = releaseManifest[dir];
  if (!manifestVersion) {
    errors.push(`Release Please manifest must track the latest released version for ${dir}.`);
  }
  if (manifestVersion && !manifestVersion.startsWith("0.")) {
    errors.push(`${dir} Release Please manifest must stay on the public library 0.x release line.`);
  }
  if (manifestVersion && compareLibraryVersions(manifestVersion, json.version) > 0) {
    errors.push(
      `Release Please manifest for ${dir} must not be ahead of package.json version ${json.version}.`,
    );
  }
  if (!String(json.version ?? "").startsWith("0.")) {
    errors.push(`${dir}/package.json must stay on the public library 0.x release line for now.`);
  }
}

if (releaseConfig.packages?.["."]?.["package-name"] !== "hyper-dank") {
  errors.push("Release Please config must keep the root hyper-dank package.");
}
if (!releaseManifest["."]) {
  errors.push("Release Please manifest must track the root hyper-dank version separately.");
}

const publishWorkflow = await readFile(
  path.join(root, ".github", "workflows", "publish-npm.yml"),
  "utf8",
);
if (!publishWorkflow.includes("release:")) {
  errors.push("Publish npm workflow must run from published GitHub release events.");
}
if (!publishWorkflow.includes("startsWith(github.event.release.tag_name, 'hyper-dank-ui-v')")) {
  errors.push(
    "Publish npm workflow must only auto-stage packages from one canonical library release.",
  );
}
if (!publishWorkflow.includes("npm view")) {
  errors.push("Publish npm workflow must skip package versions that already exist on npm.");
}
if (!publishWorkflow.includes("npm install -g npm@11.15.0")) {
  errors.push("Publish npm workflow must install an npm CLI version with staged publishing.");
}
if (!publishWorkflow.includes("npm help stage")) {
  errors.push("Publish npm workflow must verify the staged publishing command is available.");
}
if (!publishWorkflow.includes("unset NODE_AUTH_TOKEN")) {
  errors.push("Publish npm workflow must clear token auth before OIDC trusted staging.");
}
if (!publishWorkflow.includes("npm stage publish . --access public --provenance")) {
  errors.push("Publish npm workflow must use trusted staged publishing with provenance.");
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(
  `Package publishing metadata is ready for ${packageJsons.length} lockstep npm packages at ${[...versions][0]}.`,
);
