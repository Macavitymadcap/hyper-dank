---
layout: default
title: System
---

# System

Hyper-Dank favours explicit hypermedia flow over framework magic.

- Hono routes receive browser requests and return full documents or small HTML fragments.
- HTMX attributes live in the component that owns the interaction.
- Repositories hide persistence details behind narrow app contracts.
- Browser assets are bundled by Vite, while the app remains server-rendered.
- Storybook and Playwright cover isolated components and real browser behaviour.

Walking Pace remains the reference server app in `apps/walking-pace`. It demonstrates Better Auth,
SQLite/Postgres providers, server-rendered forms, HTMX fragment updates, Storybook states, browser
E2E, Pa11y, and the shared component package.

The public `/pace/` demo is intentionally static. It keeps the user-facing pace workflow but swaps
server persistence for browser `localStorage` so the example works on GitHub Pages.
