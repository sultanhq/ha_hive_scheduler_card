---
title: Use setpoint in scheduler controls
author: Sultanhq
date: 2026-10-29
branch: feat/hive-slr1c-scheduler
id: l-7757426f
scope: repo
status: active
src: agent
touches:
  - README.md
  - docs/development-validation.md
  - src/components/day-schedule-editor.ts
  - src/components/schedule-graph-view.ts
  - src/components/transition-editor.ts
  - src/models/schedule.ts
  - src/utils/validation.ts
  - test/unit/validation.test.ts
---

## Decided
Call each scheduled time-and-temperature setting a setpoint. The owner chose “Add setpoint” after finding “transition” unfamiliar and considering “schedule point” and other alternatives. Use matching delete labels, tooltips and validation messages.

## Tried and ruled out
“Transition” felt unnatural to the owner; “schedule point” was a provisional suggestion rather than the final preference.

## Watch out
This is user-facing wording. Internal transition types, event names and converter properties keep their existing names, so the presentation change does not alter schedule handling.

In the code: src/components/day-schedule-editor.ts; src/components/schedule-graph-view.ts; src/components/transition-editor.ts; src/utils/validation.ts; src/models/schedule.ts.
