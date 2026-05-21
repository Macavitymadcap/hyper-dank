---
layout: default
title: Hyper-Dank
---

<section class="hero">
  <div class="hero-logo" aria-hidden="true"></div>
  <h1>Hyper-Dank</h1>
  <p class="lede">
    Hyper-Dank is a small hypermedia-first toolkit for building server-rendered Hono, HTMX, Bun,
    TypeScript, and JSX applications with reusable components, explicit data boundaries, and serious
    verification.
  </p>
  <div class="button-row">
    <a class="button" href="{{ '/pace/' | relative_url }}">Try the pace demo</a>
    <a class="button secondary" href="{{ '/storybook/' | relative_url }}">Open Storybook</a>
  </div>
</section>

<section class="grid">
  <article class="card">
    <h2>Libraries</h2>
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
    <h2>Recipes</h2>
    <p>
      Compose the libraries into static demos, server-rendered apps, dashboards, and documentation
      sites without taking on a large client framework.
    </p>
    <a href="{{ '/recipes/' | relative_url }}">Read the app recipes</a>
  </article>
</section>
