---
layout: default
title: Pace Demo
permalink: /demo/
---

# Walking Pace Demo

The static Walking Pace demo is published at [`/pace/`]({{ '/pace/' | relative_url }}). It stores
walk rows in the browser under `hyper-dank:pace-demo:walks:v1`, calculates speed and median pace with
the same app math, and proves the UI can run from static hosting.

The demo omits auth, admin, invitations, and server sessions. Those remain part of the full Hono
template app.
