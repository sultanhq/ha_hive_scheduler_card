---
title: Use the existing boost controller behind the dashboard badge
author: Sultanhq
date: 2026-10-29
branch: feat/hive-boost-badge
id: l-a3c0d007
scope: repo
status: active
src: agent
touches:
  - README.md
  - dist/hive-scheduler-card.js
  - src/boost-card.js
  - test-component.html
---

## Decided
Implement a real custom badge for Home Assistant’s top-of-view badge picker, with a compact status pill that opens the existing Boost controls. Inherit the same receiver subscription, fresh command verification, duration bounds and temperature suggestion; keep one controller/subscription per badge. Use the existing HACS resource and a badge-specific visual editor that preserves the badge config type.

## Tried and ruled out
Embedding a second Boost card in the popup would duplicate subscriptions/state. Replacing the native dialog on every receiver update would close it or lose user focus. Keep the outer dialog/pill stable and render the shared controls inside a dedicated content root instead. A sticky popup header keeps Close accessible when the viewport is short.

## Watch out
Tapping the pill only opens controls; a start still needs explicit confirmation and cancellation still needs fresh auto-mode feedback. Closing controls during verification must not cancel verification. Disconnect and reconfiguration close the dialog and dispose pending work. Viewers do not call the admin-only MQTT subscribe endpoint. Remaining countdowns can be below the new-command 15-minute minimum.

In the code: src/boost-card.js HiveBoostBadge, HiveBoostBadgeEditor and _getContentRoot; test/integration/boost-badge.test.ts; test-component.html dashboard badge preview. Register badges in window.customBadges, separately from window.customCards.
