# Development validation

## Inherited baseline

At original commit `3bb711b`, before Hive changes:

- `npm ci`: completed.
- `npm test`: 358 tests passed across nine files.
- `npx tsc --noEmit`: passed.
- `npm run build`: passed.
- npm reported 16 vulnerabilities: 2 low, 3 moderate, 9 high, and 2 critical. These are inherited dependency findings. No broad dependency upgrade or automatic audit fix is included; review `npm audit` before a production release.

Inherited tests that expected automatic midnight defaults, silent repair, guessed MQTT names, or publish-based success are adapted to Hive behavior. UI, copy dialog, time, validation, and fixture coverage is retained, with added entity discovery and receiver verification scenarios.

## Hardware status

The owner reports the existing converter is hardware-tested. The reference converter is unchanged and is not bundled into the card.

The card's complete read/edit/write/read-back and physical-remote acceptance remains pending owner confirmation. Mock tests and browser previews are not physical-device tests. No production release is authorized by these results.

## Hive implementation validation

- `npm ci`: completed with the existing lockfile dependency versions.
- `npm test`: 422 tests passed across 12 files.
- `npm run typecheck`: passed.
- `npm run build`: exits zero; two production builds produce the same JavaScript hash.
- The 110 KB bundle includes the full original MIT notice. Licence comments survive minification.
- GitHub Actions workflow YAML parses successfully. CI validates the committed build; release automation creates drafts only.
- Desktop and 360-pixel card-width layouts were inspected in Chrome using the local mock preview. A manual temperature edit, publish, and verified mock read-back succeeded. No physical schedule was read or written during this preview.
- Production compilation uses non-watching TypeScript sys hooks to avoid inherited compiler watchers keeping Node 24 alive after bundle creation. Development watch mode retains real watchers.

Hardware acceptance remains pending. Installation and the backup/edit/read-back/remote-confirmation/restore procedure are documented in README.md.

## Start-of-day graph follow-up

The carried-over temperature appears in a hover tooltip, without a persistent legend, and is drawn with a non-scaling dashed line and a non-editable start marker. The inferred period includes the rise/fall to the first native transition. Tests cover previous-day off/heating values, weekly wraparound, explicit midnight transitions, absent previous-day data, and a verified save with no synthetic midnight payload. The 1°C tooltip content and line were inspected in the narrow Chrome mock preview.

Graph periods and the inferred overnight period use the same temperature palette as their points and timetable entries. Rendering tests cover hot, mild, and off settings while keeping the overnight hover details and thin dashes.

Graph time and temperature labels sit beside vertical steps with a background-colour outline. Late-day labels face inward to stay inside the graph; low-temperature labels sit above the point to avoid the time axis. A rendering test covers arbitrary-minute and 23:59 label placement. The labels were checked in desktop and narrow Chrome previews. User-facing controls and validation messages use “schedule point” for each time-and-temperature setting.
