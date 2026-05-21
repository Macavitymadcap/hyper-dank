# Hyper-Dank Scripts

Reusable Bun automation helpers for Hyper-Dank apps.

```ts
import {
  buildImagesSection,
  getGitHubRepo,
  getGitHubToken,
  runVerification,
  waitForHttp,
} from "@macavitymadcap/hyper-dank-automation";
```

## Helper Groups

- `process`: synchronous and asynchronous command execution with captured output, inherited stdio,
  and allow-failure handling.
- `github`: GitHub remote parsing, token lookup, REST requests, and current-branch pull request
  discovery.
- `verification`: ordered verification gates with stop-on-failure behaviour and Markdown report
  rendering, plus small gate builders for command-based checks.
- `local-server`: dynamic Bun server startup, app server harness setup/teardown, and HTTP readiness
  polling.
- `browser`: Playwright screenshot flow orchestration for light and dark theme states, with target
  summaries for PR evidence.
- `pr-images`: PR image table generation and body section replacement.
- `pa11y`: a small Pa11y runner wrapper that supports named targets, config paths, and auth cookies.
- `static-site`: static artifact assertions and smoke checks for generated HTML directories.
- `content`: Markdown, front matter, URL, route, page discovery, and static-content build helpers
  from `@macavitymadcap/hyper-dank-automation/content`.

## Static Content Helpers

```ts
import {
  buildStaticContentSite,
  discoverMarkdownPages,
  escapeHtml,
  renderMarkdown,
} from "@macavitymadcap/hyper-dank-automation/content";

const pages = await discoverMarkdownPages({ sourceDir: "site" });

await buildStaticContentSite({
  assets: [{ from: "site/assets", to: "assets" }],
  basePath: "/docs",
  destinationDir: "public",
  renderDocument: ({ content, page }) =>
    `<!doctype html><title>${escapeHtml(page.title)}</title>${content}`,
  sourceDir: "site",
});

renderMarkdown("# Hello", { basePath: "/docs" });
```

The content subpath owns reusable mechanics only. Apps still own their document shell, navigation,
CSS, deployment layout, content taxonomy, RSS/search decisions, and any product-specific metadata.

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
  createCommandGate,
  parseGitHubRepo,
  renderVerificationReport,
  smokeStaticSite,
  summariseScreenshotTargets,
  waitForHttp,
} from "@macavitymadcap/hyper-dank-automation";

const repo = parseGitHubRepo("Macavitymadcap/hyper-dank");
const gate = createCommandGate("check", "Static Checks", "bun", ["run", "check"], "Biome");
const report = renderVerificationReport([{ ...gate, status: "not run", stdout: "", stderr: "" }], "/workspace");
await waitForHttp("http://127.0.0.1:3000/healthz");
await smokeStaticSite({ root: "dist", routes: [{ path: "index.html" }] });
summariseScreenshotTargets([{ id: "home", label: "Home", description: "Home", states: [] }]);
buildImagesSection({ branch: "main", repo, flows: [], screenshots: [] });
```

## Character Sheet-Style Consumer Example

```ts
import { startBunServer, waitForHttp } from "@macavitymadcap/hyper-dank-automation";

const server = startBunServer({
  fetch: (request) => app.fetch(request),
});

try {
  await waitForHttp(`${server.url}/healthz`);
} finally {
  server.server.stop(true);
}
```

## Adoption Boundary

Keep app-specific knowledge local: seeded users, route paths, browser flows, and deployment targets.
Shared helpers should own mechanics such as command execution, GitHub requests, verification
reporting, server readiness, screenshots, Pa11y invocation, PR image Markdown, and generic static
content rendering.
