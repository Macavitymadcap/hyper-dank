# Walking Pace Tracker

A small walking pace tracker built with Hono, HTMX, Bun, TypeScript, JSX, Better Auth, SQLite, and Postgres.

The app records user-scoped walks, calculates average speed and median pace, supports light/dark mode, and uses server-rendered HTML fragments instead of a client-side framework.

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
- [Better Auth](https://www.better-auth.com/) for production email/password users, sessions, roles, and admin account controls.
- [SQLite](https://www.sqlite.org/) through Bun's SQLite APIs for simple local/test persistence.
- [PostgreSQL](https://www.postgresql.org/) for production persistence when `DATABASE_URL` is configured.
- [Resend](https://resend.com/) for invitation email delivery when configured.

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
bun run check
bun run check:deprecations
bun run db:migrate
bun run format
bun run format:check
bun run lint
bun run protect:main
bun run screenshots:pr
bun run seed:admin
bun run seed:dev
bun run start
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

Run the formatter, linter, import sorting check, and deprecated TypeScript API check:

```bash
bun run check
```

Run only the deprecated TypeScript API check:

```bash
bun run check:deprecations
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

By default, `bun run screenshots:pr` writes ignored local review images to `.cache/pr-screenshots/<branch>/`. Screenshot behaviour is flow-driven: use `--flow walks` for the original tracker states, `--flow pace-0002` for the auth/admin review states, `--all-flows` for every configured flow, or `--list-flows` to inspect the available set. Use `--persist --no-stage` to write ignored local files under `docs/pr-screenshots/<branch>/` for manual review. Use `--commit-and-push` when a pull request explicitly needs repo-hosted images, or `--update-pr-only` to reuse already-pushed persisted screenshots and only update the PR body.

The test suite covers:

- component rendering contracts
- Hono full-page and error route behaviour
- HTMX fragment mutation contracts
- Better Auth provider integration and invitation acceptance
- WCAG 2 AA accessibility checks with pa11y
- SQLite repository behaviour with in-memory databases, including user scoping
- validation and pace calculations

## Repository Workflow

CI is configured in `.github/workflows/ci.yml` and runs `bun run check`, `bun run typecheck`, `bun run test`, and `bun run test:a11y` on branch pushes and pull requests to `main`. The `check` command includes Biome plus TypeScript deprecation diagnostics, so editor deprecation warnings fail before merge.

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
| `DATABASE_URL` | unset | Postgres connection string; when set, the app uses Postgres instead of SQLite |
| `BETTER_AUTH_SECRET` | Better Auth dev default | Secret used by Better Auth for signing/encryption |
| `BETTER_AUTH_URL` | inferred locally | Public base URL used for auth and invite links |
| `RESEND_API_KEY` | unset | Sends invitation email when paired with `EMAIL_FROM` |
| `EMAIL_FROM` | unset | Verified sender address for invitation email |
| `USER_LIMIT` | `10` | Maximum total users, with pending invitations counted before creation |
| `ADMIN_EMAIL` | unset | Email used by `bun run seed:admin`; set `DB_PATH` for local SQLite or `DATABASE_URL` for Postgres |
| `ADMIN_PASSWORD` | unset | Password used by `bun run seed:admin`; must be at least 8 characters |
| `ADMIN_NAME` | `Admin` | Display name used when seeding the first admin |

SQLite database files and sidecar files are ignored by Git.

`bun run seed:dev` is local-only and refuses to run when `DATABASE_URL` is set. It replaces only the
preset local SQLite users and their walks, leaving other local accounts untouched.

## Railway Deployment

Railway deployment is configured with `Dockerfile` and `railway.json`. The Railway config uses the Dockerfile builder, runs `bun run db:migrate` as a pre-deploy command, starts the app with `bun run start`, and checks `/healthz` before activating a deployment.

For a new Railway service:

1. Create a Railway app service from the GitHub repo.
2. Add a Railway Postgres service and expose its `DATABASE_URL` to the app service.
3. Set `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `RESEND_API_KEY`, `EMAIL_FROM`, and `USER_LIMIT`.
4. Deploy the app service.
5. Seed the first admin with Railway environment variables loaded:

```bash
railway run bun run seed:admin
```

The app also runs migrations during startup as a defensive fallback, but the Railway pre-deploy command keeps schema changes ahead of traffic.

## Project Structure

```text
src/
├── app.tsx                    # Hono app factory
├── index.ts                   # Bun runtime entrypoint
├── app.test.tsx               # route behaviour tests
├── htmx.test.tsx              # HTMX fragment contract tests
├── components/                # server-rendered JSX components
│   ├── atoms/                 # primitive controls, cards, cells, styles, and tests
│   ├── molecules/             # composed UI pieces such as labelled outputs, rows, and reusable tables
│   ├── organisms/             # feature sections such as forms and tables
│   ├── pages/                 # full-page compositions
│   ├── templates/             # document shell and shared assets
│   └── styles.ts              # SSR style aggregation boundary
├── auth/                      # auth provider boundary, Better Auth, SQLite local auth, and test provider
├── db/                        # database providers, repositories, migrations, and pace math
├── email/                     # Resend/console email senders
├── invitations/               # invitation service and repository contracts
└── walks/                     # walk input validation
scripts/
├── add-pr-screenshots.ts      # mobile PR screenshot capture and PR table updates
├── configure-main-protection.ts
├── pa11y-config.cjs
├── seed-admin.ts
├── seed-local-dev.ts
├── test-a11y.ts
└── lib/                       # shared script helpers for GitHub, serving, and process calls
```

## Formulas

- **Speed (mph)** = miles / (minutes / 60 + seconds / 3600)
- **Pace (min/mi)** = (minutes + seconds / 60) / miles
- **Average speed** = average of valid walk speeds
- **Median pace** = median of valid walk paces
