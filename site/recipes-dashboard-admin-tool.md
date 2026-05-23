---
layout: default
title: Dashboard Or Admin Tool Recipe
permalink: /recipes/dashboard-admin-tool/
---

# Dashboard Or Admin Tool

Use this shape for dense screens that need repeated scanning, filtering, pagination, and action review.

<div class="docs-layout recipe-layout">
<details class="docs-side-nav recipe-side-nav" open>
  <summary aria-label="Toggle recipe navigation"><span class="docs-side-nav__icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2zM9 4v14M15 6v14" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"/></svg></span><span class="docs-side-nav__label">Recipe docs</span><span class="docs-side-nav__mobile-label">Recipes</span></summary>
  <nav aria-label="Recipe docs">
    <a href="{{ '/recipes/' | relative_url }}">Overview</a>
    <a href="{{ '/recipes/server-app/' | relative_url }}">Server app</a>
    <a href="{{ '/recipes/static-blog/' | relative_url }}">Static blog</a>
    <a aria-current="page" href="{{ '/recipes/dashboard-admin-tool/' | relative_url }}">Dashboard or admin tool</a>
    <a href="{{ '/recipes/static-demo/' | relative_url }}">Static demo</a>
    <a href="{{ '/recipes/script-consumer/' | relative_url }}">Script consumer</a>
    <a href="{{ '/recipes/static-content-generator/' | relative_url }}">Static-content generator</a>
  </nav>
</details>

<div class="docs-page recipe-page">

## Required Packages

- `@macavitymadcap/hyper-dank-ui` for `AppShell`, `PageHeader`, `SideNav`, `Toolbar`, `HxForm`, `ScrollableTable`, `TableCell`, `Pagination`, `StatusSummary`, `Badge`, and `PopoverMenu`.
- `@macavitymadcap/hyper-dank-transport` for GET filters, POST actions, HTMX redirects, and fragment-or-page responses.
- `@macavitymadcap/hyper-dank-data` for provider lifecycle and app-owned repository contracts.
- `@macavitymadcap/hyper-dank-automation` for seeded review flows, screenshots, Pa11y, and browser checks.

```tsx
import { Button, FormField, HxForm, Panel, ScrollableTable, TableCell } from "@macavitymadcap/hyper-dank-ui";

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

## App-Owned Responsibilities

The app owns domain tables, filter semantics, roles, audit trails, mutations, destructive-action
policy, empty states, and seeded review data.

## Verification

Use component tests for dense states, route tests for permissions, HTMX tests for filter and
mutation fragments, screenshots for light and dark review states, and Pa11y for the main admin
route.

## References

[UI]({{ '/libraries/ui/' | relative_url }}),
[Transport]({{ '/libraries/transport/' | relative_url }}),
[Data]({{ '/libraries/data/' | relative_url }}),
[Automation]({{ '/libraries/automation/' | relative_url }}), and
[Storybook dashboard examples]({{ '/storybook/' | relative_url }}).

</div>
</div>
