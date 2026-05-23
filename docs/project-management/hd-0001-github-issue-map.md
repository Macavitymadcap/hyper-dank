# hd-0001 GitHub Issue Map

Created from the accepted `hd-0001` plan and added to the Hyper-Dank GitHub Project. Use this file as
the local cross-reference for issue numbers, project fields, branch names, and follow-up numbering.

## hd-0001: Publish Packages And Polish The Public Reference

- GitHub issue: [#88](https://github.com/Macavitymadcap/hyper-dank/issues/88)
- Type: Epic
- Areas: Automation, Docs, UI, Workflow
- Status: Planned
- Release impact: Minor
- Branch: `hd-0001-plan-next-epic`

Summary: Publish the four Hyper-Dank packages to npm and improve the public reference across docs,
Storybook, recipes, accessibility, navigation, and UX.

Acceptance criteria:

- `hd-0002` through `hd-0007` are complete.
- Packages are ready for staged npm publication with trusted publishing and provenance.
- Docs, Storybook, recipes, accessibility statement, and UX review changes pass `bun run verify`.
- UX follow-up tickets are recorded contiguously from `hd-0008`.

## Child Tickets

| ID | Title | Type | Areas | Branch | Status |
| --- | --- | --- | --- | --- | --- |
| ID | Issue | Title | Type | Areas | Branch | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `hd-0002` | [#89](https://github.com/Macavitymadcap/hyper-dank/issues/89) | Publish packages to npm | Ticket | Automation, Docs, Workflow | `hd-0002` | Implemented locally |
| `hd-0003` | [#90](https://github.com/Macavitymadcap/hyper-dank/issues/90) | Improve site chrome and in-page navigation | Ticket | Docs, UI | `hd-0003` | Implemented locally |
| `hd-0004` | [#91](https://github.com/Macavitymadcap/hyper-dank/issues/91) | Deepen Storybook component docs | Ticket | UI, Docs | `hd-0004` | Implemented locally |
| `hd-0005` | [#92](https://github.com/Macavitymadcap/hyper-dank/issues/92) | Split recipes into index and subpages | Ticket | Docs | `hd-0005` | Implemented locally |
| `hd-0006` | [#93](https://github.com/Macavitymadcap/hyper-dank/issues/93) | Add accessibility statement | Ticket | Docs, Automation | `hd-0006` | Implemented locally |
| `hd-0007` | [#94](https://github.com/Macavitymadcap/hyper-dank/issues/94) | Run public-site UX review | Audit | Docs, UI | `hd-0007` | Implemented locally |

## UX Follow-Up Tickets

| ID | Title | Type | Areas | Parent / Source | Priority |
| --- | --- | --- | --- | --- | --- |
| ID | Issue | Title | Type | Areas | Parent / Source | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| `hd-0008` | [#95](https://github.com/Macavitymadcap/hyper-dank/issues/95) | Add visible current-section state to generated page TOCs | Follow-up | Docs, UI | `hd-0007` | P3 |
| `hd-0009` | [#96](https://github.com/Macavitymadcap/hyper-dank/issues/96) | Add richer npm publish release evidence after first staged approval | Follow-up | Automation, Workflow | `hd-0007` | P2 |
| `hd-0010` | [#97](https://github.com/Macavitymadcap/hyper-dank/issues/97) | Add Storybook visual review screenshots for the rewritten shared groups | Follow-up | UI, Docs | `hd-0007` | P3 |
| `hd-0011` | [#98](https://github.com/Macavitymadcap/hyper-dank/issues/98) | Add a dedicated public support/contact route or issue template link for accessibility reports | Follow-up | Docs, Workflow | `hd-0007` | P3 |

## Project Field Defaults

- Parent epic: `hd-0001`
- Target release: `next`
- Verification: `Verify passed` once `bun run verify` succeeds
- Release impact: `Minor` for the epic and package publication, `None` for audit-only follow-ups
- PR: fill after the epic PR is opened
