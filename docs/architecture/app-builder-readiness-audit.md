# App-Builder Readiness Audit

This audit implements `pace-0051` for the `pace-0050` app-builder readiness epic. It fixes the
component directory for the next UI tickets, records package API rules, and maps documentation gaps
before source implementation begins.

## Current Strengths

- `@macavitymadcap/hyper-dank-ui` already exports useful server-rendered JSX primitives from
  `libs/components/src/index.ts`: actions, cards, badges/chips, form wrappers, compact lists,
  scrollable tables, popover menus, and HTMX-aware props.
- Shared CSS is already centralised in `libs/components/src/styles.css` and tested by
  `libs/components/src/styles.test.ts`.
- `@macavitymadcap/hyper-dank-data` has a small lifecycle and migration contract in
  `libs/database/src/index.ts`, with testing helpers under the package testing subpath.
- `@macavitymadcap/hyper-dank-transport` provides the right first layer for Hono/HTMX route
  mechanics: `FormValues`, `routeParam`, `errorMessage`, and `HttpResponder`.
- `@macavitymadcap/hyper-dank-automation` already contains reusable process, GitHub, verification,
  local server, browser, PR image, and Pa11y helpers.
- The docs build in `apps/walking-pace/scripts/lib/docs-build.ts` proves a reusable static-content
  path is viable: front matter, Markdown rendering, route generation, document chrome, assets, and
  code highlighting are all present.

## Main Gaps

- Storybook coverage is incomplete for shared components. `Badge`, `Icon`, `Panel`, `Accordion`,
  `CompactList`, and `PopoverMenu` have tests but no dedicated stories.
- Storybook currently mixes generic components, Walking Pace reference components, and guide pages
  without a strong enough reader boundary between reusable package exports and domain examples.
- The public UI docs are too table-heavy for non-UI package APIs and too shallow for method,
  parameter, return, error, and example descriptions.
- Package READMEs are concise but not yet app-builder-ready: they need clearer export policy,
  boundary notes, richer links, and removal of private-consumer phrasing.
- `site/verification.md` exposes internal process detail that is less useful for public package
  adopters than framework philosophy and recipe-level verification guidance.
- `site/system.md` is a good start but should become the primary philosophy page for Hyper-Dank's
  HTML-first, Hono/HTMX, Bun, Storybook, and package-boundary model.
- Data helpers stop at lifecycle and migration primitives. New apps still repeat repository
  contracts, provider wiring, repository conformance tests, and migration registry checks.
- Transport helpers do not yet cover common route/action wrappers, validation-result response
  patterns, or consistent HTMX/native fallback helpers beyond redirects.
- Automation helpers do not yet expose a static-content subpath for docs/blog generation, nor a
  role/target catalogue shape for screenshots and a11y checks.

## Public Boundary Issues

The public docs estate means `README.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md`, package READMEs,
`site/`, Storybook guide stories, generated docs, and recipes.

Current public material still contains private-consumer wording in package README examples. Later
docs work must remove private app names and replace them with generic consumer shapes such as
server app, static blog, dashboard/admin, static demo, script consumer, and reference app.

Public docs may say that Hyper-Dank is validated by consumer-style compatibility tests. They should
not name private applications, private domains, or private roadmaps.

## Fixed Component Directory

This is the accepted component directory for `pace-0052` and `pace-0053`. Implementation tickets
must not add components outside this table unless they update `pace-0050` and explain why scope
changed.

| Component | Group | Decision | Target Ticket | Reason | Required Evidence |
| --- | --- | --- | --- | --- | --- |
| `Button` | Action atom | Improve | `pace-0052` | Existing primitive is useful; needs stronger icon/aria examples and density review | Render tests, Storybook states, a11y notes |
| `LinkButton` | Action atom | Add | `pace-0052` | Common navigation/action pattern without forcing button semantics on links | Render tests, Storybook, keyboard/native link notes |
| `IconButton` | Action atom | Add | `pace-0052` | Needed for dense tools, menus, table actions, dialogs, and app shells | Render tests, aria-label contract, Storybook |
| `ButtonGroup` | Action molecule | Add | `pace-0052` | Groups related actions with stable spacing and responsive wrapping | Render tests, Storybook |
| `SegmentedControl` | Form/action molecule | Add | `pace-0052` | Common mode/filter control for dashboards, tools, and demos | Render tests, keyboard notes, Storybook |
| `FormField` | Form molecule | Improve | `pace-0052` | Existing text input wrapper should support help text, errors, and described-by hooks | Render tests, Storybook, a11y notes |
| `InputGroup` | Form molecule | Improve | `pace-0052` | Keep compact numeric/text control but align with field/error contracts | Render tests, Storybook |
| `TextareaField` | Form molecule | Add | `pace-0052` | Static blogs, admin tools, and content workflows need multi-line text | Render tests, Storybook |
| `SelectField` | Form molecule | Add | `pace-0052` | Common filter/settings input with native fallback | Render tests, Storybook |
| `CheckboxField` | Form atom/molecule | Add | `pace-0052` | Needed for settings, filters, consent, and bulk actions | Render tests, keyboard/a11y notes |
| `RadioGroup` | Form molecule | Add | `pace-0052` | Needed for mutually exclusive modes while keeping native form semantics | Render tests, Storybook |
| `Fieldset` | Form molecule | Add | `pace-0052` | Groups related controls with native legend semantics | Render tests, Storybook |
| `ValidationSummary` | Feedback/form molecule | Add | `pace-0052` | Reusable place for form-level errors and anchorable field errors | Render tests, Storybook |
| `Switch` | Form atom | Improve | `pace-0052` | Existing switch works; needs icon strategy alignment and broader examples | Render tests, Storybook, keyboard notes |
| `Icon` | Icon atom | Improve | `pace-0052` | Existing atom lacks Storybook and a broad enough catalogue | Render tests, Storybook icon grid, fallback tests |
| Icon catalogue | Icon set | Add | `pace-0052` | Cover docs, admin, blog, dashboard, static demo, and generic tabletop-adjacent concepts | Storybook grid, alias tests |
| `Badge` | Feedback atom | Improve | `pace-0052` | Existing primitive needs Storybook and tone review | Render tests, Storybook |
| `Chip` | Feedback atom | Improve | `pace-0052` | Existing primitive is useful for compact metadata | Render tests, Storybook |
| `Card` | Surface atom | Improve | `pace-0052` | Keep as a simple repeated-item or content surface, not page-section layout | Render tests, Storybook |
| `Panel` | Surface atom | Improve | `pace-0052` | Existing primitive needs Storybook and clearer section semantics | Render tests, Storybook |
| `TableCell` | Data atom | Improve | `pace-0052` | Existing primitive is useful but should align with richer table states | Render tests, Storybook |
| `Accordion` | Disclosure molecule | Improve | `pace-0053` | Existing native details/summary pattern needs Storybook and guidance | Render tests, Storybook |
| `PopoverMenu` | Navigation/action molecule | Improve | `pace-0053` | Existing menu primitive needs Storybook, icon button trigger guidance, and keyboard notes | Render tests, Storybook |
| `ScrollableTable` | Data molecule | Improve | `pace-0053` | Existing table shell should support richer empty/loading/pagination composition | Render tests, Storybook |
| `CompactList` | Data molecule | Improve | `pace-0053` | Existing metadata list needs Storybook and recipe examples | Render tests, Storybook |
| `LabelledOutput` | Data molecule | Improve | `pace-0053` | Existing stat/output primitive should align with stat summaries | Render tests, Storybook |
| `AppShell` | Layout | Add | `pace-0053` | Common app frame for server apps and dashboards without owning product routes | Render tests, Storybook |
| `PageHeader` | Content/layout | Add | `pace-0053` | Common title, description, actions, and metadata pattern | Render tests, Storybook |
| `SectionHeader` | Content/layout | Add | `pace-0053` | Keeps dense panels and table sections consistent | Render tests, Storybook |
| `Toolbar` | Layout/action | Add | `pace-0053` | Needed for filters, actions, and compact tool rows | Render tests, Storybook |
| `Breadcrumbs` | Navigation | Add | `pace-0053` | Common docs/admin/server-app navigation pattern | Render tests, Storybook |
| `Tabs` | Navigation | Add | `pace-0053` | Common app workspace and docs pattern using links or native buttons as appropriate | Render tests, keyboard notes, Storybook |
| `SideNav` | Navigation | Add | `pace-0053` | Needed for docs, dashboards, and admin sections | Render tests, responsive Storybook |
| `Pagination` | Navigation/data | Add | `pace-0053` | Common list/table navigation with native links/forms | Render tests, Storybook |
| `Dialog` | Overlay | Add | `pace-0053` | Use native `<dialog>` with small trigger/focus glue and HTMX/native fallbacks | Render tests, browser keyboard/focus tests, Storybook |
| `Notice` | Feedback | Add | `pace-0053` | Reusable success/info/warning/error message block | Render tests, Storybook |
| `StatusSummary` | Feedback/data | Add | `pace-0053` | Useful for verification, dashboards, imports, and admin summaries | Render tests, Storybook |
| `Progress` | Feedback | Add | `pace-0053` | Native progress and task status pattern | Render tests, Storybook |
| `LoadingIndicator` | Feedback | Add | `pace-0053` | HTMX-friendly loading affordance without app-specific copy | Render tests, Storybook |
| `EmptyState` | Feedback/content | Add | `pace-0053` | Common blank state for tables, dashboards, and demos | Render tests, Storybook |
| `StatBlock` | Data display | Add | `pace-0053` | Common metric display for dashboards and reference apps | Render tests, Storybook |
| `MetadataList` | Data display | Add | `pace-0053` | More flexible successor/partner to `CompactList` for article/admin metadata | Render tests, Storybook |
| `TimelineList` | Data display | Add | `pace-0053` | Useful for activity, release notes, changelogs, and audit trails | Render tests, Storybook |
| `Prose` | Content | Add | `pace-0053` | Shared readable content wrapper for docs/blog pages | Render tests, Storybook |
| `CodeBlock` | Content | Add | `pace-0053` | Consistent code examples for docs/blog/static sites | Render tests, Storybook |
| `Callout` | Content/feedback | Add | `pace-0053` | Common docs and workflow note pattern | Render tests, Storybook |

## Deferred Components

| Component / Pattern | Reason |
| --- | --- |
| Toast/snackbar region | Needs a broader client behaviour policy and queue/dismissal model. |
| Tooltip | Requires careful hover/focus/touch behaviour; defer until icon/action density proves it is needed. |
| Date picker | Too much behaviour for this epic; native date inputs can remain app-owned. |
| Autocomplete/combobox | Accessibility and keyboard complexity deserve a focused ticket. |
| Data grid | `ScrollableTable`, pagination, and app-owned filters are enough for this epic. |
| Tree view | No current recipe requires it. |
| Stepper/wizard | Route-owned workflows can compose existing primitives first. |
| Charts | App/domain-specific; `StatBlock` and tables cover the common need. |
| Rich text editor | Out of scope for a server-rendered primitives library. |

## Storybook Directory Decision

Storybook should use these top-level groups:

- `Introduction`: Hyper-Dank philosophy and reference map.
- `Components/Shared`: every public `@macavitymadcap/hyper-dank-ui` component.
- `Components/Reference App`: Walking Pace domain components and pages, labelled as examples of
  composition rather than package exports.
- `Guides`: recipes, app-builder guidance, and package usage notes that benefit from rendered
  examples.

Every shared component story should include light/dark review, accessibility notes, prop/reference
details, rendered semantic output notes, and interaction checks where relevant.

## Package API Decisions

- Public exports must be additive unless a ticket explicitly records a breaking change.
- Every public export or subpath needs `package.json` export coverage, README coverage, docs or
  Storybook coverage, tests, and a release-impact note.
- Public API shape should prefer interfaces, factories, and composable helpers. Abstract/base
  classes are allowed only when they remove repeated lifecycle code without hiding app-owned SQL,
  queries, transactions, or adapter setup.
- Compatibility tests should cover at least these consumer shapes: server app, static blog,
  dashboard/admin, static demo, script consumer, and static-content generator.

## Automation Content Subpath Contract

The first static-content API should live at `@macavitymadcap/hyper-dank-automation/content`.

Accepted helper groups:

- Front matter parsing for simple Markdown pages.
- Markdown-to-HTML rendering with headings, lists, tables, fenced code, links, inline code, emphasis,
  and raw HTML passthrough where already supported by the docs build.
- Route/output path generation from filenames and permalinks.
- Site/page metadata types.
- Asset copying and output writing helpers.
- Code-highlighting hook support without coupling consumers to this docs site's layout.

App-owned responsibilities:

- Content collection schema and taxonomy.
- Blog-specific routes, feeds, search indexes, pagination, authors, tags, and archive pages.
- Visual layout and public copy.
- Deployment target and base path policy.

## Docs Audience Map

| Document | Primary Audience | Future Direction |
| --- | --- | --- |
| `README.md` | New adopters and maintainers | Keep concise setup, package overview, reference app, scripts, and deployment links. |
| `ARCHITECTURE.md` | Maintainers and app builders | Keep framework philosophy, package boundaries, app construction, routes, persistence, and testing strategy. |
| `CONTRIBUTING.md` | Maintainers and contributors | Keep branch flow, PR title, verification, release, and review expectations. |
| Package READMEs | Package consumers | Show install/imports, exports, usage boundaries, and links to richer docs or Storybook. |
| `site/` docs | Public adopters | Explain philosophy, package APIs, recipes, deployment, and static-content generation. |
| Storybook | UI consumers and reviewers | Own component details, visual states, interactions, and accessibility notes. |
| `docs/architecture/` | Maintainers | Hold audits, decisions, and implementation planning that does not belong on the public site. |

## Follow-Up Mapping

| Ticket | Audit Output Used |
| --- | --- |
| `pace-0052` | Existing primitive improvements, core atoms/actions/forms/icons, icon catalogue. |
| `pace-0053` | Layout, navigation, dialog, feedback, data-display, and content primitives. |
| `pace-0054` | Data provider/repository/migration helper gaps and API rules. |
| `pace-0055` | `@macavitymadcap/hyper-dank-automation/content` helper contract. |
| `pace-0056` | Transport wrappers, automation target catalogues, screenshots, a11y, and static-site checks. |
| `pace-0057` | Storybook group structure, missing stories, interaction checks, and reference-app boundary. |
| `pace-0058` | Docs audience map, private-reference cleanup, non-UI API docs, and System page direction. |
| `pace-0059` | Consumer-shape compatibility tests and app-builder recipes. |

## Acceptance Notes

- The component directory above is fixed for this epic unless `pace-0050` is explicitly revised.
- `pace-0052` and `pace-0053` should use tests first for semantic HTML, class hooks, HTMX/native
  fallback attributes, keyboard behaviour, and Storybook interaction where relevant.
- Public docs cleanup must include package READMEs and repo-level docs, not only the generated site.
- Implementation can now proceed ticket by ticket without re-deciding component scope, public API
  policy, or the static-content subpath.
