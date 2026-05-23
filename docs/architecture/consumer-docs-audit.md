# Consumer Docs And Package Contract Audit

## Header

| Field | Value |
| --- | --- |
| Ticket | `pace-0061` |
| Parent Epic | `pace-0060` |
| Status | Accepted |
| Last updated | 2026-05-21 |

## Summary

Hyper-Dank has the right public surfaces for an adopter-facing toolkit, but those surfaces still
need clearer ownership. The highest-risk gap is package installation: the scoped package names exist
locally and can be packed, but they are not published to npm today. `pace-0062` proves an
outside-workspace package-tarball installation route first, while npm or GitHub Packages remain
longer-term distribution options.

Storybook already has broad shared component coverage and a useful reference-app split. The next
Storybook work should refine consumer signposting, improve the icon catalogue, and move or reframe
maintainer-oriented guide pages rather than rebuilding the catalogue from scratch.

## Accepted Decisions

- Treat package installation as a blocker for downstream adoption, not a copy-only follow-up.
- Keep the public docs app-neutral. Reference-app material may mention Walking Pace only when it is
  clearly labelled as an example app.
- Use `pace-0062` to prove package consumption from outside the workspace before rewriting install
  copy.
- Use Storybook as the rendered UI contract and the docs site as the framework, recipe, and non-UI
  API contract.
- Keep historical Markdown planning docs intact while `pace-0067` defines the future GitHub Issues
  and Projects workflow.

## Package Status

Registry checks on 2026-05-21 returned `E404 Not Found` for all current package names:

- `@macavitymadcap/hyper-dank-ui`
- `@macavitymadcap/hyper-dank-data`
- `@macavitymadcap/hyper-dank-transport`
- `@macavitymadcap/hyper-dank-automation`

The packages are currently workspace packages with source imports and local packing scripts.

| Package | Local version | Public subpaths | Peer dependencies | Current distribution finding | Recommendation |
| --- | --- | --- | --- | --- | --- |
| `@macavitymadcap/hyper-dank-ui` | `0.1.0` | `.`, `./styles.css` | `hono`, `typescript` | Not on npm; can build declarations and pack locally | Tarball smoke verifies UI imports plus CSS export from a clean outside workspace |
| `@macavitymadcap/hyper-dank-data` | `0.1.0` | `.`, `./testing` | `typescript` | Not on npm; testing subpath is package-visible | Tarball smoke verifies main and testing subpath imports |
| `@macavitymadcap/hyper-dank-transport` | `0.1.0` | `.` | `hono`, `typescript` | Not on npm; Hono peer is explicit | Install docs name the Hono peer and tarball smoke verifies public imports |
| `@macavitymadcap/hyper-dank-automation` | `0.1.0` | `.`, `./content` | `@playwright/test` optional, `typescript` | Not on npm; content subpath is package-visible | Tarball smoke verifies content subpath imports and install docs explain optional browser tooling |

### Consumption Route Recommendation

Use package tarballs as the first proven downstream-app route:

1. Run the existing `bun run pack:packages` flow.
2. Install the generated package tarballs into a clean directory outside this workspace.
3. Import each public package and subpath through its package name.
4. Verify TypeScript declarations, source imports, CSS export, and peer dependency expectations.
5. Document the route as the supported near-term path.

`bun run test:packages` now executes this route with a temporary Bun app under `/private/tmp`.
It installs the four packed packages, adds required peers, typechecks public imports, resolves the
UI CSS export, and runs a Bun smoke through the public package names. This route matches existing
package scripts, avoids overpromising npm publication, and is easy to replace with npm or GitHub
Packages later because it exercises the package manifests and export maps. GitHub Packages is a
possible follow-up if private registry authentication is acceptable. Public npm publication remains
the best long-term public adoption route, but it should not be claimed until release credentials,
package visibility, and versioning policy are in place.

## Public Surface Classification

| Surface | Current role | Audience | Classification | Recommended owner |
| --- | --- | --- | --- | --- |
| `README.md` | Repository overview, setup, scripts, deployment, workflow, formulas | Adopters and maintainers | Mixed adopter and maintainer reference | `pace-0062` should add package-install entry points; keep detailed local workflow but signpost docs |
| `ARCHITECTURE.md` | System design, boundaries, reference app shape | Adopters, maintainers, contributors | Durable architecture reference | Keep; update only when package or workflow ownership changes |
| `CONTRIBUTING.md` | Branch flow, PR titles, releases, verification | Maintainers and contributors | Maintainer workflow | `pace-0067` should move operational tracking guidance towards GitHub |
| `libs/components/README.md` | UI exports, CSS export, composition patterns, BasicGraph | Package consumer | Package README | `pace-0062` should add install route; `pace-0063` should avoid duplicating Storybook detail |
| `libs/database/README.md` | Data exports, registry, migrations, harnesses | Package consumer | Package README | Add install route and deeper API links |
| `libs/http/README.md` | Transport helpers and boundaries | Package consumer | Package README | Add install route and deeper API links |
| `libs/scripts/README.md` | Automation helpers, content helpers, examples | Package consumer and maintainer | Package README | Add install route, explain optional Playwright peer, link API docs |
| `site/index.md` | Public home page | Adopter | Positioning | `pace-0066` should sharpen value and limits after install route is known |
| `site/system.md` | Framework philosophy and package boundaries | Adopter | Conceptual docs | Keep as the main system explainer |
| `site/libraries.md` | Package overview | Adopter | Library index | `pace-0065` should make navigation and package map clearer |
| `site/libraries-ui.md` | UI package overview, component groups, BasicGraph | UI adopter | Library docs | Link to Storybook for rendered contracts; avoid duplicating every prop |
| `site/libraries-data.md` | Data API reference | Package adopter | API reference | `pace-0063` should deepen type/function docs |
| `site/libraries-transport.md` | Transport API reference | Package adopter | API reference | `pace-0063` should deepen helper docs |
| `site/libraries-automation.md` | Automation and content helpers | Package adopter | API reference | `pace-0063` should deepen helper docs and content subpath |
| `site/recipes.md` | App-shape recipes | Adopter | Recipe guide | `pace-0065` should list all required packages per recipe |
| `site/storybook.md` | Storybook entry page | UI adopter | Cross-link page | Keep as bridge from docs to rendered reference |
| `site/verification.md` | Verification guidance | Maintainer and script consumer | Mixed workflow/reference | Reframe towards reusable automation checks where public |
| `site/demo.md` | Static Walking Pace demo link | Adopter | Reference-app example | Keep, but label as example app rather than required app shape |

## Storybook Classification

| Storybook surface | Current classification | Action |
| --- | --- | --- |
| `Introduction/Component Philosophy` | Consumer reference with some template language | Keep; explain how the reference map helps a package consumer find contracts |
| `Guides/Template / Usage` | Mixed adopter and maintainer setup guide | Reframe around consuming Hyper-Dank and local reference review |
| `Guides/Template / Application flow` | Reference-app architecture guide | Keep if labelled as reference-app composition; move route/service specifics to docs where needed |
| `Guides/Template / Testing pipeline` | Mostly maintainer workflow | Move to contributor/docs verification or reframe as reusable automation guidance |
| `Guides/About` | Adopter-facing purpose page | Keep only if it explains toolkit purpose and reference-app role; otherwise merge into docs home/about copy |
| `Components/Shared/Core Primitives` | Shared component reference | Keep; expand contracts and improve icon scanability |
| `Components/Shared/Existing Primitives` | Shared component reference | Keep; rename or add signposting so "Surfaces and Metadata" and "Disclosure and Menu" explain use cases |
| `Components/Shared/App Surfaces And Feedback` | Shared component reference | Keep; renamed from the internal "Second Wave Primitives" label and signposted around app shell, navigation, feedback, and data views |
| `Components/Shared/Reusable Patterns` | Shared component reference | Keep; ensure BasicGraph, Accordion, CompactList, and PopoverMenu have clear boundaries |
| `Components/Reference App/*` | Reference-app examples | Keep separated from shared package exports |

## Captured Questions

| Question | Answer | Ticket |
| --- | --- | --- |
| Is Testing Pipeline relevant to library users? | Partly. The Storybook page is mostly maintainer workflow; its reusable verification ideas belong in public automation docs or contributor docs. | `pace-0064`, `pace-0066` |
| Is the reference map useful to consumers? | Yes, if it is presented as a way to find component contracts and not as internal project taxonomy. | `pace-0064` |
| What is App Builder Reuse for? | It should become task language: app recipes, package composition, and downstream adoption paths. Avoid a vague branded term unless a page defines it. | `pace-0065`, `pace-0066` |
| Should the icon catalogue change? | Yes. It is present and tested, but the current grid is basic. It should support scanning, comparison, copyable names, and light/dark review. | `pace-0064` |
| What are Surfaces and Metadata, Disclosure and Menu, and Second Wave Primitives for? | They are useful shared component groups. The app-shell, navigation, feedback, and data-display group now uses the consumer-facing `App Surfaces And Feedback` title; each group should keep explaining when to use it, what contracts it owns, and what remains app-owned. | `pace-0064` |
| Is the About page needed? | It is useful only if it explains toolkit purpose and reference-app role. If it stays, keep it adopter-facing and avoid project-history drift. | `pace-0064`, `pace-0066` |
| Should recipes behave like library docs? | Yes. Each recipe should name the required packages, imports, app-owned responsibilities, verification path, and links to API/Storybook references. | `pace-0065` |
| Should the libraries sidebar expand/collapse? | Yes, if it remains accessible and improves scanability. The docs site should not add heavy client-side navigation for this. | `pace-0065` |

## Accepted Coverage Map

| Ticket | Required output from this audit |
| --- | --- |
| `pace-0062` | Prove external package-tarball installation first; then update root and package README install guidance from the verified route |
| `pace-0063` | Deepen non-UI API docs for data, transport, automation, and content helpers; keep UI docs as setup plus Storybook links |
| `pace-0064` | Rework Storybook signposting, icon catalogue, guide/reference pages, and reference-app labels without adding new primitives |
| `pace-0065` | Improve docs navigation and recipe structure so package requirements and app-owned boundaries are explicit |
| `pace-0066` | Run the final public copy pass after install route, API docs, Storybook, and navigation decisions are implemented |
| `pace-0067` | Define the GitHub Issues/Projects workflow and identifier prefix after historical ticket reconciliation is complete |

## Candidate Checks

Add checks only where they protect real drift:

- Package export reference check: compare documented package names and important exports against
  `libs/*/src/index.ts` and package export maps.
- Public/private wording check: keep private app names and maintainer-only terms out of public docs
  and Storybook shared component copy.
- Link smoke check: verify docs-site internal links after build.
- Storybook classification check: keep shared stories under `Components/Shared`, reference-app
  stories under `Components/Reference App`, and guide pages out of the component catalogue.
- Installation smoke: install packed packages into a clean external directory and import package
  main paths plus `@macavitymadcap/hyper-dank-ui/styles.css`,
  `@macavitymadcap/hyper-dank-data/testing`, and
  `@macavitymadcap/hyper-dank-automation/content`.

## Deferred Work

- Public npm publishing is deferred until `pace-0062` decides whether package-tarball consumption
  is sufficient for the next downstream app.
- Generated TypeScript API docs are deferred unless `pace-0063` proves hand-maintained Markdown is
  too brittle.
- Starter templates and generators are deferred until installable package contracts are proven.
- Bulk GitHub issue creation is deferred until `pace-0067` defines the project-management model.
