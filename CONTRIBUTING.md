# Contributing

This project uses a protected feature-branch flow. `main` is the stable branch and should not receive direct commits.

## Git Flow

1. Branch from the latest `main`.
2. Keep work scoped to one change.
3. Open a pull request into `main`.
4. Use a Conventional Commit style PR title.
5. Wait for required checks and resolve any conversations.
6. Merge when the maintainer is satisfied with the PR.

This repository uses a solo-maintainer flow. GitHub does not allow a PR author to approve their own PR for branch protection, so main protection does not require approving reviews. The maintainer's approval is expressed by merging the PR after checks pass.

Branch protection still keeps the important guardrails:

- `main` changes go through pull requests.
- The `test` and `lint-pr-title` checks must pass.
- PR titles follow Conventional Commits.
- Conversations must be resolved before merge.
- Direct pushes, force pushes, and branch deletion are blocked.

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

When a feature PR is merged into `main`, the `Release Please` workflow reads the Conventional Commit history and opens or updates a release PR. That release PR updates `package.json`, updates the release manifest, and prepares changelog content. It still goes through the same protected PR flow, so version changes land only after checks pass and the maintainer chooses to merge.

Version bump rules:

- `fix:` creates a patch release.
- `feat:` creates a minor release.
- `type!:` or a `BREAKING CHANGE:` footer creates a major release.
- `docs:`, `test:`, `ci:`, `build:`, `refactor:`, and `chore:` are included in changelog sections when release-please creates a release PR.

Do not manually edit `package.json` versions outside a release PR unless you are intentionally changing the release baseline.

## Verification

Before asking for review, run:

```bash
bun run check
bun run typecheck
bun run test
bun run test:a11y
```

For user-facing UI changes, add PR screenshots:

```bash
bun run screenshots:pr -- --persist
```

The screenshot script captures Samsung Galaxy A5-sized states for light and dark mode. A plain `bun run screenshots:pr` writes ignored local images to `.cache/pr-screenshots/<branch>/` for quick review. Add `--persist` when the PR needs repo-hosted screenshots; persisted images are written to `docs/pr-screenshots/<branch>/`, force-staged, and used to update the PR image table when GitHub credentials are available.

## Templates

- GitHub PRs use `.github/PULL_REQUEST_TEMPLATE.md`.
- GitHub issues use `.github/ISSUE_TEMPLATE/`.
- GitLab merge requests use `.gitlab/merge_request_templates/default.md`.

Keep templates in sync when the review flow changes.
