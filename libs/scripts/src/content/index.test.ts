import { describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  buildStaticContentSite,
  discoverMarkdownPages,
  outputPathForContentPage,
  parseFrontMatter,
  renderInlineMarkdown,
  renderMarkdown,
  rewriteContentUrl,
  safeDestinationPath,
  titleFromFilename,
} from ".";

describe("front matter", () => {
  test("parses quoted and unquoted string metadata while preserving the body", () => {
    expect(
      parseFrontMatter('---\ntitle: "Release Notes"\npermalink: /notes/\n---\n\n# Notes\n'),
    ).toEqual({
      body: "\n# Notes\n",
      frontMatter: {
        permalink: "/notes/",
        title: "Release Notes",
      },
    });
  });

  test("returns empty metadata when front matter is absent or incomplete", () => {
    expect(parseFrontMatter("# Plain")).toEqual({ body: "# Plain", frontMatter: {} });
    expect(parseFrontMatter("---\ntitle: Missing end\n# Plain")).toEqual({
      body: "---\ntitle: Missing end\n# Plain",
      frontMatter: {},
    });
  });
});

describe("markdown rendering", () => {
  test("renders headings, lists, tables, code fences, inline marks, links, and raw HTML", () => {
    const html = renderMarkdown(
      [
        "# Libraries",
        "",
        "See [Storybook](/storybook/), **strong copy**, and `Button`.",
        "",
        "- First",
        "- Second",
        "",
        "1. One",
        "2. Two",
        "",
        "| Export | Purpose |",
        "| --- | --- |",
        "| `Button` | Action |",
        "",
        "```ts",
        "const value = '<safe>';",
        "```",
        "",
        "<section>",
        "<a href=\"{{ '/pace/' | relative_url }}\">Demo</a>",
        "</section>",
      ].join("\n"),
      { basePath: "/hyper-dank" },
    );

    expect(html).toContain("<h1>Libraries</h1>");
    expect(html).toContain('<a href="/hyper-dank/storybook/">Storybook</a>');
    expect(html).toContain("<strong>strong copy</strong>");
    expect(html).toContain("<code>Button</code>");
    expect(html).toContain("<ul>");
    expect(html).toContain("<ol>");
    expect(html).toContain('<div class="table-scroll" tabindex="0">');
    expect(html).toContain("const value = '&lt;safe&gt;';");
    expect(html).toContain("<section>");
    expect(html).toContain('<a href="/hyper-dank/pace/">Demo</a>');
    expect(html).not.toContain("&lt;section");
  });

  test("escapes paragraph HTML while preserving raw HTML blocks", () => {
    const html = renderMarkdown("Copy with <unsafe> text.\n\n<div>Trusted block</div>");

    expect(html).toContain("<p>Copy with &lt;unsafe&gt; text.</p>");
    expect(html).toContain("<div>Trusted block</div>");
  });
});

describe("inline markdown and URLs", () => {
  test("renders inline links, code spans, strong text, and rewritten root-relative URLs", () => {
    expect(
      renderInlineMarkdown("Read [docs](/docs/) with `code` and **care**.", {
        basePath: "/hyper-dank",
      }),
    ).toBe(
      'Read <a href="/hyper-dank/docs/">docs</a> with <code>code</code> and <strong>care</strong>.',
    );
  });

  test("leaves absolute and hash URLs alone while supporting Liquid relative_url values", () => {
    expect(rewriteContentUrl("https://example.com", { basePath: "/hyper-dank" })).toBe(
      "https://example.com",
    );
    expect(rewriteContentUrl("#section", { basePath: "/hyper-dank" })).toBe("#section");
    expect(
      rewriteContentUrl("{{ '/libraries/' | relative_url }}", { basePath: "/hyper-dank" }),
    ).toBe("/hyper-dank/libraries/");
  });
});

describe("page discovery and route helpers", () => {
  test("derives pretty output paths and titles", () => {
    expect(outputPathForContentPage("index.md")).toBe("index.html");
    expect(outputPathForContentPage("release-notes.md")).toBe("release-notes/index.html");
    expect(outputPathForContentPage("ignored.md", "/libraries/ui/")).toBe(
      "libraries/ui/index.html",
    );
    expect(titleFromFilename("release-notes.md")).toBe("Release Notes");
  });

  test("discovers markdown pages with sorted output paths", async () => {
    const tmp = await mkdtemp(path.join(os.tmpdir(), "hyper-dank-content-"));

    await writeFile(path.join(tmp, "z-notes.md"), "---\ntitle: Notes\n---\n\n# Notes\n");
    await writeFile(path.join(tmp, "index.md"), "---\ntitle: Home\npermalink: /\n---\n\n# Home\n");
    await writeFile(path.join(tmp, "asset.txt"), "skip me");

    const pages = await discoverMarkdownPages({ sourceDir: tmp });

    expect(pages.map((page) => page.outputPath)).toEqual(["index.html", "z-notes/index.html"]);
    expect(pages[0]).toMatchObject({
      body: "# Home",
      frontMatter: { permalink: "/", title: "Home" },
      title: "Home",
    });
  });
});

describe("static content build", () => {
  test("writes pretty routes, uses app-owned document rendering, and copies assets", async () => {
    const tmp = await mkdtemp(path.join(os.tmpdir(), "hyper-dank-content-build-"));
    const sourceDir = path.join(tmp, "site");
    const destinationDir = path.join(tmp, "public");

    await mkdir(path.join(sourceDir, "assets"), { recursive: true });
    await writeFile(
      path.join(sourceDir, "index.md"),
      "---\ntitle: Home\n---\n\n# Hello\n\n[Demo](/demo/)\n",
    );
    await writeFile(path.join(sourceDir, "assets/site.css"), "body { color: black; }\n");

    const pages = await buildStaticContentSite({
      assets: [{ from: path.join(sourceDir, "assets"), to: "assets" }],
      basePath: "/hyper-dank",
      destinationDir,
      renderDocument: ({ content, page }) =>
        `<!doctype html><title>${page.title}</title>${content}`,
      sourceDir,
    });

    expect(pages.map((page) => page.outputPath)).toEqual(["index.html"]);
    await expect(readFile(path.join(destinationDir, "index.html"), "utf8")).resolves.toContain(
      '<a href="/hyper-dank/demo/">Demo</a>',
    );
    await expect(readFile(path.join(destinationDir, "assets/site.css"), "utf8")).resolves.toContain(
      "body",
    );
  });

  test("rejects page and asset destinations outside the output directory", async () => {
    const tmp = await mkdtemp(path.join(os.tmpdir(), "hyper-dank-content-escape-"));
    const sourceDir = path.join(tmp, "site");
    const destinationDir = path.join(tmp, "public");

    await mkdir(path.join(sourceDir, "assets"), { recursive: true });
    await writeFile(
      path.join(sourceDir, "escape.md"),
      "---\ntitle: Escape\npermalink: ../escaped\n---\n\n# Escape\n",
    );
    await writeFile(path.join(sourceDir, "assets/site.css"), "body { color: black; }\n");

    await expect(
      buildStaticContentSite({
        destinationDir,
        renderDocument: ({ content }) => content,
        sourceDir,
      }),
    ).rejects.toThrow("Static content destination escapes output directory: ../escaped/index.html");

    await writeFile(path.join(sourceDir, "index.md"), "---\ntitle: Home\n---\n\n# Home\n");
    await writeFile(path.join(sourceDir, "escape.md"), "---\ntitle: Escape\n---\n\n# Escape\n");

    await expect(
      buildStaticContentSite({
        assets: [{ from: path.join(sourceDir, "assets"), to: "../assets" }],
        destinationDir,
        renderDocument: ({ content }) => content,
        sourceDir,
      }),
    ).rejects.toThrow("Static content destination escapes output directory: ../assets");
  });

  test("rejects absolute destinations", () => {
    expect(() => safeDestinationPath("/tmp/site", "/tmp/outside.html")).toThrow(
      "Static content destination must be relative: /tmp/outside.html",
    );
  });
});
