---
title: Production builds must exit after writing the card
author: Sultanhq
date: 2026-10-29
branch: feat/hive-slr1c-scheduler
id: l-5132b091
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
Disable compiler file and directory watchers in one-shot production compilation, while retaining real TypeScript watchers for rollup -w development builds.

## Tried and ruled out
The inherited Rollup TypeScript plugin wrote the artifact and printed created successfully but left more than 200 FSWatcher handles alive on Node 24. Closing the Rollup bundle did not release them. Treating the created message as a successful process exit would leave CI or local validation hanging.

## Watch out
Verify npm run build actually exits zero, then compare two build hashes. Do not force process.exit or disable development watchers to hide unfinished work.

In the code: rollup.config.js supplies non-watching TypeScript sys hooks only when ROLLUP_WATCH is absent. Dependency versions remain unchanged.
