---
title: Start boosts at 15 minutes without restricting receiver countdowns
author: Sultanhq
date: 2026-10-29
branch: feat/hive-boost-card
id: l-dd8ff3c9
scope: repo
status: active
src: agent
touches:
  - README.md
  - dist/hive-scheduler-card.js
  - docs/development-validation.md
  - src/boost-card.js
  - test-component.html
  - test/integration/boost-card.test.ts
---

## Decided
Use “Boost active” for the active status and require at least 15 whole minutes for a new boost. The owner requested both while testing the local preview. Apply the minimum to the custom input, configured default, command validation and editor; offer a 15m preset and use 15 minutes in the preview.

## Tried and ruled out
The earlier preview allowed a five-minute new boost and displayed the protocol term “Hold active”. These do not match the owner’s requested controls and wording.

## Watch out
The 15-minute minimum applies only to newly requested durations. A running receiver boost naturally counts below 15 minutes; continue displaying and verifying that remaining duration normally. Cancellation still needs zero duration and auto mode. Keep the existing fresh-feedback verification intact.

In the code: src/boost-card.js MIN_DURATION, validDuration, active badge and editor; test-component.html preview defaults; test/integration/boost-card.test.ts covers rejected short durations and a 15-minute start confirmed with 14 minutes remaining.
