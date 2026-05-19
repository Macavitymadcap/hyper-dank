# Documentation Audit

Last reviewed: 2026-05-19

This audit records the current documentation ownership model before the `pace-0041` public docs,
Storybook, and demo review work starts. It deliberately treats the Jekyll site as the current
production baseline; `pace-0043` owns replacing that build path with repo-owned Bun tooling.

## Source Of Truth

| Topic | Owner | Supporting References | Notes |
| --- | --- | --- | --- |
| Project purpose, setup, scripts, local review, deployment summary, and configuration | `README.md` | `CONTRIBUTING.md`, `ARCHITECTURE.md` | Keep this as the maintainer entrypoint. Avoid deep package API tables here. |
| App and package architecture, request flow, persistence boundaries, HTMX conventions, and testing strategy | `ARCHITECTURE.md` | `docs/architecture/database-adapters.md`, package READMEs | Keep implementation guidance here when it affects how new features should be built. |
| Branch flow, PR rules, release flow, and verification expectations | `CONTRIBUTING.md` | `.github/BRANCH_PROTECTION.md`, `.github/workflows/*.yml` | Keep workflow rules here rather than repeating them in public docs. |
| Public docs home, library overview, recipes, Storybook, demo, and verification summaries | `site/*.md` | `README.md`, package READMEs, Storybook stories | Current source for GitHub Pages documentation until `pace-0043` replaces the Jekyll build. |
| Package import contracts and package-specific examples | `libs/*/README.md` | `site/libraries.md`, `e2e/consumer-compat/character-sheet-compat.test.tsx` | Package READMEs should stay closer to exports than the public site. |
| Server deployment runbook | `docs/deployment/railway.md` | `README.md`, `Dockerfile`, root scripts | Keep Railway framed as a reusable server-app pattern, not this repo's production target. |
| Epic and ticket intent | `docs/epics/*.md`, `docs/tickets/*.md` | Branch history and PRs | Planning docs should not become the active source for commands after implementation lands. |
| Component review docs | `apps/walking-pace/src/stories/*.stories.tsx`, component stories | `libs/components/README.md`, `site/libraries.md` | Storybook currently covers useful states, but `pace-0046` should deepen reference material. |

## Current Stale Or Build-Sensitive Claims

| Area | Finding | Disposition |
| --- | --- | --- |
| Jekyll public docs | `README.md`, `ARCHITECTURE.md`, and `site/storybook.md` correctly describe the current GitHub Pages build as Jekyll-backed. | Keep for `pace-0042`; replace in `pace-0043` after the Bun docs build exists. |
| Public docs information architecture | `site/libraries.md` is a single dense page with tabbed sections for all packages. | Split into a libraries home plus package pages in `pace-0045`. |
| Docs shell | The current public docs header exposes several links directly and wide markdown tables depend on page-level styling. | Improve compact navigation, theme toggle, and table overflow in `pace-0044`. |
| Storybook structure | Guide stories exist, but the navigation starts from the current story hierarchy rather than a fuller component-system introduction and grouped reference path. | Restructure and deepen component references in `pace-0046`. |
| Storybook utility control | Storybook has a shared theme switch, but no compact quick-link control for docs, libraries, and demo. | Add quick links in `pace-0047`. |
| Demo review | README documents `seed:dev`, but public/static demo docs still emphasise the browser-only demo and do not expose authenticated review paths. | Resolve demo review accounts and invite messaging in `pace-0048`. |
| Character Sheet comparison | The docs mention consumer compatibility, but the current Character Sheet SRD patterns have not been reviewed against Hyper-Dank package candidates. | Capture extraction decisions in `pace-0049`. |

## Copy And Accuracy Notes

- Prefer "public docs" when describing visitor-facing pages and "site source" when referring to
  files under `site/`.
- Keep "Jekyll" wording only where it names the current build path. Do not present Jekyll as a
  long-term architecture choice during the `pace-0041` epic.
- Use package names consistently: `@macavitymadcap/hyper-dank-ui`,
  `@macavitymadcap/hyper-dank-data`, `@macavitymadcap/hyper-dank-transport`, and
  `@macavitymadcap/hyper-dank-automation`.
- Keep "Walking Pace" for the reference app and "static Walking Pace demo" for the browser-only
  `/pace/` site. The authenticated Hono app is a local/server reference until a consumer deploys it.
- Storybook copy should distinguish reusable component documentation from Walking Pace-specific app
  state examples.

## Later Ticket Feed

| Ticket | Audit Feed |
| --- | --- |
| `pace-0043` | Replace Jekyll-specific build claims in README, architecture, and Storybook/public docs after the Bun generator exists. |
| `pace-0044` | Use the public docs shell findings to drive header, navigation, theme toggle, and table overflow checks. |
| `pace-0045` | Use the source-of-truth map so package pages pull public examples from `site/` and export details from package READMEs. |
| `pace-0046` | Treat Storybook guide stories as useful seed content, not a complete reference structure. |
| `pace-0047` | Link targets should follow the published Pages routes documented in README and `site/*.md`. |
| `pace-0048` | Keep production auth/invitation docs separate from demo-review affordances. |
| `pace-0049` | Compare Character Sheet patterns against package READMEs and consumer compatibility boundaries before proposing shared exports. |
