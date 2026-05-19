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
  routeParam,
} from "@macavitymadcap/hyper-dank-transport";

const responder = new HttpResponder();

app.post("/entries/:id", async (context) => {
  const id = routeParam(context, "id");
  const values = await FormValues.from(context);

  try {
    await saveEntry(id, {
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
| `FormValues` | Wraps parsed Hono form bodies and normalises missing or repeated values through `string(key)`. |
| `errorMessage` | Converts unknown thrown values into a safe message string. |
| `routeParam` | Reads a route parameter from a Hono context and returns an empty string when it is absent. |
| `HttpResponder` | Detects HTMX requests and centralises action redirects. |

`HttpResponder.redirectAfterAction()` returns `HX-Redirect` for HTMX requests and a normal redirect
for native requests. `redirectWithAuthCookies()` preserves cookies from an auth response while using
the same HTMX-aware redirect behaviour.

## Route Pattern

| Step | Helper | App Responsibility |
| --- | --- | --- |
| Read route state | `routeParam(context, "id")` | Choose route names and validate whether the resource exists. |
| Read submitted fields | `await FormValues.from(context)` | Validate product rules and map fields to domain commands. |
| Handle failures | `errorMessage(error)` | Choose status codes, fragment shape, and logging. |
| Redirect after success | `responder.redirectAfterAction(context, "/")` | Choose the destination and whether cookies must be preserved. |

</div>
</div>
