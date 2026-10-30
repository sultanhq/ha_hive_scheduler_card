---
title: Preserve dashboard editor controls during HA updates and discover the receiver from climate metadata
author: Sultanhq
date: 2026-10-30
branch: main
id: l-28efbe50
scope: repo
status: active
src: agent
touches:
  - README.md
  - dist/hive-scheduler-card.js
  - rollup.config.js
  - src/boost-card.js
  - src/card.ts
  - src/editor.ts
  - src/index.ts
  - src/models/types.ts
  - src/services/save-coordinator.ts
  - test/integration/boost-card.test.ts
---

## Decided
Keep Boost card and badge editor controls mounted across HA state updates. Refresh climate options only when their IDs or labels change, and defer changes while the picker has focus. Ignore identical config echoes so uncommitted typing stays intact. Keep the scheduler picker domain filter reference stable.

Selecting the climate entity is sufficient for the scheduler, Boost card and badge. Resolve its device through the entity registry, then read that exact climate entity's MQTT discovery state topic through mqtt/device/debug_info. Preserve explicit mqtt_device YAML overrides for older setups, but clear the previous override when the user selects another climate entity.

## Tried and ruled out
Rebuilding the editor with shadowRoot.innerHTML on every hass assignment closes native dropdowns and loses focus or unfinished input. Guessing a receiver topic from a climate entity ID or display name is unreliable because either can be renamed independently of Zigbee2MQTT.

## Watch out
Keep receiver discovery separate from fresh command verification. Missing or ambiguous metadata must produce an actionable error rather than a guessed MQTT destination. Bound discovery and discard stale results after reconfiguration or disconnect. Bundle Boost through the normal entry point so the shared resolver remains in the single HACS resource.

In the code: src/boost-card.js HiveBoostCardEditor and _ensureSubscription; src/editor.ts _renderEntityPicker; src/services/mqtt-device.js resolveMqttDevice; src/services/save-coordinator.ts; src/index.ts; rollup.config.js. Regression checks: npm test, npm run typecheck, npm run build.
