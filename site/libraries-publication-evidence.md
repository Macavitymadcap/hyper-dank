---
layout: default
title: Package Publication Evidence
permalink: /libraries/publication-evidence/
---

# Package Publication Evidence

Use this page to verify the first public npm publication and the staged publishing workflow for the
Hyper-Dank packages.

<div class="library-layout">
<details class="docs-side-nav library-side-nav" open>
  <summary aria-label="Toggle library docs navigation"><span class="docs-side-nav__icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M4 5.5c3 0 5 .7 8 2.2 3-1.5 5-2.2 8-2.2v12c-3 0-5 .7-8 2.2-3-1.5-5-2.2-8-2.2z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="2"/></svg></span><span class="docs-side-nav__label">Library docs</span><span class="docs-side-nav__mobile-label">Libraries</span></summary>
  <nav aria-label="Library docs">
    <a href="{{ '/libraries/' | relative_url }}">Overview</a>
    <a href="{{ '/libraries/consumer-setup/' | relative_url }}">Consumer setup</a>
    <a aria-current="page" href="{{ '/libraries/publication-evidence/' | relative_url }}">Publication evidence</a>
    <a href="{{ '/libraries/ui/' | relative_url }}">UI</a>
    <a href="{{ '/libraries/data/' | relative_url }}">Data</a>
    <a href="{{ '/libraries/transport/' | relative_url }}">Transport</a>
    <a href="{{ '/libraries/automation/' | relative_url }}">Automation</a>
  </nav>
</details>

<div class="library-page">

## First public package set

The first public npm package set is `0.1.0`. The repository is already prepared for a later `0.1.1`
documentation metadata release, so use npm registry metadata as the source of truth when checking
what consumers can install right now.

| Package | npm package | Version | Integrity |
| --- | --- | --- | --- |
| `@macavitymadcap/hyper-dank-ui` | [npm](https://www.npmjs.com/package/@macavitymadcap/hyper-dank-ui) | `0.1.0` | `sha512-iPpySpB1FAOSQkqVwku3UGUVAiQtVKuf/MiPew9NfTI1FsyDwJ1sCo0F9XC8nfpJq+Kxzn15v2W7B2tWrVxSBA==` |
| `@macavitymadcap/hyper-dank-data` | [npm](https://www.npmjs.com/package/@macavitymadcap/hyper-dank-data) | `0.1.0` | `sha512-+WFSoHSsqAzGQXf2BDmCVJZoy4SAFlXVUFqktrO0wknTPJcPwfz1PpB4bEznwU13Ggn7qLO5f9sq8coj0vjP+Q==` |
| `@macavitymadcap/hyper-dank-transport` | [npm](https://www.npmjs.com/package/@macavitymadcap/hyper-dank-transport) | `0.1.0` | `sha512-dzn3bqdfvsAZPYyzToqtWlfKX+3fJiJeIE2kBWYpFB0wSwfPNkix5/xDaSUwC280ADYrNF4OZZME9c//jsYfww==` |
| `@macavitymadcap/hyper-dank-automation` | [npm](https://www.npmjs.com/package/@macavitymadcap/hyper-dank-automation) | `0.1.0` | `sha512-gbEPdbsBesHujE0PWQeteWSv5v7lgqOFMOoqQbV68SMLctSkLtErvx/4G7vKw4QYSj7o6KRH3ejtTNUxVpai1g==` |

## Approval and provenance status

The first live `0.1.0` packages were published manually after the local npm CLI did not expose the
staged publish command. Those tarballs have npm registry integrity and signature metadata, but they
do not have GitHub OIDC provenance from the trusted-publishing workflow.

The root `hyper-dank` release and the public library package releases are separate Release Please
manifest entries. The root package keeps its `2.x` application history. The public libraries stay on
their own shared `0.x` line because their npm history started with the first public monorepo package
set.

Merging normal work to `main` does not publish npm packages directly. Release Please first opens or
updates a release PR. When that generated release PR is merged and GitHub releases are published,
the `Publish npm packages` workflow runs automatically for release events. It verifies metadata,
builds and smoke-tests the package tarballs, skips any package version that already exists on npm,
then stages only unpublished package versions with npm trusted publishing and `--provenance`.

The same workflow can still be run manually. Use the default `dry_run=true` to check the package
set without staging anything. Use `dry_run=false` only for recovery or a deliberate manual release
after checking that npm trusted publishers are configured for every package. Treat the
`npm-publishing` environment approval, npm staged package review, and npm provenance badge as the
approval evidence for automated package sets.

## Integrity checks

Check the live registry metadata before announcing or debugging a package release:

```bash
npm view @macavitymadcap/hyper-dank-ui version dist.integrity dist.shasum dist.signatures --json
npm view @macavitymadcap/hyper-dank-data version dist.integrity dist.shasum dist.signatures --json
npm view @macavitymadcap/hyper-dank-transport version dist.integrity dist.shasum dist.signatures --json
npm view @macavitymadcap/hyper-dank-automation version dist.integrity dist.shasum dist.signatures --json
```

For a consumer smoke, install from the registry in a clean directory and run the package imports from
[Consumer setup]({{ '/libraries/consumer-setup/' | relative_url }}). For a release workflow smoke,
run `bun run test:packages` before staging packages.

## Release-note checklist

Release notes that announce package publication should link back to this page and include:

- package names and versions;
- npm package URLs;
- whether the release was manual, staged, or trusted-published with provenance;
- integrity verification command output or a link to the GitHub workflow run;
- external consumer install smoke notes.

</div>
</div>
