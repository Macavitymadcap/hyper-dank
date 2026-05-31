#!/usr/bin/env bun
import { mkdtemp, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { root } from "./lib/paths";
import { readJsonFile } from "./lib/script-guards";

const packageCacheDir = path.join(root, ".cache", "packages");
const temporaryParent =
  process.env.PACKAGE_SMOKE_TMPDIR ??
  (process.platform === "darwin" ? "/private/tmp" : os.tmpdir());
const temporaryRoot = await mkdtemp(path.join(temporaryParent, "hyper-dank-package-smoke-"));
const keepTemporaryRoot = process.env.KEEP_PACKAGE_SMOKE === "true";

try {
  const tarballs = await discoverPackageTarballs();
  await writeConsumerFixture(tarballs);
  run("bun", ["install", "--no-progress"], temporaryRoot);
  run("bun", ["run", "typecheck"], temporaryRoot);
  run("bun", ["index.tsx"], temporaryRoot);

  console.log(`Package tarball smoke passed in ${temporaryRoot}`);
} finally {
  if (keepTemporaryRoot) {
    console.log(`Keeping package smoke fixture at ${temporaryRoot}`);
  } else {
    await rm(temporaryRoot, { force: true, recursive: true });
  }
}

async function discoverPackageTarballs() {
  const packageJson = await readJsonFile<{
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    peerDependencies: Record<string, string>;
  }>(path.join(root, "package.json"));
  const entries = await readdir(packageCacheDir);
  const tarballs = Object.fromEntries(
    entries
      .filter((entry) => entry.endsWith(".tgz"))
      .map((entry) => [packageNameFromTarball(entry), path.join(packageCacheDir, entry)]),
  );
  const requiredPackages = [
    "@macavitymadcap/hyper-dank-ui",
    "@macavitymadcap/hyper-dank-data",
    "@macavitymadcap/hyper-dank-transport",
    "@macavitymadcap/hyper-dank-automation",
  ];

  for (const packageName of requiredPackages) {
    if (!tarballs[packageName]) {
      throw new Error(
        `Missing packed tarball for ${packageName}. Run bun run pack:packages first.`,
      );
    }
  }

  return {
    dependencies: {
      hono: packageJson.dependencies.hono,
      typescript: packageJson.peerDependencies.typescript,
    },
    tarballs,
  };
}

async function writeConsumerFixture({
  dependencies,
  tarballs,
}: {
  dependencies: Record<string, string | undefined>;
  tarballs: Record<string, string>;
}) {
  const packageJson = {
    name: "hyper-dank-package-smoke",
    private: true,
    type: "module",
    scripts: {
      typecheck: "tsc --noEmit",
    },
    dependencies: {
      "@macavitymadcap/hyper-dank-automation": `file:${tarballs["@macavitymadcap/hyper-dank-automation"]}`,
      "@macavitymadcap/hyper-dank-data": `file:${tarballs["@macavitymadcap/hyper-dank-data"]}`,
      "@macavitymadcap/hyper-dank-transport": `file:${tarballs["@macavitymadcap/hyper-dank-transport"]}`,
      "@macavitymadcap/hyper-dank-ui": `file:${tarballs["@macavitymadcap/hyper-dank-ui"]}`,
      hono: dependencies.hono,
      typescript: dependencies.typescript,
    },
  };

  await writeFile(
    path.join(temporaryRoot, "package.json"),
    `${JSON.stringify(packageJson, null, 2)}\n`,
  );
  await writeFile(
    path.join(temporaryRoot, "tsconfig.json"),
    `${JSON.stringify(
      {
        compilerOptions: {
          jsx: "react-jsx",
          jsxImportSource: "hono/jsx",
          lib: ["ESNext", "DOM"],
          module: "Preserve",
          moduleResolution: "bundler",
          noEmit: true,
          skipLibCheck: true,
          strict: true,
          target: "ESNext",
        },
        include: ["index.tsx"],
      },
      null,
      2,
    )}\n`,
  );
  await writeFile(path.join(temporaryRoot, "index.tsx"), consumerSmokeSource());
}

function run(command: string, commandArgs: string[], cwd: string) {
  const result = Bun.spawnSync([command, ...commandArgs], {
    cwd,
    env: {
      ...process.env,
      BUN_INSTALL_CACHE_DIR: path.join(cwd, ".bun-cache"),
      TEMP: cwd,
      TMP: cwd,
      TMPDIR: cwd,
    },
    stderr: "pipe",
    stdout: "pipe",
  });

  if (!result.success) {
    throw new Error(
      `${[command, ...commandArgs].join(" ")} failed in ${cwd}\n\n${result.stdout.toString()}\n${result.stderr.toString()}`,
    );
  }
}

function packageNameFromTarball(fileName: string) {
  const match = fileName.match(
    /^(macavitymadcap-hyper-dank-(?:ui|data|transport|automation))-\d+\.\d+\.\d+.*\.tgz$/,
  );
  if (!match?.[1]) return fileName;

  return match[1].replace(/^macavitymadcap-/, "@macavitymadcap/");
}

function consumerSmokeSource() {
  return `
import {
  createCommandGate,
  renderVerificationReport,
} from "@macavitymadcap/hyper-dank-automation";
import { renderMarkdown } from "@macavitymadcap/hyper-dank-automation/content";
import {
  createProviderRegistry,
  type Migration,
  type RepositoryContract,
  runPendingMigrations,
} from "@macavitymadcap/hyper-dank-data";
import { type RepositoryHarness, runRepositoryHarness } from "@macavitymadcap/hyper-dank-data/testing";
import { FormValues, HttpResponder, isHtmxRequest } from "@macavitymadcap/hyper-dank-transport";
import { Button, Panel } from "@macavitymadcap/hyper-dank-ui";
import {
  ActionPanel,
  CopyField,
  LiveRegionPanel,
  StagedForm,
} from "@macavitymadcap/hyper-dank-ui/organisms";

async function fetchWithTimeout(url: string, timeoutMs = 10_000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { signal: controller.signal });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (controller.signal.aborted) {
      throw new Error(\`Could not fetch \${url} within \${timeoutMs}ms.\`);
    }

    throw new Error(\`Could not fetch \${url}: \${message}\`);
  } finally {
    clearTimeout(timeout);
  }
}

const cssUrl = import.meta.resolve("@macavitymadcap/hyper-dank-ui/styles.css");
const cssResponse = await fetchWithTimeout(cssUrl);

if (!cssResponse.ok) {
  throw new Error("Expected the UI CSS export to resolve to a real file.");
}

const html = String(
  <Panel labelledBy="package-smoke-heading">
    <h1 id="package-smoke-heading">Package smoke</h1>
    <Button type="button" variant="ghost">
      Save
    </Button>
    <StagedForm currentStepId="details" steps={[{ id: "details", label: "Details" }]}>
      Step body
    </StagedForm>
    <CopyField id="share-link" label="Share link" value="https://example.test/share" />
    <ActionPanel title="Actions" primaryActions={<Button type="button">Approve</Button>} />
    <LiveRegionPanel id="live-fragment" status="Updated">
      Live body
    </LiveRegionPanel>
  </Panel>,
);

if (
  !html.includes("Package smoke") ||
  !html.includes('data-variant="ghost"') ||
  !html.includes('class="staged-form"') ||
  !html.includes('class="copy-field"') ||
  !html.includes('class="action-panel"') ||
  !html.includes('class="live-region-panel"')
) {
  throw new Error("Expected UI components and organisms to render through public package imports.");
}

const applied: string[] = [];
const migrations: Migration[] = [{ id: "001", sql: "select 1" }];
await runPendingMigrations(
  {
    hasMigration: (id) => applied.includes(id),
    recordMigration: (id) => {
      applied.push(id);
    },
    runMigration: () => {},
  },
  migrations,
);

const providers = createProviderRegistry({
  memory: ({ label }: { label: string }) => ({
    close: () => {},
    createRepositories: () => ({}),
    kind: "memory" as const,
    label,
    migrate: () => {},
  }),
});
const provider = await providers.create("memory", { label: "smoke" });
const repository: RepositoryContract<{ id: string; title: string }, string> = {
  delete: () => true,
  findById: (id) => ({ id, title: "Package smoke" }),
  list: () => [{ id: "entry", title: "Package smoke" }],
  save: (record) => record,
};
const harness: RepositoryHarness<typeof repository> = { repository };
const title = await runRepositoryHarness(() => harness, async (entries) => {
  const entry = await entries.findById("entry");
  return entry?.title;
});
const form = new FormValues({ enabled: "on", title });
const responder = new HttpResponder();
const gate = createCommandGate("check", "Check", "bun", ["--version"], "Bun");
const report = renderVerificationReport([{ ...gate, status: "not run", stdout: "", stderr: "" }], "/tmp");
const content = renderMarkdown("# Package smoke");

if (
  applied[0] !== "001" ||
  provider.label !== "smoke" ||
  title !== "Package smoke" ||
  form.boolean("enabled") !== true ||
  !isHtmxRequest({ "HX-Request": "true" }) ||
  !report.includes("Check") ||
  !content.includes("<h1") ||
  !(responder instanceof HttpResponder)
) {
  throw new Error("Expected package helpers to work from tarball imports.");
}

console.log("External tarball imports passed.");
`;
}
