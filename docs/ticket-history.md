# Ticket History Map

This map reconciles the `pace-*` sequence before Hyper-Dank moves operational tracking to GitHub
Issues and GitHub Projects. It is based on local Markdown docs, local branches, remote branch
history, and PR links present in the repository docs as of `pace-0067`.

## Summary

| Range | Classification |
| --- | --- |
| `pace-0001` | Missing local planning doc; historical git subject references an early refactor |
| `pace-0002` | Implemented early production-foundations ticket without a parent epic field |
| `pace-0003` to `pace-0012` | Implemented early docs-first epics and tickets |
| `pace-0013` to `pace-0016` | Implemented generic extraction and branding epic, merged through PR #78 |
| `pace-0017` to `pace-0019` | Implemented single-branch hotfix or cleanup epics |
| `pace-0020` to `pace-0027` | Implemented package and deployment epic with ticket group |
| `pace-0028` and `pace-0029` | Implemented single-branch cleanup or planning epics |
| `pace-0030` | No local doc found; treat as unused or reserved unless GitHub history proves otherwise |
| `pace-0031` to `pace-0038` | Implemented reference-app and component-system epic with ticket group |
| `pace-0039` and `pace-0040` | Implemented single-branch hotfix or cleanup epics |
| `pace-0041` to `pace-0049` | Implemented package-extraction and docs epic with ticket group |
| `pace-0050` to `pace-0059` | Implemented app-builder readiness epic with ticket group |
| `pace-0060` to `pace-0067` | Consumer docs, Storybook, and GitHub planning epic |

## Detailed Map

| ID | Type | Status | Parent / Group | Evidence | Notes |
| --- | --- | --- | --- | --- | --- |
| `pace-0001` | Missing historical item | Missing doc | None | Git history subject `fix(pace-0001): refactor app` | No local planning doc found. Keep as historical missing item. |
| `pace-0002` | Ticket | Implemented | None recorded | `docs/tickets/pace-0002.md`, PR #3 | Early production-foundations ticket predates parent-epic field. |
| `pace-0003` | Epic | Implemented | Early docs-first flow | `docs/epics/pace-0003.md`, PR #9 | Owns `pace-0004`. |
| `pace-0004` | Ticket | Implemented | `pace-0003` | `docs/tickets/pace-0004.md`, PR #9 | First documented ticket branch. |
| `pace-0005` | Epic | Implemented | Early production hardening | `docs/epics/pace-0005.md` | Owns `pace-0006` to `pace-0011`. |
| `pace-0006` to `pace-0011` | Tickets | Implemented | `pace-0005` | `docs/tickets/pace-0006.md` through `pace-0011.md` | Implemented ticket group. |
| `pace-0012` | Epic | Implemented | Standalone cleanup | `docs/epics/pace-0012.md` | No ticket branches listed. |
| `pace-0013` | Epic | Implemented | Generic extraction and branding | `docs/epics/pace-0013.md`, PR #78 | Rebased onto Hyper-Dank repo history during migration. |
| `pace-0014` to `pace-0016` | Tickets | Implemented | `pace-0013` | `docs/tickets/pace-0014.md` through `pace-0016.md` | Completed under PR #78. |
| `pace-0017` | Epic / hotfix | Implemented | Standalone | `docs/epics/pace-0017.md` | Single-branch fix or cleanup. |
| `pace-0018` | Epic / hotfix | Implemented | Standalone | `docs/epics/pace-0018.md`, PR #19 | Single-branch fix or cleanup. |
| `pace-0019` | Epic / hotfix | Implemented | Standalone | `docs/epics/pace-0019.md`, PR #21 | Single-branch fix or cleanup. |
| `pace-0020` | Epic | Implemented | Package/deployment group | `docs/epics/pace-0020.md`, PR #23 | Owns `pace-0021` to `pace-0027`. |
| `pace-0021` to `pace-0027` | Tickets | Implemented | `pace-0020` | `docs/tickets/pace-0021.md` through `pace-0027.md` | Implemented ticket group. |
| `pace-0028` | Epic / cleanup | Implemented | Standalone | `docs/epics/pace-0028.md` | No ticket branches listed. |
| `pace-0029` | Epic / cleanup | Implemented | Standalone | `docs/epics/pace-0029.md` | No ticket branches listed. |
| `pace-0030` | Reserved / unused | No local doc | None | No `docs/epics` or `docs/tickets` file found | Treat as unused unless GitHub history later proves otherwise. |
| `pace-0031` | Epic | Implemented | Reference-app and component-system group | `docs/epics/pace-0031.md`, PR #43 | Owns `pace-0032` to `pace-0038`. |
| `pace-0032` to `pace-0038` | Tickets | Implemented | `pace-0031` | `docs/tickets/pace-0032.md` through `pace-0038.md`, PR #36 to #42 | Implemented ticket group. |
| `pace-0039` | Epic / hotfix | Implemented | Standalone | `docs/epics/pace-0039.md`, PR #34 | Single-branch fix or cleanup. |
| `pace-0040` | Epic / hotfix | Implemented | Standalone | `docs/epics/pace-0040.md`, PR #46 | Single-branch fix or cleanup. |
| `pace-0041` | Epic | Implemented | Package extraction and docs group | `docs/epics/pace-0041.md`, PR #56 | Owns `pace-0042` to `pace-0049`. |
| `pace-0042` to `pace-0049` | Tickets | Implemented | `pace-0041` | `docs/tickets/pace-0042.md` through `pace-0049.md` | Implemented ticket group. |
| `pace-0050` | Epic | Implemented | App-builder readiness group | `docs/epics/pace-0050.md`, PR #59 | Owns `pace-0051` to `pace-0059`. |
| `pace-0051` to `pace-0059` | Tickets | Implemented | `pace-0050` | `docs/tickets/pace-0051.md` through `pace-0059.md`, PR #61, #63, #70 to #75 where recorded | Implemented ticket group. |
| `pace-0060` | Epic | Active | Consumer docs and Storybook group | `docs/epics/pace-0060.md`, PR #77 | Owns `pace-0061` to `pace-0067`. |
| `pace-0061` | Ticket | Implemented | `pace-0060` | `docs/tickets/pace-0061.md`, PR #80 | Consumer docs and Storybook audit. |
| `pace-0062` | Ticket | Implemented | `pace-0060` | `docs/tickets/pace-0062.md`, PR #81 | Package installation and README contracts. |
| `pace-0063` | Ticket | Implemented | `pace-0060` | `docs/tickets/pace-0063.md`, PR #82 | API reference and docs consistency checks. |
| `pace-0064` | Ticket | Implemented | `pace-0060` | `docs/tickets/pace-0064.md`, PR #83 | Storybook consumer reference. |
| `pace-0065` | Ticket | Implemented | `pace-0060` | `docs/tickets/pace-0065.md`, PR #84 | Docs navigation, recipes, and sidebar behaviour. |
| `pace-0066` | Ticket | Implemented | `pace-0060` | `docs/tickets/pace-0066.md`, PR #85 | Positioning, copy, and public evidence. |
| `pace-0067` | Ticket | In progress | `pace-0060` | `docs/tickets/pace-0067.md` | GitHub Issues and Projects migration model. |

## Migration Rules

- Do not renumber historical `pace-*` docs.
- Do not create retroactive GitHub issues for every historical doc.
- Link this map from future GitHub epic issues when historical context matters.
- Start new GitHub-managed work at `hd-0001`.
- If an old `pace-*` follow-up becomes active, create a new `hd-*` issue and link the historical
  `pace-*` doc or PR instead of reopening the old sequence.
