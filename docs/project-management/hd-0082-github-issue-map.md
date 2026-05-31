# hd-0082 GitHub Issue Map

Created from the accepted stateful-organism planning prompt and added to the Hyper-Dank GitHub
Project. Use this file as the local cross-reference for issue numbers, project fields, branch names,
and neighbouring issues.

## hd-0082: Promote Shared Stateful App Organisms

- GitHub issue: [#224](https://github.com/Macavitymadcap/hyper-dank/issues/224)
- Ticket review: [#224 comment](https://github.com/Macavitymadcap/hyper-dank/issues/224#issuecomment-4586713701)
- Type: Epic
- Areas: UI, Docs
- Status: Planned
- Release impact: Minor
- Branch: `hd-0082-stateful-organisms`
- Project: [Hyper-Dank](https://github.com/users/Macavitymadcap/projects/2)

Summary: Plan and deliver a reusable organism layer for stateful, server-rendered Hyper-Dank app
patterns, while keeping product-specific feature regions app-owned.

Acceptance criteria:

- `hd-0083` through `hd-0089` are complete or explicitly deferred.
- The organism taxonomy is documented and additive.
- New organism components are tested, documented, covered in Storybook, and validated through
  consumer-style compatibility examples.
- App-specific domain models, route paths, and permissions remain outside the shared package.

## Child Tickets

| ID | Issue | Title | Type | Areas | Branch | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `hd-0083` | [#225](https://github.com/Macavitymadcap/hyper-dank/issues/225) | Audit stateful molecules and consumer organisms | Audit | UI, Docs | `hd-0083-stateful-organism-audit` | Planned |
| `hd-0084` | [#226](https://github.com/Macavitymadcap/hyper-dank/issues/226) | Define the organism taxonomy and additive export boundary | Ticket | UI, Docs | `hd-0084-organism-taxonomy` | Planned |
| `hd-0085` | [#227](https://github.com/Macavitymadcap/hyper-dank/issues/227) | Add workflow organisms for copy, actions, and live fragments | Ticket | UI, Transport, Docs | `hd-0085-workflow-organisms` | Planned |
| `hd-0086` | [#228](https://github.com/Macavitymadcap/hyper-dank/issues/228) | Add selection and status organisms | Ticket | UI, Docs | `hd-0086-selection-status-organisms` | Planned |
| `hd-0087` | [#229](https://github.com/Macavitymadcap/hyper-dank/issues/229) | Add content and app chrome organisms | Ticket | UI, Docs | `hd-0087-content-app-chrome-organisms` | Planned |
| `hd-0088` | [#230](https://github.com/Macavitymadcap/hyper-dank/issues/230) | Document organism patterns in Storybook and public docs | Ticket | UI, Docs | `hd-0088-organism-storybook-docs` | Planned |
| `hd-0089` | [#231](https://github.com/Macavitymadcap/hyper-dank/issues/231) | Add consumer compatibility examples and final review evidence | Ticket | UI, Docs, Automation | `hd-0089-organism-compat-review` | Planned |

## Project Field Defaults

- Parent epic: `hd-0082`
- Target release: `next`
- Verification: `Not started`
- Release impact: `Minor` for implementation/docs tickets, `None` for the audit ticket
- PR: fill after the epic or ticket PR is opened

## Native Relationships

- [#225](https://github.com/Macavitymadcap/hyper-dank/issues/225) through
  [#231](https://github.com/Macavitymadcap/hyper-dank/issues/231) are native sub-issues of
  [#224](https://github.com/Macavitymadcap/hyper-dank/issues/224).
- The epic issue body mirrors the child-ticket map for readability, but GitHub native sub-issues
  are the operational parent/child relationship.

## Adjacent Issues

- [#134](https://github.com/Macavitymadcap/hyper-dank/issues/134) audits consumer adoption lessons
  from Campaign Ledger and the blog.
- [#149](https://github.com/Macavitymadcap/hyper-dank/issues/149) expands library and recipe
  reference docs.
- [#152](https://github.com/Macavitymadcap/hyper-dank/issues/152) uses consumer apps to inform
  recipe guidance.
- [#183](https://github.com/Macavitymadcap/hyper-dank/issues/183) added the staged form primitive,
  a useful reference for route-owned workflow state.
- [#195](https://github.com/Macavitymadcap/hyper-dank/issues/195) tracks smaller consumer-driven
  component polish and should stay separate from this broader organism-layer epic.
