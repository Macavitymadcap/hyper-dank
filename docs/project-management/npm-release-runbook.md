# npm Release Runbook

Use this when Hyper-Dank package versions are ready on `main` but npm still shows an older public
`latest` version.

## Check Release State

```bash
bun run check:npm-release
```

The command compares the four local package versions with npm `latest`. It exits non-zero while a
release is still needed.

## Stage Packages

Staging should happen through GitHub Actions, not from a local machine:

1. Open GitHub Actions.
2. Run `Publish npm packages` on `main`.
3. Choose `release_mode=stage-unpublished-packages`.
4. Approve the `npm-publishing` GitHub environment if prompted.

The workflow uses npm trusted publishing, provenance, and `npm stage publish`.

## Approve Current Staged Packages

After staging, list pending stages for each package:

```bash
npm stage list @macavitymadcap/hyper-dank-ui
npm stage list @macavitymadcap/hyper-dank-data
npm stage list @macavitymadcap/hyper-dank-transport
npm stage list @macavitymadcap/hyper-dank-automation
```

Approve the staged entries whose version matches the package versions on `main`:

```bash
npm stage approve <stage-id>
```

npm may prompt for 2FA. When the approvals complete, verify that public `latest` has caught up:

```bash
bun run check:npm-release
```

## Clear Stale Staged Versions

If `npm stage list` shows older staged versions, do not approve them after a newer lockstep release
has been staged. Reject the stale entries instead:

```bash
npm stage reject <stage-id>
```

This prevents future workflow runs from failing with `E409 Conflict` for a version that is already
staged but not public.

## Notes

- The four public packages release in lockstep.
- A staged package is not visible as npm `latest` until it is approved.
- `E409 Conflict` during `npm stage publish` can mean the same package version is already staged.
  Use `npm stage list <package>` before rerunning the workflow.
