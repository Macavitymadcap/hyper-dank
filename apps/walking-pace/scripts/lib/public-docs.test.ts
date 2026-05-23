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

  test("keep recipe guidance complete and navigable", () => {
    const recipes = readFileSync(path.join(root, "site/recipes.md"), "utf8");
    const expectedSections = [
      {
        id: "server-app",
        packages: [
          "@macavitymadcap/hyper-dank-ui",
          "@macavitymadcap/hyper-dank-transport",
          "@macavitymadcap/hyper-dank-data",
          "@macavitymadcap/hyper-dank-automation",
        ],
      },
      {
        id: "static-blog",
        packages: [
          "@macavitymadcap/hyper-dank-ui",
          "@macavitymadcap/hyper-dank-automation/content",
          "@macavitymadcap/hyper-dank-automation",
        ],
      },
      {
        id: "dashboard-admin-tool",
        packages: [
          "@macavitymadcap/hyper-dank-ui",
          "@macavitymadcap/hyper-dank-transport",
          "@macavitymadcap/hyper-dank-data",
          "@macavitymadcap/hyper-dank-automation",
        ],
      },
      {
        id: "static-demo",
        packages: ["@macavitymadcap/hyper-dank-ui", "@macavitymadcap/hyper-dank-automation"],
      },
      {
        id: "script-consumer",
        packages: ["@macavitymadcap/hyper-dank-automation"],
      },
      {
        id: "static-content-generator",
        packages: [
          "@macavitymadcap/hyper-dank-automation/content",
          "@macavitymadcap/hyper-dank-automation",
        ],
      },
    ];

    expect(recipes).toContain('<details class="docs-side-nav recipe-side-nav" open>');
    expect(recipes).toContain('<summary aria-label="Toggle recipe navigation">');
    expect(recipes).toContain('<nav aria-label="Recipe sections">');

    const wrappedPackageItems = Array.from(
      recipes.matchAll(/\n- `@macavitymadcap\/hyper-dank-[^`]+`[^\n]*\n {2}\S/g),
    ).map((match) => match[0].trim());

    const missingContent = expectedSections.flatMap(({ id, packages }) => {
      const section = recipeSection(recipes, id);
      const missingHeadings = [
        "### Required packages",
        "### App-owned responsibilities",
        "### Verification",
        "### References",
      ].flatMap((heading) => (section.includes(heading) ? [] : [`${id}: missing ${heading}`]));
      const missingPackages = packages.flatMap((packageName) =>
        section.includes(packageName) ? [] : [`${id}: missing ${packageName}`],
      );

      return [
        recipes.includes(`href="#${id}"`) ? "" : `${id}: missing recipe nav link`,
        ...missingHeadings,
        ...missingPackages,
      ].filter(Boolean);
    });

    expect(wrappedPackageItems).toEqual([]);
    expect(missingContent).toEqual([]);
  });

  test("uses route icons for side-panelled homepage destinations", () => {
    const home = readFileSync(path.join(root, "site/index.md"), "utf8");

    expect(home).toContain('<h2 class="route-card-heading">');
    expect(home).toContain('<span class="docs-side-nav__icon" aria-hidden="true">');
    expect(home).toContain("M4 5.5c3 0 5 .7 8 2.2");
    expect(home).toContain("M4 6l5-2 6 2 5-2");
  });

  test("keeps docs side navigation stretched while open and compact while closed", () => {
    const css = readFileSync(path.join(root, "site/assets/site.css"), "utf8");
    const script = readFileSync(path.join(root, "site/assets/site.js"), "utf8");

    expect(css).toContain("align-items: stretch;");
    expect(css).toContain(".docs-side-nav[open],\n.library-side-nav[open]");
    expect(css).toContain(".docs-side-nav:not([open]),\n.library-side-nav:not([open])");
    expect(css).toContain(".docs-layout:has(.docs-side-nav:not([open])),");
    expect(css).toContain("grid-template-columns: 4.75rem minmax(0, 1fr);");
    expect(css).toContain(".docs-page,\n  .library-page");
    expect(css).toContain("grid-column: 1;");
    expect(css).toContain("align-self: stretch;");
    expect(css).toContain("align-self: start;");
    expect(css).toContain("position: fixed;");
    expect(css).toContain("height: calc(100dvh - 7rem);");
    expect(css).toContain(".site-main:has(.docs-side-nav)");
    expect(css).toContain("padding-left: 4.75rem;");
    expect(css).toContain("width: 3.75rem;");
    expect(css).toContain("width: min(20rem, calc(100vw - 1rem));");
    expect(css).toContain("--drawer-backdrop-shadow");
    expect(css).toContain(
      "box-shadow: var(--surface-depth-shadow), var(--drawer-backdrop-shadow);",
    );
    expect(css).toContain('content: "›";');
    expect(css).toContain('content: "Close";');
    expect(css).toContain("grid-template-columns: 1fr;");
    expect(css).toContain("grid-template-columns: 2rem minmax(0, 1fr) 2rem;");
    expect(css).toContain(".docs-side-nav__icon");
    expect(css).toContain(".docs-side-nav__mobile-label");
    expect(script).toContain('window.matchMedia("(max-width: 640px)").matches');
    expect(script).toContain('document.querySelectorAll(".docs-side-nav[open]")');
    expect(script).toContain('document.querySelectorAll(".docs-side-nav a")');
    expect(script).toContain('link.closest(".docs-side-nav")?.removeAttribute("open")');
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

function recipeSection(markdown: string, id: string) {
  const match = new RegExp(
    `<section id="${id}" class="recipe-section">(?<section>[\\s\\S]*?)</section>`,
  ).exec(markdown);

  return match?.groups?.section ?? "";
}
