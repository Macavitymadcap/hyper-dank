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
<details class="docs-side-nav library-side-nav" open>
  <summary aria-label="Toggle library docs navigation"><span class="docs-side-nav__icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M4 5.5c3 0 5 .7 8 2.2 3-1.5 5-2.2 8-2.2v12c-3 0-5 .7-8 2.2-3-1.5-5-2.2-8-2.2z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"/></svg></span><span class="docs-side-nav__label">Library docs</span><span class="docs-side-nav__mobile-label">Libraries</span></summary>
  <nav aria-label="Library docs">
    <a href="{{ '/libraries/' | relative_url }}">Overview</a>
    <a href="{{ '/libraries/ui/' | relative_url }}">UI</a>
    <a href="{{ '/libraries/data/' | relative_url }}">Data</a>
    <a href="{{ '/libraries/transport/' | relative_url }}">Transport</a>
    <a aria-current="page" href="{{ '/libraries/automation/' | relative_url }}">Automation</a>
  </nav>
</details>

<div class="library-page">

## Install

Install from npm with TypeScript-aware tooling:

```bash
bun add @macavitymadcap/hyper-dank-automation typescript
```

```ts
import {
  buildImagesSection,
  createCommandGate,
  getGitHubRepo,
  getGitHubToken,
  runPa11yTargets,
  runVerification,
  smokeStaticSite,
  summariseScreenshotTargets,
  updateImagesSection,
  waitForHttp,
} from "@macavitymadcap/hyper-dank-automation";

import {
  buildAccessibilityStatementPage,
  buildStaticContentSite,
  createContentNavigation,
  escapeHtml,
  renderAccessibilityStatementMarkdown,
  renderChoiceListMarkdown,
  renderMarkdown,
} from "@macavitymadcap/hyper-dank-automation/content";
```

## Helper Groups

| Group | Purpose |
| --- | --- |
| Process helpers | Run sync and async commands with predictable cwd, env, stdio, captured output, and allow-failure behaviour. |
| GitHub helpers | Parse repository remotes, discover tokens, make REST requests, find pull requests, and update PR bodies. |
| Verification helpers | Run ordered gates, stop on failure, build command gates, and render Markdown verification reports. |
| Local server helpers | Start Bun test servers, wrap app server setup/teardown, and wait for HTTP readiness. |
| Browser helpers | Orchestrate Playwright screenshot flows, theme setup, and target summaries. |
| PR image helpers | Build and replace Markdown image sections for persisted PR screenshots. |
| A11y helpers | Run Pa11y for one URL or named target lists with optional config paths and auth cookies while app routes stay local. |
| Static-site helpers | Assert generated static artifacts and smoke-check expected file contents. |
| Content helpers | Parse front matter, render Markdown, rewrite content URLs, discover Markdown pages, and build static content through an app-owned document renderer. |

## Main Export Reference

### Process

| Export | Contract |
| --- | --- |
| `RunOptions` | Options shared by process helpers: `cwd`, `env`, `input`, `stdio`, and `allowFailure`. |
| `RunResult` | Captured `stdout`, `stderr`, and `exitCode` from sync commands. |
| `run` | Runs a command synchronously and returns trimmed stdout. Throws on non-zero exit unless `allowFailure` is true. |
| `runResult` | Runs a command synchronously and returns `RunResult` without throwing. |
| `runAsync` | Runs a command asynchronously with inherited stdio by default. Throws on non-zero exit unless `allowFailure` is true. |

### Verification

| Export | Contract |
| --- | --- |
| `VerificationStatus` | `"pass"`, `"fail"`, or `"not run"`. |
| `VerificationGate` | Command gate identity, command, arguments, name, and tooling label. |
| `VerificationGateInput` | Gate input accepted by `createVerificationGate`; `tooling` may be omitted. |
| `VerificationResult` | Gate plus status, output, exit code, and optional duration. |
| `RunVerificationOptions` | Optional cwd, environment, spawn implementation, stop-on-failure behaviour, and result callback. |
| `createVerificationGate` | Fills default tooling for a custom gate object. |
| `createCommandGate` | Builds a command-shaped `VerificationGate`. |
| `runVerification` | Runs gates in order and marks later gates as not run when stop-on-failure is enabled. |
| `renderVerificationReport` | Renders a Markdown report with a summary table and command output sections. |

### Local Servers And Browser Evidence

| Export | Contract |
| --- | --- |
| `StartedBunServer` | Bun server, port, and base URL returned by `startBunServer`. |
| `HttpFetch` | Fetch-compatible function type for readiness polling. |
| `StartBunServerOptions` | Host, port, attempt, and fetch-handler options for an in-process Bun server. |
| `WaitForHttpOptions` | Retry, delay, fetch implementation, and success predicate for readiness checks. |
| `AppServerHarness` | Started app server with URL and async `stop()` callback. |
| `CreateAppServerHarnessOptions` | Start, setup, stop, URL, readiness path, and wait options for app-owned server harnesses. |
| `startBunServer` | Starts an in-process Bun server on a requested or dynamic port. |
| `waitForHttp` | Polls a URL until the response passes the success predicate or times out. |
| `createAppServerHarness` | Starts an app-owned server, runs setup, waits for readiness, and returns a cleanup handle. |
| `dynamicPortCandidate` | Generates deterministic local port candidates from process id and attempt. |
| `Theme` | `"light"` or `"dark"` screenshot theme. |
| `ScreenshotFlowContext` | Page, server, and theme passed to screenshot setup hooks. |
| `ScreenshotStateBehavior` | State label, slug, path, auth user, and setup hooks for one screenshot state. |
| `ScreenshotFlow` | App-owned screenshot flow with label, description, states, and optional setup. |
| `ScreenshotTargetSummary` | Flattened screenshot target metadata for PR summaries. |
| `CaptureScreenshotsOptions` | Base URL, flows, output directory, Playwright page, server, auth setter, and themes. |
| `captureScreenshots` | Runs screenshot flows and writes themed images. |
| `setTheme` | Sets the documented theme localStorage key and HTML data attribute in a Playwright page. |
| `summariseScreenshotTargets` | Returns target summaries without needing a browser. |

### GitHub And PR Images

| Export | Contract |
| --- | --- |
| `GitHubRepo` | Repository owner and name. |
| `GitHubPullRequest` | Minimal PR shape used by local automation. |
| `GitHubFetch` | Fetch-compatible GitHub request function. |
| `GitHubRequestOptions` | Optional fetch implementation for tests. |
| `parseGitHubRepo` | Parses shorthand, SSH, and HTTPS GitHub remote strings. |
| `getGitHubRepo` | Reads the current `origin` remote and parses it. |
| `getGitHubToken` | Reads `GITHUB_TOKEN`, `GH_TOKEN`, or the local Git credential helper. |
| `getPullRequest` | Finds the explicit or branch-matching open pull request. |
| `githubRequest` | Sends a GitHub REST request with standard headers and error reporting. |
| `ScreenshotResult` | Persisted screenshot metadata for a captured image. |
| `ScreenshotStateSummary` | PR-body summary of one screenshot state. |
| `ScreenshotFlowSummary` | PR-body summary of one screenshot flow. |
| `BuildImagesSectionOptions` | Repository, branch, flows, and screenshot records for PR image Markdown. |
| `buildImagesSection` | Builds the managed PR screenshots section. |
| `updateImagesSection` | Inserts or replaces the managed PR screenshots section in a PR body. |

### Pa11y And Static Artifacts

| Export | Contract |
| --- | --- |
| `RunPa11yOptions` | Pa11y cwd, env, stdio, config path, cookie, and executable options. |
| `A11yTarget` | Named target with either a path under a base URL or a full URL. |
| `RunPa11yTargetsOptions` | Batch Pa11y options plus base URL and optional runner for tests. |
| `runPa11y` | Runs Pa11y for one URL and passes cookies through `PA11Y_COOKIE`. |
| `runPa11yTargets` | Runs named Pa11y targets and returns checked names and URLs. |
| `StaticArtifactAssertion` | Relative artifact path plus optional required content. |
| `SmokeStaticSiteOptions` | Static root and route assertions for static-site smoke checks. |
| `assertStaticArtifact` | Checks one generated file exists, stays inside the root, and contains expected strings. |
| `smokeStaticSite` | Checks a list of static artifact assertions. |

## Verification Example

```ts
import { createCommandGate, runVerification } from "@macavitymadcap/hyper-dank-automation";

const results = await runVerification([
  createCommandGate("check", "Static Checks", "bun", ["run", "check"], "Biome"),
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
const report = renderVerificationReport(
  [{ ...gate, status: "not run", stdout: "", stderr: "" }],
  "/workspace",
);
await waitForHttp("http://127.0.0.1:3000/healthz");
await smokeStaticSite({ root: "dist", routes: [{ path: "index.html" }] });
summariseScreenshotTargets([{ id: "home", label: "Home", description: "Home", states: [] }]);
buildImagesSection({ branch: "main", repo, flows: [], screenshots: [] });
```

`createCommandGate()` builds the common command-shaped verification entries used by
`runVerification()`, while `renderVerificationReport()` turns completed or pending gate results into
Markdown. `smokeStaticSite()` and `assertStaticArtifact()` are for generated local directories; they
check relative paths and reject paths that escape the static root. `summariseScreenshotTargets()`
describes app-owned screenshot flows for PR evidence without needing a browser page.

`runVerification()` runs gates in order and stops after the first failure. Each gate returns an id,
name, status, stdout, stderr, and optional duration. Command gates accept a command, arguments, cwd,
environment, display tooling name, and optional allow-failure setting, so apps can build local
verifiers without duplicating process handling.

`getGitHubRepo()` and `parseGitHubRepo()` understand normal GitHub remote formats and return an
owner/name pair. `getGitHubToken()` reads the token source used by local scripts, while
`githubRequest()` applies the standard GitHub API headers. Higher-level helpers such as
`getPullRequest()` and PR body update utilities keep app scripts focused on which section to update
and what evidence to attach.

`waitForHttp(url)` polls until a local route is ready or times out. Pair it with `startBunServer()`
or an app-owned server command when a script needs to start a temporary review app, run checks, and
tear it down predictably.

For accessibility batches, pass named targets to `runPa11yTargets()`:

```ts
await runPa11yTargets(
  [
    { name: "Home", path: "/" },
    { name: "Admin", path: "/admin", cookie: "session=admin" },
  ],
  { baseUrl: "http://127.0.0.1:3000", configPath: "pa11y-config.cjs" },
);
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

renderAccessibilityStatementMarkdown({
  contact: "Open an issue.",
  knownLimitations: ["Third-party embeds may vary."],
  siteName: "Docs",
  statementDate: "2026-05-21",
  supportSummary: "Docs uses semantic HTML and keyboard reachable controls.",
  testing: ["Pa11y checks", "Keyboard review"],
});

createContentNavigation(
  [
    { href: "/chapter-1/", label: "Chapter one", order: 1 },
    { href: "/chapter-2/", label: "Chapter two", order: 2 },
  ],
  "/chapter-1/",
);

renderChoiceListMarkdown([{ href: "/start/", label: "Begin" }]);
```

The `/content` subpath includes `parseFrontMatter`, `renderMarkdown`, `renderInlineMarkdown`,
`rewriteContentUrl`, `relativeContentUrl`, `discoverMarkdownPages`, `outputPathForContentPage`,
`titleFromFilename`, `safeDestinationPath`, `buildStaticContentSite`,
`renderAccessibilityStatementMarkdown`, `buildAccessibilityStatementPage`,
`createContentNavigation`, `renderChoiceListMarkdown`, `escapeHtml`, and `escapeAttribute`.
These helpers return strings or typed page models and throw normal filesystem errors with the
source paths supplied by the caller when files cannot be read or written.

## Content Subpath Reference

| Export | Contract |
| --- | --- |
| `ContentUrlOptions` | Base path option used by URL and Markdown render helpers. |
| `RenderMarkdownOptions` | Markdown render options; currently extends `ContentUrlOptions`. |
| `FrontMatterResult` | Parsed front matter metadata plus Markdown body. |
| `ContentPage` | Discovered content page metadata, source path, output path, route, title, and rendered content. |
| `AccessibilityStatementInput` | App-owned accessibility statement evidence and contact details. |
| `BuildAccessibilityStatementPageOptions` | Output, route, and statement inputs for a static accessibility page. |
| `OrderedContentItem` | Ordered item used for previous/next navigation. |
| `ContentNavigation` | Previous and next item output from `createContentNavigation`. |
| `ChoiceListItem` | Link and label used by `renderChoiceListMarkdown`. |
| `DiscoverMarkdownPagesOptions` | Source directory for page discovery. |
| `StaticContentAsset` | Source and destination asset copy instruction. |
| `RenderStaticContentDocumentOptions` | Page, content, and base path passed to an app-owned document renderer. |
| `BuildStaticContentSiteOptions` | Source, destination, base path, assets, and document renderer for static builds. |
| `buildStaticContentSite` | Discovers Markdown pages, renders content, writes pretty routes, and copies assets. |
| `buildAccessibilityStatementPage` | Renders and writes a static accessibility statement page. |
| `renderAccessibilityStatementMarkdown` | Turns app-owned accessibility evidence into Markdown. |
| `createContentNavigation` | Builds previous/next links from ordered content around the current URL. |
| `renderChoiceListMarkdown` | Renders a Markdown list of choices for static docs or branching content. |
| `discoverMarkdownPages` | Reads Markdown files from a directory and derives route metadata. |
| `outputPathForContentPage` | Converts file names and permalinks into pretty output paths. |
| `safeDestinationPath` | Resolves a destination path and rejects escapes outside the output directory. |
| `renderMarkdown` | Renders headings, tables, lists, code, inline formatting, links, and allowed raw HTML blocks. |
| `parseFrontMatter` | Parses simple YAML-style string front matter and returns body Markdown. |
| `renderInlineMarkdown` | Renders inline links, code, and emphasis. |
| `rewriteContentUrl` | Applies docs base paths to root-relative and Liquid `relative_url` links. |
| `relativeContentUrl` | Joins a root-relative URL with a base path. |
| `titleFromFilename` | Converts a Markdown filename into title text. |
| `escapeHtml` | Escapes text for HTML content. |
| `escapeAttribute` | Escapes text for HTML attributes. |

`buildStaticContentSite()` accepts the source directory, destination directory, base path, assets,
and an app-owned document renderer. The helper discovers Markdown pages, renders Markdown, rewrites
content URLs, writes pretty route output, and copies assets. The app still owns layout, CSS, search,
feeds, accessibility evidence and claims, and any content model beyond front matter plus Markdown.

## Adoption Boundary

| Shared Package | Consuming App |
| --- | --- |
| Process execution and verification report mechanics. | Which commands prove a product change. |
| GitHub request helpers and PR-body section replacement. | PR narrative, release policy, and review expectations. |
| Dynamic local server and browser helpers. | App routes, seeded users, fixtures, and smoke journeys. |
| Pa11y runner wrapper. | A11y configuration and product-specific authentication cookies. |
| Markdown, URL, route, accessibility statement, and static-content build mechanics. | Document chrome, CSS, deployment layout, taxonomy, RSS, search, accessibility evidence, legal claims, and product metadata. |

For app-shape examples, see [`/recipes/`]({{ '/recipes/' | relative_url }}).

</div>
</div>
