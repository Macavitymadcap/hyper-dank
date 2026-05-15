# Main Branch Protection

This repo is set up for a feature-branch workflow:

- CI runs on every branch push.
- CI runs again for pull requests targeting `main`.
- `main` should only accept changes through pull requests.
- Pull requests do not require approving reviews in solo-maintainer mode.
- The required `test` and `lint-pr-title` checks must pass before merging.
- Direct pushes and force pushes to `main` should be blocked.
- Conversations must be resolved before merging.

## Solo-Maintainer Mode

GitHub does not let a pull request author approve their own PR for branch
protection purposes. Because this is a solo-maintainer repository, the merge
action is the maintainer approval. Branch protection still requires a pull
request, a Conventional Commit title, passing checks, linear history, and
resolved conversations.

The protection config keeps `required_pull_request_reviews` enabled with
`required_approving_review_count` set to `0`. That keeps the pull request gate
without requiring an impossible self-approval.

## Apply Protection

After pushing this branch, run:

```bash
bun run protect:main
```

The script calls the GitHub API and applies `.github/branch-protection-main.json` to `Macavitymadcap/pace-calculator`.

To target a different fork or remote:

```bash
bun run protect:main -- OWNER/REPO
```

You need repository admin permissions and either `GITHUB_TOKEN`, `GH_TOKEN`, or an authenticated Git credential for GitHub.
