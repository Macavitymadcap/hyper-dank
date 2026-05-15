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
PORT=3100 DB_PATH=/tmp/walking-pace-db bun run dev
```

## Scripts

```bash
bun run dev
bun run test
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

The test suite covers:

- component rendering contracts
- Hono full-page and error route behavior
- HTMX fragment mutation contracts
- SQLite repository behavior with in-memory databases
- validation and pace calculations

## Configuration

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3000` | HTTP port used by Bun |
| `DB_PATH` | `walking-pace-db` | SQLite database file path |

## Project Structure

```text
src/
├── app.tsx                    # Hono app factory
├── index.ts                   # Bun runtime entrypoint
├── app.test.tsx               # route behavior tests
├── htmx.test.tsx              # HTMX fragment contract tests
├── components/                # server-rendered JSX components
│   ├── atoms/Button/          # component, styles, tests, and export
│   ├── molecules/WalksRow/    # component, styles, tests, and export
│   └── styles.ts              # SSR style aggregation boundary
├── db/                        # repository, model, and pace math
└── walks/                     # walk input validation
```

## Formulas

- **Speed (mph)** = miles / (minutes / 60 + seconds / 3600)
- **Pace (min/mi)** = (minutes + seconds / 60) / miles
- **Average speed** = average of valid walk speeds
- **Median pace** = median of valid walk paces
