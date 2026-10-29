---
title: Keep a compiler API when updating the build toolchain
author: Sultanhq
date: 2026-10-29
branch: chore/update-dependencies
id: l-7be7a473
scope: repo
status: active
src: agent
touches:
  - ".github/workflows/ci.yml"
  - ".github/workflows/claude-issue-resolver.yml"
  - ".github/workflows/labels-sync.yml"
  - ".github/workflows/release.yml"
  - README.md
  - dist/hive-scheduler-card.js
  - docs/development-validation.md
  - package-lock.json
  - package.json
---

## Decided
Use TypeScript 6.0.x with the current Rollup TypeScript plugin, and Node 24.15+ (24.x) or 26+ for the updated Vitest/jsdom toolchain. Vite is explicit because Vitest 5 consumes it as a peer dependency. Keep the existing production watcher suppression: the updated build must still exit normally and reproduce the committed artifact.

## Tried and ruled out
TypeScript 7.0 is the latest compiler but does not ship a programmatic API; the Rollup plugin and its production sys override require that API. Upgrading to 7 would break this build. npm also tried to resolve the new Vitest against the old installed tree and rejected the peers. Resolving the new package manifest in a clean temporary directory produced a valid lockfile, then npm ci installed it without force or legacy-peer-deps.

## Watch out
The update clears moderate/high/critical audit findings, but two low development findings remain via the latest resolver plugin’s deepmerge dependency. The advisory has no patched release; npm’s resolver 7 downgrade is not a supported Rollup 4 fix. Keep the audit results explicit rather than claiming zero total findings. Production-only audit is clean.

In the code: package.json and package-lock.json; .nvmrc; .github/workflows/ci.yml and build workflows; rollup.config.js retains the non-watching production compiler hooks. TypeScript’s official 7.0 announcement documents the missing compiler API. Run npm ci, all tests, tsc and two exiting builds after updates.
