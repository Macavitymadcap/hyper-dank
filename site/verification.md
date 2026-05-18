---
layout: default
title: Verification
---

# Verification

`bun run verify` is the full local gate. It runs static checks, typechecking, unit and contract
tests, patch whitespace checks, workspace builds, the production healthcheck, the static pace demo
smoke, package compatibility tests, Storybook browser tests, Playwright E2E, and Pa11y.

Compatibility is treated as a public contract. `bun run test:compat` packs local workspace packages
and imports them through consumer-style package paths. The compatibility harness covers Character
Sheet-style markup, static blog composition, dashboard/admin screens, static demos, server-app
progressive actions, and scripts-package helpers with fake inputs.
