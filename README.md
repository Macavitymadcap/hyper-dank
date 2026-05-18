# Hyper-Dank

Hyper-Dank is a hypermedia-first Bun workspace for building server-rendered Hono, HTMX,
TypeScript, and JSX applications with reusable component, database, and HTTP helper packages.

The repository includes Walking Pace Tracker as the reference app and public demo. The full Hono app
records user-scoped walks, calculates average speed and median pace, supports light/dark mode, and
uses server-rendered HTML fragments instead of a client-side framework.

The public production site is GitHub Pages: Jekyll documentation at `/`, a browser-only
localStorage pace demo at `/pace/`, and Storybook at `/storybook/`.

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
- [Better Auth](https://www.better-auth.com/) for production email/password users, sessions, roles, and admin account controls.
- [Kysely](https://kysely.dev/) for the Postgres dialect used by Better Auth.
- [SQLite](https://www.sqlite.org/) through Bun's SQLite APIs for simple local/test persistence.
- [PostgreSQL](https://www.postgresql.org/) for production persistence when `DATABASE_URL` is configured.
- [node-postgres](https://node-postgres.com/) (`pg`) for Postgres connections and queries.
- [Resend](https://resend.com/) for invitation email delivery when configured.

Styling and verification:

- [Vite](https://vite.dev/) for browser CSS, client JavaScript, static assets, production manifests, and Storybook bundling.
- [Biome](https://biomejs.dev/) for formatting, linting, and import organization.
- [Open Props](https://open-props.style/) for low-level CSS tokens.
- [Storybook](https://storybook.js.org/) for isolated component and app-state review.
- [Playwright](https://playwright.dev/) for browser E2E coverage and PR screenshot capture.
- [Pa11y](https://pa11y.org/) for automated accessibility checks.
- [`@types/bun`](https://www.npmjs.com/package/@types/bun), [`@types/pg`](https://www.npmjs.com/package/@types/pg), and TypeScript peer types for local typechecking.

The component structure is inspired by [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/), but used as a vocabulary rather than a rigid rulebook: atoms are primitives, molecules combine primitives, organisms own feature regions, and pages compose the screen.

## Setup

```bash
bun install
```

## Run Locally

```bash
bun run dev
```

The app dev server runs on `http://localhost:3000` by default. `bun run dev` also starts Vite on `http://localhost:5173` so the server-rendered layout can load browser CSS, HTMX, and theme behaviour from the Vite dev server.

You can change the port or database path with environment variables:

```bash
PORT=3100 DB_PATH=/tmp/walking-pace.sqlite3 bun run dev
```

To review the authenticated UI locally with SQLite, seed an admin into a file-backed database and
run the dev server against the same path:

```bash
DB_PATH=/tmp/pace-review.sqlite3 \
ADMIN_EMAIL=admin@example.com \
ADMIN_PASSWORD=password123 \
bun run seed:admin

DB_PATH=/tmp/pace-review.sqlite3 bun run dev
```

Then sign in at `http://localhost:3000/login` with the seeded email and password.

For a richer local review database with multiple account states and walk histories, use the dev
presets:

```bash
DB_PATH=/tmp/pace-review.sqlite3 bun run seed:dev
DB_PATH=/tmp/pace-review.sqlite3 bun run dev
```

All preset users use the password `password123`.

| Email | Role/state | Profile |
| --- | --- | --- |
| `admin@example.com` | Admin | Account management and read-only user score review |
| `walker@example.com` | User | Regular account with a few typical walks |
| `history@example.com` | User | Long walk history for table scrolling |
| `empty@example.com` | User | No walks yet |
| `banned@example.com` | Banned user | Admin banned-state review |

Set `DATABASE_URL` to use Postgres instead of SQLite:

```bash
DATABASE_URL=postgres://user:password@localhost:5432/pace bun run dev
```

When SQLite is used, app and local auth data are stored in SQLite. Production auth persistence uses
Better Auth with Postgres when `DATABASE_URL` is set.

## Scripts

```bash
bun run dev
bun run dev:app
bun run dev:assets
bun run build
bun run check
bun run check:deprecations
bun run coverage
bun run coverage:check
bun run db:migrate
bun run format
bun run format:check
bun run lint
bun run protect:main
bun run screenshots:pr
bun run seed:admin
bun run seed:dev
bun run start
bun run storybook
bun run storybook:build
bun run test
bun run test:a11y
bun run test:e2e
bun run test:e2e:ui
bun run test:healthcheck
bun run test:storybook
bun run test:watch
bun run typecheck
bun run verify
```

## Testing

Run the full test suite:

```bash
bun run test
```

Run the formatter, linter, import sorting check, and deprecated TypeScript API check:

```bash
bun run check
```

Run only the deprecated TypeScript API check:

```bash
bun run check:deprecations
```

Run tests with text and browsable coverage output:

```bash
bun run coverage
```

The coverage command writes ignored local artifacts to `coverage/`, including
`coverage/index.html` for browser review and `coverage/lcov.info` for tools that understand LCOV.
It also enforces per-file minimums of 100% function coverage and 80% line coverage. After a
coverage run, `bun run coverage:check` reruns only the threshold check against the current LCOV file.

Run the TypeScript checker:

```bash
bun run typecheck
```

Run the pa11y accessibility check against a temporary in-memory app server:

```bash
bun run test:a11y
```

Run Playwright browser workflows against a seeded in-memory app server:

```bash
bun run test:e2e
```

Smoke-test the production start command and health endpoint:

```bash
bun run test:healthcheck
```

Run Storybook locally, build it, or execute the Storybook test runner:

```bash
bun run storybook
bun run storybook:build
bun run test:storybook
```

Run the ordered verification gate suite and write a Markdown report:

```bash
bun run verify
```

The verifier runs static checks, typechecking, unit tests, build, the production healthcheck,
package compatibility, Storybook browser tests, Playwright E2E, Pa11y, and `git diff --check` in fail-fast order. It
writes `.cache/verification-report.md`, prints the same report, and marks later gates as not run
when an earlier gate fails. Set `VERIFY_REPORT_PATH` to write the report somewhere else.

Storybook includes per-component docs and controls for atoms, molecules, and organisms, plus a
shared app-style light/dark switch that applies the same theme mode across every story. The
production build publishes the static Storybook site under `/storybook/` on the same domain as the
app.

Capture Samsung Galaxy A5-sized PR screenshots with Playwright and update the open pull request image table:

```bash
bun run screenshots:pr -- --persist
```

By default, `bun run screenshots:pr` writes ignored local review images to `.cache/pr-screenshots/<branch>/`. Screenshot behaviour is flow-driven: use `--flow walks` for the original tracker states, `--flow pace-0002` for the auth/admin review states, `--all-flows` for every configured flow, or `--list-flows` to inspect the available set. Use `--persist --no-stage` to write ignored local files under `docs/pr-screenshots/<branch>/` for manual review. Use `--commit-and-push` when a pull request explicitly needs repo-hosted images, or `--update-pr-only` to reuse already-pushed persisted screenshots and only update the PR body.

The test suite covers:

- component rendering contracts
- generic component-library exports
- Hono full-page and error route behaviour
- HTMX fragment mutation contracts
- Playwright E2E workflows for auth, walk mutations, stats refresh, and admin score review
- Storybook stories for generic components and important app states
- Better Auth provider integration and invitation acceptance
- WCAG 2 AA accessibility checks with pa11y
- SQLite repository behaviour with in-memory databases, including user scoping
- shared database provider and repository adapter contracts, with optional Postgres conformance via `TEST_DATABASE_URL`
- validation and pace calculations

## Forms And Progressive Enhancement

Interactive forms use the shared `HxForm` molecule. Each form renders native `method` and `action`
attributes first, then adds HTMX attributes such as `hx-post`, `hx-delete`, `hx-target`, and
`hx-swap` for JavaScript-enabled fragment updates.

The native fallback is intentional:

- sign in, sign out, invitation acceptance, admin actions, and walk creation submit as ordinary POST forms when JavaScript is unavailable
- walk clear buttons use HTMX `DELETE` for fragment updates, plus POST fallback routes for browsers without JavaScript
- admin account links keep normal `href` navigation while using `hx-get` and `hx-push-url` when HTMX is available
- theme switching is convenience-only, so the default readable theme remains usable without JavaScript

## Repository Workflow

CI is configured in `.github/workflows/ci.yml` and runs `bun run verify` on branch pushes and pull requests to `main`. The verifier runs the same ordered gates used locally, uploads `.cache/verification-report.md`, and stops at the first failed component or test framework. The `check` gate includes Biome plus TypeScript deprecation diagnostics, so editor deprecation warnings fail before merge.

The project uses an epic-and-ticket branch flow. Create an epic branch from `main`, such as `pace-0003`, and make its first commit the detailed epic plan plus ticket plans under `docs/epics/` and `docs/tickets/`. Open that epic branch as a draft PR into `main`. Then create ticket branches such as `pace-0004` from the epic branch and open those PRs back into the epic branch. The epic PR is merged to `main` only after its ticket PRs are complete.

`main` should be protected as PR-only with passing CI, branch-flow validation, a Conventional Commit PR title, and resolved conversations. Approving reviews are disabled for the solo-maintainer workflow because GitHub does not allow a PR author to approve their own PR for branch protection. After pushing this branch, apply the repository protection with:

```bash
bun run protect:main
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full epic/ticket flow and [.github/BRANCH_PROTECTION.md](./.github/BRANCH_PROTECTION.md) for the exact protection settings. Version bumps are prepared by release-please after epic branches merge to `main`.

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3000` | HTTP port used by Bun |
| `VITE_PORT` | `5173` | Vite dev-server port used by `bun run dev` |
| `VITE_DEV_SERVER_URL` | inferred from `VITE_PORT` | Explicit Vite dev-server origin for layout asset tags |
| `DB_PATH` | `walking-pace.sqlite3` | SQLite database file path |
| `DATABASE_URL` | unset | Postgres connection string; when set, the app uses Postgres instead of SQLite |
| `BETTER_AUTH_SECRET` | Better Auth dev default | Secret used by Better Auth for signing/encryption |
| `BETTER_AUTH_URL` | inferred locally | Public base URL used for auth and invite links |
| `RESEND_API_KEY` | unset | Sends invitation email when paired with `EMAIL_FROM` |
| `EMAIL_FROM` | unset | Verified sender address for invitation email |
| `USER_LIMIT` | `10` | Maximum total users, with pending invitations counted before creation |
| `ADMIN_EMAIL` | unset | Email used by `bun run seed:admin`; set `DB_PATH` for local SQLite or `DATABASE_URL` for Postgres |
| `ADMIN_PASSWORD` | unset | Password used by `bun run seed:admin`; must be at least 8 characters |
| `ADMIN_NAME` | `Admin` | Display name used when seeding the first admin |
| `TEST_DATABASE_URL` | unset | Optional disposable Postgres database for adapter contract tests |

SQLite database files and sidecar files are ignored by Git.

`bun run seed:dev` is local-only and refuses to run when `DATABASE_URL` is set. It replaces only the
preset local SQLite users and their walks, leaving other local accounts untouched.

## GitHub Pages Deployment

Production deploys are managed by `.github/workflows/deploy.yml`. The workflow runs when changes land
on `main`, builds the Hyper-Dank Jekyll docs, builds the static pace demo, builds Storybook, and
publishes one GitHub Pages artifact.

The published routes are:

- `/` for Hyper-Dank documentation from `site/`
- `/pace/` for the static Walking Pace demo backed by `localStorage`
- `/storybook/` for the static Storybook build

The workflow resolves the GitHub Pages project path from the current repository name. Before the
manual repository rename completes, a `main` deploy builds links for `/pace-calculator`; after the
rename it builds links for `/hyper-dank`. You can override this with a `PAGES_BASE_PATH` repository
variable, and you should rerun the deploy workflow after the rename to publish the stable
`/hyper-dank` paths.

Prepare the same deployment inputs locally with:

```bash
PACE_DEMO_BASE=/hyper-dank/pace/ bun run build:pages-assets
PAGES_BASE_PATH=/hyper-dank bun run prepare:pages-source
```

The workflow prepares a Jekyll source copy with the resolved `baseurl`, uses GitHub's Jekyll Pages
action to build that source, then `bun run prepare:pages` copies the Vite-built pace demo into
`pace/` and Storybook into `storybook/`.

After this epic lands, rename the GitHub repository manually from `Macavitymadcap/pace-calculator` to
`Macavitymadcap/hyper-dank`. The branch prefix remains `pace`.

## Server App Deployment

The authenticated Walking Pace app still runs locally with `bun run dev` and can be deployed as a
server app by a downstream consumer, but it is no longer the production deployment target for this
repository. Server deployments need a Bun runtime plus SQLite or Postgres configuration.

Railway remains a supported downstream deployment pattern for server apps such as Character Sheet.
This monorepo keeps the server pieces those apps need:

- `Dockerfile` builds the Bun workspace and copies app/package build output.
- `bun run start` starts the Walking Pace Hono server from the repository root.
- `bun run db:migrate` runs app database migrations.
- `bun run seed:admin` seeds or upgrades the first admin account.
- `/healthz` remains the server health check route.

For Railway-style deployments, use `bun run db:migrate` as a pre-deploy command, `bun run start` as
the start command, and `/healthz` as the health check path. See
[`docs/deployment/railway.md`](./docs/deployment/railway.md) for the reusable runbook and example
configuration.

## Project Structure

```text
apps/
└── walking-pace/
    ├── static-demo/           # Vite HTML entry for the public localStorage demo
    ├── src/
    │   ├── client/            # Vite browser entry and bundled CSS
    │   ├── app.tsx            # public app factory export
    │   ├── index.ts           # Bun runtime entrypoint
    │   ├── components/        # app-specific JSX components, pages, and templates
    │   ├── auth/              # auth provider boundary, Better Auth, SQLite local auth, and test provider
    │   ├── db/                # app repository contracts, providers, migrations, and pace math
    │   ├── envs/              # local environment fixtures and seed presets
    │   ├── http/              # Hono app factory, route classes, request helpers, and route tests
    │   ├── services/          # application services such as invitations and email delivery
    │   ├── stories/           # app Storybook rendering helpers and sample states
    │   └── walks/             # walk input validation
    ├── scripts/               # app dev, E2E, a11y, screenshots, seeds, and verification helpers
    └── public/                # static files copied by Vite
libs/
├── components/                # reusable server-rendered component package
├── database/                  # shared database lifecycle and migration primitives
└── http/                      # reusable form parsing and HTTP response helpers
site/                          # Jekyll source for the public Hyper-Dank documentation
e2e/
├── tests/walking-pace/        # Playwright browser workflows
└── consumer-compat/           # package consumer compatibility tests
```

## Formulas

- **Speed (mph)** = miles / (minutes / 60 + seconds / 3600)
- **Pace (min/mi)** = (minutes + seconds / 60) / miles
- **Average speed** = average of valid walk speeds
- **Median pace** = median of valid walk paces
