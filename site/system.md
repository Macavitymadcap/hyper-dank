---
layout: default
title: System
---

# System

Hyper-Dank favours explicit hypermedia flow over framework magic.

- Its HTML-first approach is informed by [Hypermedia Systems](https://hypermedia.systems/),
  [HTMX](https://htmx.org/), and
  [Server-Driven Web Apps with htmx](https://pragprog.com/titles/mvhtmx/server-driven-web-apps-with-htmx/).
- Hono routes receive browser requests and return full documents or small HTML fragments.
- HTMX attributes live in the component that owns the interaction.
- Repositories hide persistence details behind narrow app contracts.
- Browser assets are bundled by Vite, while the app remains server-rendered.
- Storybook and Playwright cover isolated components and real browser behaviour.
- Script entrypoints stay app-owned, while shared automation helpers cover process execution,
  GitHub requests, verification reports, local servers, screenshots, and Pa11y.

Walking Pace remains the reference server app in `apps/walking-pace`. It demonstrates Better Auth,
SQLite/Postgres providers, server-rendered forms, HTMX fragment updates, Storybook states, browser
E2E, Pa11y, and the shared component package.

The public `/pace/` demo is intentionally static. It keeps the user-facing pace workflow but swaps
server persistence for browser `localStorage` so the example works on GitHub Pages.

The reusable packages are documented in [Libraries]({{ '/libraries/' | relative_url }}). Practical
compositions for server apps, static blogs, dashboards, static demos, and script consumers live in
[App Recipes]({{ '/recipes/' | relative_url }}).
