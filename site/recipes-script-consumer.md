---
layout: default
title: Script Consumer Recipe
permalink: /recipes/script-consumer/
---

# Script Consumer

Use this shape when an app needs repeatable local automation without copying one-off helpers.

<div class="docs-layout recipe-layout">
<details class="docs-side-nav recipe-side-nav" open>
  <summary aria-label="Toggle recipe navigation"><span class="docs-side-nav__icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2zM9 4v14M15 6v14" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"/></svg></span><span class="docs-side-nav__label">Recipe docs</span><span class="docs-side-nav__mobile-label">Recipes</span></summary>
  <nav aria-label="Recipe docs">
    <a href="{{ '/recipes/' | relative_url }}">Overview</a>
    <a href="{{ '/recipes/server-app/' | relative_url }}">Server app</a>
    <a href="{{ '/recipes/static-blog/' | relative_url }}">Static blog</a>
    <a href="{{ '/recipes/dashboard-admin-tool/' | relative_url }}">Dashboard or admin tool</a>
    <a href="{{ '/recipes/static-demo/' | relative_url }}">Static demo</a>
    <a aria-current="page" href="{{ '/recipes/script-consumer/' | relative_url }}">Script consumer</a>
    <a href="{{ '/recipes/static-content-generator/' | relative_url }}">Static-content generator</a>
  </nav>
</details>

<div class="docs-page recipe-page">

## Required Packages

- `@macavitymadcap/hyper-dank-automation` for command gates, verification reports, process helpers, local server readiness, GitHub requests, Pa11y, and PR image Markdown.

```ts
import { createCommandGate, renderVerificationReport, runVerification, waitForHttp } from "@macavitymadcap/hyper-dank-automation";

const results = await runVerification([
  createCommandGate("check", "Static Checks", "bun", ["run", "check"], "Biome"),
]);

await waitForHttp("http://127.0.0.1:3000/healthz");
console.log(renderVerificationReport(results, process.cwd()));
```

## App-Owned Responsibilities

The app owns which commands run, which services start, which credentials are available, and which
outputs are published or attached to PRs.

## Verification

Unit test scripts with fake runners where possible, then run the real script in CI or a local
verification pass before relying on it for release work.

## References

[Automation]({{ '/libraries/automation/' | relative_url }}) and
[Verification]({{ '/verification/' | relative_url }}).

</div>
</div>
