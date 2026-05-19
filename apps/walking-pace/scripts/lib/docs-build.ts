import { existsSync } from "node:fs";
import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
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

interface SitePage {
  content: string;
  outputPath: string;
  title: string;
}

export async function buildDocsSite({ basePath, destinationDir, sourceDir }: BuildDocsOptions) {
  const normalizedBasePath = normalizePagesBasePath(basePath);
  const siteConfig = await readSiteConfig(path.join(sourceDir, "_config.yml"));
  const pages = await readSitePages(sourceDir);

  await rm(destinationDir, { force: true, recursive: true });
  await mkdir(destinationDir, { recursive: true });

  for (const page of pages) {
    const pageHtml = renderMarkdown(page.content, normalizedBasePath);
    const documentHtml = renderDocument({
      basePath: normalizedBasePath,
      content: pageHtml,
      description: siteConfig.description,
      siteTitle: siteConfig.title,
      title: page.title,
    });
    const outputPath = path.join(destinationDir, page.outputPath);

    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, documentHtml);
  }

  const assetsDir = path.join(sourceDir, "assets");
  if (existsSync(assetsDir)) {
    await cp(assetsDir, path.join(destinationDir, "assets"), { recursive: true });
  }

  await writeFile(path.join(destinationDir, ".nojekyll"), "");
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

async function readSitePages(sourceDir: string): Promise<SitePage[]> {
  const entries = await readdir(sourceDir, { withFileTypes: true });
  const pages: SitePage[] = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;

    const filePath = path.join(sourceDir, entry.name);
    const { frontMatter, body } = parseFrontMatter(await readFile(filePath, "utf8"));
    const permalink = frontMatter.permalink;
    const outputPath = outputPathForPage(entry.name, permalink);

    pages.push({
      content: body.trim(),
      outputPath,
      title: frontMatter.title ?? titleFromFilename(entry.name),
    });
  }

  return pages.sort((a, b) => a.outputPath.localeCompare(b.outputPath));
}

function outputPathForPage(fileName: string, permalink?: string) {
  if (permalink) {
    const trimmed = permalink.replace(/^\/+/, "").replace(/\/+$/, "");
    return trimmed === "" ? "index.html" : path.join(trimmed, "index.html");
  }

  if (fileName === "index.md") return "index.html";
  return path.join(fileName.replace(/\.md$/, ""), "index.html");
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
    <link rel="stylesheet" href="${relativeUrl("/assets/site.css", basePath)}" />
    ${codeHighlightingHtml()}
    <script defer src="${relativeUrl("/assets/site.js", basePath)}"></script>
  </head>
  <body>
    <header class="site-header">
      <nav class="site-nav" aria-label="Primary">
        <a class="brand" href="${relativeUrl("/", basePath)}">Hyper-Dank</a>
        <div class="site-actions">
          <div class="nav-links">
            <a href="${relativeUrl("/libraries/", basePath)}">Libraries</a>
            <a href="${relativeUrl("/recipes/", basePath)}">Recipes</a>
            <a href="${relativeUrl("/system/", basePath)}">System</a>
            <a href="${relativeUrl("/pace/", basePath)}">Pace Demo</a>
            <a href="${relativeUrl("/storybook/", basePath)}">Storybook</a>
          </div>
          ${themeToggleHtml()}
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

export function renderMarkdown(markdown: string, basePath = "") {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let paragraph: string[] = [];
  let list: "ul" | "ol" | undefined;
  let table: string[][] = [];
  let codeBlock: { language: string; lines: string[] } | undefined;
  let rawParagraphOpen = false;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const content = renderInline(paragraph.join(" "), basePath);
    html.push(rawParagraphOpen ? content : `<p>${content}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!list) return;
    html.push(`</${list}>`);
    list = undefined;
  };

  const flushTable = () => {
    if (table.length === 0) return;
    const [head, separator, ...body] = table;

    if (head && separator?.every((cell) => /^:?-{3,}:?$/.test(cell.trim()))) {
      html.push("<table>");
      html.push(
        `<thead><tr>${head.map((cell) => `<th>${renderInline(cell.trim(), basePath)}</th>`).join("")}</tr></thead>`,
      );
      html.push("<tbody>");
      for (const row of body) {
        html.push(
          `<tr>${row.map((cell) => `<td>${renderInline(cell.trim(), basePath)}</td>`).join("")}</tr>`,
        );
      }
      html.push("</tbody></table>");
    } else {
      for (const row of table) html.push(`<p>${renderInline(row.join(" | "), basePath)}</p>`);
    }

    table = [];
  };

  for (const line of lines) {
    const codeFence = /^```(\w+)?\s*$/.exec(line);
    if (codeFence) {
      if (codeBlock) {
        html.push(
          `<pre><code${codeBlock.language ? ` class="language-${escapeAttribute(codeBlock.language)}"` : ""}>${escapeHtml(codeBlock.lines.join("\n"))}</code></pre>`,
        );
        codeBlock = undefined;
      } else {
        flushParagraph();
        flushList();
        flushTable();
        codeBlock = { language: codeFence[1] ?? "", lines: [] };
      }
      continue;
    }

    if (codeBlock) {
      codeBlock.lines.push(line);
      continue;
    }

    if (line.trim() === "") {
      flushParagraph();
      flushList();
      flushTable();
      continue;
    }

    const tableCells = parseTableRow(line);
    if (tableCells) {
      flushParagraph();
      flushList();
      table.push(tableCells);
      continue;
    }
    flushTable();

    const heading = /^(#{1,6})\s+(.+)$/.exec(line);
    if (heading) {
      flushParagraph();
      flushList();
      const marker = heading.at(1);
      const text = heading.at(2);
      if (!marker || !text) continue;
      const level = marker.length;
      html.push(`<h${level}>${renderInline(text, basePath)}</h${level}>`);
      continue;
    }

    const unordered = /^-\s+(.+)$/.exec(line);
    if (unordered) {
      flushParagraph();
      if (list !== "ul") {
        flushList();
        html.push("<ul>");
        list = "ul";
      }
      const item = unordered.at(1);
      if (item) html.push(`<li>${renderInline(item, basePath)}</li>`);
      continue;
    }

    const ordered = /^\d+\.\s+(.+)$/.exec(line);
    if (ordered) {
      flushParagraph();
      if (list !== "ol") {
        flushList();
        html.push("<ol>");
        list = "ol";
      }
      const item = ordered.at(1);
      if (item) html.push(`<li>${renderInline(item, basePath)}</li>`);
      continue;
    }

    if (/^\s*<\/?[a-z][a-z0-9-]*(\s|>|\/>)/i.test(line)) {
      flushParagraph();
      flushList();
      html.push(rewriteLiquidUrls(line, basePath));
      if (/^\s*<p(\s|>)/i.test(line)) rawParagraphOpen = true;
      if (/<\/p>\s*$/i.test(line)) rawParagraphOpen = false;
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph();
  flushList();
  flushTable();

  return html.join("\n");
}

function parseFrontMatter(content: string) {
  if (!content.startsWith("---\n"))
    return { body: content, frontMatter: {} as Record<string, string> };

  const end = content.indexOf("\n---\n", 4);
  if (end === -1) return { body: content, frontMatter: {} as Record<string, string> };

  const frontMatterText = content.slice(4, end);
  const body = content.slice(end + 5);
  const frontMatter: Record<string, string> = {};

  for (const line of frontMatterText.split("\n")) {
    const match = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    const key = match?.at(1);
    const value = match?.at(2);
    if (key && value !== undefined) frontMatter[key] = unquoteYamlString(value);
  }

  return { body, frontMatter };
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

function parseTableRow(line: string) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) return undefined;
  return trimmed
    .slice(1, -1)
    .split("|")
    .map((cell) => cell.trim());
}

function renderInline(value: string, basePath: string) {
  let output = escapeHtml(value);
  output = output.replace(/`([^`]+)`/g, "<code>$1</code>");
  output = output.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  output = output.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_match, text: string, href: string) =>
      `<a href="${escapeAttribute(rewriteUrl(href, basePath))}">${text}</a>`,
  );
  return rewriteLiquidUrls(output, basePath);
}

function rewriteLiquidUrls(value: string, basePath: string) {
  return value.replace(/\{\{\s*'([^']+)'\s*\|\s*relative_url\s*\}\}/g, (_match, url: string) =>
    relativeUrl(url, basePath),
  );
}

function rewriteUrl(url: string, basePath: string) {
  const liquidUrl = /^\{\{\s*'([^']+)'\s*\|\s*relative_url\s*\}\}$/.exec(url);
  const liquidPath = liquidUrl?.at(1);
  if (liquidPath) return relativeUrl(liquidPath, basePath);
  if (/^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith("#")) return url;
  if (url.startsWith("/")) return relativeUrl(url, basePath);
  return url;
}

function relativeUrl(url: string, basePath: string) {
  const normalizedBasePath = normalizePagesBasePath(basePath);
  const normalizedUrl = url.startsWith("/") ? url : `/${url}`;
  if (normalizedBasePath === "") return normalizedUrl;
  if (normalizedUrl === "/") return `${normalizedBasePath}/`;
  return `${normalizedBasePath}${normalizedUrl}`;
}

function titleFromFilename(fileName: string) {
  if (fileName === "index.md") return "";
  return fileName
    .replace(/\.md$/, "")
    .split("-")
    .map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttribute(value: string) {
  return escapeHtml(value).replaceAll("'", "&#39;");
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
  return `<button class="theme-toggle" type="button" data-theme-toggle aria-pressed="false">
            <span class="theme-toggle__icon" aria-hidden="true"></span>
            <span data-theme-toggle-label>Dark</span>
          </button>`;
}
