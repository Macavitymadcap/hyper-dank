---
layout: default
title: App Recipes
---

# App Recipes

Hyper-Dank packages are small on purpose. Applications choose the pieces that match their shape,
then keep product routes, permissions, schemas, copy, fixtures, and deployment decisions in the app.

Use these recipes as adoption maps. They show which public packages compose well together, what the
shared code owns, what the app still owns, and which checks prove the boundary.

## Server App

Use this shape for authenticated Hono apps and workflows where the server owns state.

Useful packages:

- `@macavitymadcap/hyper-dank-ui` for server-rendered controls, panels, forms, menus, and status
  views.
- `@macavitymadcap/hyper-dank-transport` for form values, route params, HTMX detection, and
  progressive redirects.
- `@macavitymadcap/hyper-dank-data` for provider lifecycle, migration planning, repository
  contracts, and adapter test harnesses.
- `@macavitymadcap/hyper-dank-automation` for verification gates, local server readiness, Pa11y,
  screenshots, and PR evidence.

```tsx
import { Button, FormField, HxForm, Panel } from "@macavitymadcap/hyper-dank-ui";

export function SettingsPanel() {
  return (
    <Panel labelledBy="settings-heading">
      <h2 id="settings-heading">Settings</h2>
      <HxForm action="/settings" method="post" hx-post="/settings" hx-target="#settings-panel">
        <FormField id="display-name" label="Display name" name="displayName" required />
        <Button type="submit">Save</Button>
      </HxForm>
    </Panel>
  );
}
```

Start with native HTML first. Add HTMX attributes to the same controls when a fragment response
improves the workflow. Keep auth, permissions, domain validation, route names, schemas, services,
repositories, seeded users, and deployment target in the app.

Verify server apps with route tests for full pages, HTMX contract tests for fragments, repository
contract tests for adapter behaviour, Playwright for browser journeys, and Pa11y for user-facing
screens.

Deeper references:
[UI]({{ '/libraries/ui/' | relative_url }}),
[Transport]({{ '/libraries/transport/' | relative_url }}),
[Data]({{ '/libraries/data/' | relative_url }}), and
[Automation]({{ '/libraries/automation/' | relative_url }}).

## Static Blog

Use this shape for docs, journals, release notes, and content-heavy pages served from static
hosting.

Useful packages:

- `@macavitymadcap/hyper-dank-ui` for article cards, metadata, breadcrumbs, prose, code blocks,
  callouts, timelines, tabs, and empty states.
- `@macavitymadcap/hyper-dank-automation/content` for Markdown rendering, route output paths, URL
  rewriting, page discovery, and static content builds when the app wants a generated site.
- `@macavitymadcap/hyper-dank-automation` for static artifact smoke checks and local script
  plumbing.

```tsx
import { Badge, Card, CompactList, Panel } from "@macavitymadcap/hyper-dank-ui";

export function ArticleSummary() {
  return (
    <Card as="article">
      <Panel labelledBy="post-title">
        <h2 id="post-title">Release notes</h2>
        <Badge tone="neutral">Platform</Badge>
        <CompactList items={[{ label: "Reading time", value: "4 min" }]} />
      </Panel>
    </Card>
  );
}
```

The app owns content collections, front matter schema, taxonomy, navigation, feeds, search, layout,
editorial copy, and publishing workflow. Import `@macavitymadcap/hyper-dank-ui/styles.css` through
the app's asset bundle when you want the baseline component class contracts.

Verify static blogs with content helper tests, generated artifact smoke checks, link checks, and a
browser pass over important responsive article layouts.

## Dashboard Or Admin Tool

Use this shape for dense screens that need repeated scanning, filtering, pagination, and action
review.

Useful packages:

- `@macavitymadcap/hyper-dank-ui` for `AppShell`, `PageHeader`, `SideNav`, `Toolbar`, `HxForm`,
  `ScrollableTable`, `TableCell`, `Pagination`, `StatusSummary`, `Badge`, and `PopoverMenu`.
- `@macavitymadcap/hyper-dank-transport` for GET filters, POST actions, HTMX redirects, and
  fragment-or-page responses.
- `@macavitymadcap/hyper-dank-data` for provider lifecycle and app-owned repository contracts.
- `@macavitymadcap/hyper-dank-automation` for seeded review flows, screenshots, Pa11y, and browser
  checks.

```tsx
import {
  Button,
  FormField,
  HxForm,
  Panel,
  ScrollableTable,
  TableCell,
} from "@macavitymadcap/hyper-dank-ui";

export function AdminList() {
  return (
    <Panel labelledBy="admin-heading">
      <h2 id="admin-heading">Operations</h2>
      <HxForm action="/admin" method="get" hx-get="/admin" hx-target="#admin-results">
        <FormField id="query" label="Search" name="query" />
        <Button type="submit">Filter</Button>
      </HxForm>
      <ScrollableTable columns={[{ key: "name", header: "Name" }]}>
        <tr className="scrollable-table-row">
          <TableCell value="Build checks" />
        </tr>
      </ScrollableTable>
    </Panel>
  );
}
```

The app owns domain tables, filter semantics, roles, audit trails, mutations, destructive-action
policy, empty states, and seeded review data. Shared components provide structure and class hooks;
they do not decide who can act or what a row means.

Verify dashboards with component tests for dense states, route tests for permissions, HTMX tests for
filter and mutation fragments, screenshots for light and dark review states, and Pa11y for the main
admin route.

## Static Demo

Use this shape for GitHub Pages demos or offline examples that should not assume a server.

Useful packages:

- `@macavitymadcap/hyper-dank-ui` for panels, inputs, outputs, buttons, notices, and compact data
  displays.
- `@macavitymadcap/hyper-dank-automation` for static-site smoke checks and local preview scripts.

```tsx
import { Button, InputGroup, LabelledOutput, Panel } from "@macavitymadcap/hyper-dank-ui";

export function DemoForm() {
  return (
    <Panel labelledBy="demo-heading">
      <h2 id="demo-heading">Static demo</h2>
      <InputGroup type="number" name="miles" label="Miles" min={0} step={0.1} placeholder="1.2" />
      <LabelledOutput label="Average speed" value={3.8} />
      <Button type="button" name="action" value="local-add">
        Add
      </Button>
    </Panel>
  );
}
```

The app owns browser state, local persistence, calculation logic, demo copy, routing, and hosting
target. Avoid server-only helpers in the demo runtime; keep build, smoke, and publish mechanics in
scripts.

Verify static demos with storage tests for browser state, a static artifact smoke test, a mobile
browser pass, and an accessibility check for the published route.

## Script Consumer

Use `@macavitymadcap/hyper-dank-automation` when an app needs repeatable local automation without
copying one-off helpers.

```ts
import {
  createCommandGate,
  renderVerificationReport,
  runVerification,
  waitForHttp,
} from "@macavitymadcap/hyper-dank-automation";

const results = await runVerification([
  createCommandGate("check", "Static Checks", "bun", ["run", "check"], "Biome"),
]);

console.log(renderVerificationReport(results));
await waitForHttp("http://127.0.0.1:3000/healthz");
```

The app owns the command list, environment variables, secrets policy, seeded fixtures, smoke
journeys, release process, and PR narrative. Shared helpers own mechanics such as command execution,
GitHub requests, verification reporting, server readiness, screenshots, Pa11y invocation, and PR
image Markdown.

Verify script consumers with fake inputs, no live network services, and command tests that make
failure output clear.

## Static-Content Generator

Use `@macavitymadcap/hyper-dank-automation/content` when a static site needs Markdown pages, pretty
routes, copied assets, and a custom document shell.

```ts
import {
  buildStaticContentSite,
  escapeHtml,
} from "@macavitymadcap/hyper-dank-automation/content";

await buildStaticContentSite({
  assets: [{ from: "site/assets", to: "assets" }],
  basePath: "/docs",
  destinationDir: "public",
  renderDocument: ({ content, page }) =>
    `<!doctype html><title>${escapeHtml(page.title)}</title>${content}`,
  sourceDir: "site",
});
```

The app owns source directories, front matter meaning, document chrome, navigation, CSS, content
taxonomy, RSS or search policy, deployment layout, and product metadata. The package owns the
repeatable mechanics: parse front matter, render Markdown, rewrite root-relative URLs, discover
pages, compute output paths, copy assets, and write static HTML.

Verify generated sites with unit tests for route output, static artifact checks for generated
files, public link checks, and a browser smoke test for the deployed base path.

## How The Recipes Are Protected

`bun run test:compat` packs the local workspace packages and runs app-shape compatibility tests
through public package paths. The harness covers these recipe shapes without importing monorepo
internals:

- server-app controls, data helpers, and transport helpers
- static blog and documentation components
- dashboard/admin table and filter composition
- static demo controls without server-only assumptions
- script helpers with fake inputs and no live services
- static-content generation through the automation content subpath

Run `bun run verify` before shipping a recipe or package-boundary change.
