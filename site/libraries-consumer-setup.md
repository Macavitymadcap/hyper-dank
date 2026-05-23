---
layout: default
title: Consumer Setup
permalink: /libraries/consumer-setup/
---

# Consumer Setup

Use this page when you are installing Hyper-Dank packages into a Bun, Hono, HTMX, or static docs
app outside this repository.

<div class="library-layout">
<details class="docs-side-nav library-side-nav" open>
  <summary aria-label="Toggle library docs navigation"><span class="docs-side-nav__icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M4 5.5c3 0 5 .7 8 2.2 3-1.5 5-2.2 8-2.2v12c-3 0-5 .7-8 2.2-3-1.5-5-2.2-8-2.2z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"/></svg></span><span class="docs-side-nav__label">Library docs</span><span class="docs-side-nav__mobile-label">Libraries</span></summary>
  <nav aria-label="Library docs">
    <a href="{{ '/libraries/' | relative_url }}">Overview</a>
    <a aria-current="page" href="{{ '/libraries/consumer-setup/' | relative_url }}">Consumer setup</a>
    <a href="{{ '/libraries/ui/' | relative_url }}">UI</a>
    <a href="{{ '/libraries/data/' | relative_url }}">Data</a>
    <a href="{{ '/libraries/transport/' | relative_url }}">Transport</a>
    <a href="{{ '/libraries/automation/' | relative_url }}">Automation</a>
  </nav>
</details>

<div class="library-page">

## Install packages

Install the packages you need from the npm registry. Server-rendered UI and transport helpers need
`hono`. Every package expects TypeScript-aware tooling, and Bun apps should install Bun's public
type package.

<div class="package-manager-tabs">
  <input checked id="install-npm" name="install-package-manager" type="radio">
  <label for="install-npm">npm</label>
  <input id="install-bun" name="install-package-manager" type="radio">
  <label for="install-bun">Bun</label>
  <input id="install-yarn" name="install-package-manager" type="radio">
  <label for="install-yarn">Yarn</label>
  <input id="install-pnpm" name="install-package-manager" type="radio">
  <label for="install-pnpm">pnpm</label>
  <div class="package-manager-tabs__panel package-manager-tabs__panel--npm">

```bash
npm install @macavitymadcap/hyper-dank-ui @macavitymadcap/hyper-dank-data @macavitymadcap/hyper-dank-transport @macavitymadcap/hyper-dank-automation hono
npm install --save-dev typescript bun-types
```

  </div>
  <div class="package-manager-tabs__panel package-manager-tabs__panel--bun">

```bash
bun add @macavitymadcap/hyper-dank-ui @macavitymadcap/hyper-dank-data @macavitymadcap/hyper-dank-transport @macavitymadcap/hyper-dank-automation hono
bun add --dev typescript bun-types
```

  </div>
  <div class="package-manager-tabs__panel package-manager-tabs__panel--yarn">

```bash
yarn add @macavitymadcap/hyper-dank-ui @macavitymadcap/hyper-dank-data @macavitymadcap/hyper-dank-transport @macavitymadcap/hyper-dank-automation hono
yarn add --dev typescript bun-types
```

  </div>
  <div class="package-manager-tabs__panel package-manager-tabs__panel--pnpm">

```bash
pnpm add @macavitymadcap/hyper-dank-ui @macavitymadcap/hyper-dank-data @macavitymadcap/hyper-dank-transport @macavitymadcap/hyper-dank-automation hono
pnpm add --save-dev typescript bun-types
```

  </div>
</div>

Install the optional Playwright peer only when your app uses browser screenshots, E2E checks, or
Playwright-backed automation helpers.

```bash
npm install --save-dev @playwright/test
```

## TypeScript and JSX

Hyper-Dank UI components use Hono JSX. Set the JSX runtime in the consuming app's `tsconfig.json`.

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx",
    "module": "Preserve",
    "moduleResolution": "bundler",
    "target": "ESNext",
    "types": ["bun-types"]
  }
}
```

The packages publish source for Bun and declaration files in `dist/`. Bun consumers can import the
package names directly. Other build systems should use TypeScript-aware bundler resolution.

## CSS import

Import the UI CSS from a browser bundle or another static asset pipeline. Importing a component in
server code does not load browser styles on its own.

```ts
import "@macavitymadcap/hyper-dank-ui/styles.css";
```

Layer product CSS after the package CSS when your app needs its own layout, density, or brand
styling.

## Minimal smoke

This small script checks the package exports, the CSS subpath, server-rendered JSX, data helpers,
transport helpers, and static-content automation.

```tsx
import { renderMarkdown } from "@macavitymadcap/hyper-dank-automation/content";
import { createProviderRegistry, runPendingMigrations } from "@macavitymadcap/hyper-dank-data";
import { FormValues, HttpResponder, isHtmxRequest } from "@macavitymadcap/hyper-dank-transport";
import { Button, Panel } from "@macavitymadcap/hyper-dank-ui";

import "@macavitymadcap/hyper-dank-ui/styles.css";

const cssUrl = import.meta.resolve("@macavitymadcap/hyper-dank-ui/styles.css");
const cssResponse = await fetch(cssUrl);

if (!cssResponse.ok) {
  throw new Error("Expected the UI CSS export to resolve.");
}

const html = String(
  <Panel labelledBy="package-smoke-heading">
    <h1 id="package-smoke-heading">Package smoke</h1>
    <Button type="button" variant="ghost">
      Save
    </Button>
  </Panel>,
);

const applied: string[] = [];
await runPendingMigrations(
  {
    hasMigration: (id) => applied.includes(id),
    recordMigration: (id) => {
      applied.push(id);
    },
    runMigration: () => {},
  },
  [{ id: "001", sql: "select 1" }],
);

const providers = createProviderRegistry({
  memory: () => ({
    close: () => {},
    createRepositories: () => ({}),
    kind: "memory" as const,
    migrate: () => {},
  }),
});

const provider = await providers.create("memory", {});
const form = new FormValues({ enabled: "on" });

if (
  !html.includes("Package smoke") ||
  applied[0] !== "001" ||
  provider.kind !== "memory" ||
  form.boolean("enabled") !== true ||
  !isHtmxRequest({ "HX-Request": "true" }) ||
  !(new HttpResponder() instanceof HttpResponder) ||
  !renderMarkdown("# Package smoke").includes("<h1")
) {
  throw new Error("Expected public package imports to work.");
}
```

## Package pages

<div class="table-scroll" tabindex="0">
<table>
  <thead>
    <tr>
      <th>Package</th>
      <th>npm</th>
      <th>Docs</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>@macavitymadcap/hyper-dank-ui</code></td>
      <td><a href="https://www.npmjs.com/package/@macavitymadcap/hyper-dank-ui">npm</a></td>
      <td><a href="{{ '/libraries/ui/' | relative_url }}">UI docs</a></td>
    </tr>
    <tr>
      <td><code>@macavitymadcap/hyper-dank-data</code></td>
      <td><a href="https://www.npmjs.com/package/@macavitymadcap/hyper-dank-data">npm</a></td>
      <td><a href="{{ '/libraries/data/' | relative_url }}">Data docs</a></td>
    </tr>
    <tr>
      <td><code>@macavitymadcap/hyper-dank-transport</code></td>
      <td><a href="https://www.npmjs.com/package/@macavitymadcap/hyper-dank-transport">npm</a></td>
      <td><a href="{{ '/libraries/transport/' | relative_url }}">Transport docs</a></td>
    </tr>
    <tr>
      <td><code>@macavitymadcap/hyper-dank-automation</code></td>
      <td><a href="https://www.npmjs.com/package/@macavitymadcap/hyper-dank-automation">npm</a></td>
      <td><a href="{{ '/libraries/automation/' | relative_url }}">Automation docs</a></td>
    </tr>
  </tbody>
</table>
</div>

</div>
</div>
