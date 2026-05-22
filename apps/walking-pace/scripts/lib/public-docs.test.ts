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

  test("document public package exports on library API pages", () => {
    const coverage = [
      {
        docs: "site/libraries-ui.md",
        sources: ["libs/components/src/index.ts"],
      },
      {
        docs: "site/libraries-data.md",
        sources: ["libs/database/src/index.ts", "libs/database/src/testing.ts"],
      },
      {
        docs: "site/libraries-transport.md",
        sources: ["libs/http/src/index.ts"],
      },
      {
        docs: "site/libraries-automation.md",
        sources: [
          "libs/scripts/src/browser.ts",
          "libs/scripts/src/github.ts",
          "libs/scripts/src/local-server.ts",
          "libs/scripts/src/pa11y.ts",
          "libs/scripts/src/pr-images.ts",
          "libs/scripts/src/process.ts",
          "libs/scripts/src/static-site.ts",
          "libs/scripts/src/verification.ts",
          "libs/scripts/src/content/index.ts",
        ],
      },
    ];

    const missingExports = coverage.flatMap(({ docs, sources }) => {
      const text = readFileSync(path.join(root, docs), "utf8");
      const documentedNames = documentedCodeNames(text);

      return sources.flatMap((source) =>
        publicExportNames(source).flatMap((exportName) =>
          documentedNames.has(exportName) ? [] : [`${docs}: missing ${exportName} from ${source}`],
        ),
      );
    });

    expect(missingExports).toEqual([]);
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

function documentedCodeNames(markdown: string) {
  return new Set(
    Array.from(markdown.matchAll(/`(?<name>[A-Za-z][A-Za-z0-9_]*)`/g)).flatMap((match) =>
      match.groups?.name ? [match.groups.name] : [],
    ),
  );
}

function publicExportNames(relativePath: string) {
  const text = readFileSync(path.join(root, relativePath), "utf8");
  const names = new Set<string>();

  for (const match of text.matchAll(
    /export\s+(?:async\s+)?(?:function|class|interface|type|const)\s+(?<name>[A-Za-z0-9_]+)/g,
  )) {
    if (match.groups?.name) names.add(match.groups.name);
  }

  for (const match of text.matchAll(/export\s*\{(?<exports>[^}]+)\}/g)) {
    const exportsGroup = match.groups?.exports;
    if (!exportsGroup) continue;

    for (const part of exportsGroup.split(",")) {
      const name = part
        .trim()
        .replace(/^type\s+/, "")
        .split(/\s+as\s+/)
        .pop()
        ?.trim();
      if (name) names.add(name);
    }
  }

  return [...names].sort();
}
