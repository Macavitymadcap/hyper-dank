---
layout: default
title: App Recipes
---

# App Recipes

Hyper-Dank packages are small on purpose. Applications choose the pieces that match their shape,
then keep product routes, permissions, schemas, copy, and deployment decisions in the app.

Use these recipes as starting points, not as framework rules.

## Server App

Use this shape for authenticated Hono apps, admin tools, and any workflow where the server owns
state.

| Concern | Hyper-Dank package | App-owned boundary |
| --- | --- | --- |
| Page and fragment UI | `@macavitymadcap/hyper-dank-ui` | Domain pages, route-specific organisms, product copy |
| Form parsing and redirects | `@macavitymadcap/hyper-dank-transport` | Auth, validation rules, permissions, routes |
| Migrations and provider lifecycle | `@macavitymadcap/hyper-dank-data` | Schemas, repositories, adapter choice |
| Verification and browser checks | `@macavitymadcap/hyper-dank-automation` | Gate list, fixtures, seeded users, smoke flows |

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

Server apps should start with native HTML first. Add HTMX attributes to the same controls when a
fragment response improves the experience. Keep auth and permission checks in routes or services,
not in the shared packages.

## Static Blog

Use this shape for docs, journals, release notes, and content-heavy pages served from static hosting.

- Use `Card`, `Panel`, `Badge`, and `CompactList` for article metadata and related links.
- Import `@macavitymadcap/hyper-dank-ui/styles.css` through the static site's asset bundle
  when you want the baseline component contracts.
- Keep content rendering, routing, search indexes, and feed generation in the static-site app.

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

## Dashboard Or Admin Tool

Use this shape for dense screens that need repeated scanning, filtering, and action review.

- Use `Card` or `Panel` as section surfaces, not as a replacement for product layout.
- Use `HxForm` and `FormField` for filters that can work as normal GET forms.
- Use `ScrollableTable`, `TableCell`, `Badge`, and `PopoverMenu` for compact data and row actions.
- Keep account permissions, audit trails, and domain-specific mutations in the app.

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
      <h2 id="admin-heading">Accounts</h2>
      <HxForm action="/admin" method="get" hx-get="/admin" hx-target="#admin-results">
        <FormField id="query" label="Search" name="query" />
        <Button type="submit">Filter</Button>
      </HxForm>
      <ScrollableTable columns={[{ key: "name", header: "Name" }]}>
        <tr className="scrollable-table-row">
          <TableCell value="Ada Lovelace" />
        </tr>
      </ScrollableTable>
    </Panel>
  );
}
```

## Static Demo

Use this shape for GitHub Pages demos or offline examples that should not assume a server.

- Use components for markup consistency.
- Keep browser persistence local to the demo, such as `localStorage` or an in-memory store.
- Avoid shared server helpers in demo runtime code; scripts can still build, smoke-test, and publish
  the demo.

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

## Script Consumer

Use `@macavitymadcap/hyper-dank-automation` when an app needs repeatable local automation without
copying one-off helpers.

```ts
import {
  buildImagesSection,
  getGitHubRepo,
  renderVerificationReport,
  runVerification,
  waitForHttp,
} from "@macavitymadcap/hyper-dank-automation";

const results = await runVerification([
  { id: "check", name: "Static Checks", tooling: "Biome", command: "bun", args: ["run", "check"] },
]);

console.log(renderVerificationReport(results));
await waitForHttp("http://127.0.0.1:3000/healthz");
buildImagesSection({ branch: "main", repo: getGitHubRepo(), flows: [], screenshots: [] });
```

Scripts should keep app-specific knowledge local: seeded users, route paths, browser flows, and
deployment targets. Shared helpers should own mechanics such as command execution, GitHub requests,
verification reporting, server readiness, screenshots, and PR image Markdown.
