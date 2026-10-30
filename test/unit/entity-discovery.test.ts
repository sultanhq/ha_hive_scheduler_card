import { describe, expect, it, vi } from 'vitest';
import { getScheduleFromSensor, resolveScheduleEntities, resolveMqttDevice } from '../../src/services/ha-service';
import { DAYS_OF_WEEK, type EntityRegistryEntry, type HiveSchedulerCardConfig, type HomeAssistant, type ScheduleEntities } from '../../src/models/types';

function fixture() {
  const entities = Object.fromEntries(DAYS_OF_WEEK.map(day => [day, `text.arbitrarily_renamed_${day}`])) as ScheduleEntities;
  const entries: EntityRegistryEntry[] = [
    { entity_id: 'climate.unrelated', device_id: 'hive', platform: 'mqtt', unique_id: 'climate' },
    ...DAYS_OF_WEEK.map(day => ({ entity_id: entities[day], device_id: 'hive', platform: 'mqtt', unique_id: `0x123_schedule_${day}_zigbee2mqtt` })),
    { entity_id: 'text.other_schedule_monday', device_id: 'other', platform: 'mqtt', unique_id: '0x456_schedule_monday_zigbee2mqtt' }
  ];
  const hass: HomeAssistant = {
    states: Object.fromEntries(DAYS_OF_WEEK.map(day => [entities[day], { entity_id: entities[day], state: '06:07/20.5 19:30/1 19:30/1', attributes: {} }])),
    callService: vi.fn(), callWS: vi.fn().mockImplementation(async () => entries)
  };
  const config: HiveSchedulerCardConfig = { type: 'custom:hive-scheduler-card', entity: 'climate.unrelated', mqtt_device: 'Hive Reciever' };
  return { hass, config, entities, entries };
}

describe('Hive schedule entity resolution', () => {
  it('discovers all seven renamed entities on the climate device, independently of MQTT name', async () => {
    const f = fixture(); expect(await resolveScheduleEntities(f.hass, f.config)).toEqual(f.entities);
    const read = getScheduleFromSensor(f.hass, f.entities);
    expect(DAYS_OF_WEEK.every(day => read[day].transitions.length === 2 && read[day].transitions[0].time === '06:07')).toBe(true);
    expect(f.hass.callService).not.toHaveBeenCalled();
  });
  it('uses explicit overrides without requiring registry access', async () => {
    const f = fixture(); delete f.hass.callWS; f.config.schedule_entities = f.entities;
    expect(await resolveScheduleEntities(f.hass, f.config)).toEqual(f.entities);
  });
  it('combines overrides and unambiguous discovery', async () => {
    const f = fixture(); f.config.schedule_entities = { monday: 'text.manual_monday' };
    expect((await resolveScheduleEntities(f.hass, f.config)).monday).toBe('text.manual_monday');
  });
  it.each(['missing', 'ambiguous', 'disabled', 'no-device', 'not-mqtt'])('requires overrides when discovery is %s', async kind => {
    const f = fixture(); const monday = f.entries.find(entry => entry.entity_id === f.entities.monday)!;
    if (kind === 'missing') f.entries.splice(f.entries.indexOf(monday), 1);
    if (kind === 'ambiguous') f.entries.push({ ...monday, entity_id: 'text.second_monday' });
    if (kind === 'disabled') monday.disabled_by = 'user';
    if (kind === 'no-device') f.entries[0].device_id = null;
    if (kind === 'not-mqtt') monday.platform = 'other';
    await expect(resolveScheduleEntities(f.hass, f.config)).rejects.toThrow(/schedule_entities/);
  });
  it('rejects duplicate entity mappings', async () => {
    const f = fixture(); f.config.schedule_entities = { ...f.entities, tuesday: f.entities.monday };
    await expect(resolveScheduleEntities(f.hass, f.config)).rejects.toThrow('different');
  });
  it.each(['unknown', 'unavailable', 'bad', '06:00/20.25', '06:00/20 06:00/21'])('reports invalid Monday state %s without creating defaults', value => {
    const f = fixture(); f.hass.states[f.entities.monday].state = value;
    expect(() => getScheduleFromSensor(f.hass, f.entities)).toThrow('monday:');
  });
});


describe('Zigbee2MQTT receiver topic resolution', () => {
  function mqttFixture(payload: unknown, subscriptions: Array<{topic: string}> = []) {
    // Arrange - create one climate entity and an associated MQTT device.
    const f = fixture();
    f.config.mqtt_device = undefined;
    f.hass.user = { is_admin: true };
    f.hass.callWS = vi.fn().mockImplementation(async (request: { type: string }) =>
      request.type === 'config/entity_registry/list' ? f.entries : {
        entities: [{ entity_id: f.config.entity, discovery_data: { payload }, subscriptions }]
      });
    return f;
  }
  it('uses the exact state topic, never a changing friendly name', async () => {
    const f = mqttFixture({ '~': 'zigbee2mqtt/Hive Reciever', stat_t: '~' });
    f.hass.states[f.config.entity] = { entity_id: f.config.entity, state: 'heat', attributes: {friendly_name:'New temperature 20.5'} };
    // Act - resolve MQTT topic from HA discovery payload.
    const device = await resolveMqttDevice(f.hass, f.config);
    // Assert - topic spelling is preserved exactly and unrelated to the display name.
    expect(device).toBe('Hive Reciever');
    expect(f.hass.callWS).toHaveBeenCalledWith({type:'mqtt/device/debug_info',device_id:'hive'});
  });
  it('also accepts the climate entity exact MQTT state subscription', async () => {
    const f = mqttFixture(null, [{topic:'zigbee2mqtt/Hive Reciever'}]);
    expect(await resolveMqttDevice(f.hass, f.config)).toBe('Hive Reciever');
  });
  it('uses an explicit MQTT override without requesting metadata', async () => {
    const f = mqttFixture(null);
    f.config.mqtt_device = 'Manual Hive';
    expect(await resolveMqttDevice(f.hass, f.config)).toBe('Manual Hive');
    expect(f.hass.callWS).not.toHaveBeenCalled();
  });
  it('rejects missing, unrelated, and ambiguous topics rather than guessing', async () => {
    for (const payload of [null, {state_topic:'other/receiver'}, {state_topic:'zigbee2mqtt/Receiver', '~':'zigbee2mqtt/Another', stat_t:'~'}]) {
      const f = mqttFixture(payload);
      // Act & Assert - never publish based on a friendly name or ambiguous metadata.
      await expect(resolveMqttDevice(f.hass, f.config)).rejects.toThrow(/mqtt_device/);
    }
  });
  it('does not use non-admin MQTT debug access', async () => {
    const f = mqttFixture(null);
    f.hass.user = {is_admin:false};
    await expect(resolveMqttDevice(f.hass, f.config)).rejects.toThrow(/administrator/);
  });
});
