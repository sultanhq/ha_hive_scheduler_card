---
title: Verify boost commands with fresh command fields and receiver mode
author: Sultanhq
date: 2026-10-29
branch: feat/hive-boost-card
id: l-d914722c
scope: repo
status: active
src: agent
touches:
  - README.md
  - dist/hive-scheduler-card.js
  - src/boost-card.js
  - test-component.html
  - test/integration/boost-card.test.ts
---

## Decided
Keep boost display state separate from command verification. Each start/cancel operation owns an initially empty feedback snapshot, populated only by non-retained receiver messages received during that operation. Require every relevant field before confirming: start needs hold, finite duration, setpoint and heat mode; cancellation needs cleared hold, zero duration and auto mode. Configuration changes abandon pending verification.

## Tried and ruled out
Checking the merged display cache allowed old or retained matching settings plus a fresh room-temperature-only update to report a successful command. Checking only hold fields also confirmed boosts while the receiver stayed off, or cancellations while it stayed in heat mode. Nine regression cases reproduced these failures before the fix.

## Watch out
Fresh fields can arrive in separate messages; accumulate them only within the current operation. Retained feedback may update the display but must not enter the command snapshot. An explicit auto mode is required before saying normal scheduling resumed. Mock confirmation and expiry are not physical receiver acceptance.

In the code: src/boost-card.js _receive, _matchesPending, _send and setConfig; test/integration/boost-card.test.ts; test-component.html has normal, retained-only, wrong-mode and silent feedback plus simulated minute advancement.
