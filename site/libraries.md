---
layout: default
title: Libraries
permalink: /libraries/
---

# Libraries

Hyper-Dank packages are small shared contracts for Hono, HTMX, Bun, and server-rendered JSX apps.
They keep mechanics reusable while product behaviour stays in the consuming application.

<div class="library-layout">
<details class="docs-side-nav library-side-nav" open>
  <summary aria-label="Toggle library docs navigation"><span class="docs-side-nav__icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M4 5.5c3 0 5 .7 8 2.2 3-1.5 5-2.2 8-2.2v12c-3 0-5 .7-8 2.2-3-1.5-5-2.2-8-2.2z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"/></svg></span><span class="docs-side-nav__label">Library docs</span><span class="docs-side-nav__mobile-label">Libraries</span></summary>
  <nav aria-label="Library docs">
    <a aria-current="page" href="{{ '/libraries/' | relative_url }}">Overview</a>
    <a href="{{ '/libraries/consumer-setup/' | relative_url }}">Consumer setup</a>
    <a href="{{ '/libraries/publication-evidence/' | relative_url }}">Publication evidence</a>
    <a href="{{ '/libraries/ui/' | relative_url }}">UI</a>
    <a href="{{ '/libraries/data/' | relative_url }}">Data</a>
    <a href="{{ '/libraries/transport/' | relative_url }}">Transport</a>
    <a href="{{ '/libraries/automation/' | relative_url }}">Automation</a>
  </nav>
</details>

<div class="library-page">

The libraries deliberately stop at reusable boundaries: component primitives, database lifecycle
contracts, Hono/HTMX transport helpers, and script automation. App-owned language, routes,
permissions, schemas, repositories, fixtures, and release choices stay local.

Install all packages from npm:

```bash
npm install \
  @macavitymadcap/hyper-dank-ui \
  @macavitymadcap/hyper-dank-data \
  @macavitymadcap/hyper-dank-transport \
  @macavitymadcap/hyper-dank-automation
npm install hono typescript
```

For TypeScript, Hono JSX, CSS import, optional peers, and a minimal package smoke, see
[Consumer setup]({{ '/libraries/consumer-setup/' | relative_url }}). For the first public package
set, registry integrity hashes, and trusted-publishing approval notes, see
[Publication evidence]({{ '/libraries/publication-evidence/' | relative_url }}).

<div class="library-card-grid">
  <a class="library-card" href="{{ '/libraries/ui/' | relative_url }}">
    <span class="library-meta">Components and CSS</span>
    <strong>UI package</strong>
    <span class="library-package">@macavitymadcap/hyper-dank-ui</span>
    <span>Server-rendered Hono JSX primitives, HTMX-friendly props, and a small baseline CSS export.</span>
  </a>
  <a class="library-card" href="{{ '/libraries/data/' | relative_url }}">
    <span class="library-meta">Lifecycle and migrations</span>
    <strong>Data package</strong>
    <span class="library-package">@macavitymadcap/hyper-dank-data</span>
    <span>Provider shapes, migration helpers, and Bun conformance tests for app-owned adapters.</span>
  </a>
  <a class="library-card" href="{{ '/libraries/transport/' | relative_url }}">
    <span class="library-meta">Hono and HTMX</span>
    <strong>Transport package</strong>
    <span class="library-package">@macavitymadcap/hyper-dank-transport</span>
    <span>Form parsing, route parameters, safe error messages, and HTMX-aware redirects.</span>
  </a>
  <a class="library-card" href="{{ '/libraries/automation/' | relative_url }}">
    <span class="library-meta">Bun scripts</span>
    <strong>Automation package</strong>
    <span class="library-package">@macavitymadcap/hyper-dank-automation</span>
    <span>Shared process, GitHub, verification, server, screenshot, PR-image, and a11y helpers.</span>
  </a>
</div>

| Package | npm |
| --- | --- |
| `@macavitymadcap/hyper-dank-ui` | [npm package](https://www.npmjs.com/package/@macavitymadcap/hyper-dank-ui) |
| `@macavitymadcap/hyper-dank-data` | [npm package](https://www.npmjs.com/package/@macavitymadcap/hyper-dank-data) |
| `@macavitymadcap/hyper-dank-transport` | [npm package](https://www.npmjs.com/package/@macavitymadcap/hyper-dank-transport) |
| `@macavitymadcap/hyper-dank-automation` | [npm package](https://www.npmjs.com/package/@macavitymadcap/hyper-dank-automation) |

## Shared Boundaries

| Package | Owns | Leaves to Apps |
| --- | --- | --- |
| UI | Generic JSX components, class contracts, HTMX prop surfaces, baseline CSS. | Product layout, feature organisms, wording, route paths, permissions. |
| Data | Provider lifecycle types, migration store contract, ordered migration runner, lifecycle tests. | Domain schemas, repositories, adapter setup, transaction policy. |
| Transport | Request form helpers, route parameter normalisation, safe error strings, action redirects. | Auth, permissions, services, validation rules, route composition. |
| Automation | Script mechanics for processes, GitHub, checks, local servers, browsers, PR screenshots, Pa11y. | App fixtures, smoke journeys, deployment targets, release decisions. |

## Consumption Pattern

Use a package when it removes repeated mechanics without hiding the app contract. Keep imports close
to the consuming boundary, add app-specific wrappers only when they clarify product behaviour, and
cover package use through consumer-style compatibility tests.

</div>
</div>
