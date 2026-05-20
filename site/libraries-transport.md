---
layout: default
title: Transport Library
permalink: /libraries/transport/
---

# Transport Library

`@macavitymadcap/hyper-dank-transport` contains generic Hono and HTMX helpers for hypermedia-first
apps. Auth, permissions, services, validation, and product routes stay in the consuming app.

<div class="library-layout">
<details class="library-side-nav" open>
  <summary>Library docs</summary>
  <nav aria-label="Library docs">
    <a href="{{ '/libraries/' | relative_url }}">Overview</a>
    <a href="{{ '/libraries/ui/' | relative_url }}">UI</a>
    <a href="{{ '/libraries/data/' | relative_url }}">Data</a>
    <a aria-current="page" href="{{ '/libraries/transport/' | relative_url }}">Transport</a>
    <a href="{{ '/libraries/automation/' | relative_url }}">Automation</a>
  </nav>
</details>

<div class="library-page">

```ts
import {
  FormValues,
  HttpResponder,
  errorMessage,
  fragmentOrPage,
  isHtmxRequest,
  routeParam,
} from "@macavitymadcap/hyper-dank-transport";

const responder = new HttpResponder();

app.post("/entries/:id", async (context) => {
  const id = routeParam(context, "id");
  const values = await FormValues.from(context);

  try {
    await saveEntry(id, {
      featured: values.boolean("featured"),
      limit: values.number("limit"),
      title: values.string("title"),
      status: values.string("status"),
    });
    return responder.redirectAfterAction(context, "/");
  } catch (error) {
    return context.text(errorMessage(error), 400);
  }
});
```

## Transport API

| Export | Purpose |
| --- | --- |
| `FormValues` | Wraps parsed Hono form bodies and normalises missing or repeated values through safe string, optional string, number, and checkbox-style boolean reads. |
| `errorMessage` | Converts unknown thrown values into a safe message string. |
| `routeParam` | Reads a route parameter from a Hono context and returns an empty string when it is absent. |
| `isHtmxRequest` | Detects HTMX headers from a `Headers` object or plain header record without requiring a Hono context. |
| `HttpResponder` | Detects HTMX requests and centralises action redirects. |
| `fragmentOrPage` | Chooses between app-rendered fragment and full-page HTML for progressive enhancement. |

`HttpResponder.redirectAfterAction()` returns `HX-Redirect` for HTMX requests and a normal redirect
for native requests. `redirectWithAuthCookies()` preserves cookies from an auth response while using
the same HTMX-aware redirect behaviour.

`fragmentOrPage()` keeps the rendering decision small: route handlers still own validation,
permissions, templates, status codes, and URLs, while the helper selects the HTMX fragment or native
page response from caller-provided HTML.

## Route Pattern

| Step | Helper | App Responsibility |
| --- | --- | --- |
| Read route state | `routeParam(context, "id")` | Choose route names and validate whether the resource exists. |
| Read submitted fields | `await FormValues.from(context)` | Validate product rules and map fields to domain commands. |
| Handle failures | `errorMessage(error)` | Choose status codes, fragment shape, and logging. |
| Progressive rendering | `fragmentOrPage(context, { fragment, page })` | Render the fragment and page shells in app-owned components. |
| Redirect after success | `responder.redirectAfterAction(context, "/")` | Choose the destination and whether cookies must be preserved. |

For lower-level code that only receives headers, `isHtmxRequest(headers)` provides the same header
check without coupling the caller to Hono. `FormValues.number()` returns `undefined` for missing,
blank, repeated, or non-numeric values so domain validation can decide which error message to show.

</div>
</div>
