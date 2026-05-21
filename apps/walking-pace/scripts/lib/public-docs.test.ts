import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { normalizePath, root } from "./paths";

const publicDocFiles = [
  "README.md",
  "ARCHITECTURE.md",
  "CONTRIBUTING.md",
  "libs/components/README.md",
  "libs/database/README.md",
  "libs/http/README.md",
  "libs/scripts/README.md",
  ...markdownFiles("site"),
];

const privateReferencePatterns = [
  /\bCharacter Sheet\b/i,
  /\bCharacter Sheet-style\b/i,
  /\bcharacter-sheet\b/i,
];

const relativeUrlPattern = /\{\{\s*["'](?<route>\/[^"']*)["']\s*\|\s*relative_url\s*\}\}/g;

describe("public docs", () => {
  test("do not expose private consumer names", () => {
    const leaks = publicDocFiles.flatMap((file) => {
      const text = readFileSync(path.join(root, file), "utf8");

      return privateReferencePatterns.flatMap((pattern) =>
        pattern.test(text) ? [`${file}: ${pattern.source}`] : [],
      );
    });

    expect(leaks).toEqual([]);
  });

  test("use live public site routes for Jekyll-style relative_url links", () => {
    const siteRoutes = new Set([
      ...markdownFiles("site").map((file) => pageRoute(file)),
      "/pace/",
      "/storybook/",
    ]);

    const brokenLinks = markdownFiles("site").flatMap((file) => {
      const text = readFileSync(path.join(root, file), "utf8");

      return Array.from(text.matchAll(relativeUrlPattern)).flatMap((match) => {
        const route = match.groups?.route;

        if (!route || route.startsWith("/assets/")) {
          return [];
        }

        return siteRoutes.has(route) ? [] : [`${file}: ${route}`];
      });
    });

    expect(brokenLinks).toEqual([]);
  });

  test("keep relative Markdown links pointing at real files", () => {
    const brokenLinks = publicDocFiles.flatMap((file) => {
      const text = readFileSync(path.join(root, file), "utf8");

      return markdownLinks(text).flatMap((target) => {
        if (shouldIgnoreMarkdownLink(target)) {
          return [];
        }

        const targetPath = path.resolve(path.join(root, path.dirname(file)), stripFragment(target));

        return existsSync(targetPath) ? [] : [`${file}: ${target}`];
      });
    });

    expect(brokenLinks).toEqual([]);
  });
});

function markdownFiles(relativeDir: string): string[] {
  const dir = path.join(root, relativeDir);

  return readdirSync(dir)
    .filter((entry) => entry.endsWith(".md"))
    .map((entry) => normalizePath(path.join(relativeDir, entry)))
    .sort();
}

function pageRoute(file: string) {
  const source = readFileSync(path.join(root, file), "utf8");
  const permalinkMatch = /^permalink:\s*(?<route>\/.*)$/m.exec(source);
  const permalink = permalinkMatch?.groups?.route;

  if (permalink) {
    return permalink.trim();
  }

  const basename = path.basename(file, ".md");
  return basename === "index" ? "/" : `/${basename}/`;
}

function markdownLinks(markdown: string): string[] {
  return Array.from(markdown.matchAll(/\[[^\]]+\]\((?<target>[^)]+)\)/g)).flatMap((match) => {
    const target = match.groups?.target;

    return target ? [target.trim()] : [];
  });
}

function shouldIgnoreMarkdownLink(target: string) {
  return (
    target.startsWith("http://") ||
    target.startsWith("https://") ||
    target.startsWith("mailto:") ||
    target.startsWith("#") ||
    target.startsWith("{{") ||
    target.startsWith("/")
  );
}

function stripFragment(target: string) {
  const withoutFragment = target.split("#", 1)[0] ?? "";
  return withoutFragment.split("?", 1)[0] ?? "";
}
