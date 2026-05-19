import { describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { buildDocsSite, renderMarkdown } from "./docs-build";

describe("docs build", () => {
  test("renders headings, tables, code blocks, and relative URLs", () => {
    const html = renderMarkdown(
      [
        "# Libraries",
        "",
        "See [Storybook](/storybook/) and `Button`.",
        "",
        "| Export | Purpose |",
        "| --- | --- |",
        "| `Button` | Action |",
        "",
        "```ts",
        "const value = '<safe>';",
        "```",
        "",
        "<a href=\"{{ '/pace/' | relative_url }}\">Demo</a>",
      ].join("\n"),
      "/hyper-dank",
    );

    expect(html).toContain("<h1>Libraries</h1>");
    expect(html).toContain('<a href="/hyper-dank/storybook/">Storybook</a>');
    expect(html).toContain('<div class="table-scroll" tabindex="0">');
    expect(html).toContain("<table>");
    expect(html).toContain("<code>Button</code>");
    expect(html).toContain("const value = '&lt;safe&gt;';");
    expect(html).toContain('<a href="/hyper-dank/pace/">Demo</a>');
    expect(html).not.toContain("&lt;a");
  });

  test("preserves raw HTML blocks from existing site markdown", () => {
    const html = renderMarkdown(
      [
        '<section class="hero">',
        "  <h1>Hyper-Dank</h1>",
        '  <p class="lede">',
        "  Copy inside the paragraph.",
        "  </p>",
        "  <a href=\"{{ '/pace/' | relative_url }}\">Demo</a>",
        "</section>",
      ].join("\n"),
      "/hyper-dank",
    );

    expect(html).toContain('<section class="hero">');
    expect(html).toContain('<p class="lede">\nCopy inside the paragraph.\n  </p>');
    expect(html).toContain('<a href="/hyper-dank/pace/">Demo</a>');
    expect(html).not.toContain("&lt;section");
    expect(html).not.toContain("<p><p");
  });

  test("builds pretty routes and copies assets", async () => {
    const tmp = await mkdtemp(path.join(os.tmpdir(), "hyper-dank-docs-"));
    const sourceDir = path.join(tmp, "site");
    const destinationDir = path.join(tmp, "public");

    await mkdir(path.join(sourceDir, "assets"), { recursive: true });
    await writeFile(
      path.join(sourceDir, "_config.yml"),
      'title: Hyper-Dank\ndescription: Docs for tests\nbaseurl: "/old"\n',
    );
    await writeFile(
      path.join(sourceDir, "index.md"),
      "---\nlayout: default\ntitle: Home\n---\n\n# Hello\n",
    );
    await writeFile(
      path.join(sourceDir, "demo.md"),
      "---\nlayout: default\ntitle: Demo\npermalink: /demo/\n---\n\n# Demo\n",
    );
    await writeFile(path.join(sourceDir, "assets/site.css"), "body { color: black; }\n");

    await buildDocsSite({ basePath: "/hyper-dank", destinationDir, sourceDir });

    await expect(readFile(path.join(destinationDir, "index.html"), "utf8")).resolves.toContain(
      '<link rel="stylesheet" href="/hyper-dank/assets/site.css" />',
    );
    await expect(readFile(path.join(destinationDir, "demo/index.html"), "utf8")).resolves.toContain(
      "<h1>Demo</h1>",
    );
    await expect(readFile(path.join(destinationDir, "assets/site.css"), "utf8")).resolves.toContain(
      "body",
    );
    await expect(readFile(path.join(destinationDir, ".nojekyll"), "utf8")).resolves.toBe("");
  });

  test("renders compact docs navigation and checkbox-backed theme switch", async () => {
    const tmp = await mkdtemp(path.join(os.tmpdir(), "hyper-dank-docs-"));
    const sourceDir = path.join(tmp, "site");
    const destinationDir = path.join(tmp, "public");

    await mkdir(path.join(sourceDir, "assets"), { recursive: true });
    await writeFile(
      path.join(sourceDir, "_config.yml"),
      "title: Hyper-Dank\ndescription: Docs for tests\n",
    );
    await writeFile(
      path.join(sourceDir, "index.md"),
      "---\nlayout: default\ntitle: Home\n---\n\n# Hello\n",
    );

    await buildDocsSite({ basePath: "/hyper-dank", destinationDir, sourceDir });

    const html = await readFile(path.join(destinationDir, "index.html"), "utf8");

    expect(html).toContain('<details class="nav-menu">');
    expect(html).toContain('<summary class="nav-menu__summary">Menu</summary>');
    expect(html).toContain('class="theme-toggle__input" type="checkbox" role="switch"');
    expect(html).toContain('href="/hyper-dank/verification/"');
  });
});
