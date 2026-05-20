import { existsSync } from "node:fs";
import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

export interface ContentUrlOptions {
  basePath?: string;
}

export interface RenderMarkdownOptions extends ContentUrlOptions {}

export interface FrontMatterResult {
  body: string;
  frontMatter: Record<string, string>;
}

export interface ContentPage {
  body: string;
  fileName: string;
  filePath: string;
  frontMatter: Record<string, string>;
  outputPath: string;
  title: string;
}

export interface DiscoverMarkdownPagesOptions {
  sourceDir: string;
}

export interface StaticContentAsset {
  from: string;
  to: string;
}

export interface RenderStaticContentDocumentOptions {
  content: string;
  page: ContentPage;
}

export interface BuildStaticContentSiteOptions extends DiscoverMarkdownPagesOptions {
  assets?: StaticContentAsset[];
  basePath?: string;
  destinationDir: string;
  renderDocument(options: RenderStaticContentDocumentOptions): string;
}

export async function buildStaticContentSite({
  assets = [],
  basePath = "",
  destinationDir,
  renderDocument,
  sourceDir,
}: BuildStaticContentSiteOptions) {
  const pages = await discoverMarkdownPages({ sourceDir });

  await rm(destinationDir, { force: true, recursive: true });
  await mkdir(destinationDir, { recursive: true });

  for (const page of pages) {
    const content = renderMarkdown(page.body, { basePath });
    const documentHtml = renderDocument({ content, page });
    const outputPath = safeDestinationPath(destinationDir, page.outputPath);

    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, documentHtml);
  }

  for (const asset of assets) {
    if (!existsSync(asset.from)) continue;
    await cp(asset.from, safeDestinationPath(destinationDir, asset.to), { recursive: true });
  }

  return pages;
}

export async function discoverMarkdownPages({ sourceDir }: DiscoverMarkdownPagesOptions) {
  const entries = await readdir(sourceDir, { withFileTypes: true });
  const pages: ContentPage[] = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;

    const filePath = path.join(sourceDir, entry.name);
    const { frontMatter, body } = parseFrontMatter(await readFile(filePath, "utf8"));
    const permalink = frontMatter.permalink;
    const outputPath = outputPathForContentPage(entry.name, permalink);

    pages.push({
      body: body.trim(),
      fileName: entry.name,
      filePath,
      frontMatter,
      outputPath,
      title: frontMatter.title ?? titleFromFilename(entry.name),
    });
  }

  return pages.sort((a, b) => a.outputPath.localeCompare(b.outputPath));
}

export function outputPathForContentPage(fileName: string, permalink?: string) {
  if (permalink) {
    const trimmed = permalink.replace(/^\/+/, "").replace(/\/+$/, "");
    return trimmed === "" ? "index.html" : path.join(trimmed, "index.html");
  }

  if (fileName === "index.md") return "index.html";
  return path.join(fileName.replace(/\.md$/, ""), "index.html");
}

export function safeDestinationPath(destinationDir: string, relativePath: string) {
  if (path.isAbsolute(relativePath)) {
    throw new Error(`Static content destination must be relative: ${relativePath}`);
  }

  const normalizedDestination = path.resolve(destinationDir);
  const outputPath = path.resolve(normalizedDestination, relativePath);
  const relativeOutput = path.relative(normalizedDestination, outputPath);

  if (relativeOutput === "" || relativeOutput.startsWith("..") || path.isAbsolute(relativeOutput)) {
    throw new Error(`Static content destination escapes output directory: ${relativePath}`);
  }

  return outputPath;
}

export function renderMarkdown(markdown: string, options: RenderMarkdownOptions = {}) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let paragraph: string[] = [];
  let list: "ul" | "ol" | undefined;
  let table: string[][] = [];
  let codeBlock: { language: string; lines: string[] } | undefined;
  let rawParagraphOpen = false;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const content = renderInlineMarkdown(paragraph.join(" "), options);
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
      html.push('<div class="table-scroll" tabindex="0">');
      html.push("<table>");
      html.push(
        `<thead><tr>${head.map((cell) => `<th>${renderInlineMarkdown(cell.trim(), options)}</th>`).join("")}</tr></thead>`,
      );
      html.push("<tbody>");
      for (const row of body) {
        html.push(
          `<tr>${row.map((cell) => `<td>${renderInlineMarkdown(cell.trim(), options)}</td>`).join("")}</tr>`,
        );
      }
      html.push("</tbody></table>");
      html.push("</div>");
    } else {
      for (const row of table)
        html.push(`<p>${renderInlineMarkdown(row.join(" | "), options)}</p>`);
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
      html.push(`<h${level}>${renderInlineMarkdown(text, options)}</h${level}>`);
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
      if (item) html.push(`<li>${renderInlineMarkdown(item, options)}</li>`);
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
      if (item) html.push(`<li>${renderInlineMarkdown(item, options)}</li>`);
      continue;
    }

    if (/^\s*<\/?[a-z][a-z0-9-]*(\s|>|\/>)/i.test(line)) {
      flushParagraph();
      flushList();
      html.push(rewriteLiquidUrls(line, options));
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

export function parseFrontMatter(content: string): FrontMatterResult {
  if (!content.startsWith("---\n")) return { body: content, frontMatter: {} };

  const end = content.indexOf("\n---\n", 4);
  if (end === -1) return { body: content, frontMatter: {} };

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

export function renderInlineMarkdown(value: string, options: ContentUrlOptions = {}) {
  let output = escapeHtml(value);
  output = output.replace(/`([^`]+)`/g, "<code>$1</code>");
  output = output.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  output = output.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_match, text: string, href: string) =>
      `<a href="${escapeAttribute(rewriteContentUrl(href, options))}">${text}</a>`,
  );
  return rewriteLiquidUrls(output, options);
}

export function rewriteContentUrl(url: string, options: ContentUrlOptions = {}) {
  const liquidUrl = /^\{\{\s*'([^']+)'\s*\|\s*relative_url\s*\}\}$/.exec(url);
  const liquidPath = liquidUrl?.at(1);
  if (liquidPath) return relativeContentUrl(liquidPath, options.basePath ?? "");
  if (/^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith("#")) return url;
  if (url.startsWith("/")) return relativeContentUrl(url, options.basePath ?? "");
  return url;
}

export function relativeContentUrl(url: string, basePath = "") {
  const normalizedBasePath = normalizeBasePath(basePath);
  const normalizedUrl = url.startsWith("/") ? url : `/${url}`;
  if (normalizedBasePath === "") return normalizedUrl;
  if (normalizedUrl === "/") return `${normalizedBasePath}/`;
  return `${normalizedBasePath}${normalizedUrl}`;
}

export function titleFromFilename(fileName: string) {
  if (fileName === "index.md") return "";
  return fileName
    .replace(/\.md$/, "")
    .split("-")
    .map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function escapeAttribute(value: string) {
  return escapeHtml(value).replaceAll("'", "&#39;");
}

function normalizeBasePath(basePath: string) {
  const trimmed = basePath.trim();
  if (trimmed === "" || trimmed === "/") return "";
  return `/${trimmed.replace(/^\/+/, "").replace(/\/+$/, "")}`;
}

function parseTableRow(line: string) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) return undefined;
  return trimmed
    .slice(1, -1)
    .split("|")
    .map((cell) => cell.trim());
}

function rewriteLiquidUrls(value: string, options: ContentUrlOptions) {
  return value.replace(/\{\{\s*'([^']+)'\s*\|\s*relative_url\s*\}\}/g, (_match, url: string) =>
    relativeContentUrl(url, options.basePath ?? ""),
  );
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
