# Hyper-Dank Scripts

Reusable Bun automation helpers for Hyper-Dank apps.

```ts
import {
  buildImagesSection,
  getGitHubRepo,
  getGitHubToken,
  runVerification,
  waitForHttp,
} from "@macavitymadcap/hyper-dank-scripts";
```

## Helper Groups

- `process`: synchronous and asynchronous command execution with captured output, inherited stdio,
  and allow-failure handling.
- `github`: GitHub remote parsing, token lookup, REST requests, and current-branch pull request
  discovery.
- `verification`: ordered verification gates with stop-on-failure behaviour and Markdown report
  rendering.
- `local-server`: dynamic Bun server startup and HTTP readiness polling.
- `browser`: Playwright screenshot flow orchestration for light and dark theme states.
- `pr-images`: PR image table generation and body section replacement.
- `pa11y`: a small Pa11y runner wrapper that supports config paths and auth cookies.

## Walking Pace Example

```ts
import { runVerification } from "@macavitymadcap/hyper-dank-scripts";

const results = await runVerification([
  { id: "check", name: "Static Checks", tooling: "Biome", command: "bun", args: ["run", "check"] },
]);
```

## Character Sheet-Style Consumer Example

```ts
import { startBunServer, waitForHttp } from "@macavitymadcap/hyper-dank-scripts";

const server = startBunServer({
  fetch: (request) => app.fetch(request),
});

try {
  await waitForHttp(`${server.url}/healthz`);
} finally {
  server.server.stop(true);
}
```
