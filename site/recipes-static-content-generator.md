---
layout: default
title: Static-Content Generator Recipe
permalink: /recipes/static-content-generator/
---

# Static-Content Generator

Use this shape when a static site needs Markdown pages, pretty routes, copied assets, and a custom document shell.

<div class="docs-layout recipe-layout">
<details class="docs-side-nav recipe-side-nav" open>
  <summary aria-label="Toggle recipe navigation"><span class="docs-side-nav__icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2zM9 4v14M15 6v14" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"/></svg></span><span class="docs-side-nav__label">Recipe docs</span><span class="docs-side-nav__mobile-label">Recipes</span></summary>
  <nav aria-label="Recipe docs">
    <a href="{{ '/recipes/' | relative_url }}">Overview</a>
    <a href="{{ '/recipes/server-app/' | relative_url }}">Server app</a>
    <a href="{{ '/recipes/static-blog/' | relative_url }}">Static blog</a>
    <a href="{{ '/recipes/dashboard-admin-tool/' | relative_url }}">Dashboard or admin tool</a>
    <a href="{{ '/recipes/static-demo/' | relative_url }}">Static demo</a>
    <a href="{{ '/recipes/script-consumer/' | relative_url }}">Script consumer</a>
    <a aria-current="page" href="{{ '/recipes/static-content-generator/' | relative_url }}">Static-content generator</a>
  </nav>
</details>

<div class="docs-page recipe-page">

## Required Packages

- `@macavitymadcap/hyper-dank-automation/content` for front matter, Markdown rendering, route output paths, relative URL rewriting, page discovery, and static content builds.
- `@macavitymadcap/hyper-dank-automation` for static artifact smoke checks and local server helpers around the generated output.

```ts
import { buildStaticContentSite, escapeHtml } from "@macavitymadcap/hyper-dank-automation/content";

await buildStaticContentSite({
  assets: [{ from: "site/assets", to: "assets" }],
  basePath: "/docs",
  destinationDir: "public",
  renderDocument: ({ content, page }) =>
    `<!doctype html><title>${escapeHtml(page.title)}</title><main>${content}</main>`,
  sourceDir: "site",
});
```

## App-Owned Responsibilities

The app owns document chrome, CSS, deployment layout, taxonomy, RSS, search, accessibility evidence,
legal claims, and product metadata.

## Verification

Test generated routes, copied assets, rewritten links, important Markdown features, and a local
browser pass over the built artifact.

## References

[Automation]({{ '/libraries/automation/' | relative_url }}),
[Static blog recipe]({{ '/recipes/static-blog/' | relative_url }}), and
[Verification]({{ '/verification/' | relative_url }}).

</div>
</div>
