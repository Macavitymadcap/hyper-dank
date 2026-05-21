# Hyper-Dank HTTP

Small Hono and HTMX helpers for hypermedia-first apps.

The package contains generic form parsing, route parameter, error-message, and HTMX redirect
helpers. App-specific auth, permissions, routes, and services stay in the consuming app.

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
