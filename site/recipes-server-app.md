---
layout: default
title: Server App Recipe
permalink: /recipes/server-app/
---

# Server App

Use this shape for authenticated Hono apps and workflows where the server owns state.

<div class="docs-layout recipe-layout">
<details class="docs-side-nav recipe-side-nav" open>
  <summary aria-label="Toggle recipe navigation"><span class="docs-side-nav__icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2zM9 4v14M15 6v14" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"/></svg></span><span class="docs-side-nav__label">Recipe docs</span><span class="docs-side-nav__mobile-label">Recipes</span></summary>
  <nav aria-label="Recipe docs">
    <a href="{{ '/recipes/' | relative_url }}">Overview</a>
    <a aria-current="page" href="{{ '/recipes/server-app/' | relative_url }}">Server app</a>
    <a href="{{ '/recipes/static-blog/' | relative_url }}">Static blog</a>
    <a href="{{ '/recipes/dashboard-admin-tool/' | relative_url }}">Dashboard or admin tool</a>
    <a href="{{ '/recipes/static-demo/' | relative_url }}">Static demo</a>
    <a href="{{ '/recipes/script-consumer/' | relative_url }}">Script consumer</a>
    <a href="{{ '/recipes/static-content-generator/' | relative_url }}">Static-content generator</a>
  </nav>
</details>

<div class="docs-page recipe-page">

## Required Packages

- `@macavitymadcap/hyper-dank-ui` for server-rendered controls, panels, forms, menus, and status views.
- `@macavitymadcap/hyper-dank-transport` for form values, route params, HTMX detection, and progressive redirects.
- `@macavitymadcap/hyper-dank-data` for provider lifecycle, migration planning, repository contracts, and adapter test harnesses.
- `@macavitymadcap/hyper-dank-automation` for verification gates, local server readiness, Pa11y, screenshots, and PR evidence.

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

## App-Owned Responsibilities

Keep auth, permissions, domain validation, route names, schemas, services, repositories, seeded
users, and deployment targets in the app.

## Verification

Use route tests for full pages, HTMX contract tests for fragments, repository contract tests for
adapter behaviour, Playwright for browser journeys, and Pa11y for user-facing screens.

## References

[UI]({{ '/libraries/ui/' | relative_url }}),
[Transport]({{ '/libraries/transport/' | relative_url }}),
[Data]({{ '/libraries/data/' | relative_url }}),
[Automation]({{ '/libraries/automation/' | relative_url }}), and
[Storybook]({{ '/storybook/' | relative_url }}).

</div>
</div>
