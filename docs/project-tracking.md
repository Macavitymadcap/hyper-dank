# Project Tracking

Hyper-Dank is moving operational project tracking to GitHub Issues and GitHub Projects.
Repository Markdown remains useful, but it should no longer be the day-to-day ticket board once the
GitHub workflow is active.

## Source Of Truth

| Work Item | Operational Source | Durable Repository Record |
| --- | --- | --- |
| Epic | GitHub issue plus project item | Optional `docs/epics/` brief for large architecture or migration plans |
| Ticket | GitHub issue plus project item | Optional implementation notes when the decision must remain versioned |
| Hotfix | GitHub issue or PR-linked issue | PR description and release notes |
| Audit | GitHub issue plus optional Markdown artifact | Findings document when the audit should be preserved |
| Architecture decision | GitHub issue linking a Markdown decision note | Markdown decision, architecture doc, or package README |
| Follow-up | GitHub issue | None unless it becomes an epic or durable decision |

Historical `docs/epics/pace-*.md` and `docs/tickets/pace-*.md` files remain intact. They explain how
the project got here and are still valid implementation records. New work should start in GitHub
unless the maintainer explicitly asks for a Markdown planning brief.

## Identifier Convention

Legacy `pace-*` identifiers remain valid for historical branches, PRs, docs, release notes, and the
`pace-0060` epic. Future GitHub-managed work should use `hd-*`.

| Surface | Convention |
| --- | --- |
| GitHub issue title | `hd-0001: concise outcome` when the issue has an assigned identifier |
| Branch | `hd-0001-short-task-name` or `hd-0001` for narrow work |
| PR title | Conventional Commit title, not the identifier alone |
| PR body | Link the issue with `Closes #123`, `Fixes #123`, or `Refs #123` |
| Project item | Use the issue as the project item; do not create a separate tracking row |
| Markdown artifact | Keep historical `pace-*`; use `hd-0001-brief.md` only for durable decisions |

Start `hd-*` numbering at `hd-0001`. Do not continue the old `pace-*` counter. That keeps the old
Walking Pace-derived sequence readable as history while making new Hyper-Dank work obviously
project-owned.

## Issue Model

Create issues from the templates in `.github/ISSUE_TEMPLATE/`:

- **Epic**: a coherent outcome that may contain multiple tickets. It owns goals, non-goals,
  dependencies, target branch, release impact, and acceptance criteria.
- **Ticket**: one independently reviewable slice of implementation, documentation, or workflow.
  It owns affected areas, verification, screenshots when relevant, and its PR link.
- **Hotfix**: urgent or narrow corrective work. It can be lightweight, but it still needs impact,
  rollback, and verification notes.
- **Audit**: investigation before implementation. It should classify findings and create follow-up
  tickets rather than silently expanding scope.
- **Follow-up**: triaged work that should not block the current PR or epic.

Use these labels consistently:

| Label | Meaning |
| --- | --- |
| `type: epic` | Parent outcome that groups tickets |
| `type: ticket` | Independently shippable implementation slice |
| `type: hotfix` | Urgent fix with narrow scope |
| `type: audit` | Discovery, review, or investigation |
| `type: follow-up` | Non-blocking future work |
| `area: ui` | Components, Storybook, visual behaviour, accessibility |
| `area: data` | Provider lifecycle, migrations, repositories, persistence helpers |
| `area: transport` | Hono, HTMX, form, response, and route helpers |
| `area: automation` | Scripts, verification, GitHub helpers, screenshots, release support |
| `area: docs` | Public docs, READMEs, copy, recipes, API reference |
| `area: workflow` | Project management, branch flow, templates, CI policy |
| `status: blocked` | Waiting on a decision, dependency, credential, or external action |
| `release-impact: patch` | Backwards-compatible fix |
| `release-impact: minor` | Backwards-compatible capability |
| `release-impact: major` | Breaking change or migration requirement |

## GitHub Project

Use one project table or board for active Hyper-Dank work. The project item should be the issue,
not the PR.

| Field | Type | Values / Notes |
| --- | --- | --- |
| Status | Single select | Triage, Planned, Ready, In progress, Blocked, In review, Merged, Released, Closed |
| Parent epic | Text or linked issue | `hd-0001` or issue URL |
| Branch | Text | Branch name once work starts |
| PR | Text or linked PR | PR URL once opened |
| Type | Single select | Epic, Ticket, Hotfix, Audit, Follow-up, Release chore |
| Area | Multi select | UI, Data, Transport, Automation, Docs, Workflow |
| Priority | Single select | P0, P1, P2, P3 |
| Verification | Single select | Not started, Narrow checks, Verify passed, CI passed, Blocked |
| Release impact | Single select | None, Patch, Minor, Major |
| Target release | Text or milestone | Optional release version, milestone, or "next" |

Recommended views:

- **Roadmap**: epics and planned tickets grouped by parent epic.
- **Active work**: Ready, In progress, Blocked, and In review tickets.
- **Review queue**: open PRs grouped by verification state.
- **Release impact**: merged but unreleased work grouped by release impact.
- **Follow-ups**: non-blocking issues created from reviews and audits.

## Branch And PR Rules

The protected branch rules still apply:

- `main` changes go through PRs.
- PR titles follow Conventional Commits.
- CI, branch-flow, title lint, and resolved conversations are required.
- Release Please owns version updates after work lands.

During the transition, `branch-flow` supports two modes:

| Branch Mode | PR Base | Required Linkage |
| --- | --- | --- |
| Legacy `pace-*` epic | `main` | `docs/epics/<branch>.md` |
| Legacy `pace-*` ticket | parent `pace-*` epic | `docs/tickets/<branch>.md` referencing the parent epic |
| GitHub `hd-*` epic | `main` | PR body links a GitHub issue with `Closes`, `Fixes`, or `Refs` |
| GitHub `hd-*` ticket | parent `hd-*` epic branch | Later `hd-*` number and PR body issue link |

Use normal follow-up commits on open PRs unless the maintainer explicitly asks for history
rewriting. Extra commits are acceptable when the ticket or epic milestones remain answered.

## Migration Rollout

1. Keep historical Markdown docs in place.
2. Create labels from this document.
3. Create the GitHub Project with the fields above.
4. For the next new epic after `pace-0060`, open a GitHub epic issue and assign the first `hd-*`
   identifier.
5. Create ticket issues from the GitHub templates and add them to the project.
6. Open `hd-*` branches from the correct base and link the issue in every PR body.
7. Use Markdown only for durable architecture notes, accepted epic briefs, or implementation
   records that need to live with the code.
8. After one full `hd-*` epic lands cleanly, decide whether to stop creating Markdown ticket files
   by default.

Do not bulk-create issues for all historical `pace-*` docs. Link the history map when context is
needed, then create only active follow-up work in GitHub.
