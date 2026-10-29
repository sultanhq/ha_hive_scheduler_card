---
title: Hive setpoints use half-degree steps
author: Sultanhq
date: 2026-10-29
branch: feat/hive-slr1c-scheduler
id: l-49116879
scope: repo
status: active
src: agent
touches:
  - ".github/workflows/ci.yml"
  - ".github/workflows/claude-code-review.yml"
  - ".github/workflows/claude-issue-resolver.yml"
  - ".github/workflows/claude.yml"
  - ".github/workflows/release.yml"
  - CLAUDE.md
  - README.md
  - design/bulk-schedule-update-spec.md
  - hacs.json
  - package-lock.json
---

## Decided
The Hive card accepts 1°C as heating off and normal 5–32°C setpoints in 0.5°C increments. Preserve native minute precision, but report unsupported temperatures rather than rounding them.

## Tried and ruled out
The initial plan allowed two decimal places because the external converter parser accepts them. The owner corrected this: the Hive hardware works in 0.5°C steps. The frontend therefore deliberately validates more narrowly than the converter's numeric syntax.

## Watch out
Do not reintroduce hundredths merely to match the converter's parser, and do not change the working converter as part of this card adaptation.

In the code: src/utils/validation.ts; src/models/schedule.ts; tests cover rejecting 20.25°C while accepting 1°C, 5°C, 20.5°C, and 32°C.
