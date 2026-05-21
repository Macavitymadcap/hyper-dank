import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  buildStaticContentSite,
  escapeHtml,
  relativeContentUrl,
  renderMarkdown as renderContentMarkdown,
} from "../../../../libs/scripts/src/content";
import { normalizePagesBasePath } from "./pages-base";

export interface BuildDocsOptions {
  basePath: string;
  destinationDir: string;
  sourceDir: string;
}

interface SiteConfig {
  description: string;
  title: string;
}

export async function buildDocsSite({ basePath, destinationDir, sourceDir }: BuildDocsOptions) {
  const normalizedBasePath = normalizePagesBasePath(basePath);
  const siteConfig = await readSiteConfig(path.join(sourceDir, "_config.yml"));

  await buildStaticContentSite({
    assets: [{ from: path.join(sourceDir, "assets"), to: "assets" }],
    basePath: normalizedBasePath,
    destinationDir,
    renderDocument: ({ content, page }) =>
      renderDocument({
        basePath: normalizedBasePath,
        content,
        description: siteConfig.description,
        siteTitle: siteConfig.title,
        title: page.title,
      }),
    sourceDir,
  });

  await writeFile(path.join(destinationDir, ".nojekyll"), "");
}

export function renderMarkdown(markdown: string, basePath = "") {
  return renderContentMarkdown(markdown, { basePath });
}

async function readSiteConfig(configPath: string): Promise<SiteConfig> {
  const config = await readFile(configPath, "utf8");

  return {
    description:
      yamlString(config, "description") ??
      "Hypermedia-first libraries and templates for Hono, HTMX, Bun, TypeScript, and JSX.",
    title: yamlString(config, "title") ?? "Hyper-Dank",
  };
}

function renderDocument({
  basePath,
  content,
  description,
  siteTitle,
  title,
}: {
  basePath: string;
  content: string;
  description: string;
  siteTitle: string;
  title: string;
}) {
  const documentTitle = title ? `${escapeHtml(title)} | ${escapeHtml(siteTitle)}` : siteTitle;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${documentTitle}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="icon" type="image/svg+xml" href="${relativeContentUrl("/assets/favicon.svg", basePath)}" />
    <script>
      (() => {
        try {
          const storedTheme = localStorage.getItem("hyper-dank-docs-theme");
          const theme =
            storedTheme === "dark" ||
            (storedTheme !== "light" && matchMedia("(prefers-color-scheme: dark)").matches)
              ? "dark"
              : "light";
          document.documentElement.dataset.theme = theme;
          document.documentElement.style.colorScheme = theme;
        } catch {}
      })();
    </script>
    <link rel="stylesheet" href="${relativeContentUrl("/assets/site.css", basePath)}" />
    ${codeHighlightingHtml()}
    <script defer src="${relativeContentUrl("/assets/site.js", basePath)}"></script>
  </head>
  <body>
    <header class="site-header">
      <nav class="site-nav" aria-label="Primary">
        <a class="brand" href="${relativeContentUrl("/", basePath)}" aria-label="Hyper-Dank home">
          <span class="brand-mark" aria-hidden="true"></span>
          <span>Hyper-Dank</span>
        </a>
        <div class="site-actions">
          ${themeToggleHtml()}
          <details class="nav-menu">
            <summary class="nav-menu__summary">Menu</summary>
            <div class="nav-menu__panel">
              <a href="${relativeContentUrl("/", basePath)}">Docs home</a>
              <a href="${relativeContentUrl("/libraries/", basePath)}">Libraries</a>
              <a href="${relativeContentUrl("/recipes/", basePath)}">Recipes</a>
              <a href="${relativeContentUrl("/system/", basePath)}">System</a>
              <a href="${relativeContentUrl("/verification/", basePath)}">Verification</a>
              <a href="${relativeContentUrl("/pace/", basePath)}">Pace demo</a>
              <a href="${relativeContentUrl("/storybook/", basePath)}">Storybook</a>
            </div>
          </details>
        </div>
      </nav>
    </header>
    <main class="site-main">
      ${content}
    </main>
  </body>
</html>
`;
}

function yamlString(config: string, key: string) {
  const match = new RegExp(`^${key}:\\s*(.*)$`, "m").exec(config);
  const value = match?.at(1);
  return value === undefined ? undefined : unquoteYamlString(value);
}

function unquoteYamlString(value: string) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function codeHighlightingHtml() {
  return `<link
      id="highlight-theme-light"
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css"
    />
    <link
      id="highlight-theme-dark"
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css"
      disabled
    />
    <script
      defer
      src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"
    ></script>`;
}

function themeToggleHtml() {
  return `<label class="theme-toggle" for="theme-toggle">
            <span class="theme-toggle__label">Colour mode</span>
            <input id="theme-toggle" class="theme-toggle__input" type="checkbox" role="switch" aria-label="Colour mode" aria-checked="false" data-theme-toggle />
            <span class="theme-toggle__track" aria-hidden="true">
              <span class="theme-toggle__icon theme-toggle__icon--light">☀</span>
              <span class="theme-toggle__icon theme-toggle__icon--dark">☾</span>
              <span class="theme-toggle__thumb"></span>
            </span>
          </label>`;
}
