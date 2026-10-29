---
title: Keep sliders and schedules on one temperature palette
author: Sultanhq
date: 2026-10-29
branch: feat/hive-slr1c-scheduler
id: l-ce2fddad
scope: repo
status: active
replaces: l-23e7044c
src: agent
touches:
  - README.md
  - dist/hive-scheduler-card.js
  - docs/development-validation.md
  - src/components/transition-editor.ts
  - src/styles/card-styles.ts
  - test/integration/hive-behavior.test.ts
---

## Decided
The owner refined the palette: normal heating around 20–25°C should look nearly red; anything above 25°C should be pure red. Retain the earlier preference that 19.5°C is already reddish, while 19°C and cooler remain green/blue and off remains blue. Apply this palette to the timetable, graph, editor value and slider thumb. Generate the track gradient from that same palette at positions on the slider’s actual 5–32°C range.

## Tried and ruled out
Updating the shared colour function alone left the slider orange: the editor and shared stylesheet each had a separate hard-coded gradient. A midpoint green stop also represented the wrong temperature. Remove the local override and generate the shared gradient rather than maintaining a second palette.

## Watch out
25°C is near-red; 25.5°C through 32°C are pure red. The heating slider begins at 5°C because off is a separate choice. This changes presentation only, never stored temperatures or schedules.

In the code: src/styles/card-styles.ts getTemperatureColor and temperatureSliderGradient; src/components/transition-editor.ts temperature-slider and thumb styles. This replaces the earlier red-above-19 learning with the refined high-temperature boundary and shared slider treatment.
