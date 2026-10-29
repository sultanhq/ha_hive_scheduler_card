---
title: Label the temperature carried over into the start of a day
author: Sultanhq
date: 2026-10-29
branch: feat/hive-slr1c-scheduler
id: l-b896f10b
scope: repo
status: active
src: agent
touches:
  - README.md
  - dist/hive-scheduler-card.js
  - docs/development-validation.md
  - src/components/schedule-graph-view.ts
  - test/integration/hive-behavior.test.ts
---

## Decided
Show a readable start-of-day temperature label and a strong dashed segment derived from the previous day's final transition. Include weekly wraparound. This period is display-only and has no draggable transition handle or saved midnight entry.

## Tried and ruled out
A thin SVG dashed line and hover title did not make the 1°C carried-over value apparent to the owner. At the graph minimum it overlaps the bottom axis, and scaling the chart makes a default-width stroke too faint. A fixed screen-width dashed stroke plus a visible label addresses this without changing receiver schedules.

## Watch out
Never insert a synthetic 00:00 transition to make the chart look complete. If the day actually stores a midnight transition, show that native value without a carry-over label. Do not guess a temperature when previous-day data is absent.

In the code: src/components/schedule-graph-view.ts uses getCarryOver for graph bounds, the inferred period, and its label. test/integration/hive-behavior.test.ts confirms writes still contain only native transitions.
