# Walking Pace Tracker

A small walking pace tracker built with Hono, HTMX, Bun, TypeScript, JSX, and SQLite.

The app records walks, calculates average speed and median pace, supports light/dark mode, and uses server-rendered HTML fragments instead of a client-side framework.

For the design and template patterns behind the app, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Requirements

- [Bun](https://bun.sh/)

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
bun run screenshots:pr
```

The script writes screenshots to `docs/pr-screenshots/<branch>/`, stages them by default, and updates the PR body when GitHub credentials are available. Use `bun run screenshots:pr -- --commit-and-push` to also commit and push the generated images, or `bun run screenshots:pr -- --update-pr-only` to reuse already-pushed screenshots and only update the PR body.

The test suite covers:

- component rendering contracts
- Hono full-page and error route behavior
- HTMX fragment mutation contracts
- WCAG 2 AA accessibility checks with pa11y
- SQLite repository behavior with in-memory databases
- validation and pace calculations

## Repository Workflow

CI is configured in `.github/workflows/ci.yml` and runs `bun run typecheck`, `bun run test`, and `bun run test:a11y` on branch pushes and pull requests to `main`.

`main` should be protected as PR-only with passing CI and at least one approval required. After pushing this branch, apply the repository protection with:

```bash
scripts/configure-main-protection.sh
```

See [.github/BRANCH_PROTECTION.md](./.github/BRANCH_PROTECTION.md) for the exact settings.

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
│   ├── molecules/             # composed UI pieces such as stats and table rows
│   ├── organisms/             # feature sections such as forms and tables
│   ├── pages/                 # full-page compositions
│   ├── templates/             # document shell and shared assets
│   └── styles.ts              # SSR style aggregation boundary
├── db/                        # repository, model, and pace math
└── walks/                     # walk input validation
```

## Formulas

- **Speed (mph)** = miles / (minutes / 60 + seconds / 3600)
- **Pace (min/mi)** = (minutes + seconds / 60) / miles
- **Average speed** = average of valid walk speeds
- **Median pace** = median of valid walk paces
