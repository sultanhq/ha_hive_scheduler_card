---
title: Suggest a boost one degree above the room temperature
author: Sultanhq
date: 2026-10-29
branch: feat/hive-boost-card
id: l-33c4356f
scope: repo
status: active
src: agent
touches:
  - README.md
  - dist/hive-scheduler-card.js
  - docs/development-validation.md
  - src/boost-card.js
  - test/integration/boost-card.test.ts
---

## Decided
The owner wants the initial Boost suggestion to be room temperature +1°C rather than a fixed 21°C. Round upward to a 0.5°C step so normal readings between steps still get at least a degree of increase, within the receiver’s 5–32°C limits. Keep default_temperature as an unavailable-room fallback only.

## Tried and ruled out
A fixed configured/default value can be below a warm room. Recalculating on every state update would overwrite slider edits or change the temperature being reviewed or sent. Reusing an unchanged HA value after fresh MQTT feedback can also revert the latest room reading.

## Watch out
Update untouched suggestions from changing HA or MQTT room readings, but preserve manual edits and the confirmation/pending target. Reset selection/source state on configuration changes. At the 32°C limit the requested full degree may be impossible; never exceed the receiver range. Treat missing, blank, boolean and non-finite room readings as unavailable rather than coercing them to zero.

In the code: src/boost-card.js parseRoomTemperature, _syncClimateTemperature, room/source fields and _render; test/integration/boost-card.test.ts; README documents fallback-only configuration and rounding.
