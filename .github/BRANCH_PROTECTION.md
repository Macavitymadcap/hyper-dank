# Main Branch Protection

This repo is set up for an epic-and-ticket branch workflow:

- CI runs on every branch push.
- CI runs again for pull requests targeting `main`.
- `main` should only accept completed epic branches through pull requests.
- Epic branches, such as `pace-0003`, are temporary integration branches for planned ticket work.
- Ticket branches, such as `pace-0004`, branch from and merge back into their parent epic branch.
- Pull requests do not require approving reviews in solo-maintainer mode.
- The required `test`, `branch-flow`, and `lint-pr-title` checks must pass before merging.
- Direct pushes and force pushes to `main` should be blocked.
- Conversations must be resolved before merging.

## Branch Flow Checks

The `branch-flow` workflow validates PR relationships:

- PRs targeting `main` must come from an epic branch matching `pace-\d{4}` and include a matching `docs/epics/<branch>.md`.
- Release-please branches are allowed to target `main`.
- PRs targeting an epic branch must come from a later numbered `pace-\d{4}` ticket branch.
- Ticket branches must include `docs/tickets/<branch>.md`, and that ticket doc must reference the parent epic branch.

## Solo-Maintainer Mode

GitHub does not let a pull request author approve their own PR for branch
protection purposes. Because this is a solo-maintainer repository, the merge
action is the maintainer approval. Branch protection still requires a pull
request, a valid epic/ticket branch relationship, a Conventional Commit title,
passing checks, linear history, and resolved conversations.

The protection config keeps `required_pull_request_reviews` enabled with
`required_approving_review_count` set to `0`. That keeps the pull request gate
without requiring an impossible self-approval.

## Apply Protection

After pushing this branch, run:

```bash
bun run protect:main
```

The script calls the GitHub API and applies `.github/branch-protection-main.json` to `Macavitymadcap/hyper-dank`.

To target a different fork or remote:

```bash
bun run protect:main -- OWNER/REPO
```

You need repository admin permissions and either `GITHUB_TOKEN`, `GH_TOKEN`, or an authenticated Git credential for GitHub.
