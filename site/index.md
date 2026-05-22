---
layout: default
title: Hyper-Dank
---

<section class="hero">
  <div class="hero-logo-shell" aria-hidden="true">
    <div class="hero-logo"></div>
  </div>
  <div class="hero-copy">
    <h1>Hyper-Dank</h1>
    <p class="lede">
      Hyper-Dank is a small hypermedia-first toolkit for building server-rendered Hono, HTMX, Bun,
      TypeScript, and JSX applications with reusable components, explicit data boundaries, and
      serious verification.
    </p>
    <div class="button-row">
      <a class="button" href="{{ '/pace/' | relative_url }}">Try the pace demo</a>
      <a class="button secondary" href="{{ '/storybook/' | relative_url }}">Open Storybook</a>
    </div>
  </div>
</section>

<section class="grid">
  <article class="card">
    <h2 class="route-card-heading"><span class="docs-side-nav__icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M4 5.5c3 0 5 .7 8 2.2 3-1.5 5-2.2 8-2.2v12c-3 0-5 .7-8 2.2-3-1.5-5-2.2-8-2.2z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"/></svg></span>Libraries</h2>
    <p>
      Shared packages cover Hono JSX components, database lifecycle primitives, and HTTP/HTMX helper
      contracts.
    </p>
    <a href="{{ '/libraries/' | relative_url }}">Explore the packages</a>
  </article>
  <article class="card">
    <h2>System</h2>
    <p>
      The template keeps state visible: routes receive requests, repositories own persistence, JSX
      renders HTML, and HTMX swaps focused fragments.
    </p>
    <a href="{{ '/system/' | relative_url }}">Read the architecture</a>
  </article>
  <article class="card">
    <h2 class="route-card-heading"><span class="docs-side-nav__icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2zM9 4v14M15 6v14" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"/></svg></span>Recipes</h2>
    <p>
      Compose the libraries into static demos, server-rendered apps, dashboards, and documentation
      sites without taking on a large client framework.
    </p>
    <a href="{{ '/recipes/' | relative_url }}">Read the app recipes</a>
  </article>
</section>
