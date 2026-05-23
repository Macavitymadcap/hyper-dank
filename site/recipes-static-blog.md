---
layout: default
title: Static Blog Recipe
permalink: /recipes/static-blog/
---

# Static Blog

Use this shape for docs, journals, release notes, and content-heavy pages served from static hosting.

<div class="docs-layout recipe-layout">
<details class="docs-side-nav recipe-side-nav" open>
  <summary aria-label="Toggle recipe navigation"><span class="docs-side-nav__icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2zM9 4v14M15 6v14" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"/></svg></span><span class="docs-side-nav__label">Recipe docs</span><span class="docs-side-nav__mobile-label">Recipes</span></summary>
  <nav aria-label="Recipe docs">
    <a href="{{ '/recipes/' | relative_url }}">Overview</a>
    <a href="{{ '/recipes/server-app/' | relative_url }}">Server app</a>
    <a aria-current="page" href="{{ '/recipes/static-blog/' | relative_url }}">Static blog</a>
    <a href="{{ '/recipes/dashboard-admin-tool/' | relative_url }}">Dashboard or admin tool</a>
    <a href="{{ '/recipes/static-demo/' | relative_url }}">Static demo</a>
    <a href="{{ '/recipes/script-consumer/' | relative_url }}">Script consumer</a>
    <a href="{{ '/recipes/static-content-generator/' | relative_url }}">Static-content generator</a>
  </nav>
</details>

<div class="docs-page recipe-page">

## Required Packages

- `@macavitymadcap/hyper-dank-ui` for article cards, metadata, breadcrumbs, prose, code blocks, callouts, timelines, tabs, and empty states.
- `@macavitymadcap/hyper-dank-automation/content` for Markdown rendering, route output paths, URL rewriting, page discovery, and static content builds.
- `@macavitymadcap/hyper-dank-automation` for static artifact smoke checks and local script plumbing.

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

## App-Owned Responsibilities

The app owns content collections, front matter schema, taxonomy, navigation, feeds, search, layout,
editorial copy, and publishing workflow.

## Verification

Use content helper tests, generated artifact smoke checks, link checks, and a browser pass over
important responsive article layouts.

## References

[UI]({{ '/libraries/ui/' | relative_url }}),
[Automation]({{ '/libraries/automation/' | relative_url }}),
[Static-content API]({{ '/libraries/automation/' | relative_url }}), and
[Storybook content primitives]({{ '/storybook/' | relative_url }}).

</div>
</div>
