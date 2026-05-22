# Contributing

This project uses protected pull requests and GitHub-tracked work items. `main` is the stable branch
and should not receive direct commits.

## Git Flow

New operational work should start in GitHub Issues and GitHub Projects. Use `hd-*` identifiers for
new Hyper-Dank issues and branches, starting at `hd-0001`. Historical `pace-*` branches and
Markdown docs remain valid for old epics and for the active `pace-0060` migration epic.

For new `hd-*` work:

1. Open a GitHub issue from the relevant template.
2. Add it to the Hyper-Dank project with status, type, area, priority, verification, and release
   impact fields.
3. Create an epic branch such as `hd-0001` from `main`, or a ticket branch such as `hd-0002` from
   its parent `hd-*` epic branch.
4. Link the issue from the PR body with `Closes #123`, `Fixes #123`, or `Refs #123`.
5. Keep durable architecture notes, accepted long-form briefs, or implementation records in
   Markdown when they need to live with the code.

Legacy `pace-*` work keeps the existing docs-first epic-and-ticket flow:

1. Branch from the latest `main` with the next epic number, for example `pace-0003`.
2. Make the first commit the detailed planning commit: add `docs/epics/pace-0003.md` and the planned ticket files, for example `docs/tickets/pace-0004.md`.
3. Open a draft pull request from the epic branch into `main`. This is the umbrella PR for the whole epic.
4. Create implementation ticket branches from the epic branch, using later numbers such as `pace-0004`, `pace-0005`, and `pace-0006`.
5. Open each ticket pull request into the epic branch, not into `main`.
6. Merge each ticket branch into the epic branch after checks pass and the ticket is complete.
7. Mark the epic PR ready for review only after all planned ticket PRs are merged and the epic branch is ready to land.
8. Merge the epic branch into `main` once checks pass and conversations are resolved.

Epic branches are temporary integration branches. They collect a planned set of related ticket branches, but they should not become long-lived release branches. Ticket branches should keep their scope to one planned ticket.

This repository uses a solo-maintainer flow. GitHub does not allow a PR author to approve their own PR for branch protection, so main protection does not require approving reviews. The maintainer's approval is expressed by merging the PR after checks pass.

When updating an open ticket, epic, or PR branch, prefer normal follow-up commits and a normal push.
Do not amend and force-push just to tidy history unless the maintainer explicitly asks or the branch
cannot otherwise be made correct. Extra commits are acceptable when the issue or epic milestones
remain answered.

Branch protection still keeps the important guardrails:

- `main` changes go through pull requests.
- Epic branches target `main`; ticket branches target their parent epic branch.
- The `test`, `branch-flow`, and `lint-pr-title` checks must pass.
- PR titles follow Conventional Commits.
- Conversations must be resolved before merge.
- Direct pushes, force pushes, and branch deletion are blocked.

## Branch Naming

Use `hd-*` for new GitHub-managed work:

```text
hd-0001
hd-0002
```

Use the historical `pace-*` prefix and four digits for legacy Markdown-managed epic and ticket branches:

```text
pace-0003
pace-0004
```

The epic branch uses the first number in the sequence. Ticket branches use later numbers and branch from the epic branch. For example, `hd-0002` can target `hd-0001`, and `pace-0004` can target `pace-0003`, but a ticket branch should not target `main`.

The branch-flow workflow enforces these relationships:

- Legacy `pace-*` PRs into `main` must include a matching `docs/epics/<branch>.md`, or come from a
  release-please branch.
- Legacy `pace-*` PRs into an epic branch must come from a later numbered ticket branch with a
  matching `docs/tickets/<branch>.md`.
- Legacy ticket docs must reference their parent epic branch.
- GitHub-managed `hd-*` PRs can omit Markdown ticket files, but their PR body must link a GitHub
  issue with `Closes`, `Fixes`, or `Refs`.

See [docs/project-tracking.md](./docs/project-tracking.md) for issue templates, labels, project
fields, migration rules, and the source-of-truth split. See
[docs/ticket-history.md](./docs/ticket-history.md) for the reconciled historical `pace-*` map.

## Conventional Commits

PR titles must follow this shape:

```text
type(optional-scope): short description
```

Common types:

- `feat`: user-facing capability
- `fix`: bug fix
- `docs`: documentation-only change
- `test`: test-only change
- `refactor`: behaviour-preserving implementation change
- `style`: formatting or presentation-only change
- `build`: dependency or build tooling change
- `ci`: workflow or repository automation change
- `chore`: maintenance that does not fit another type

Use `!` for breaking changes:

```text
feat!: replace repository contract
fix(table): align bottom row radius
ci(release): add release automation
```

The `PR Title` workflow enforces this on pull requests.

## Versioning

Version updates are automated with release-please.

When an epic PR is merged into `main`, the `Release Please` workflow reads the Conventional Commit history and opens or updates a release PR. That release PR updates `package.json`, updates the release manifest, and prepares changelog content. It still goes through the same protected PR flow, so version changes land only after checks pass and the maintainer chooses to merge.

Version bump rules:

- `fix:` creates a patch release.
- `feat:` creates a minor release.
- `type!:` or a `BREAKING CHANGE:` footer creates a major release.
- `docs:`, `test:`, `ci:`, `build:`, `refactor:`, and `chore:` are included in changelog sections when release-please creates a release PR.

Do not manually edit `package.json` versions outside a release PR unless you are intentionally changing the release baseline.

## Verification

Before asking for review, run:

```bash
bun run verify
```

The verifier runs the ordered local quality gates, writes `.cache/verification-report.md`, and stops
at the first failing gate so the failed component or test framework is easy to find.

For user-facing UI changes, add PR screenshots:

```bash
bun run screenshots:pr -- --persist
```

The screenshot script captures Samsung Galaxy A5-sized states for light and dark mode. A plain `bun run screenshots:pr` writes ignored local images to `.cache/pr-screenshots/<branch>/` for quick review. Add `--persist` when the PR needs repo-hosted screenshots; persisted images are written to `docs/pr-screenshots/<branch>/`, force-staged, and used to update the PR image table when GitHub credentials are available.

## Templates

- GitHub PRs use `.github/PULL_REQUEST_TEMPLATE.md`.
- GitHub issues use `.github/ISSUE_TEMPLATE/`.

Keep templates in sync when the review flow changes.
