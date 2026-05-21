import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as ui from "../index";
import { sharedIconStoryNames, sharedStoryCoverage } from "./storybook-coverage";

const storyTitlePattern = /title:\s*["']([^"']+)["']/;
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");

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
