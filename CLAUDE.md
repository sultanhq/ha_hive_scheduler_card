# Hive Scheduler Card

TypeScript/Lit dashboard card for native Hive SLR1c schedules through Home Assistant MQTT. See README.md for configuration and hardware acceptance, and follow AGENTS.md for repository exploration.

- Native values: 1°C off or 5–32°C in 0.5°C steps; one to six chronological HH:mm transitions. Collapse identical padding only. Never insert midnight, round native values, or replace errors with defaults.
- Keep climate identity, schedule entity IDs, and exact MQTT friendly name independent. Use registry discovery or explicit overrides.
- Write modified days only. A publish acknowledgement is not success; verify fresh feedback and entity agreement. Preserve drafts on failure or conflict.
- Keep the external converter unchanged. Obtain explicit hardware-test approval before physical schedule writes. The receiver executes its timetable.
- Preserve MIT and abaddon attribution. Rebuild and commit dist/hive-scheduler-card.js with source edits.
- Run npm ci, npm test, npm run typecheck, npm run build, and committed-build comparison. Refresh Trail and run trail check before commit/push/PR.
- Target only sultanhq/ha_hive_scheduler_card. Never push or create PRs against upstream; no production release before confirmed hardware acceptance.
