---
title: Show heating above 19°C in red shades
author: Sultanhq
date: 2026-10-29
branch: feat/hive-slr1c-scheduler
id: l-23e7044c
scope: repo
status: active
src: agent
touches:
  - README.md
  - dist/hive-scheduler-card.js
  - docs/development-validation.md
  - src/styles/card-styles.ts
  - test/integration/hive-behavior.test.ts
---

## Decided
Use red shades for every temperature above 19°C, starting at 19.5°C. The owner finds the inherited brown/orange at typical 20–20.5°C heating settings unattractive and wants those settings to look nearly red. Keep one shared palette across timetable blocks, graph periods and points, and editor controls.

## Tried and ruled out
The inherited blue/green/red interpolation made ordinary heating settings brown because its red endpoint was above normal room temperatures. Moving only graph colours would leave the timetable inconsistent.

## Watch out
19°C remains on the cool/green side; all warmer valid settings should read as red. Keep off at 1°C blue. This is presentation only and must not change schedule temperatures.

In the code: src/styles/card-styles.ts getTemperatureColor; existing Hive UI coverage checks 19.5°C, 20°C, 20.5°C and 32°C alongside 19°C and off.
