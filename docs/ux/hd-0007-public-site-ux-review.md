# hd-0007: Public Site UX Review

## Surfaces Reviewed

- Docs routes: home, libraries, library subpages, recipes index and recipe subpages, system,
  verification, accessibility, Storybook landing page.
- Static demo: `/pace/` is still covered by existing static demo and accessibility checks.
- Storybook: shared component reference groups, guides, and reference-app stories.

## Findings

- `P2` Package publication path was still described as tarball-only. This blocked adopter trust
  because the public docs sold package reuse without a real registry route. Fixed in `hd-0002` by
  adding npm metadata, staged publish workflow, readiness checks, and install copy.
- `P2` Recipes were too long as a single page. A developer had to scroll through unrelated app
  shapes before copying the right guidance. Fixed in `hd-0005` by creating an index plus one route
  per recipe.
- `P2` Side-panel navigation did not expose section-level context. Library and recipe subpages had
  a page-level side nav but no current-page map. Fixed in `hd-0003` with a generated heading TOC
  below the active nav item.
- `P2` Several Storybook shared groups looked like demo shelves rather than reference docs. Fixed
  in `hd-0004` by adding purpose, contract, accessibility, ownership, and copyable examples to the
  weak groups called out in the epic brief.
- `P3` The public artifact lacked a single accessibility statement. Fixed in `hd-0006` with a
  statement covering tests, known limits, package responsibilities, contact route, and cadence.

## Follow-Up Tickets

- `hd-0008`: Add active-current-section highlighting to generated page TOCs as the user scrolls.
- `hd-0009`: After the first npm staged approval, add release evidence to docs and the GitHub issue.
- `hd-0010`: Capture and attach mobile/desktop light/dark screenshots for the rewritten Storybook
  shared groups.
- `hd-0011`: Add a dedicated public support/contact route or GitHub issue template link for
  accessibility reports.

## Verification

- Planned: `bun run check:publishing`
- Planned: public docs tests for routes, recipes, links, and side navigation
- Planned: `bun run test:storybook`
- Planned: `bun run test:static-demo`
- Planned: `bun run test:a11y`
- Planned: `bun run verify`
