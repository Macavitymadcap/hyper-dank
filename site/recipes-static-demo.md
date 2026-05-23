---
layout: default
title: Static Demo Recipe
permalink: /recipes/static-demo/
---

# Static Demo

Use this shape for GitHub Pages demos or offline examples that should not assume a server.

<div class="docs-layout recipe-layout">
<details class="docs-side-nav recipe-side-nav" open>
  <summary aria-label="Toggle recipe navigation"><span class="docs-side-nav__icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2zM9 4v14M15 6v14" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"/></svg></span><span class="docs-side-nav__label">Recipe docs</span><span class="docs-side-nav__mobile-label">Recipes</span></summary>
  <nav aria-label="Recipe docs">
    <a href="{{ '/recipes/' | relative_url }}">Overview</a>
    <a href="{{ '/recipes/server-app/' | relative_url }}">Server app</a>
    <a href="{{ '/recipes/static-blog/' | relative_url }}">Static blog</a>
    <a href="{{ '/recipes/dashboard-admin-tool/' | relative_url }}">Dashboard or admin tool</a>
    <a aria-current="page" href="{{ '/recipes/static-demo/' | relative_url }}">Static demo</a>
    <a href="{{ '/recipes/script-consumer/' | relative_url }}">Script consumer</a>
    <a href="{{ '/recipes/static-content-generator/' | relative_url }}">Static-content generator</a>
  </nav>
</details>

<div class="docs-page recipe-page">

## Required Packages

- `@macavitymadcap/hyper-dank-ui` for panels, inputs, outputs, buttons, notices, and compact data displays.
- `@macavitymadcap/hyper-dank-automation` for static-site smoke checks and local preview scripts.

```tsx
import { Button, InputGroup, LabelledOutput, Panel } from "@macavitymadcap/hyper-dank-ui";

export function DemoForm() {
  return (
    <Panel labelledBy="demo-heading">
      <h2 id="demo-heading">Static demo</h2>
      <InputGroup type="number" name="miles" label="Miles" min={0} step={0.1} placeholder="1.2" />
      <LabelledOutput label="Average speed" value={3.8} />
      <Button type="button" name="action" value="local-add">Add</Button>
    </Panel>
  );
}
```

## App-Owned Responsibilities

The app owns browser state, local persistence, calculation logic, demo copy, routing, and hosting
target. Avoid server-only helpers in the demo runtime.

## Verification

Use storage tests for browser state, a static artifact smoke test, a mobile browser pass, and an
accessibility check for the published route.

## References

[UI]({{ '/libraries/ui/' | relative_url }}),
[Automation]({{ '/libraries/automation/' | relative_url }}),
[Pace demo]({{ '/pace/' | relative_url }}), and
[Storybook]({{ '/storybook/' | relative_url }}).

</div>
</div>
