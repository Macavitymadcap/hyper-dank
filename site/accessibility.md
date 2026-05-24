---
layout: default
title: Accessibility Statement
permalink: /accessibility/
---

# Accessibility Statement

Hyper-Dank aims to make its public documentation, static demo, Storybook reference, and reusable
component contracts usable with semantic HTML, keyboard navigation, readable colour contrast, and
progressive enhancement.

Last reviewed: 2026-05-23

## What We Test

- `bun run test:a11y` runs Pa11y against the user-facing app route.
- `bun run test:storybook` exercises Storybook stories in Chromium and checks documented states.
- `bun run test:static-demo` checks the browser-only pace demo from the built static artifact.
- `bun run verify` runs the full local gate set before user-facing changes are reported complete.
- Manual review should cover light and dark themes, fixed mobile and representative desktop
  viewports, focus order, drawer behaviour, and copy-paste code examples.

## Known Limitations

- Storybook is a third-party documentation shell, so some outer chrome is outside the reusable
  component package contract.
- Package consumers own their product copy, route structure, auth flows, validation messages, and
  final accessibility testing when Hyper-Dank components are composed into their apps.
- The current automated checks do not replace screen-reader review for complex downstream product
  flows.

## Package Responsibilities

The UI package provides semantic primitives, stable class hooks, native controls, labelled outputs,
and component docs that state expected accessibility behaviour. The transport, data, and automation
packages support accessible apps indirectly by keeping progressive form responses, test harnesses,
Pa11y runners, and static-content helpers repeatable.

## Contact

Use the
[accessibility report template](https://github.com/Macavitymadcap/hyper-dank/issues/new?template=accessibility_report.yml)
to report an accessibility problem in the public documentation, static demo, Storybook reference, or
package guidance.

Include the affected route, component, or package; what happened; what you expected; and your
browser, operating system, assistive technology, and relevant settings. Do not include private
personal, account, or security details in a public issue.

We aim to triage accessibility reports within seven days. Confirmed issues are prioritised by user
impact and may be fixed directly or split into follow-up tickets when the work is broader than the
report.

## Review Cadence

Review this statement whenever the public docs IA, Storybook reference, package contracts, or
published demo routes change materially.
