/** Home Assistant entity discovery and receiver schedule access. */
import { HomeAssistant, WeeklySchedule, DAYS_OF_WEEK, HiveSchedulerCardConfig, ScheduleEntities, EntityRegistryEntry } from '../models/types';
import { parseDaySchedule } from '../models/schedule';
import { validateMqttDevice } from './mqtt-sanitizer';
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


/**
 * Resolve the receiver's exact MQTT topic segment from the selected Home Assistant
 * climate entity, NOT from its mutable friendly_name/display label. Only an exact,
 * unique zigbee2mqtt/<device> state topic is safe for MQTT writes.
 *
 * Home Assistant's mqtt/device/debug_info WebSocket endpoint requires an admin.
 * The explicit mqtt_device override remains supported when metadata is unavailable.
 */
export async function resolveMqttDevice(hass: HomeAssistant, config: HiveSchedulerCardConfig): Promise<string> {
  if (config.mqtt_device?.trim()) {
    validateMqttDevice(config.mqtt_device);
    return config.mqtt_device;
  }
  if (!hass.callWS || !hass.user?.is_admin) {
    throw new Error('MQTT topic discovery requires a Home Assistant administrator. Set mqtt_device explicitly if discovery is unavailable.');
  }
  const registry = await hass.callWS<EntityRegistryEntry[]>({ type: 'config/entity_registry/list' });
  const deviceId = registry.find(entry => entry.entity_id === config.entity)?.device_id;
  if (!deviceId) throw new Error('Cannot identify the climate device in the entity registry. Set mqtt_device explicitly.');
  const debug = await hass.callWS<{
    entities?: Array<{
      entity_id?: string;
      subscriptions?: Array<{ topic?: string }>;
      discovery_data?: { payload?: unknown };
    }>;
  }>({ type: 'mqtt/device/debug_info', device_id: deviceId });
  const candidates = new Set<string>();
  const addTopic = (topic: unknown): void => {
    if (typeof topic !== 'string') return;
    const match = /^zigbee2mqtt\/([^/+#\x00-\x1f\x7f]+)$/.exec(topic);
    if (match) candidates.add(match[1]);
  };
  // Use the selected climate entity's MQTT metadata, not unrelated devices or labels.
  for (const entry of debug.entities || []) {
    if (entry.entity_id !== config.entity) continue;
    for (const subscription of entry.subscriptions || []) addTopic(subscription.topic);
    let payload = entry.discovery_data?.payload;
    if (typeof payload === 'string') {
      try { payload = JSON.parse(payload); } catch { payload = null; }
    }
    if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
      const fields = payload as Record<string, unknown>;
      const base = typeof fields['~'] === 'string' ? fields['~'] : '';
      for (const key of ['state_topic', 'stat_t']) {
        const topic = fields[key];
        if (typeof topic === 'string') addTopic(topic.replace(/^~/, base));
      }
    }
  }
  if (candidates.size !== 1) {
    throw new Error(candidates.size === 0
      ? 'No exact Zigbee2MQTT state topic found for the climate entity. Set mqtt_device explicitly.'
      : 'Multiple Zigbee2MQTT topics match this climate entity. Set mqtt_device explicitly.');
  }
  const name = [...candidates][0];
  validateMqttDevice(name);
  return name;
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
