# Development validation

## Inherited baseline

At original commit `3bb711b`, before Hive changes:

- `npm ci`: completed.
- `npm test`: 358 tests passed across nine files.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed.
- npm reported 16 vulnerabilities: 2 low, 3 moderate, 9 high, and 2 critical. These were inherited dependency findings recorded at baseline; the dependency update below supersedes this audit result.

Inherited tests that expected automatic midnight defaults, silent repair, guessed MQTT names, or publish-based success are adapted to Hive behavior. UI, copy dialog, time, validation, and fixture coverage is retained, with added entity discovery and receiver verification scenarios.

## Hardware status

The owner reports the existing converter is hardware-tested. The reference converter is unchanged and is not bundled into the card.

On 29 October 2026, the owner confirmed completion of the card's hardware acceptance: all seven days displayed correctly, temperature changes were saved and verified against the physical Hive remote, and backup, copying and restoration checks were completed. This is owner-reported hardware validation; the agent's tests and browser previews used mocks. No production release has been requested.

## Hive implementation validation

- `npm ci`: completed with the existing lockfile dependency versions.
- `npm test`: 422 tests passed across 12 files.
- `npm run typecheck`: passed.
- `npm run build`: exits zero; two production builds produce the same JavaScript hash.
- The 110 KB bundle includes the full original MIT notice. Licence comments survive minification.
- GitHub Actions workflow YAML parses successfully. CI validates the committed build; release automation creates drafts only.
- Desktop and 360-pixel card-width layouts were inspected in Chrome using the local mock preview. A manual temperature edit, publish, and verified mock read-back succeeded. No physical schedule was read or written during this preview.
- Production compilation uses non-watching TypeScript sys hooks to avoid inherited compiler watchers keeping Node 24 alive after bundle creation. Development watch mode retains real watchers.

Hardware acceptance is complete following the owner's confirmation on 29 October 2026. Installation and the repeatable backup/edit/read-back/remote-confirmation/restore procedure are documented in README.md.

## Start-of-day graph follow-up

The carried-over temperature appears in a hover tooltip, without a persistent legend, and is drawn with a non-scaling dashed line and a non-editable start marker. The inferred period includes the rise/fall to the first native transition. Tests cover previous-day off/heating values, weekly wraparound, explicit midnight transitions, absent previous-day data, and a verified save with no synthetic midnight payload. The 1°C tooltip content and line were inspected in the narrow Chrome mock preview.

Graph periods and the inferred overnight period use the same temperature palette as their points and timetable entries. Rendering tests cover blue below 10°C, green at both 10°C and 15°C, near-red at 20°C and 25°C, pure red at 25.5°C, plus off settings while keeping the overnight hover details and thin dashes. Slider tracks derive their gradient from the same palette at the actual temperature positions; thumb outlines match the selected temperature.

Graph time and temperature labels sit beside vertical steps with a background-colour outline. Late-day labels face inward to stay inside the graph; low-temperature labels sit above the point to avoid the time axis. A rendering test covers arbitrary-minute and 23:59 label placement. The labels were checked in desktop and narrow Chrome previews. User-facing controls and validation messages use “setpoint” for each time-and-temperature setting.

## Dependency update — 29 October 2026

The development toolchain now uses Node.js 24.15+ on the 24.x line, or Node.js 26+. CI and build workflows use Node 24; `.nvmrc` selects it locally. The browser card does not require Node.js in Home Assistant.

Updated Lit, Rollup and its plugins, Testing Library, jsdom, Vitest, Vite, TypeScript and Node types. Vite is now explicit because Vitest 5 declares it as a peer dependency. TypeScript stays on `~6.0.3`: TypeScript 7.0 does not expose the programmatic compiler API required by the Rollup TypeScript plugin. Node types track the Node 24 development baseline.

Validation with the new lockfile:

- `npm ci`: passes without peer-dependency overrides.
- `npm test`: all 422 tests pass, with the existing suite unchanged.
- `npx tsc --noEmit`: passes.
- `npm run build`: exits zero; repeated builds have identical JavaScript hashes and retain the full original MIT notice.
- `npm audit`: 2 low findings, down from 16; no moderate, high or critical findings remain.
- `npm audit --omit=dev`: zero findings.
- The rebuilt JavaScript passed a jsdom smoke check: seven native day schedules, two graph points, matching timetable/graph colours and minute labels, without hardware writes.

The two remaining low findings are the build-only `@rollup/plugin-node-resolve` → `deepmerge` advisory [GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4). The current `deepmerge` release (4.3.1) has no patched version. npm proposes downgrading the resolver to 7.1.3, which is outside the supported Rollup 4 plugin line; that downgrade was not applied. No force install, dependency override or audit suppression was added.

## Boost review follow-up — 29 October 2026

The boost PR adds a second card in the same JavaScript resource. Two review findings were reproduced and fixed: cached/retained display state cannot supply command confirmation fields, and receiver mode must match the requested `heat` or `auto` mode. Pending verification is abandoned on reconfiguration.

- Nine new regression cases failed against the original implementation and pass with the fixes.
- All 444 tests pass across 13 files; `npm ci`, TypeScript and the build pass.
- Repeated builds exit normally and reproduce the same JavaScript hash.
- The compiled local preview passes start/confirm, cancellation, simulated expiry, retained plus room-only feedback rejection, fresh read-back and wrong-mode rejection checks. Weekly schedules stay unchanged.
- The local preview includes desktop and mobile Boost cards, with feedback controls and manual mock minute advancement. Both layouts were inspected in Chrome; a mock boost and verified cancellation were exercised through the browser. It has no Home Assistant connection or hardware writes.

The original scheduler’s hardware acceptance remains complete. Boost start, cancellation, real receiver expiry and physical remote behaviour still require their own hardware acceptance; local mocks do not establish those results.

New Boost commands now require 15–360 whole minutes, including configured defaults and custom input. The receiver’s remaining countdown may fall below 15 minutes and is still displayed and verified normally. The active status reads “Boost active”, and the preview defaults to 15 minutes.
