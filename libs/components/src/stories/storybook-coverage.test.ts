import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as ui from "../index";
import { sharedIconStoryNames, sharedStoryCoverage } from "./storybook-coverage";

const storyTitlePattern = /title:\s*["']([^"']+)["']/;
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");
const consumerGuideStoryTitles = new Map([
  ["apps/walking-pace/src/stories/about.stories.tsx", "Guides/About"],
  [
    "apps/walking-pace/src/stories/component-system.stories.tsx",
    "Introduction/Component Contracts",
  ],
  ["apps/walking-pace/src/stories/guides.stories.tsx", "Guides/Using Hyper-Dank"],
]);

describe("Storybook shared reference coverage", () => {
  test("documents every public shared runtime export", () => {
    expect(Object.keys(sharedStoryCoverage).sort()).toEqual(Object.keys(ui).sort());
  });

  test("keeps shared component stories under Components/Shared", () => {
    const storyFiles = listStoryFiles(join(repoRoot, "libs/components/src"));

    expect(storyFiles.length).toBeGreaterThan(0);

    for (const storyFile of storyFiles) {
      expect(readStoryTitle(storyFile), relative(repoRoot, storyFile)).toStartWith(
        "Components/Shared/",
      );
    }
  });

  test("maps each covered shared export to an existing story group", () => {
    const storyTitles = new Set(
      listStoryFiles(join(repoRoot, "libs/components/src")).map((storyFile) =>
        readStoryTitle(storyFile),
      ),
    );

    for (const storyGroup of Object.values(sharedStoryCoverage)) {
      expect(storyTitles).toContain(storyGroup);
    }
  });

  test("keeps reference app component stories under Components/Reference App", () => {
    const storyFiles = listStoryFiles(join(repoRoot, "apps/walking-pace/src/components"));

    expect(storyFiles.length).toBeGreaterThan(0);

    for (const storyFile of storyFiles) {
      expect(readStoryTitle(storyFile), relative(repoRoot, storyFile)).toStartWith(
        "Components/Reference App/",
      );
    }
  });

  test("keeps narrative Storybook pages in accepted consumer reference groups", () => {
    for (const [storyPath, expectedTitle] of consumerGuideStoryTitles) {
      const storyFile = join(repoRoot, storyPath);

      expect(readStoryTitle(storyFile), storyPath).toBe(expectedTitle);
    }
  });

  test("keeps maintainer-only guide labels out of consumer Storybook pages", () => {
    const storyFiles = listStoryFiles(join(repoRoot, "apps/walking-pace/src/stories"));
    const forbiddenPatterns = [/Guides\/Template/, /Template guide/, /App Builder Reuse/];

    for (const storyFile of storyFiles) {
      const source = readFileSync(storyFile, "utf8");

      for (const pattern of forbiddenPatterns) {
        expect(source, `${relative(repoRoot, storyFile)} should not match ${pattern}`).not.toMatch(
          pattern,
        );
      }
    }
  });

  test("lists every generic icon in the shared icon catalogue", () => {
    expect(sharedIconStoryNames).toEqual([
      "add",
      "book",
      "calendar",
      "check",
      "close",
      "database",
      "delete",
      "dice",
      "document",
      "download",
      "edit",
      "external-link",
      "filter",
      "folder",
      "home",
      "lock",
      "map",
      "menu",
      "moon",
      "save",
      "search",
      "settings",
      "shield",
      "sparkles",
      "star",
      "sun",
      "tag",
      "upload",
      "user",
      "warning",
    ]);
  });

  test("keeps rewritten shared docs examples copyable and wrapper-free", () => {
    const storyFiles = [
      "libs/components/src/stories/shared-coverage.stories.tsx",
      "libs/components/src/stories/second-wave-primitives.stories.tsx",
      "libs/components/src/stories/generic-components.stories.tsx",
      "libs/components/src/stories/low-state-primitives.stories.tsx",
      "libs/components/src/organisms/StagedForm/StagedForm.stories.tsx",
      "libs/components/src/organisms/WorkflowOrganisms.stories.tsx",
    ];

    for (const storyPath of storyFiles) {
      const source = readFileSync(join(repoRoot, storyPath), "utf8");
      const codeExamples = [...source.matchAll(/code={`(?<code>[\s\S]*?)`}/g)];

      expect(
        codeExamples.length,
        `${storyPath} should include visible code examples`,
      ).toBeGreaterThan(0);

      for (const example of codeExamples) {
        const code = example.groups?.code ?? "";
        expect(code, `${storyPath} example should import public package`).toContain(
          "@macavitymadcap/hyper-dank-ui",
        );
        expect(code, `${storyPath} example should not expose Storybook wrapper`).not.toContain(
          "renderStory",
        );
        expect(
          code,
          `${storyPath} example should not expose Storybook-only wrapper classes`,
        ).not.toContain("storybook-doc");
      }
    }
  });
});

function listStoryFiles(root: string) {
  if (!existsSync(root)) return [];

  const files: string[] = [];
  const entries = readdirSync(root);

  for (const entry of entries) {
    const path = join(root, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      files.push(...listStoryFiles(path));
      continue;
    }

    if (path.endsWith(".stories.tsx")) files.push(path);
  }

  return files.sort();
}

function readStoryTitle(storyFile: string) {
  const matches = [...readFileSync(storyFile, "utf8").matchAll(new RegExp(storyTitlePattern, "g"))];
  const match = matches.find((candidate) =>
    ["Components/", "Guides/", "Introduction/"].some((prefix) => candidate[1]?.startsWith(prefix)),
  );

  if (!match) throw new Error(`Missing Storybook title in ${storyFile}`);

  return match[1];
}
