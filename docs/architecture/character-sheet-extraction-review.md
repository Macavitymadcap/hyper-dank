# Character Sheet Extraction Review

Last reviewed: 2026-05-19

This review captures the `pace-0049` comparison between Hyper-Dank packages and the current
Character Sheet SRD work. Character Sheet is now on `codex/sheet-0031-srd-player-hardening`, so
this document uses that branch as the live comparison point while still treating `sheet-0029` and
`sheet-0040` as planning context.

## Source Context

| Source | Evidence Used | Notes |
| --- | --- | --- |
| Character Sheet `sheet-0020` epic | SRD import, rules browsing, local-first branch strategy, and explicit Hyper-Dank deferral | Confirms shared-package adoption is a later roadmap slice, not part of the SRD epic. |
| Character Sheet `sheet-0029` ticket | Mobile sheet ergonomics, seeded asset fallback, stable tab URLs, SRD source categories, and rule detail navigation | Several deferred hardening items became the newer `sheet-0031` ticket. |
| Character Sheet `sheet-0031` branch and PR #32 | HTMX edit fragments, mobile table fit, dice result placement, tab-specific screenshot coverage, seeded Mira note, and final hosted-rehearsal density decision | Current best evidence for player-facing local patterns before the pre-deployment hardening PR merges. |
| Character Sheet `sheet-0040` epic branch | Planned Hyper-Dank adoption boundary and package candidates | Confirms Character Sheet intends to consume stable public Hyper-Dank APIs after SRD and deployment work. |
| Hyper-Dank packages | `@macavitymadcap/hyper-dank-ui`, `@macavitymadcap/hyper-dank-automation`, `@macavitymadcap/hyper-dank-data`, and `@macavitymadcap/hyper-dank-transport` | Existing package contracts are mostly aligned; gaps are additive rather than reasons for app migration now. |

## Decisions

| Candidate | Target | Decision | Rationale |
| --- | --- | --- | --- |
| `Switch` icon slots, visual variants, and gradient hooks | `@macavitymadcap/hyper-dank-ui` | Adapt | Hyper-Dank already exports a generic switch with HTMX and theme-toggle support. Character Sheet's variant and gradient hooks are stronger for expressive product themes, but should be added as optional CSS/custom-property affordances rather than copied wholesale. |
| `PopoverMenu` and compact site navigation | `@macavitymadcap/hyper-dank-ui` | Observe | The component implementation is already effectively aligned. The reusable part is the composition pattern: compact header actions, theme switch, user summary, current-link menu, and POST logout item. That belongs in docs or a later generic `SiteHeader` primitive only if a second consumer needs it. |
| Role-aware `SiteHeader` composition | UI docs or future app shell package | Adapt cautiously | The shell shape is reusable, but role names, link destinations, auth user shape, and sign-out semantics are app-owned. Extract only generic layout slots, not Character Sheet roles or route policy. |
| Sheet tab workspace, canonical tab URLs, and HTMX history | Future UI or transport ticket | Adapt | The refreshable tab route pattern is useful for Hyper-Dank apps with dense workspaces. It should become a documented recipe first, then a package primitive only after the required route and fragment contracts are clear. |
| HTMX row edit fragments for abilities, skills, and proficiencies | Future UI recipe or additive components | Observe | The fragment pattern is strong, but current fields are D&D-specific. A later ticket can extract generic `InlineEditForm` or `EditableRow` primitives if another app needs the same interaction. |
| Local in-memory app harness with login and request helpers | `@macavitymadcap/hyper-dank-automation` | Extract | Character Sheet's harness offers reusable mechanics for starting a Hono app, logging in, preserving cookies, and issuing authenticated requests. Hyper-Dank already has server helpers, but login/request helpers should be made generic through callbacks. |
| Screenshot target catalogue with seeded data preparation | `@macavitymadcap/hyper-dank-automation` | Extract/adapt | Hyper-Dank has richer PR image publishing and light/dark flow orchestration; Character Sheet has a compact target catalogue, role cookies, tab-specific targets, and seed asset preparation. Merge the catalogue shape while keeping app-specific seeds local and making changed route/tab states explicit. |
| A11y target catalogue by role | `@macavitymadcap/hyper-dank-automation` | Extract | Hyper-Dank's Pa11y wrapper is generic but Walking Pace only checks one authenticated state. Character Sheet's role-aware target list is a better app contract for reusable a11y runners. |
| Seed asset placeholder writer | `@macavitymadcap/hyper-dank-automation` helper or app recipe | Adapt | The mechanics are reusable for screenshot/a11y fixtures, but asset paths and placeholders are app-specific. Provide a helper that accepts target paths and bytes rather than embedding Character Sheet content. |
| Rules source category and idempotent importer lessons | `@macavitymadcap/hyper-dank-data` docs | Observe | Source provenance and idempotence are useful lessons for future importers, but SRD schemas and repository shapes are Character Sheet-owned. Capture as database lifecycle guidance, not a shared rules model. |
| Safe campaign wiki Markdown renderer | Future content/docs helper | Observe | The renderer may inform future static blog/docs work, but its current source assumptions are tied to campaign content and Google Docs-style export. Revisit when Hyper-Dank opens a content package. |
| Auth invite/reset token service | App-local for now | Keep app-specific | Token hashing and expiry are reusable in principle, but Hyper-Dank currently delegates production auth to Better Auth and Walking Pace's invitation service is app-specific. No shared auth package should be introduced from this evidence alone. |
| Dice roller and D&D controls | Character Sheet only | Keep app-specific | Strong component, wrong package boundary. It belongs to table-play UX rather than general Hyper-Dank UI. |

## Follow-Up Tickets

| Proposed Ticket | Package / Area | Scope | Compatibility Expectation |
| --- | --- | --- | --- |
| `pace-0050` | `@macavitymadcap/hyper-dank-automation` | Add generic authenticated local-app helpers: start app, log in through caller-provided credentials, store cookies, and make request helpers usable by screenshot, a11y, and smoke scripts. | Add Character Sheet-style consumer coverage that imports the public helpers and proves callbacks keep routes, auth, and seed data app-owned. |
| `pace-0051` | `@macavitymadcap/hyper-dank-automation` | Add role-aware screenshot and a11y target catalogue helpers, including optional seed/prepare callbacks, tab/route-specific changed-state targets, and fixture asset preparation. | Keep target definitions app-local; shared tests should exercise light/dark screenshots, Pa11y cookies, public/authenticated role targets, and at least one non-default tab or sub-route without naming Walking Pace or Character Sheet routes. |
| `pace-0052` | `@macavitymadcap/hyper-dank-ui` | Add optional `Switch` visual customisation for richer track/thumb gradients and named variants while preserving the current default/compact contract. | Extend existing component tests and Storybook states; add consumer compatibility coverage for Character Sheet-style `theme` and `inspiration` switches. |
| `pace-0053` | Docs / UI recipes | Document compact authenticated site headers, refreshable HTMX tab workspaces, and inline edit fragments as reusable app patterns before extracting larger app-shell components. | Use docs and examples only; implementation tickets should follow once at least two consumers need the same contract. |
| `pace-0054` | `@macavitymadcap/hyper-dank-data` docs | Add importer provenance and source-category guidance based on Character Sheet SRD lessons without exporting D&D-specific data helpers. | Documentation-only unless a future non-D&D importer needs shared code. |

## Package Boundary Notes

- Hyper-Dank should continue to own generic mechanics: component class contracts, HTMX attributes,
  local server startup, readiness checks, Pa11y invocation, screenshot orchestration, verification
  reporting, migration lifecycle helpers, and form/redirect utilities.
- Character Sheet should keep D&D language, route policy, role permissions, campaign assets, SRD
  import rules, dice behaviour, seeded character semantics, auth sessions, and repository schemas.
- Any extracted public API should be additive and covered by consumer compatibility tests before
  Character Sheet attempts the `sheet-0040` platform-adoption epic.
- Screenshot and a11y helpers should make coverage intent reviewable: when a PR changes a specific
  tab, role, route, or dense mobile control, the target catalogue should show that state directly
  rather than relying on the app's default landing surface.
- The current Character Sheet work strengthens Hyper-Dank's roadmap, but it does not justify a
  cross-repo migration during the active SRD/deployment sequence.
