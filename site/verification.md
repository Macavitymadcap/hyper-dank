---
layout: default
title: Verification
---

# Verification

Hyper-Dank treats verification as a set of boundary checks. App builders can copy the whole local
gate, or choose the parts that match the change they are making.

`bun run verify` is the full repository gate. It runs static checks, typechecking, unit and contract
tests, patch whitespace checks, workspace builds, the production healthcheck, the static pace demo
smoke, package compatibility tests, Storybook browser tests, Playwright E2E, and Pa11y in fail-fast
order. It also writes `.cache/verification-report.md` so the result can be attached to a review.

## Choosing Gates

For component markup or CSS, run `bun run test`, `bun run test:storybook`, and screenshots for
important states.

For route, form, or HTMX behaviour, use unit route tests, HTMX contract tests, and Playwright for
browser flow coverage.

For package exports, pair unit tests with package compatibility tests that import through public
package names.

For static docs or demo output, use static artifact smoke checks, docs build tests, and link or
boundary checks.

For accessibility-sensitive UI, pair Pa11y with browser review of focus, landmarks, labels, and
responsive layout.

For deployment wiring, run build, healthcheck, migration, and start-command smoke tests.

## Public Contract Checks

Compatibility tests pack the local workspace packages and import them through consumer-style package
paths. The harness covers server-app progressive actions, static blog composition, dashboard/admin
screens, static demos, and scripts-package helpers with fake inputs. Those tests are intentionally
written from the outside so package exports stay usable by public adopters.

The public docs also have boundary tests. They keep Jekyll-style `relative_url` links pointed at
live Pages routes, ensure relative Markdown links resolve to real files, and prevent private
consumer names from leaking into public documentation.

## Review Evidence

Use Storybook when a reviewer needs isolated states and control-level documentation. Use
`bun run screenshots:pr` when a visual change needs stable light and dark screenshots. Use
Playwright and Pa11y when the behaviour depends on a browser, focus movement, responsive layout, or
assistive-technology-facing markup.

Adopting apps do not need to reproduce Hyper-Dank's exact script list. Keep the same principle:
prove the package boundary with import tests, prove server behaviour through route tests, prove
browser behaviour in a real browser, and keep accessibility checks close to the user-facing flows.
