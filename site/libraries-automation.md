---
layout: default
title: Automation Library
permalink: /libraries/automation/
---

# Automation Library

`@macavitymadcap/hyper-dank-automation` contains reusable Bun automation helpers for Hyper-Dank
apps. It keeps local script entrypoints small while app-specific routes, fixtures, and deployment
choices remain in the app.

<div class="library-layout">
<details class="library-side-nav" open>
  <summary>Library docs</summary>
  <nav aria-label="Library docs">
    <a href="{{ '/libraries/' | relative_url }}">Overview</a>
    <a href="{{ '/libraries/ui/' | relative_url }}">UI</a>
    <a href="{{ '/libraries/data/' | relative_url }}">Data</a>
    <a href="{{ '/libraries/transport/' | relative_url }}">Transport</a>
    <a aria-current="page" href="{{ '/libraries/automation/' | relative_url }}">Automation</a>
  </nav>
</details>

<div class="library-page">

```ts
import {
  buildImagesSection,
  getGitHubRepo,
  getGitHubToken,
  runVerification,
  updateImagesSection,
  waitForHttp,
} from "@macavitymadcap/hyper-dank-automation";

import {
  buildStaticContentSite,
  escapeHtml,
  renderMarkdown,
} from "@macavitymadcap/hyper-dank-automation/content";
```

## Helper Groups

| Group | Purpose |
| --- | --- |
| Process helpers | Run sync and async commands with predictable cwd, env, stdio, captured output, and allow-failure behaviour. |
| GitHub helpers | Parse repository remotes, discover tokens, make REST requests, find pull requests, and update PR bodies. |
| Verification helpers | Run ordered gates, stop on failure, and render Markdown verification reports. |
| Local server helpers | Start Bun test servers on dynamic ports and wait for HTTP readiness. |
| Browser helpers | Orchestrate Playwright screenshot flows and theme setup. |
| PR image helpers | Build and replace Markdown image sections for persisted PR screenshots. |
| A11y helpers | Run Pa11y with optional config paths and auth cookies while app routes stay local. |
| Content helpers | Parse front matter, render Markdown, rewrite content URLs, discover Markdown pages, and build static content through an app-owned document renderer. |

## Walking Pace Example

```ts
import { runVerification } from "@macavitymadcap/hyper-dank-automation";

const results = await runVerification([
  { id: "check", name: "Static Checks", tooling: "Biome", command: "bun", args: ["run", "check"] },
]);
```

## Compatibility Example

```ts
import {
  buildImagesSection,
  parseGitHubRepo,
  renderVerificationReport,
  waitForHttp,
} from "@macavitymadcap/hyper-dank-automation";

const repo = parseGitHubRepo("Macavitymadcap/hyper-dank");
const report = renderVerificationReport([], "/workspace");
await waitForHttp("http://127.0.0.1:3000/healthz");
buildImagesSection({ branch: "main", repo, flows: [], screenshots: [] });
```

## Content Example

```ts
import {
  buildStaticContentSite,
  escapeHtml,
  renderMarkdown,
} from "@macavitymadcap/hyper-dank-automation/content";

renderMarkdown("# Release notes", { basePath: "/docs" });

await buildStaticContentSite({
  assets: [{ from: "site/assets", to: "assets" }],
  basePath: "/docs",
  destinationDir: "public",
  renderDocument: ({ content, page }) =>
    `<!doctype html><title>${escapeHtml(page.title)}</title>${content}`,
  sourceDir: "site",
});
```

The `/content` subpath includes `parseFrontMatter`, `renderMarkdown`, `renderInlineMarkdown`,
`rewriteContentUrl`, `relativeContentUrl`, `discoverMarkdownPages`, `outputPathForContentPage`,
`titleFromFilename`, and `buildStaticContentSite`. These helpers return strings or typed page
models and throw normal filesystem errors with the source paths supplied by the caller when files
cannot be read or written.

## Adoption Boundary

| Shared Package | Consuming App |
| --- | --- |
| Process execution and verification report mechanics. | Which commands prove a product change. |
| GitHub request helpers and PR-body section replacement. | PR narrative, release policy, and review expectations. |
| Dynamic local server and browser helpers. | App routes, seeded users, fixtures, and smoke journeys. |
| Pa11y runner wrapper. | A11y configuration and product-specific authentication cookies. |
| Markdown, URL, route, and static-content build mechanics. | Document chrome, navigation, CSS, deployment layout, taxonomy, RSS, search, and product metadata. |

For app-shape examples, see [`/recipes/`]({{ '/recipes/' | relative_url }}).

</div>
</div>
