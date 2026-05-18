# Hyper-Dank Components

Server-rendered Hono JSX components shared by Hyper-Dank apps.

```ts
import { Button, Panel, Switch } from "@macavitymadcap/hyper-dank-components";
```

The package publishes source for Bun/workspace consumers and declaration files in `dist/`.
Import `@macavitymadcap/hyper-dank-components/styles.css` when an app wants the baseline
component class contracts.

```ts
import "@macavitymadcap/hyper-dank-components/styles.css";
```

The CSS export is intentionally small. It preserves generic class and variant hooks such as
`.button[data-variant="ghost"]`, `.switch[data-variant="compact"]`, and `.form-field`; consuming apps
own their product layout and can layer app-specific styling after the package import.

Vite-backed consumers can import the CSS from their browser entry. Bun/Hono consumers that render
server-side JSX should still include the CSS through the browser bundle or another static asset
pipeline; importing the package in server code does not automatically load styles in the browser.
