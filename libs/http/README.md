# Hyper-Dank HTTP

Small Hono and HTMX helpers for hypermedia-first apps.

The package contains generic form parsing, route parameter, error-message, and HTMX redirect
helpers. App-specific auth, permissions, routes, and services stay in the consuming app.

## Public Exports

- `FormValues`: parses Hono request bodies and exposes safe string reads.
- `errorMessage`: formats unknown thrown values for route responses.
- `routeParam`: normalises Hono route params to strings.
- `HttpResponder`: detects HTMX requests and chooses between `HX-Redirect` and native redirects,
  including auth-cookie-preserving redirects.

The public docs site includes route-level examples for these helpers.
