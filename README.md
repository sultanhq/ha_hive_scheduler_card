# Hive Scheduler Card

A Home Assistant dashboard card for the **native heating schedule stored on a Hive SLR1c receiver**, through Zigbee2MQTT. The receiver executes the timetable; Home Assistant provides the editor and MQTT transport. No custom integration or Schedule Helper is required.

![Schedule edits pass through Zigbee2MQTT; the Hive receiver stores and executes the timetable, with fresh read-back confirming saves.](docs/hive-schedule-flow.svg)

Derived from [abaddon's Sonoff TRVZB Scheduler Card](https://github.com/abaddon/ha_sonoff_TRVZB_scheduler_card). The original MIT licence and Copyright (c) 2024 abaddon are preserved in [LICENSE](LICENSE) and the compiled card.

## Requirements and validation status

- Hive SLR1c with the working external converter exposing seven writable text properties, `schedule_monday` through `schedule_sunday`, `/get` support, and receiver-originated schedule responses. It must not optimistically publish requested schedules as confirmed state. The converter is not bundled or modified by this card.
- Zigbee2MQTT Home Assistant discovery and Home Assistant's MQTT integration, using base topic `zigbee2mqtt`.
- Home Assistant 2024.1 or newer. Viewing requires entity access. **Verified saving requires a Home Assistant administrator**, because HA's MQTT listener requires administrator permissions.
- Temperatures: **1°C off**, or **5–32°C in 0.5°C steps**. One to six chronological transitions per day, with every minute supported.

The owner has hardware-tested the converter. The card's complete end-to-end hardware acceptance remains pending owner confirmation. No production release has been published for this implementation.

## HACS installation

After the Hive feature branch is merged into this repository's `main`:

1. Open HACS → menu → **Custom repositories**.
2. Add `https://github.com/sultanhq/ha_hive_scheduler_card`, category **Dashboard** (`plugin` in older interfaces).
3. Download **Hive Scheduler Card** from the default branch and reload the frontend.
4. Verify resource `/hacsfiles/ha_hive_scheduler_card/hive-scheduler-card.js`, type **JavaScript module**, under Settings → Dashboards → Resources. Add it manually if HACS has not registered it.

The compiled file is committed under `dist/`, so a GitHub release and inclusion in the main HACS catalogue are unnecessary. Do not install the inherited Sonoff `main` while the Hive changes remain only in a draft PR.

## Manual development installation

1. Download `dist/hive-scheduler-card.js` from branch `feat/hive-slr1c-scheduler`, or unzip the `hive-scheduler-card` artifact from a successful branch CI run.
2. Copy the file to `/config/www/hive-scheduler-card.js` in Home Assistant.
3. Register `/local/hive-scheduler-card.js?v=hive-dev-1` as a **JavaScript module** resource. Increment the version query after replacing the file and reload the browser.
4. Add the configuration below. Load only one copy of the card's resource; HACS and manual installation are alternatives.

## Configuration

```yaml
type: custom:hive-scheduler-card
entity: climate.hive_reciever  # illustrative: select your actual entity
mqtt_device: "Hive Reciever"  # exact spelling, case, and embedded space
name: Hive Heating
view_mode: week              # week (default) or graph
```

`entity` and `mqtt_device` are required and independent. The friendly name is used verbatim in MQTT topics. Wildcards, `/`, and control characters are rejected rather than replaced. `name` is optional.

Schedule text entities are discovered through the climate entity's HA device and MQTT schedule identifiers. Renamed entities work independently of the climate entity ID. If discovery is missing or ambiguous, configure overrides in YAML or the visual editor:

```yaml
type: custom:hive-scheduler-card
entity: climate.actual_hive_entity
mqtt_device: "Hive Reciever"
name: Hive Heating
view_mode: graph
schedule_entities:
  monday: text.actual_monday_entity
  tuesday: text.actual_tuesday_entity
  wednesday: text.actual_wednesday_entity
  thursday: text.actual_thursday_entity
  friday: text.actual_friday_entity
  saturday: text.actual_saturday_entity
  sunday: text.actual_sunday_entity
```

Overrides may be partial; discovery resolves the remainder. Each day needs a different `text.*` entity.

## Editing and verified saving

Click a day to edit transitions, or drag stored graph points. The first transition is editable and deletable; retain at least one transition. Choose **Heating off (1°C)** for an off period. Graph lines use the same temperature colours as their points and the timetable, including the dashed overnight period. Use **Copy to Other Days** to copy a day's schedule.

Schedules may begin after midnight. A dashed graph segment before the first transition shows the previous day's final temperature, including weekly wraparound. Hover over this segment or its open start marker to see the temperature, time interval, and previous day—for example, “00:00–06:00: Heating off (1°C), carried over from Sunday”. It has no editable point and is never written. Identical duplicate padding is collapsed; different transition times with equal temperatures remain distinct.

Save validates the draft and publishes only changed days:

```text
Topic: zigbee2mqtt/Hive Reciever/set
Payload: {"schedule_monday":"06:00/21 19:30/1"}

Topic: zigbee2mqtt/Hive Reciever/get
Payload: {"schedule_monday":""}
```

**Verifying…** remains visible until fresh, non-retained feedback and the associated HA entities agree with the intended schedule. Duplicate padding and formatting differences are ignored. Read requests retry at 10 and 20 seconds with a 30-second read-back deadline. Individual HA calls time out after five seconds. Writes are never automatically repeated.

Errors preserve your draft. Confirmed days are tracked on partial failure; check connectivity and Zigbee2MQTT logs before retrying. External changes to an edited day block saving until you explicitly **Discard edits and reload**. This discards the draft and requests all seven schedules without writing schedules.

The native protocol has no transaction ID; verification relies on the supplied converter's receiver responses and a fresh read-back window. A multi-day save is not atomic. Avoid other controllers editing schedules during acceptance testing.

Missing entities and malformed, unordered, conflicting, or unsupported schedules show errors. The card never substitutes defaults or rounds existing unsupported values. It deliberately restricts temperatures to half-degree steps, even if a converter accepts finer precision.

## Hardware acceptance

First display all seven days against the actual HA text entities. **Refresh** sends read-only `/get` requests.

After explicit approval for a hardware write:

1. Back up the exact original text state for one day.
2. Change one temperature by 0.5°C, save, and wait for verification.
3. Confirm the value on the physical Hive remote and record the result.
4. Restore the backup and verify read-back and remote display.
5. Back up a target day, test copying to it, then restore and verify it.

Physical testing remains incomplete until the owner confirms it. Production publication is a separate action after acceptance.

## Development

```sh
npm ci
npm test
npm run typecheck
npm run build
git diff --exit-code -- dist/hive-scheduler-card.js
```

Rebuild and commit the JavaScript alongside source changes. CI verifies the committed build and uploads an artifact; other generated files remain ignored. Serve this repository locally and open `test-component.html` for a mock preview that never contacts hardware.

Tag-triggered release automation creates **draft releases only**. Optional inherited Claude automation requires repository variable `ENABLE_CLAUDE_AUTOMATION=true` and its credentials.

See [development validation](docs/development-validation.md) for baseline results, dependency findings, and hardware status.
