# hd-0010 Storybook Visual Review Evidence

## Scope

This review captures durable light and dark screenshots for the Storybook groups rewritten during
`hd-0004`:

- Disclosure and menu
- Surfaces and metadata
- Shell navigation and feedback
- Content and empty states
- Reuse set

## Evidence

Screenshots are stored under `docs/pr-screenshots/hd-0010/` and captured with:

```bash
bun run screenshots:pr -- --persist --no-update-pr --flow hd-0010-storybook-groups
```

The screenshot flow targets the Storybook iframe routes directly, with mobile and desktop viewports
in both light and dark themes. The disclosure/menu state opens the example menu before capture so
the menu affordance is represented in the evidence set.

## Review Notes

- The five rewritten groups render without obvious overlap in the reviewed Storybook iframe states.
- Light and dark themes keep the component examples legible against the Storybook docs shell.
- The examples remain copy-paste oriented; wrapper-free code coverage stays in the existing
  Storybook coverage tests.
- The evidence pass found and fixed small shared-style issues for open popover menus, accordion
  title/meta spacing, compact-list value/meta spacing, and mobile AppShell stacking.
- Follow-up review tightened the topic examples in light and dark mode by giving accordion panels
  explicit theme-safe surfaces, adding visible graph axes, labels, and values, and replacing the
  abstract reuse-set sample with a compact release-desk example.
- Remaining visual refinements are covered by later follow-ups: `hd-0015` for command/selection
  primitives, `hd-0016` for status and notification language, and `hd-0017` for data-heavy table and
  dashboard affordances.
