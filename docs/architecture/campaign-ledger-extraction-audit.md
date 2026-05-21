# Campaign Ledger Generic Extraction Audit

Last reviewed: 2026-05-21

This audit implements `pace-0014` for the `pace-0013` bridge epic. It compares the current
Campaign Ledger codebase with Hyper-Dank's app-builder packages, then ranks which generic patterns
should be extracted in `pace-0015`. Campaign Ledger is evidence, not a dependency: shared
Hyper-Dank code must remain app-neutral and useful for future dashboards, blogs, static web books,
and branching narrative sites.

## Source Context

| Source | Evidence Used | Notes |
| --- | --- | --- |
| Campaign Ledger README and architecture | Local-first Hono/HTMX app, auth UI, role-aware shell, public/local play, campaign assets, wiki rendering, hosted rehearsal, verification | The app has diverged from the original template and now proves repeated patterns beyond Walking Pace. |
| Campaign Ledger components | `PasswordField`, `SiteHeader`, `Layout`, `DiceRoller`, `LocalPlay`, `Rules`, `Campaign`, `Admin`, sheet tabs, compact panels | Components are useful evidence, but most page and organism names remain product-specific. |
| Campaign Ledger scripts | `test-a11y.ts`, `capture-screenshots.ts`, `smoke-mvp.ts`, `hosted-data.ts`, `scripts/lib/local-app.ts` | Scripts show richer target catalogues, local app setup, role cookies, seeded asset preparation, and acceptance workflows. |
| Hyper-Dank UI package | Current atoms/molecules, Storybook stories, `AppShell`, `PopoverMenu`, `InputGroup`, `Tabs`, `StatBlock`, `ScrollableTable` | The package has broad primitives, but examples can still feel flat without small visualisation and authored-content patterns. |
| Hyper-Dank automation package | Static-content helpers, Pa11y runner, local-server harness, screenshots, verification reports | The package already has the right home for accessibility statements, static docs pages, and future publishing helpers. |
| `pace-0013` planning docs | Generic boundary, future app shapes, accessibility statement support, basic graph candidate, brand polish | This audit keeps implementation brief by selecting no more than three must-do candidate families. |

## Implementation Short-List

`pace-0015` should implement these must-do families first. They are deliberately small and
app-neutral.

| Priority | Candidate | Target | Why now | Generic boundary |
| --- | --- | --- | --- | --- |
| Must-do | Basic graph component | `@macavitymadcap/hyper-dank-ui` | The dashboard/admin examples need lightweight data visualisation to feel credible, and future blogs/books can also use small charts for static facts. | Provide labelled SVG charts and accessible summaries only; no charting framework, animation system, canvas renderer, live data layer, or domain metrics. |
| Must-do | Accessibility statement helper | `@macavitymadcap/hyper-dank-automation/content` or automation docs surface | Every future public site needs a clear accessibility statement with support, testing, limitations, contact path, and review date. | Generate Markdown/page content from app-owned evidence; do not claim legal compliance, certification, or remediation promises. |
| Must-do | Authored-content navigation and choice patterns | `@macavitymadcap/hyper-dank-automation/content`, docs recipes, and existing UI primitives | Blog, static web book, and choose-your-own-adventure work all need metadata, previous/next links, table of contents, choice lists, and action/result examples. | Provide route/navigation metadata helpers and recipes; no blog starter, book compiler, save-state engine, randomiser, combat/rules engine, or authoring DSL. |

If one of these grows beyond a focused additive change during implementation, keep the highest-value
piece and move the rest to a follow-up ticket.

## Candidate Decisions

| Candidate | Evidence | Current Hyper-Dank Coverage | Future App Support | Decision | Priority | Target | Generic Boundary | Required Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Basic graph component | Current dashboard/admin examples are useful but visually thin; Campaign Ledger admin/campaign surfaces show repeated dense operational data needs | `StatBlock`, `StatusSummary`, `ScrollableTable`, and `Progress` exist, but no small chart or graph primitive exists | Dashboard, blog, static web book | Extract | Must-do | UI package, Storybook, compatibility examples | SVG-only, static data, labels and summaries; no full charting framework | Render tests, Storybook, a11y notes, app-shape recipe |
| Accessibility statement helper | Campaign Ledger and Hyper-Dank both use Pa11y and screenshots, but neither provides reusable public statement copy | Pa11y runners and static-content helpers exist, but no statement data contract or Markdown generator exists | Dashboard, blog, static web book, branching narrative, Campaign Ledger adoption | Extract | Must-do | Automation content subpath or automation package, docs site recipe | Apps own audit evidence, limitations, contact route, and compliance claims | Unit tests, docs page example, README/library docs |
| Authored-content navigation and choice patterns | Campaign Ledger wiki pages, public local play, and rules pages prove content plus small interactions; future projects include blog, web book, CYOA | Static-content helpers discover and render Markdown pages, but do not yet model collections, previous/next navigation, or choice/action recipes | Blog, static web book, branching narrative | Extract/document | Must-do | Automation content helpers, recipes, compatibility tests if exported | Helpers stay metadata/navigation level; no engine, compiler, save system, or schema lock-in | Unit tests for metadata/navigation helpers, recipes with public imports |
| Password visibility field | Campaign Ledger `PasswordField` uses labelled password input plus show/hide button | `InputGroup` can render password inputs, but not visibility controls | Campaign Ledger adoption, dashboard/admin | Defer | Useful follow-up | UI package or recipe | Password policy, invite/reset flows, and validation stay app-owned | Render tests and Storybook if later extracted |
| Copy control | Campaign Ledger admin handoff needs copyable invite/reset links | Hyper-Dank has buttons and forms, but no generic copy affordance | Dashboard/admin, accessibility statement contact snippets | Defer | Useful follow-up | UI package or docs recipe | Token generation, URL construction, and access control stay app-owned | Render tests, progressive fallback docs |
| App header/shell refinements | Campaign Ledger `SiteHeader` combines brand, theme switch, user summary, and menu | Hyper-Dank has `AppShell`, `PopoverMenu`, `Switch`, `Toolbar`, `SideNav` | Dashboard/admin, Campaign Ledger adoption | Defer | Useful follow-up | UI docs or `AppShell` improvements | Route maps, roles, auth user shape, and sign-out policy stay app-owned | Storybook and recipe coverage if later accepted |
| Popover action/result pattern | Campaign Ledger `DiceRoller` uses native popover, HTMX form target, and result output | `PopoverMenu`, `HxForm`, `FormField`, and `Button` cover pieces but not a combined action/result pattern | Dashboard/admin, branching narrative, Campaign Ledger adoption | Document first | Useful follow-up | Recipe; possible later UI primitive | Dice, modifiers, randomisation, and domain calculations stay app-owned | Recipe with neutral action/result example |
| Asset placeholder helper | Campaign Ledger writes seeded placeholder assets and rejects absolute storage paths | Static-content asset copying and safe destination paths exist | Blog, static web book, Campaign Ledger adoption | Defer | Useful follow-up | Automation package or recipe | Storage backend, visibility checks, and content policy stay app-owned | Unit tests with caller-provided paths/bytes if later extracted |
| Role-aware Pa11y target catalogues | Campaign Ledger has public/player/GM/admin target lists with cookies | `runPa11yTargets()` supports targets and cookies, but target preparation remains app-local | Dashboard/admin, Campaign Ledger adoption | Document | Useful follow-up | Automation docs/recipe | Seeded users and login flow stay app-owned | Recipe showing target catalogue shape |
| Hosted rehearsal acceptance checklist | Campaign Ledger documents hosted SQLite/asset rehearsal and manual account handoff | Hyper-Dank has verification reports and local server helpers | Campaign Ledger adoption | Document | Useful follow-up | Recipes/docs | Deployment target, secrets, and operator workflow stay app-owned | Docs-only |
| Safe campaign wiki renderer | Campaign Ledger renderer handles limited Markdown and `asset:` references | Static-content renderer already handles Markdown, tables, assets, and safe paths | Static web book, blog | Observe | Useful follow-up | Future content helper only if second project needs it | Campaign page types and private content stay app-owned | No source extraction now |
| Dice roller | Campaign Ledger `DiceRoller` is polished and useful in its domain | No equivalent, intentionally | None as a domain component | Reject | Reject | N/A | Dice, advantage/disadvantage, character modifiers, and D&D semantics stay app-owned | None |
| D&D rules/source models | Campaign Ledger rules importer, source categories, stat blocks, and rule links | Hyper-Dank data helpers are schema-neutral | None as domain model | Reject | Reject | N/A | Rules schemas, SRD policy, stat blocks, and private source policy stay app-owned | None |

## Future App Shape Review

### Dashboard/Admin

The dashboard examples need a basic data-visualisation primitive. The useful generic piece is a
small labelled SVG graph that can sit next to `StatBlock`, `StatusSummary`, and `ScrollableTable`.
It should accept app-provided data, expose an accessible title/summary, and render static examples
without a browser charting dependency.

### Blog

The static-content package already discovers Markdown pages and renders HTML. The next useful slice
is metadata and collection guidance: post lists, tags/categories, previous/next links, route
generation, and static checks. Feed generation and search indexes are worth noting, but should stay
hooks or follow-ups rather than becoming a starter app.

### Static Web Book

A web book needs chapter order, table of contents, stable anchors, previous/next navigation,
footnotes/callouts, and asset references. `pace-0015` should only add metadata/navigation helpers
or recipes that reuse existing Markdown rendering. EPUB/PDF export, editorial workflows, and a
custom book schema are out of scope.

### Branching Narrative

A choose-your-own-adventure site needs choice lists, action/result panels, progress/history display,
and local browser state guidance. The shared layer should provide examples and neutral UI patterns,
not a story graph engine or save system. The `DiceRoller` is useful only as evidence for native
popover plus result-region mechanics.

## Accessibility Statement Review

Hyper-Dank should add reusable accessibility statement support if it fits the short implementation
slice. The helper should accept app-owned inputs and render Markdown that a static site can publish.

Recommended input fields:

| Field | Purpose |
| --- | --- |
| `siteName` | Human-readable site or app name. |
| `statementDate` | Date the statement was last reviewed. |
| `supportSummary` | Plain description of accessibility support provided. |
| `testing` | Manual and automated checks the app actually runs, such as Pa11y targets, keyboard review, screenshots, and contrast checks. |
| `knownLimitations` | Specific unsupported states, third-party content, browser constraints, or unresolved issues. |
| `contact` | App-owned issue reporting, email, or repository path. |
| `reviewCadence` | Optional review schedule or trigger, such as before major releases. |

The helper must not create unsupported claims such as "fully WCAG compliant" unless an app supplies
its own evidence and wording. It should make limitations and contact paths easy to include because
honest statements are more useful than vague compliance copy.

## Package Boundary Notes

- UI can own static graph rendering, labels, summaries, class hooks, and Storybook examples.
- UI should not own data fetching, analytics semantics, animation, or chart framework concerns.
- Automation/content can own Markdown statement generation and static page recipes.
- Automation/content can own authored-content metadata helpers only while they stay schema-light and
  static-site friendly.
- Apps own domain models, private content policy, auth, permissions, storage backends, route maps,
  smoke journeys, and legal/accessibility claims.
- Public docs should describe dashboard, blog, static book, branching narrative, and admin examples
  without naming Campaign Ledger or private app roadmaps.

## `pace-0015` Scope Recommendation

Implement the short-list in this order:

1. Basic graph component and Storybook/docs examples, because it directly improves dashboard
   examples and is easiest to keep bounded.
2. Accessibility statement Markdown/static-page helper, because it supports every public site and
   pairs naturally with existing Pa11y/static-content helpers.
3. Authored-content metadata/navigation recipes or the smallest helper needed for previous/next and
   choice-list examples, because it supports blog, web book, and branching narrative without an
   engine.

Do not implement password visibility, copy controls, app header extraction, asset placeholder
helpers, or role-aware verification catalogues in `pace-0015` unless one of the three short-list
items is deliberately dropped first.

