---
layout: default
title: Search
permalink: /search/
---

<section class="docs-search" data-docs-search data-search-index="{{ '/search-index.json' | relative_url }}">
  <header class="docs-search__header">
    <p class="docs-search__eyebrow">Static docs</p>
    <h1>Docs search</h1>
  </header>

  <form class="docs-search__form" role="search" data-docs-search-form>
    <label for="docs-search-query">Search docs</label>
    <div class="docs-search__controls">
      <input id="docs-search-query" name="q" type="search" autocomplete="off" data-docs-search-input />
      <button class="button" type="submit">Search</button>
    </div>
  </form>

  <p class="docs-search__status" aria-live="polite" data-docs-search-status>
    Loading search index.
  </p>
  <ol class="docs-search__results" data-docs-search-results></ol>
</section>

<section class="docs-search__fallback" aria-labelledby="search-fallback-heading">
  <h2 id="search-fallback-heading">Reference paths</h2>
  <div class="grid">
    <a class="card" href="{{ '/libraries/' | relative_url }}">
      <strong>Libraries</strong>
      <span>Package docs for UI, data, transport, and automation.</span>
    </a>
    <a class="card" href="{{ '/recipes/' | relative_url }}">
      <strong>Recipes</strong>
      <span>Implementation recipes for common Hyper-Dank app shapes.</span>
    </a>
    <a class="card" href="{{ '/libraries/ui/' | relative_url }}">
      <strong>UI reference</strong>
      <span>Component exports, conventions, and usage notes.</span>
    </a>
    <a class="card" href="{{ '/storybook/' | relative_url }}">
      <strong>Storybook</strong>
      <span>Rendered component examples and visual reference states.</span>
    </a>
    <a class="card" href="{{ '/accessibility/' | relative_url }}">
      <strong>Accessibility</strong>
      <span>Accessibility statement, testing notes, and report path.</span>
    </a>
  </div>
</section>
