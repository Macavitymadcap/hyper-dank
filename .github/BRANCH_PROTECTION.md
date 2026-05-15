# Main Branch Protection

This repo is set up for a feature-branch workflow:

- CI runs on every branch push.
- CI runs again for pull requests targeting `main`.
- `main` should only accept changes through pull requests.
- Pull requests require at least one code owner approval from `@Macavitymadcap`.
- The required `test` and `lint-pr-title` checks must pass before merging.
- Direct pushes and force pushes to `main` should be blocked.
- Conversations must be resolved before merging.

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
