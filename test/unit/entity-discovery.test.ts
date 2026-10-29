import { describe, expect, it, vi } from 'vitest';
import { getScheduleFromSensor, resolveScheduleEntities } from '../../src/services/ha-service';
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
