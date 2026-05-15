# Walking Pace Tracker

A small walking pace tracker built with Hono, HTMX, Bun, TypeScript, JSX, and SQLite.

The app records walks, calculates average speed and median pace, supports light/dark mode, and uses server-rendered HTML fragments instead of a client-side framework.

The goal is not only to track pace, but to act as a compact template for Hono + HTMX front ends: routes render semantic HTML, HTMX swaps focused fragments, component styles stay colocated, and tests exercise the same app factory used in production.

For the design philosophy and template patterns behind the app, see [ARCHITECTURE.md](./ARCHITECTURE.md).

For the solo-maintainer branch workflow, Conventional Commit PR titles, and release/versioning process, see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Screenshots

| Light | Dark |
| --- | --- |
| ![Walking Pace Tracker in light mode](./docs/images/walking-pace-light.png) | ![Walking Pace Tracker in dark mode](./docs/images/walking-pace-dark.png) |

## Requirements

- [Bun](https://bun.sh/)

## Stack

Runtime and app:

- [Bun](https://bun.sh/) for the runtime, package manager, test runner, and TypeScript execution.
- [Hono](https://hono.dev/) for the HTTP app and route composition.
- [HTMX](https://htmx.org/) for HTML-over-the-wire form submission and fragment swaps.
- [TypeScript](https://www.typescriptlang.org/) and [JSX](https://www.typescriptlang.org/docs/handbook/jsx.html) for typed server-rendered components.
- [SQLite](https://www.sqlite.org/) through Bun's SQLite APIs for simple local persistence.

Styling and verification:

- [Open Props](https://open-props.style/) for low-level CSS tokens.
- [Pa11y](https://pa11y.org/) for automated accessibility checks.
- [Puppeteer](https://pptr.dev/) for PR screenshot capture.

The component structure is inspired by [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/), but used as a vocabulary rather than a rigid rulebook: atoms are primitives, molecules combine primitives, organisms own feature regions, and pages compose the screen.

## Setup

```bash
bun install
```

## Run Locally

```bash
bun run dev
```

The dev server runs on `http://localhost:3000` by default.

You can change the port or database path with environment variables:

```bash
PORT=3100 DB_PATH=/tmp/walking-pace.sqlite3 bun run dev
```

## Scripts

```bash
bun run dev
bun run protect:main
bun run screenshots:pr
bun run test
bun run test:a11y
bun run test:watch
bun run typecheck
```

## Testing

Run the full test suite:

```bash
bun run test
```

Run the TypeScript checker:

```bash
bun run typecheck
```

Run the pa11y accessibility check against a temporary in-memory app server:

```bash
bun run test:a11y
```

Capture Samsung Galaxy A5-sized PR screenshots and update the open pull request image table:

```bash
bun run screenshots:pr -- --persist
```

By default, `bun run screenshots:pr` writes ignored local review images to `.cache/pr-screenshots/<branch>/`. Use `--persist` when a pull request needs repo-hosted images in its screenshot table. Persisted screenshots are written to `docs/pr-screenshots/<branch>/`, staged with `git add -f`, and used to update the PR body when GitHub credentials are available. Use `bun run screenshots:pr -- --commit-and-push` to also commit and push generated images, or `bun run screenshots:pr -- --update-pr-only` to reuse already-pushed persisted screenshots and only update the PR body.

The test suite covers:

- component rendering contracts
- Hono full-page and error route behavior
- HTMX fragment mutation contracts
- WCAG 2 AA accessibility checks with pa11y
- SQLite repository behavior with in-memory databases
- validation and pace calculations

## Repository Workflow

CI is configured in `.github/workflows/ci.yml` and runs `bun run typecheck`, `bun run test`, and `bun run test:a11y` on branch pushes and pull requests to `main`.

`main` should be protected as PR-only with passing CI, a Conventional Commit PR title, and resolved conversations. Approving reviews are disabled for the solo-maintainer workflow because GitHub does not allow a PR author to approve their own PR for branch protection. After pushing this branch, apply the repository protection with:

```bash
bun run protect:main
```

See [.github/BRANCH_PROTECTION.md](./.github/BRANCH_PROTECTION.md) for the exact settings. Version bumps are prepared by release-please after merges to `main`.

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3000` | HTTP port used by Bun |
| `DB_PATH` | `walking-pace.sqlite3` | SQLite database file path |

SQLite database files and sidecar files are ignored by Git.

## Project Structure

```text
src/
├── app.tsx                    # Hono app factory
├── index.ts                   # Bun runtime entrypoint
├── app.test.tsx               # route behavior tests
├── htmx.test.tsx              # HTMX fragment contract tests
├── components/                # server-rendered JSX components
│   ├── atoms/                 # primitive controls, cards, cells, styles, and tests
│   ├── molecules/             # composed UI pieces such as labelled outputs, rows, and reusable tables
│   ├── organisms/             # feature sections such as forms and tables
│   ├── pages/                 # full-page compositions
│   ├── templates/             # document shell and shared assets
│   └── styles.ts              # SSR style aggregation boundary
├── db/                        # repository, model, and pace math
└── walks/                     # walk input validation
scripts/
├── add-pr-screenshots.ts      # mobile PR screenshot capture and PR table updates
├── configure-main-protection.ts
├── test-a11y.ts
└── lib/                       # shared script helpers for GitHub, serving, and process calls
```

## Formulas

- **Speed (mph)** = miles / (minutes / 60 + seconds / 3600)
- **Pace (min/mi)** = (minutes + seconds / 60) / miles
- **Average speed** = average of valid walk speeds
- **Median pace** = median of valid walk paces
