---
title: Blend warmer settings from the green 10–15°C band
author: Sultanhq
date: 2026-10-29
branch: feat/hive-slr1c-scheduler
id: l-c117f7a6
scope: repo
status: active
replaces: l-ce2fddad
src: agent
touches:
  - README.md
  - dist/hive-scheduler-card.js
  - docs/development-validation.md
  - src/styles/card-styles.ts
  - test/integration/hive-behavior.test.ts
---

## Decided
The owner refined the palette again: below 10°C is blue; 10–15°C is green; above 15°C the colour gradually warms towards near-red at 20–25°C, with pure red above 25°C. The smoother warm gradient replaces the earlier abrupt move to red above 19°C. Keep the shared palette across timetable, graph, slider track, selected value and thumb.

## Tried and ruled out
A direct green/red RGB blend makes muddy brown intermediate colours, which the owner previously disliked. Blend through a bright yellow stop instead. Independent slider gradients were already removed; keep generating track stops from the shared function at actual temperature positions.

## Watch out
Both 10°C and 15°C should be green, 9.5°C blue, 25°C near-red and 25.5°C pure red. Off remains blue. Slider temperatures are 5–32°C, with off selected separately; colours must not alter valid temperatures or saved schedules.

In the code: src/styles/card-styles.ts warmTemperatureStops, getTemperatureColor and temperatureSliderGradient; test/integration/hive-behavior.test.ts covers the band boundaries. This replacement records the latest colour preference while preserving the shared-slider fix.
