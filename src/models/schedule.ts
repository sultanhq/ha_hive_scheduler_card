/**
 * Schedule data model with parsing and serialization
 * Handles conversion between MQTT format and internal representation
 */

import { DaySchedule, Transition, WeeklySchedule, MQTTWeeklySchedule, DayOfWeek, DAYS_OF_WEEK, ScheduleDiff, MQTTPartialPayload } from './types';
import { compareTime } from '../utils/time';
import { validateDaySchedule } from '../utils/validation';

/**
 * Counter for generating unique transition IDs within a session
 */
let transitionIdCounter = 0;

/**
 * Generate a unique ID for a transition
 * Used for UI tracking to maintain DOM element identity during sorting
 */
export function generateTransitionId(): string {
  return `t-${Date.now()}-${++transitionIdCounter}`;
}

/**
 * Ensure a transition has an ID, generating one if missing
 */
export function ensureTransitionId(transition: Transition): Transition {
  if (transition.id) {
    return transition;
  }
  return { ...transition, id: generateTransitionId() };
}

/**
 * Parse a day schedule string from MQTT format
 * Format: "00:00/20 06:00/22 08:00/18" -> array of transitions
 *
 * @param scheduleString - Space-separated transitions in HH:mm/temperature format
 * @returns Parsed day schedule
 */
export function parseDaySchedule(scheduleString: string): DaySchedule {
  if (typeof scheduleString !== 'string' || !scheduleString.trim()) {
    throw new Error('Schedule is empty; request a fresh receiver schedule.');
  }
  const transitions = scheduleString.trim().split(/\s+/).map(part => {
    const match = /^(\d{2}:\d{2})\/(\d+(?:\.\d{1,2})?)$/.exec(part);
    if (!match) throw new Error(`Malformed setpoint: ${part}. Expected HH:mm/temperature.`);
    return { id: generateTransitionId(), time: match[1], temperature: Number(match[2]) };
  });
  const result = validateDaySchedule({ transitions });
  if (!result.valid) throw new Error(result.errors.join('; '));
  return { transitions: removeDuplicateTransitions(transitions) };
}

/** Serialize only validated native transitions; never insert or sort points. */
export function serializeDaySchedule(schedule: DaySchedule): string {
  const result = validateDaySchedule(schedule);
  if (!result.valid) throw new Error(result.errors.join('; '));
  return removeDuplicateTransitions(schedule.transitions)
    .map(t => `${t.time}/${t.temperature}`).join(' ');
}

/**
 * Parse a full weekly schedule from MQTT format
 *
 * @param mqtt - MQTT weekly schedule object
 * @returns Parsed weekly schedule
 */
export function parseWeeklySchedule(mqtt: MQTTWeeklySchedule): WeeklySchedule {
  const schedule = {} as WeeklySchedule;
  for (const day of DAYS_OF_WEEK) {
    schedule[day] = parseDaySchedule(mqtt[day] || '');
  }
  return schedule;
}

/**
 * Serialize a weekly schedule to MQTT format
 *
 * @param schedule - Weekly schedule to serialize
 * @returns MQTT-compatible weekly schedule object
 */
export function serializeWeeklySchedule(schedule: WeeklySchedule): MQTTWeeklySchedule {
  const mqtt = {} as MQTTWeeklySchedule;
  for (const day of DAYS_OF_WEEK) {
    mqtt[day] = serializeDaySchedule(schedule[day]);
  }
  return mqtt;
}

/**
 * Create an empty draft; it is invalid until the user adds a transition
 */
export function createEmptyDaySchedule(): DaySchedule {
  return {
    transitions: []
  };
}

/**
 * Create an empty weekly draft
 */
export function createEmptyWeeklySchedule(): WeeklySchedule {
  const schedule = {} as WeeklySchedule;
  for (const day of DAYS_OF_WEEK) {
    schedule[day] = createEmptyDaySchedule();
  }
  return schedule;
}

/**
 * Sort transitions by time (chronologically)
 *
 * @param transitions - Array of transitions to sort
 * @returns Sorted array (new array, doesn't mutate original)
 */
export function sortTransitions(transitions: Transition[]): Transition[] {
  return [...transitions].sort((a, b) => compareTime(a.time, b.time));
}

/**
 * Create a deep copy of a day schedule
 *
 * @param source - Day schedule to copy
 * @returns Deep copy of the schedule (preserves IDs, generates if missing)
 */
export function copyDaySchedule(source: DaySchedule): DaySchedule {
  return {
    transitions: source.transitions.map(t => ({
      id: t.id || generateTransitionId(),
      time: t.time,
      temperature: t.temperature
    }))
  };
}

/**
 * Remove duplicate transitions with the same time
 * Keeps the first occurrence of each unique time
 *
 * @param transitions - Array of transitions to deduplicate
 * @returns Array with duplicates removed (new array, doesn't mutate original)
 */
export function removeDuplicateTransitions(transitions: Transition[]): Transition[] {
  const seen = new Map<string, number>();
  const result: Transition[] = [];
  for (const transition of transitions) {
    if (seen.has(transition.time)) {
      if (seen.get(transition.time) !== transition.temperature) {
        throw new Error(`Conflicting temperatures at ${transition.time}`);
      }
      continue;
    }
    seen.set(transition.time, transition.temperature);
    result.push(ensureTransitionId({ ...transition }));
  }

  return result;
}

/**
 * Compute the difference between two weekly schedules
 * Returns only the days that have changed
 *
 * Comparison uses serialized form (MQTT string) to handle equivalent representations,
 * so harmless padding and UI IDs do not count as changes. Order is validated.
 *
 * @param original - The original/reference schedule
 * @param modified - The modified schedule to compare
 * @returns ScheduleDiff with only changed days
 */
export function computeScheduleDiff(
  original: WeeklySchedule,
  modified: WeeklySchedule
): ScheduleDiff {
  const changes = new Map<DayOfWeek, string>();

  for (const day of DAYS_OF_WEEK) {
    const originalSerialized = serializeDaySchedule(original[day]);
    const modifiedSerialized = serializeDaySchedule(modified[day]);

    if (originalSerialized !== modifiedSerialized) {
      changes.set(day, modifiedSerialized);
    }
  }

  // TypeScript readonly is better than Object.freeze for immutability
  const changedDays: readonly DayOfWeek[] = Array.from(changes.keys());

  return {
    changes,
    hasChanges: changes.size > 0,
    changedDays
  };
}

/**
 * Build the MQTT partial payload from a schedule diff
 * Creates an object with schedule_{day} keys for changed days only
 *
 * @param diff - The computed schedule differences
 * @returns Object with schedule_{day} keys for changed days only
 */
export function buildPartialPayload(diff: ScheduleDiff): MQTTPartialPayload {
  const payload: MQTTPartialPayload = {};

  for (const [day, serialized] of diff.changes) {
    payload[`schedule_${day}`] = serialized;
  }

  return payload;
}
