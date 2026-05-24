# hd-0039 Popover And Anchor CSS Browser Check

Checked on 24 May 2026 for `hd-0039`.

## Scope

- Public docs navigation uses native `details` elements, not the shared `PopoverMenu`.
- The shared UI package uses native popover attributes plus CSS anchor positioning for
  `.popover-menu-panel`.
- This check verifies the public docs shell still has no horizontal overflow and records the
  fallback for browsers without CSS anchor positioning.

## Automated Probe

| Browser | Result |
| --- | --- |
| Chromium 148.0.7778.96 | `showPopover` available, CSS `position-anchor` available, CSS `anchor()` inset available, no public-docs horizontal overflow. |
| Edge | Not run locally. Expected to follow the Chromium path for this CSS feature set because Edge shares the Chromium engine. |
| Firefox | Not run locally because the Playwright Firefox binary is not installed in this workspace. |
| Safari / WebKit | Not run locally because the Playwright WebKit binary is not installed in this workspace. |

## Fallback

`libs/components/src/styles.css` now wraps a non-anchor fallback in
`@supports not (position-anchor: --popover-anchor-name)`. Browsers without CSS anchor positioning
place `.popover-menu-panel` absolutely below the trigger instead of relying on `anchor()` placement.

Native popover support remains progressive enhancement for `PopoverMenu`; the trigger and panel
markup stay semantic, and links/forms remain regular controls in the rendered HTML.

## Follow-Up

If the workspace installs Firefox and WebKit Playwright browsers later, rerun the probe against:

```bash
bun -e 'import { chromium, firefox, webkit } from "@playwright/test"; /* probe CSS.supports and showPopover */'
```
