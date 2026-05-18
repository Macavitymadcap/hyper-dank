---
layout: default
title: Character Sheet Adoption
---

# Character Sheet Adoption

Character Sheet should consume Hyper-Dank packages only after the package contract is ready and its
own active work is clean. This epic prepares that contract without editing the sibling repository.

The first protected surface is `e2e/consumer-compat/character-sheet-compat.test.tsx`. It imports the
component, database, and HTTP packages through their public paths and renders Character Sheet-like
markup.

A later Sheet ticket can add the runtime dependency, CSS import, component migration, and consuming
app verification once the current Sheet branch is merged or otherwise stable.
