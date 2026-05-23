# hd-0012 Publication Copy and Component Sweep

Date: 2026-05-23
Branch: `hd-0012-npm-publication-follow-up`
Preview: `http://127.0.0.1:49237/`

## Scope

- Public docs routes: `/`, `/libraries/`, `/libraries/ui/`, `/libraries/data/`,
  `/libraries/transport/`, `/libraries/automation/`, `/recipes/`, `/accessibility/`.
- Public artefacts: `/pace/` and `/storybook/`.
- npm package presentation for the four published packages.
- Component-library opportunity scan against Material Design, Astro UXDS, and shadcn/ui.

## Evidence

- Mobile viewport: 390 by 844.
- Desktop viewport: 1440 by 1000.
- Render checks found no horizontal page overflow on sampled docs routes or `/pace/`.
- Library pages now render npm package links and explicit install blocks.
- npm config warnings were traced to user-level `email`, `always-auth`, and `unsafe-perm` keys and
  pruned from `/Users/dank/.npmrc`.

## Implemented in hd-0012

- Package READMEs now describe the packages as live npm packages and link to the static docs site.
- Package metadata now includes per-package `homepage` URLs pointing to the static library docs.
- Docs library pages now link to each package on npm.
- Install examples now use `npm install` first, with local tarball guidance kept for package
  development.
- Package versions moved from `0.1.0` to `0.1.1` so the npm README and metadata updates can be
  published.
- Package readiness checks now require the static docs homepage link and reject package-level
  provenance, keeping provenance workflow-owned.

## Findings and Recommendations

### P2: npm pages need the 0.1.1 documentation release

User impact: the currently published npm pages still show the package copy from `0.1.0` until a new
version is published. That means a reader can install the packages, but may not yet see the static
docs link or the clearer npm-first installation copy on npmjs.com.

Direction: publish the `0.1.1` package set after this PR lands. Verify npm page sidebars show the
new `homepage` links and the README body links to the static docs.

### P2: package onboarding is accurate but still split across several places

User impact: a new adopter can now install packages from `/libraries/`, but the first successful
path still expects them to infer the required `tsconfig` JSX settings from examples or existing
repo knowledge.

Direction: add a short "Consumer setup" page that covers `npm install`, peer dependencies,
`jsxImportSource: "hono/jsx"`, CSS import placement, and the public package smoke shape.

### P2: component coverage is broad, but several expected generic primitives are missing

User impact: the UI package already covers many server-rendered app basics, but app teams will still
recreate common primitives such as tooltips, skeleton loading, separators, keyboard hints, avatars,
sliders, command search, and richer feedback patterns.

Direction: fill the library in thin generic slices rather than one large component drop. Prioritise
low-state primitives first, then higher-state selection and feedback patterns.

### P2: feedback/status semantics need a stronger shared model

User impact: `Notice`, `StatusSummary`, `ValidationSummary`, `Badge`, and `Progress` cover pieces of
feedback, but there is no consistent severity/status vocabulary that combines text, colour, and
shape. Apps may overuse colour or invent incompatible severity labels.

Direction: add `StatusSymbol`, `NotificationBanner`, and `ToastRegion` primitives with explicit
severity contracts, non-colour affordances, and guidance for when to use inline, banner, toast, or
modal feedback.

### P3: table and dashboard affordances are ready for a second pass

User impact: `ScrollableTable`, `Toolbar`, `Pagination`, `StatusSummary`, and `BasicGraph` make a
solid dashboard base, but data-heavy apps will soon need sortable headings, filter summaries,
column visibility, persisted table preferences, and denser metadata layouts.

Direction: add table subcomponents and docs for sort state, filter chips, row actions, empty/loading
states, and persisted column choices. Keep data operations app-owned.

### P3: docs navigation would benefit from search

User impact: the side navigation and generated page TOCs are useful, but the public reference now
has enough pages and API tables that a direct search or command-palette route would reduce scanning.

Direction: add static docs search over page titles, headings, package names, and component exports.
Keep it local and static so the Pages artefact remains deployable without a backend.

## Component Inspiration Notes

- Material Design's component catalogue reinforces the value of familiar generic patterns:
  app bars, banners, data tables, dividers, navigation drawers, progress indicators, sliders,
  snackbars, tabs, text fields, and sheets.
- shadcn/ui's component list highlights copy-paste-friendly primitives that Hyper-Dank does not yet
  expose: Avatar, Aspect Ratio, Command, Context Menu, Hover Card, Kbd, Separator, Sheet, Sidebar,
  Skeleton, Slider, Toast, Toggle, Tooltip, and richer Data Table patterns.
- Astro UXDS is especially relevant for operational tools: its Status System combines colour and
  shape, reserves urgent colour for urgent states, and treats notifications as a hierarchy from log
  entries through banners to modal dialogs.

## Suggested Follow-Up Tickets

| Ticket | Title | Priority | Notes |
| --- | --- | --- | --- |
| `hd-0013` | Add a consumer setup page for published packages | P2 | npm install, peers, Hono JSX tsconfig, CSS import, external smoke. |
| `hd-0014` | Add low-state UI primitives | P2 | Tooltip, Skeleton, Separator, Kbd, Avatar, AspectRatio. |
| `hd-0015` | Add command and selection primitives | P2 | Command, Combobox, MenuButton/ContextMenu guidance, richer select/search docs. |
| `hd-0016` | Add shared status and notification primitives | P2 | StatusSymbol, NotificationBanner, ToastRegion, severity vocabulary. |
| `hd-0017` | Improve data table and dashboard affordances | P3 | Sort, filters, column visibility, row actions, persisted preferences guidance. |
| `hd-0018` | Add static docs search | P3 | Search page titles, headings, package names, component exports. |

## References

- Material Design components: <https://m2.material.io/components>
- shadcn/ui components: <https://ui.shadcn.com/docs/components>
- Astro UXDS Status System: <https://www.astrouxds.com/design-guidelines/status-system>
- Astro UXDS component tokens: <https://www.astrouxds.com/design-tokens/component/>
- npm package metadata `homepage` field: <https://docs.npmjs.com/cli/v6/configuring-npm/package-json/>
