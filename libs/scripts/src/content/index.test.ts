import { describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  buildAccessibilityStatementPage,
  buildStaticContentSite,
  createContentNavigation,
  discoverMarkdownPages,
  outputPathForContentPage,
  parseFrontMatter,
  renderAccessibilityStatementMarkdown,
  renderChoiceListMarkdown,
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

    expect(html).toContain('<h1 id="libraries">Libraries</h1>');
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

  test("renders single-asterisk emphasis", () => {
    expect(renderInlineMarkdown("Read *Hypermedia Systems*.")).toBe(
      "Read <em>Hypermedia Systems</em>.",
    );
  });

  test("renders single-asterisk emphasis inside link labels", () => {
    expect(renderInlineMarkdown("[*Hypermedia Systems*](https://example.com)")).toBe(
      '<a href="https://example.com"><em>Hypermedia Systems</em></a>',
    );
  });

  test("preserves code spans, strong text, and unmatched literal asterisks", () => {
    expect(renderInlineMarkdown("Use `*literal*` and **strong** text.")).toBe(
      "Use <code>*literal*</code> and <strong>strong</strong> text.",
    );
    expect(renderInlineMarkdown("A literal * stays literal.")).toBe("A literal * stays literal.");
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

describe("accessibility statements", () => {
  test("renders statement markdown from app-owned evidence", () => {
    const markdown = renderAccessibilityStatementMarkdown({
      contact: "Email accessibility@example.test.",
      knownLimitations: ["Third-party embeds may vary."],
      reviewCadence: "Reviewed before major releases.",
      siteName: "Example Site",
      statementDate: "2026-05-21",
      supportSummary: "Example Site is built with semantic HTML and keyboard reachable controls.",
      testing: ["Pa11y checks on public pages", "Keyboard review on core flows"],
    });

    expect(markdown).toContain("# Accessibility statement for Example Site");
    expect(markdown).toContain("Last reviewed: 2026-05-21");
    expect(markdown).toContain("- Pa11y checks on public pages");
    expect(markdown).toContain("- Third-party embeds may vary.");
    expect(markdown).toContain("Email accessibility@example.test.");
    expect(markdown).not.toContain("fully compliant");
  });

  test("builds a static accessibility statement page", async () => {
    const tmp = await mkdtemp(path.join(os.tmpdir(), "hyper-dank-a11y-statement-"));

    const result = await buildAccessibilityStatementPage({
      destinationDir: tmp,
      renderDocument: ({ content, title }) => `<!doctype html><title>${title}</title>${content}`,
      statement: {
        contact: "Open an issue.",
        siteName: "Docs",
        statementDate: "2026-05-21",
        supportSummary: "Docs uses semantic landmarks.",
      },
    });

    expect(result.outputPath).toBe("accessibility/index.html");
    await expect(readFile(path.join(tmp, "accessibility/index.html"), "utf8")).resolves.toContain(
      '<h1 id="accessibility-statement-for-docs">Accessibility statement for Docs</h1>',
    );
  });
});

describe("authored content helpers", () => {
  test("creates previous and next navigation from ordered content", () => {
    const navigation = createContentNavigation(
      [
        { href: "/chapter-2/", label: "Chapter two", order: 2 },
        { href: "/chapter-1/", label: "Chapter one", order: 1 },
        { href: "/chapter-3/", label: "Chapter three", order: 3 },
      ],
      "/chapter-2/",
    );

    expect(navigation.current.label).toBe("Chapter two");
    expect(navigation.previous?.href).toBe("/chapter-1/");
    expect(navigation.next?.href).toBe("/chapter-3/");
  });

  test("renders a small markdown choice list for branching content", () => {
    expect(
      renderChoiceListMarkdown([
        { href: "/left/", label: "Take the left path", summary: "A quiet corridor." },
        { href: "/right/", label: "Take the right path" },
      ]),
    ).toBe(
      "- [Take the left path](/left/) — A quiet corridor.\n- [Take the right path](/right/)\n",
    );
  });
});
