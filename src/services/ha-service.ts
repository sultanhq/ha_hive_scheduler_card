/** Home Assistant entity discovery and receiver schedule access. */
import { HomeAssistant, WeeklySchedule, DAYS_OF_WEEK, HiveSchedulerCardConfig, ScheduleEntities, EntityRegistryEntry } from '../models/types';
import { parseDaySchedule } from '../models/schedule';
export { SaveCoordinator } from './save-coordinator';

export function isInvalidSensorState(state: string | null | undefined): boolean {
  return state == null || ['', 'unavailable', 'unknown', 'none', 'null', 'n/a'].includes(state.trim().toLowerCase());
}

export async function resolveScheduleEntities(hass: HomeAssistant, config: HiveSchedulerCardConfig): Promise<ScheduleEntities> {
  const resolved = { ...config.schedule_entities } as ScheduleEntities;
  const missing = DAYS_OF_WEEK.filter(day => !resolved[day]);
  if (missing.length) {
    if (!hass.callWS) throw new Error('Entity discovery unavailable. Configure schedule_entities for all seven days.');
    const entries = await hass.callWS<EntityRegistryEntry[]>({ type: 'config/entity_registry/list' });
    const device = entries.find(entry => entry.entity_id === config.entity)?.device_id;
    if (!device) throw new Error('Climate device association not found. Configure schedule_entities explicitly.');
    for (const day of missing) {
      const matches = entries.filter(entry => entry.device_id === device && entry.platform === 'mqtt'
        && entry.entity_id.startsWith('text.') && !entry.disabled_by
        && new RegExp(`(?:^|_)schedule_${day}(?:_[0-9]+)?(?:_zigbee2mqtt)?$`).test(entry.unique_id));
      if (matches.length !== 1) throw new Error(`${day}: schedule entity missing or ambiguous. Set schedule_entities.${day}.`);
      resolved[day] = matches[0].entity_id;
    }
  }
  for (const day of DAYS_OF_WEEK) {
    if (!/^text\.[a-z0-9_]+$/.test(resolved[day])) throw new Error(`${day}: expected a text entity ID.`);
  }
  if (new Set(Object.values(resolved)).size !== 7) throw new Error('Each day must use a different schedule entity.');
  return resolved;
}

export function getScheduleFromSensor(hass: HomeAssistant, entities: ScheduleEntities): WeeklySchedule {
  const schedule = {} as WeeklySchedule;
  const errors: string[] = [];
  for (const day of DAYS_OF_WEEK) {
    try {
      const state = hass.states[entities[day]]?.state;
      if (isInvalidSensorState(state)) throw new Error(`Entity ${entities[day]} is missing or unavailable`);
      schedule[day] = parseDaySchedule(state);
    } catch (error) { errors.push(`${day}: ${error instanceof Error ? error.message : error}`); }
  }
  if (errors.length) throw new Error(errors.join('; '));
  return schedule;
}

export interface EntityInfo { name: string; available: boolean; currentTemp?: number; targetTemp?: number; }

export function getEntityInfo(hass: HomeAssistant, entityId: string): EntityInfo | null {
  const entity = hass.states[entityId];
  if (!entity) {
    console.warn(`Entity not found: ${entityId}`);
    return null;
  }

  // Extract friendly name - prefer friendly_name attribute, fallback to entity_id
  const name = (entity.attributes.friendly_name as string) || entityId;

  // Check availability - entity state should not be 'unavailable'
  const available = entity.state !== 'unavailable';

  // Get current temperature
  const currentTemp = entity.attributes.current_temperature as number | undefined;

  // Get target temperature - try multiple attribute names
  const targetTemp = (entity.attributes.temperature || entity.attributes.target_temperature) as number | undefined;

  return {
    name,
    available,
    currentTemp,
    targetTemp
  };
}


export function entityExists(hass: HomeAssistant, entityId: string): boolean {
  return entityId in hass.states;
}
export function getClimateEntities(hass: HomeAssistant): string[] {
  return Object.keys(hass.states).filter(id => id.startsWith('climate.'));
}
