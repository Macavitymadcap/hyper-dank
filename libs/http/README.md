# Hyper-Dank HTTP

Small Hono and HTMX helpers for hypermedia-first apps.

The package contains generic form parsing, route parameter, error-message, and HTMX redirect
helpers. App-specific auth, permissions, routes, and services stay in the consuming app.

## Installation

`@macavitymadcap/hyper-dank-transport` is not published to npm yet. Install it from the local
package tarball produced by the Hyper-Dank workspace:

```bash
# from hyper-dank
bun run pack:packages

# from a downstream app
bun add ../hyper-dank/.cache/packages/macavitymadcap-hyper-dank-transport-0.1.0.tgz
bun add hono typescript
```

The package peers on `hono` for response and request helper integration, and on `typescript` for
declaration-aware tooling. The tarball route is verified by `bun run test:packages`, which installs
the package into a clean temporary app outside this workspace and imports it by package name.

## Public Exports

- `FormValues`: parses Hono request bodies and exposes safe string, optional string, number, and
  checkbox-style boolean reads.
- `errorMessage`: formats unknown thrown values for route responses.
- `routeParam`: normalises Hono route params to strings.
- `isHtmxRequest`: detects HTMX headers from generic header sources.
- `HttpResponder`: detects HTMX requests and chooses between `HX-Redirect` and native redirects,
  including auth-cookie-preserving redirects.
- `fragmentOrPage`: renders an app-owned fragment for HTMX requests and an app-owned page for
  native requests.

The public docs site includes route-level examples for these helpers.

For app-shape guidance, see the public recipes in `site/recipes.md`.
