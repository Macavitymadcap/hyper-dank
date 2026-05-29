import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { sharedStoryCoverage } from "../../../../libs/components/src/stories/storybook-coverage";
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
      "/search-index.json",
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
        docs: ["site/libraries-ui.md", "libs/components/README.md"],
        sources: ["libs/components/src/index.ts"],
      },
      {
        docs: ["site/libraries-data.md"],
        sources: ["libs/database/src/index.ts", "libs/database/src/testing.ts"],
      },
      {
        docs: ["site/libraries-transport.md"],
        sources: ["libs/http/src/index.ts"],
      },
      {
        docs: ["site/libraries-automation.md"],
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
      return docs.flatMap((doc) => {
        const text = readFileSync(path.join(root, doc), "utf8");
        const documentedNames = documentedCodeNames(text);

        return sources.flatMap((source) =>
          publicExportNames(source).flatMap((exportName) =>
            documentedNames.has(exportName) ? [] : [`${doc}: missing ${exportName} from ${source}`],
          ),
        );
      });
    });

    expect(missingExports).toEqual([]);
  });

  test("align UI API demonstration labels with Storybook coverage", () => {
    const rows = componentApiRows(readFileSync(path.join(root, "site/libraries-ui.md"), "utf8"));

    const mismatches = Object.entries(sharedStoryCoverage).flatMap(([exportName, storyGroup]) => {
      const row = rows.find((candidate) => candidate.exports.includes(exportName));

      if (!row) return [`site/libraries-ui.md: missing API row for ${exportName}`];

      return row.demonstration.includes(storyGroup)
        ? []
        : [
            `site/libraries-ui.md: ${exportName} points at ${row.demonstration}, expected ${storyGroup}`,
          ];
    });

    expect(mismatches).toEqual([]);
  });

  test("keep recipe guidance complete and navigable", () => {
    const recipes = readFileSync(path.join(root, "site/recipes.md"), "utf8");
    const recipeFiles = [
      "site/recipes-server-app.md",
      "site/recipes-static-blog.md",
      "site/recipes-dashboard-admin-tool.md",
      "site/recipes-static-demo.md",
      "site/recipes-script-consumer.md",
      "site/recipes-static-content-generator.md",
    ];
    const expectedSections = [
      {
        file: "site/recipes-server-app.md",
        route: "/recipes/server-app/",
        packages: [
          "@macavitymadcap/hyper-dank-ui",
          "@macavitymadcap/hyper-dank-transport",
          "@macavitymadcap/hyper-dank-data",
          "@macavitymadcap/hyper-dank-automation",
        ],
      },
      {
        file: "site/recipes-static-blog.md",
        route: "/recipes/static-blog/",
        packages: [
          "@macavitymadcap/hyper-dank-ui",
          "@macavitymadcap/hyper-dank-automation/content",
          "@macavitymadcap/hyper-dank-automation",
        ],
      },
      {
        file: "site/recipes-dashboard-admin-tool.md",
        route: "/recipes/dashboard-admin-tool/",
        packages: [
          "@macavitymadcap/hyper-dank-ui",
          "@macavitymadcap/hyper-dank-transport",
          "@macavitymadcap/hyper-dank-data",
          "@macavitymadcap/hyper-dank-automation",
        ],
      },
      {
        file: "site/recipes-static-demo.md",
        route: "/recipes/static-demo/",
        packages: ["@macavitymadcap/hyper-dank-ui", "@macavitymadcap/hyper-dank-automation"],
      },
      {
        file: "site/recipes-script-consumer.md",
        route: "/recipes/script-consumer/",
        packages: ["@macavitymadcap/hyper-dank-automation"],
      },
      {
        file: "site/recipes-static-content-generator.md",
        route: "/recipes/static-content-generator/",
        packages: [
          "@macavitymadcap/hyper-dank-automation/content",
          "@macavitymadcap/hyper-dank-automation",
        ],
      },
    ];

    expect(recipes).toContain('<details class="docs-side-nav recipe-side-nav" open>');
    expect(recipes).toContain('<summary aria-label="Toggle recipe navigation">');
    expect(recipes).toContain('<nav aria-label="Recipe docs">');

    const wrappedPackageItems = recipeFiles.flatMap((file) => {
      const text = readFileSync(path.join(root, file), "utf8");
      return Array.from(
        text.matchAll(/\n- `@macavitymadcap\/hyper-dank-[^`]+`[^\n]*\n {2}\S/g),
      ).map((match) => `${file}: ${match[0].trim()}`);
    });

    const missingContent = expectedSections.flatMap(({ file, packages, route }) => {
      const section = readFileSync(path.join(root, file), "utf8");
      const missingHeadings = [
        "## Required Packages",
        "## App-Owned Responsibilities",
        "## Verification",
        "## References",
      ].flatMap((heading) => (section.includes(heading) ? [] : [`${file}: missing ${heading}`]));
      const missingPackages = packages.flatMap((packageName) =>
        section.includes(packageName) ? [] : [`${file}: missing ${packageName}`],
      );

      return [
        recipes.includes(`href="{{ '${route}' | relative_url }}"`)
          ? ""
          : `${file}: missing recipe index link`,
        ...missingHeadings,
        ...missingPackages,
      ].filter(Boolean);
    });

    expect(wrappedPackageItems).toEqual([]);
    expect(missingContent).toEqual([]);
  });

  test("documents published package consumer setup", () => {
    const setup = readFileSync(path.join(root, "site/libraries-consumer-setup.md"), "utf8");
    const evidence = readFileSync(
      path.join(root, "site/libraries-publication-evidence.md"),
      "utf8",
    );
    const libraries = readFileSync(path.join(root, "site/libraries.md"), "utf8");
    const changelog = readFileSync(path.join(root, "CHANGELOG.md"), "utf8");
    const siteCss = readFileSync(path.join(root, "site/assets/site.css"), "utf8");
    const libraryPages = [
      "site/libraries.md",
      "site/libraries-consumer-setup.md",
      "site/libraries-publication-evidence.md",
      "site/libraries-ui.md",
      "site/libraries-data.md",
      "site/libraries-transport.md",
      "site/libraries-automation.md",
    ].map((file) => readFileSync(path.join(root, file), "utf8"));
    const packageReadmes = [
      "libs/components/README.md",
      "libs/database/README.md",
      "libs/http/README.md",
      "libs/scripts/README.md",
    ].map((file) => readFileSync(path.join(root, file), "utf8"));

    const packageNames = [
      "@macavitymadcap/hyper-dank-ui",
      "@macavitymadcap/hyper-dank-data",
      "@macavitymadcap/hyper-dank-transport",
      "@macavitymadcap/hyper-dank-automation",
    ];

    expect(setup).toContain("permalink: /libraries/consumer-setup/");
    expect(evidence).toContain("permalink: /libraries/publication-evidence/");
    expect(setup).toContain('class="package-manager-tabs"');
    expect(setup).toContain('id="install-npm"');
    expect(setup).toContain('id="install-bun"');
    expect(setup).toContain('id="install-yarn"');
    expect(setup).toContain('id="install-pnpm"');
    expect(setup).toContain("npm install @macavitymadcap/hyper-dank-ui");
    expect(setup).toContain("bun add @macavitymadcap/hyper-dank-ui");
    expect(setup).toContain("yarn add @macavitymadcap/hyper-dank-ui");
    expect(setup).toContain("pnpm add @macavitymadcap/hyper-dank-ui");
    expect(setup).toContain("npm install --save-dev typescript bun-types");
    expect(setup).toContain("bun add --dev typescript bun-types");
    expect(setup).toContain("yarn add --dev typescript bun-types");
    expect(setup).toContain("pnpm add --save-dev typescript bun-types");
    expect(setup).toContain("npm install --save-dev @playwright/test");
    expect(setup).toContain('"jsxImportSource": "hono/jsx"');
    expect(setup).toContain('"types": ["bun-types"]');
    expect(setup).toContain("<a href=\"{{ '/libraries/ui/' | relative_url }}\">UI docs</a>");
    expect(setup).toContain("<a href=\"{{ '/libraries/data/' | relative_url }}\">Data docs</a>");
    expect(setup).toContain(
      "<a href=\"{{ '/libraries/transport/' | relative_url }}\">Transport docs</a>",
    );
    expect(setup).toContain(
      "<a href=\"{{ '/libraries/automation/' | relative_url }}\">Automation docs</a>",
    );
    expect(setup).toContain('import "@macavitymadcap/hyper-dank-ui/styles.css";');
    expect(setup).toContain("import.meta.resolve");
    expect(setup).toContain("Package smoke");
    expect(setup).toContain("renderMarkdown");
    expect(setup).toContain("createProviderRegistry");
    expect(setup).toContain("runPendingMigrations");
    expect(setup).toContain("FormValues");
    expect(setup).toContain("HttpResponder");
    expect(setup).toContain("isHtmxRequest");
    expect(setup).toContain(
      '<a aria-current="page" href="{{ \'/libraries/consumer-setup/\' | relative_url }}">Consumer setup</a>',
    );
    expect(libraries).toContain("{{ '/libraries/consumer-setup/' | relative_url }}");
    expect(libraries).toContain("{{ '/libraries/publication-evidence/' | relative_url }}");
    expect(changelog).toContain(
      "https://macavitymadcap.github.io/hyper-dank/libraries/publication-evidence/",
    );
    expect(siteCss).toContain(".package-manager-tabs");
    expect(siteCss).toContain(".package-manager-tabs input:checked + label");
    expect(siteCss).toContain("#install-npm:checked ~ .package-manager-tabs__panel--npm");
    expect(siteCss).toContain("td code");
    expect(siteCss).toContain("overflow-wrap: anywhere;");

    for (const packageName of packageNames) {
      expect(setup).toContain(packageName);
      expect(evidence).toContain(packageName);
      expect(setup).toContain(`https://www.npmjs.com/package/${packageName}`);
      expect(evidence).toContain(`https://www.npmjs.com/package/${packageName}`);
    }

    for (const readme of packageReadmes) {
      expect(readme).toContain(
        "https://macavitymadcap.github.io/hyper-dank/libraries/consumer-setup/",
      );
    }

    for (const page of libraryPages) {
      expect(page).toContain("{{ '/libraries/publication-evidence/' | relative_url }}");
    }

    expect(evidence).toContain("0.1.0");
    expect(evidence).toContain("0.1.1");
    expect(evidence).toContain("dist.integrity");
    expect(evidence).toContain("dist.signatures");
    expect(evidence).toContain("npm-publishing");
    expect(evidence).toContain("--provenance");
    expect(evidence).toContain("do not have GitHub OIDC provenance");
    expect(evidence).toContain("bun run test:packages");
  });

  test("uses route icons for side-panelled homepage destinations", () => {
    const home = readFileSync(path.join(root, "site/index.md"), "utf8");

    expect(home).toContain('<h2 class="route-card-heading">');
    expect(home).toContain('<span class="docs-side-nav__icon" aria-hidden="true">');
    expect(home).toContain("M4 5.5c3 0 5 .7 8 2.2");
    expect(home).toContain("M4 6l5-2 6 2 5-2");
  });

  test("provides a concrete accessibility report path", () => {
    const statement = readFileSync(path.join(root, "site/accessibility.md"), "utf8");
    const template = readFileSync(
      path.join(root, ".github/ISSUE_TEMPLATE/accessibility_report.yml"),
      "utf8",
    );

    expect(statement).toContain(
      "https://github.com/Macavitymadcap/hyper-dank/issues/new?template=accessibility_report.yml",
    );
    expect(statement).toContain("We aim to triage accessibility reports within seven days.");
    expect(statement).toMatch(/Do not include private\s+personal, account, or security details/);
    expect(statement).toContain("browser, operating system, assistive technology");
    expect(template).toContain("name: Accessibility report");
    expect(template).toContain('labels:\n  - "type: follow-up"\n  - "area: docs"');
    expect(template).toContain("Route, component, or package");
    expect(template).toContain("Do not include private personal, account, or security details");
  });

  test("provides static docs search with no-JS fallback links", () => {
    const search = readFileSync(path.join(root, "site/search.md"), "utf8");
    const script = readFileSync(path.join(root, "site/assets/site.js"), "utf8");
    const css = readFileSync(path.join(root, "site/assets/site.css"), "utf8");

    expect(search).toContain("permalink: /search/");
    expect(search).toContain("data-docs-search");
    expect(search).toContain("{{ '/search-index.json' | relative_url }}");
    expect(search).toContain("href=\"{{ '/libraries/' | relative_url }}\"");
    expect(search).toContain("href=\"{{ '/recipes/' | relative_url }}\"");
    expect(search).toContain("href=\"{{ '/libraries/ui/' | relative_url }}\"");
    expect(search).toContain("href=\"{{ '/storybook/' | relative_url }}\"");
    expect(search).toContain("href=\"{{ '/accessibility/' | relative_url }}\"");
    expect(search).toContain("Type a search term or browse the reference paths below.");
    expect(search).not.toContain("Loading search index.");
    expect(script).toContain("initialiseDocsSearch()");
    expect(script).toContain("fetch(searchIndexUrl)");
    expect(script).toContain("renderDocsSearchResults");
    expect(script).toContain("canonicalPackageRouteForQuery");
    expect(script).toContain('"@macavitymadcap/hyper-dank-ui", "/libraries/ui/"');
    expect(script).toContain('score += url.includes("/libraries/") ? 60 : 35');
    expect(css).toContain(".docs-search");
    expect(css).toContain(".docs-search__result");
  });

  test("keeps public docs search routes live", () => {
    const siteRoutes = new Set([
      ...markdownFiles("site").map((file) => pageRoute(file)),
      "/pace/",
      "/search-index.json",
      "/storybook/",
    ]);
    const docsBuild = readFileSync(
      path.join(root, "apps/walking-pace/scripts/lib/docs-build.ts"),
      "utf8",
    );

    expect(siteRoutes.has("/search/")).toBe(true);
    expect(docsBuild).toContain("search-index.json");
    expect(docsBuild).toContain("buildSearchIndex");
  });

  test("keeps docs side navigation stretched while open and compact while closed", () => {
    const css = readFileSync(path.join(root, "site/assets/site.css"), "utf8");
    const script = readFileSync(path.join(root, "site/assets/site.js"), "utf8");
    const logo = readFileSync(path.join(root, "site/assets/hyper-dank-stacked-logo.svg"), "utf8");

    expect(css).toContain("align-items: stretch;");
    expect(css).toContain(".docs-side-nav[open],\n.library-side-nav[open]");
    expect(css).toContain(".docs-side-nav:not([open]),\n.library-side-nav:not([open])");
    expect(css).toContain(".docs-layout:has(.docs-side-nav:not([open])),");
    expect(css).toContain("grid-template-columns: minmax(11rem, 13.5rem) minmax(0, 1fr);");
    expect(css).toContain("grid-template-columns: 3.5rem minmax(0, 1fr);");
    expect(css).toContain("transition: grid-template-columns 180ms ease;");
    expect(css).toContain(".docs-page,\n  .library-page");
    expect(css).toContain("grid-column: 1;");
    expect(css).toContain("align-self: stretch;");
    expect(css).toContain("align-self: start;");
    expect(css).toContain("position: fixed;");
    expect(css).toContain("position: sticky;");
    expect(css).toContain("z-index: 1;");
    expect(css).toContain("max-height: calc(100dvh - 7rem);");
    expect(css).toContain("height: calc(100dvh - 7rem);");
    expect(css).toContain(".site-main:has(.docs-side-nav)");
    expect(css).toContain("padding-left: 3.875rem;");
    expect(css).toContain("width: 3.25rem;");
    expect(css).toContain("width: min(18rem, calc(100vw - 1rem));");
    expect(css).toContain("--drawer-backdrop-shadow");
    expect(css).toContain(
      "box-shadow: var(--surface-depth-shadow), var(--drawer-backdrop-shadow);",
    );
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain('content: "›";');
    expect(css).toContain('content: "Close";');
    expect(css).toContain("grid-template-columns: 1fr;");
    expect(css).toContain("grid-template-columns: 2rem minmax(0, 1fr) 2rem;");
    expect(css).toContain(".docs-side-nav__icon");
    expect(css).toContain(".docs-side-nav__mobile-label");
    expect(css).toContain(".docs-page-toc");
    expect(css).toContain('.docs-side-nav .docs-page-toc a[aria-current="location"],');
    expect(css).toContain(".docs-side-nav .docs-page-toc a:focus-visible,");
    expect(script).toContain("buildCurrentPageNavigation()");
    expect(script).toContain('currentLink.setAttribute("aria-current", "location")');
    expect(script).toContain('currentLink.dataset.currentSection = "true"');
    expect(script).toContain(
      'window.addEventListener("scroll", scheduleCurrentLinkUpdate, { passive: true })',
    );
    expect(script).toContain("window.requestAnimationFrame");
    expect(script).not.toContain('link.addEventListener("focus"');
    expect(script).toContain('window.matchMedia("(max-width: 640px)").matches');
    expect(script).toContain('document.querySelectorAll(".docs-side-nav[open]")');
    expect(script).toContain('document.querySelectorAll(".docs-side-nav a")');
    expect(script).toContain('link.closest(".docs-side-nav")?.removeAttribute("open")');
    expect(logo).toContain('transform="translate(93 0) scale(0.74 1)"');
    expect(logo).toContain('transform="translate(179 0) scale(0.74 1)"');
  });

  test("keeps docs header controls aligned and mobile brand rows stable", () => {
    const css = readFileSync(path.join(root, "site/assets/site.css"), "utf8");

    expect(css).not.toContain(".site-quick-links");
    expect(css).toContain(".theme-toggle__icon--dark {\n  color: #1e3a8a;");
    expect(css).toContain(
      ".theme-toggle__input:checked + .theme-toggle__track .theme-toggle__icon--dark,",
    );
    expect(css).toContain("white-space: nowrap;");
    expect(css).toContain("grid-template-columns: auto minmax(0, 1fr);");
    expect(css).toContain(".hero-copy {\n    display: contents;");
    expect(css).toContain("overflow-wrap: anywhere;");
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

function componentApiRows(text: string) {
  return text
    .split("\n")
    .flatMap((line) => {
      if (!line.startsWith("| `")) return [];

      const cells = line
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim());

      if (cells.length < 3) return [];

      return [
        {
          exports: Array.from((cells[0] ?? "").matchAll(/`([^`]+)`/g)).flatMap((match) =>
            match[1] ? [match[1]] : [],
          ),
          demonstration: cells[2] ?? "",
        },
      ];
    })
    .filter((row) => row.exports.length > 0);
}
