---
layout: default
title: App Recipes
permalink: /recipes/
---

# App Recipes

Hyper-Dank recipes are adoption maps. They show which packages compose well together, what the
shared code owns, what the app still owns, and which checks prove the boundary.

<div class="docs-layout recipe-layout">
<details class="docs-side-nav recipe-side-nav" open>
  <summary aria-label="Toggle recipe navigation"><span class="docs-side-nav__icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2zM9 4v14M15 6v14" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"/></svg></span><span class="docs-side-nav__label">Recipe docs</span><span class="docs-side-nav__mobile-label">Recipes</span></summary>
  <nav aria-label="Recipe docs">
    <a aria-current="page" href="{{ '/recipes/' | relative_url }}">Overview</a>
    <a href="{{ '/recipes/server-app/' | relative_url }}">Server app</a>
    <a href="{{ '/recipes/static-blog/' | relative_url }}">Static blog</a>
    <a href="{{ '/recipes/dashboard-admin-tool/' | relative_url }}">Dashboard or admin tool</a>
    <a href="{{ '/recipes/static-demo/' | relative_url }}">Static demo</a>
    <a href="{{ '/recipes/script-consumer/' | relative_url }}">Script consumer</a>
    <a href="{{ '/recipes/static-content-generator/' | relative_url }}">Static-content generator</a>
  </nav>
</details>

<div class="docs-page recipe-page">

Choose the recipe closest to the app you are building. Each page names the required packages,
app-owned responsibilities, verification path, and references.

<div class="library-card-grid">
  <a class="library-card" href="{{ '/recipes/server-app/' | relative_url }}">
    <span class="library-meta">Hono and HTMX</span>
    <strong>Server app</strong>
    <span>Authenticated apps where the server owns state, validation, persistence, and fragments.</span>
  </a>
  <a class="library-card" href="{{ '/recipes/static-blog/' | relative_url }}">
    <span class="library-meta">Content</span>
    <strong>Static blog</strong>
    <span>Docs, journals, release notes, and content-heavy pages served from static hosting.</span>
  </a>
  <a class="library-card" href="{{ '/recipes/dashboard-admin-tool/' | relative_url }}">
    <span class="library-meta">Operations</span>
    <strong>Dashboard or admin tool</strong>
    <span>Dense screens for scanning, filtering, pagination, status, and action review.</span>
  </a>
  <a class="library-card" href="{{ '/recipes/static-demo/' | relative_url }}">
    <span class="library-meta">Browser only</span>
    <strong>Static demo</strong>
    <span>GitHub Pages demos or offline examples that should not assume a server.</span>
  </a>
  <a class="library-card" href="{{ '/recipes/script-consumer/' | relative_url }}">
    <span class="library-meta">Automation</span>
    <strong>Script consumer</strong>
    <span>Repeatable local automation without copying one-off process and server helpers.</span>
  </a>
  <a class="library-card" href="{{ '/recipes/static-content-generator/' | relative_url }}">
    <span class="library-meta">Static site</span>
    <strong>Static-content generator</strong>
    <span>Markdown pages, pretty routes, copied assets, and a custom document shell.</span>
  </a>
</div>

## Recipe Protection

Recipe examples are protected by consumer-compatibility tests that import public package paths. Run
`bun run verify` before shipping recipe or package-boundary changes.

</div>
</div>
