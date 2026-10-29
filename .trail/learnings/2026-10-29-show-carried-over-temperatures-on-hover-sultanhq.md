---
title: Show carried-over temperatures on hover without a graph legend
author: Sultanhq
date: 2026-10-29
branch: feat/hive-slr1c-scheduler
id: l-c41412cf
scope: repo
status: active
replaces: l-b896f10b
src: agent
touches:
  - README.md
  - dist/hive-scheduler-card.js
  - docs/development-validation.md
  - src/components/schedule-graph-view.ts
  - test/integration/hive-behavior.test.ts
---

## Decided
Show the previous day's final temperature as a thin dashed overnight segment, with details only in a hover tooltip. Keep the graph free of a persistent legend. Use a non-scaling 1.25-pixel stroke and 4/4 dashes, plus a wider invisible hover target so the thin line is easy to inspect. The open start marker remains display-only.

## Tried and ruled out
The owner requested removing the initial always-visible carry-over label and then asked for thinner dashes. The original unscaled one-pixel line was too faint at 1°C because it overlapped the bottom axis and shrank with the chart. Keep screen-width scaling stable instead of making the line heavy or adding a permanent legend.

## Watch out
Never save an inferred midnight transition or make the start marker draggable. Native midnight transitions take precedence; absent previous-day data must not cause a guessed setpoint. This replaces the earlier guidance to show an always-visible carry-over label.

In the code: src/components/schedule-graph-view.ts; test/integration/hive-behavior.test.ts. The hover tooltip includes the time interval, temperature, previous day, and display-only status.
