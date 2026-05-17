## Summary

-

## Images

| State | Light | Dark |
| --- | --- | --- |
| No walks | | |
| One walk | | |
| Many walks | | |
| Confirm clear all | | |

## Verification

- [ ] `bun run check`
- [ ] `bun run typecheck`
- [ ] `bun run test`
- [ ] `bun run test:a11y`
- [ ] `bun run test:e2e`
- [ ] `bun run storybook:build`
- [ ] `bun run test:storybook`

## Review Notes

- [ ] Epic PRs target `main` from an epic branch such as `pace-0003`.
- [ ] Ticket PRs target their parent epic branch from a later ticket branch such as `pace-0004`.
- [ ] Epic PRs include `docs/epics/<branch>.md`.
- [ ] Ticket PRs include `docs/tickets/<branch>.md` and reference the parent epic.
- [ ] The PR title follows Conventional Commits, for example `fix(table): align row radius`.
- [ ] This is ready for solo-maintainer merge once checks pass.
- [ ] This does not commit local SQLite database files.
- [ ] User-facing UI changes include screenshots or a short description.
