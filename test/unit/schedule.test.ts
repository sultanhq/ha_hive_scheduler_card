import { describe, it, expect } from 'vitest';
import { parseDaySchedule, serializeDaySchedule, parseWeeklySchedule, serializeWeeklySchedule,
  createEmptyDaySchedule, createEmptyWeeklySchedule, sortTransitions, copyDaySchedule,
  removeDuplicateTransitions, computeScheduleDiff, buildPartialPayload, generateTransitionId } from '../../src/models/schedule';
import { DAYS_OF_WEEK, type WeeklySchedule, type MQTTWeeklySchedule, type Transition, type DaySchedule, type ScheduleDiff } from '../../src/models/types';
const weekly = (value = '06:07/20.5 19:31/1') => parseWeeklySchedule(Object.fromEntries(DAYS_OF_WEEK.map(day => [day, value])) as MQTTWeeklySchedule);

describe('Hive schedule model', () => {
  it('collapses the typical six-slot Hive response without inserting midnight', () => {
    const parsed = parseDaySchedule('06:00/20.5 19:30/1 19:30/1 19:30/1 19:30/1 19:30/1');
    expect(parsed.transitions).toHaveLength(2);
    expect(serializeDaySchedule(parsed)).toBe('06:00/20.5 19:30/1');
  });
  it.each(['06:07/20.5', '00:00/1', '23:59/32', '05:01/5', '06:00/20.50', ' 06:00/20.5\n  19:30/1 '])('round-trips valid native values: %s', value => {
    const once = serializeDaySchedule(parseDaySchedule(value));
    expect(serializeDaySchedule(parseDaySchedule(once))).toBe(once);
  });
  it.each(['', '  ', 'invalid', '06:00/20 bad', '6:00/20', '24:00/20', '06:60/20', '06:00/NaN', '06:00/Infinity', '06:00/-1', '06:00/20.25', '06:00/4', '06:00/32.5', '06:00/2', '06:00/20/1', '06:00/20.500', '12:00/20 06:00/20', '06:00/20 06:00/21'])('rejects invalid schedules without defaults: %s', value => {
    expect(() => parseDaySchedule(value)).toThrow();
  });
  it('rejects more than six slots even if they are identical padding', () => {
    expect(() => parseDaySchedule(Array(7).fill('06:00/20').join(' '))).toThrow('Maximum is 6');
  });
  it('keeps distinct times with equal temperatures', () => {
    expect(parseDaySchedule('06:00/20 07:00/20').transitions).toHaveLength(2);
  });
  it('never sorts an unordered payload into validity', () => {
    expect(() => serializeDaySchedule({ transitions: [{ time: '19:00', temperature: 1 }, { time: '06:00', temperature: 20 }] })).toThrow('chronological');
  });
  it('rejects conflicting duplicates in the deduplication helper', () => {
    expect(() => removeDuplicateTransitions([{ time: '06:00', temperature: 20 }, { time: '06:00', temperature: 21 }])).toThrow('Conflicting');
  });
  it('deduplicates identical slots without mutating input', () => {
    const transitions = [{ time: '06:00', temperature: 20 }, { time: '06:00', temperature: 20 }];
    expect(removeDuplicateTransitions(transitions)).toHaveLength(1);
    expect(transitions).toHaveLength(2);
  });
  it('reads and serializes all seven days', () => {
    const schedule = weekly();
    expect(Object.keys(schedule)).toHaveLength(7);
    expect(Object.values(serializeWeeklySchedule(schedule))).toEqual(Array(7).fill('06:07/20.5 19:31/1'));
  });
  it('rejects missing or invalid days instead of filling defaults', () => {
    expect(() => parseWeeklySchedule({ monday: '06:00/20' } as MQTTWeeklySchedule)).toThrow();
    expect(() => serializeWeeklySchedule(createEmptyWeeklySchedule())).toThrow();
  });
  it('empty drafts contain no invented setpoint and are independent', () => {
    const a = createEmptyWeeklySchedule(); const b = createEmptyWeeklySchedule();
    expect(createEmptyDaySchedule().transitions).toEqual([]);
    expect(DAYS_OF_WEEK.every(day => a[day].transitions.length === 0)).toBe(true);
    a.monday.transitions.push({ time: '06:00', temperature: 20 });
    expect(a.tuesday.transitions).toEqual([]); expect(b.monday.transitions).toEqual([]);
  });
  it('generates distinct UI transition IDs', () => { expect(generateTransitionId()).not.toBe(generateTransitionId()); });
  it('has no diff for equivalent padding, whitespace, or IDs', () => {
    const a = weekly(); const b = weekly('06:07/20.50 19:31/1 19:31/1');
    expect(computeScheduleDiff(a, b).hasChanges).toBe(false);
  });
  it('publishes only changed days with Hive property names', () => {
    const a = weekly(); const b = weekly();
    b.monday.transitions[0].temperature = 21; b.friday.transitions[0].time = '06:09';
    expect(buildPartialPayload(computeScheduleDiff(a, b))).toEqual({ schedule_monday: '06:07/21 19:31/1', schedule_friday: '06:09/20.5 19:31/1' });
  });
  it('detects additions, removals, and changes across the full week', () => {
    const a = weekly(); const b = weekly('06:07/21 12:00/22 19:31/1');
    expect(computeScheduleDiff(a, b).changedDays).toHaveLength(7);
    b.monday.transitions.pop(); expect(computeScheduleDiff(a, b).changes.get('monday')).toBe('06:07/21 12:00/22');
  });
  describe('sortTransitions', () => {
    it('should sort transitions chronologically', () => {
      const transitions: Transition[] = [
        { time: '22:00', temperature: 18 },
        { time: '06:00', temperature: 22 },
        { time: '00:00', temperature: 20 },
        { time: '12:00', temperature: 24 }
      ];

      const result = sortTransitions(transitions);

      expect(result[0].time).toBe('00:00');
      expect(result[1].time).toBe('06:00');
      expect(result[2].time).toBe('12:00');
      expect(result[3].time).toBe('22:00');
    });

    it('should not mutate original array', () => {
      const transitions: Transition[] = [
        { time: '22:00', temperature: 18 },
        { time: '06:00', temperature: 22 }
      ];

      const result = sortTransitions(transitions);

      expect(transitions[0].time).toBe('22:00');
      expect(result[0].time).toBe('06:00');
    });

    it('should handle already sorted transitions', () => {
      const transitions: Transition[] = [
        { time: '00:00', temperature: 20 },
        { time: '06:00', temperature: 22 },
        { time: '12:00', temperature: 24 }
      ];

      const result = sortTransitions(transitions);

      expect(result).toHaveLength(3);
      expect(result[0]).toMatchObject({ time: '00:00', temperature: 20 });
      expect(result[1]).toMatchObject({ time: '06:00', temperature: 22 });
      expect(result[2]).toMatchObject({ time: '12:00', temperature: 24 });
    });

    it('should handle single transition', () => {
      const transitions: Transition[] = [{ time: '00:00', temperature: 20 }];

      const result = sortTransitions(transitions);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({ time: '00:00', temperature: 20 });
    });

    it('should handle empty array', () => {
      const transitions: Transition[] = [];

      const result = sortTransitions(transitions);

      expect(result).toHaveLength(0);
    });

    it('should correctly sort times with same hour', () => {
      const transitions: Transition[] = [
        { time: '06:30', temperature: 22 },
        { time: '06:00', temperature: 20 },
        { time: '06:45', temperature: 24 }
      ];

      const result = sortTransitions(transitions);

      expect(result[0].time).toBe('06:00');
      expect(result[1].time).toBe('06:30');
      expect(result[2].time).toBe('06:45');
    });
  });

  describe('copyDaySchedule', () => {
    it('should create deep copy of schedule', () => {
      const source: DaySchedule = {
        transitions: [
          { time: '00:00', temperature: 20 },
          { time: '06:00', temperature: 22 }
        ]
      };

      const result = copyDaySchedule(source);

      // Check that time and temperature are preserved
      expect(result.transitions).toHaveLength(2);
      expect(result.transitions[0]).toMatchObject({ time: '00:00', temperature: 20 });
      expect(result.transitions[1]).toMatchObject({ time: '06:00', temperature: 22 });
      expect(result).not.toBe(source);
      expect(result.transitions).not.toBe(source.transitions);
    });

    it('should not share transition references', () => {
      const source: DaySchedule = {
        transitions: [{ time: '00:00', temperature: 20 }]
      };

      const result = copyDaySchedule(source);

      expect(result.transitions[0]).not.toBe(source.transitions[0]);
    });

    it('should allow independent modification of copy', () => {
      const source: DaySchedule = {
        transitions: [{ time: '00:00', temperature: 20 }]
      };

      const result = copyDaySchedule(source);
      result.transitions[0].temperature = 25;

      expect(source.transitions[0].temperature).toBe(20);
      expect(result.transitions[0].temperature).toBe(25);
    });

    it('should handle empty schedule', () => {
      const source: DaySchedule = {
        transitions: []
      };

      const result = copyDaySchedule(source);

      expect(result.transitions).toHaveLength(0);
      expect(result.transitions).not.toBe(source.transitions);
    });

    it('should preserve all transition properties', () => {
      const source: DaySchedule = {
        transitions: [
          { time: '00:00', temperature: 20.5 },
          { time: '06:30', temperature: 22.5 },
          { time: '12:45', temperature: 24.5 }
        ]
      };

      const result = copyDaySchedule(source);

      expect(result.transitions[0]).toMatchObject({ time: '00:00', temperature: 20.5 });
      expect(result.transitions[1]).toMatchObject({ time: '06:30', temperature: 22.5 });
      expect(result.transitions[2]).toMatchObject({ time: '12:45', temperature: 24.5 });
    });
  });

  describe('buildPartialPayload', () => {
    it('should build payload with schedule_ prefix', () => {
      const changes = new Map<DayOfWeek, string>();
      changes.set('monday', '00:00/20 08:00/22');

      const diff = {
        changes,
        hasChanges: true,
        changedDays: ['monday' as DayOfWeek]
      };

      const payload = buildPartialPayload(diff);

      expect(payload).toEqual({
        schedule_monday: '00:00/20 08:00/22'
      });
    });

    it('should build payload with multiple days', () => {
      const changes = new Map<DayOfWeek, string>();
      changes.set('monday', '00:00/20');
      changes.set('wednesday', '00:00/22 12:00/18');

      const diff = {
        changes,
        hasChanges: true,
        changedDays: ['monday' as DayOfWeek, 'wednesday' as DayOfWeek]
      };

      const payload = buildPartialPayload(diff);

      expect(payload).toEqual({
        schedule_monday: '00:00/20',
        schedule_wednesday: '00:00/22 12:00/18'
      });
    });

    it('should return empty object for no changes', () => {
      const diff = {
        changes: new Map(),
        hasChanges: false,
        changedDays: []
      };

      const payload = buildPartialPayload(diff);

      expect(payload).toEqual({});
    });

    it('should handle all 7 days in payload', () => {
      const changes = new Map<DayOfWeek, string>();
      changes.set('sunday', '00:00/18');
      changes.set('monday', '00:00/19');
      changes.set('tuesday', '00:00/20');
      changes.set('wednesday', '00:00/21');
      changes.set('thursday', '00:00/22');
      changes.set('friday', '00:00/23');
      changes.set('saturday', '00:00/24');

      const diff = {
        changes,
        hasChanges: true,
        changedDays: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as DayOfWeek[]
      };

      const payload = buildPartialPayload(diff);

      expect(Object.keys(payload)).toHaveLength(7);
      expect(payload.schedule_sunday).toBe('00:00/18');
      expect(payload.schedule_monday).toBe('00:00/19');
      expect(payload.schedule_saturday).toBe('00:00/24');
    });

    it('should preserve complex schedule strings in payload', () => {
      const changes = new Map<DayOfWeek, string>();
      changes.set('friday', '00:00/18 06:00/21 08:00/19 17:00/22 22:00/18');

      const diff = {
        changes,
        hasChanges: true,
        changedDays: ['friday' as DayOfWeek]
      };

      const payload = buildPartialPayload(diff);

      expect(payload).toEqual({
        schedule_friday: '00:00/18 06:00/21 08:00/19 17:00/22 22:00/18'
      });
    });
  });
});
