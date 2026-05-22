---
layout: default
title: System
---

# System

Hyper-Dank is a small framework pattern for apps that treat HTML as the application protocol. It
favours explicit request flow, app-owned domain code, and package boundaries that can be copied into
ordinary Hono, HTMX, Bun, TypeScript, and JSX apps without adopting a private framework or a
client-side SPA stack.

Its HTML-first approach is informed by [Hypermedia Systems](https://hypermedia.systems/),
[HTMX](https://htmx.org/), and
[Server-Driven Web Apps with htmx](https://pragprog.com/titles/mvhtmx/server-driven-web-apps-with-htmx/).
The practical rule is direct: render useful HTML first, then enhance it with HTMX where fragment
updates shorten the workflow.

## Application Shape

Hono routes receive browser requests and return either full documents or small HTML fragments.
Routes own permission checks, validation, status codes, and redirects. JSX components own markup,
landmarks, form controls, and the `hx-*` attributes that describe enhanced behaviour.

The server remains the source of truth. A mutating route validates input, asks an app-owned
repository or service to change state, reads the current state back, and returns the fragment the
browser should swap. Native form actions stay present so the same screen can work without
JavaScript.

## Package Boundaries

The reusable packages own generic mechanics:

### `@macavitymadcap/hyper-dank-ui`

Shared responsibility: server-rendered components and CSS hooks.

App responsibility: product language, feature screens, route paths, and layout decisions.

### `@macavitymadcap/hyper-dank-data`

Shared responsibility: provider lifecycle, migration planning, and adapter test harnesses.

App responsibility: schemas, SQL, repositories, transactions, seed data, and environment parsing.

### `@macavitymadcap/hyper-dank-transport`

Shared responsibility: form parsing, route params, HTMX detection, redirects, and fragment selection.

App responsibility: auth, permissions, validation rules, templates, and response content.

### `@macavitymadcap/hyper-dank-automation`

Shared responsibility: process, GitHub, verification, local server, screenshot, Pa11y, static-site,
and content helpers.

App responsibility: script entrypoints, fixtures, route lists, release policy, and deployment
layout.

That split keeps shared code boring and reusable. If a helper needs to know a product route, a user
role, a database table, or a deployment target, it belongs in the consuming app instead of a
Hyper-Dank package.

## Browser Assets

Vite bundles CSS, client JavaScript, static assets, production manifests, and Storybook. It is the
asset pipeline, not the application server. Hono and Bun still render the app, while Vite provides
the browser files that make the rendered HTML feel polished.

Theme and component styling use CSS custom properties and visible class contracts. Consuming apps
can import package CSS for the baseline behaviour, then layer product-specific styles in their own
asset bundle.

## Verification

Storybook covers isolated component states and app examples. Playwright covers browser workflows.
Pa11y checks accessible output. Package compatibility tests import workspace packages through their
public package paths so app builders can see which contracts are meant to hold.

The point is not to make every app run every Hyper-Dank gate. The point is to keep each confidence
check close to the boundary it protects: component markup, route behaviour, package exports,
browser interaction, static output, or deployment health.

## Reference Implementations

Walking Pace remains the reference server app in `apps/walking-pace`. It demonstrates Better Auth,
SQLite/Postgres providers, server-rendered forms, HTMX fragment updates, Storybook states, browser
E2E, Pa11y, and the shared component package.

The public `/pace/` demo is intentionally static. It keeps the user-facing pace workflow but swaps
server persistence for browser `localStorage` so the example works on GitHub Pages.

The reusable packages are documented in [Libraries]({{ '/libraries/' | relative_url }}). Practical
compositions for server apps, static blogs, dashboards, static demos, and script consumers live in
[App Recipes]({{ '/recipes/' | relative_url }}).
