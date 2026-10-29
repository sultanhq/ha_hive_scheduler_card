/**
 * Validation utilities for Hive SLR1c schedules
 * Implements all validation rules from the design document
 */

import { Transition, DaySchedule, WeeklySchedule, ValidationResult, DayOfWeek } from '../models/types';
import { parseTime } from './time';

/**
 * Check if a time string is valid HH:mm format
 */
export function isValidTime(time: string): boolean {
  try {
    parseTime(time);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if temperature is valid (1°C off or 5–32°C in 0.5°C steps)
 */
export function isValidTemperature(temp: number): boolean {
  return Number.isFinite(temp) && (temp === 1 || (temp >= 5 && temp <= 32 && Number.isInteger(temp * 2)));
}

/**
 * Validate a single transition
 */
export function validateTransition(transition: Transition): ValidationResult {
  const errors: string[] = [];

  // Validate time format
  if (!isValidTime(transition.time)) {
    errors.push(`Invalid time format: ${transition.time}. Expected HH:mm (00:00 - 23:59)`);
  }

  // Validate temperature
  if (!isValidTemperature(transition.temperature)) {
    errors.push(`Temperature ${transition.temperature}°C must be 1°C (off) or 5–32°C in 0.5°C steps`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate a day schedule
 */
export function validateDaySchedule(schedule: DaySchedule): ValidationResult {
  const errors: string[] = [];
  const transitions = schedule?.transitions;
  if (!Array.isArray(transitions)) return { valid: false, errors: ['Missing transitions array'] };

  // Check minimum transitions
  if (transitions.length === 0) {
    errors.push('Day schedule must have at least 1 transition');
    return { valid: false, errors };
  }

  // Check maximum transitions
  if (transitions.length > 6) {
    errors.push(`Too many transitions: ${transitions.length}. Maximum is 6 per day`);
  }

  // Validate each transition
  transitions.forEach((transition, index) => {
    const result = validateTransition(transition);
    if (!result.valid) {
      result.errors.forEach(error => {
        errors.push(`Transition ${index + 1}: ${error}`);
      });
    }
  });

  // Check chronological order
  for (let i = 1; i < transitions.length; i++) {
    const prevTime = transitions[i - 1].time;
    const currTime = transitions[i].time;

    if (!isValidTime(prevTime) || !isValidTime(currTime)) {
      continue; // Skip comparison if time format is invalid (already reported)
    }

    const { hours: prevH, minutes: prevM } = parseTime(prevTime);
    const { hours: currH, minutes: currM } = parseTime(currTime);
    const prevMinutes = prevH * 60 + prevM;
    const currMinutes = currH * 60 + currM;

    if (currMinutes === prevMinutes && transitions[i].temperature !== transitions[i - 1].temperature) {
      errors.push(`Conflicting temperatures at ${currTime}`);
    }
    if (currMinutes < prevMinutes) {
      errors.push(`Transitions must be in chronological order: ${prevTime} should come before ${currTime}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate a weekly schedule
 */
export function validateWeeklySchedule(schedule: WeeklySchedule): ValidationResult {
  const errors: string[] = [];
  const days: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  days.forEach(day => {
    const daySchedule = schedule[day];
    const result = validateDaySchedule(daySchedule);

    if (!result.valid) {
      result.errors.forEach(error => {
        errors.push(`${day.charAt(0).toUpperCase() + day.slice(1)}: ${error}`);
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}
