---
layout: default
title: Libraries
---

# Libraries

Hyper-Dank is split into small Bun workspace packages so applications can consume only the contracts
they need.

## Components

`@macavitymadcap/hyper-dank-components` exposes server-rendered Hono JSX primitives such as
`Button`, `Card`, `Switch`, `FormField`, `HxForm`, `ScrollableTable`, `Panel`, and `CompactList`.

```ts
import { Button, FormField, Switch } from "@macavitymadcap/hyper-dank-components";
import "@macavitymadcap/hyper-dank-components/styles.css";
```

The CSS export is a baseline contract. App-specific layout and product styling should layer on top.

## Database

`@macavitymadcap/hyper-dank-database` contains provider lifecycle and migration primitives. Apps keep
their domain repositories and schemas local, then use conformance tests to keep adapters honest.

## HTTP

`@macavitymadcap/hyper-dank-http` contains generic form parsing, route parameter, error-message, and
HTMX response helpers. Auth, permissions, and product routes stay in the consuming app.
