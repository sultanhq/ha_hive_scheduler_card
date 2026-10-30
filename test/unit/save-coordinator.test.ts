import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SaveCoordinator } from '../../src/services/save-coordinator';
import { parseWeeklySchedule } from '../../src/models/schedule';
import { DAYS_OF_WEEK, type HiveSchedulerCardConfig, type HomeAssistant, type MqttMessage, type ScheduleEntities, type MQTTWeeklySchedule } from '../../src/models/types';

function fixture() {
  const entities = Object.fromEntries(DAYS_OF_WEEK.map(day => [day, `text.renamed_${day}`])) as ScheduleEntities;
  const original = parseWeeklySchedule(Object.fromEntries(DAYS_OF_WEEK.map(day => [day, '06:07/20.5 19:31/1'])) as MQTTWeeklySchedule);
  const draft = structuredClone(original);
  draft.monday.transitions[0].temperature = 21;
  const config: HiveSchedulerCardConfig = { type: 'custom:hive-scheduler-card', entity: 'climate.unrelated_name', mqtt_device: 'Hive Reciever' };
  const callbacks = new Map<string, (message: MqttMessage) => void>();
  const unsubscribe = vi.fn();
  const hass: HomeAssistant = {
    states: Object.fromEntries([
      [config.entity, { entity_id: config.entity, state: 'auto', attributes: {} }],
      ...DAYS_OF_WEEK.map(day => [entities[day], { entity_id: entities[day], state: '06:07/20.5 19:31/1', attributes: {} }])
    ]),
    user: { is_admin: true },
    callService: vi.fn().mockResolvedValue(undefined),
    connection: { subscribeMessage: vi.fn(async (callback, message) => {
      callbacks.set(String(message.topic), callback as (message: MqttMessage) => void); return unsubscribe;
    }) }
  };
  const coordinator = new SaveCoordinator();
  const start = () => coordinator.save(hass, config, entities, original, draft);
  const emit = (payload: unknown, retain = false, topic = 'zigbee2mqtt/Hive Reciever') => callbacks.get(topic)?.({ topic, payload: JSON.stringify(payload), retain });
  const state = (day: keyof ScheduleEntities, value: string) => { hass.states[entities[day]].state = value; coordinator.updateHass(hass); };
  return { hass, config, entities, original, draft, coordinator, start, emit, state, callbacks, unsubscribe };
}

describe('receiver-verified saving', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => { vi.clearAllTimers(); vi.useRealTimers(); });

  it('subscribes before writing only Monday, then requests read-back with exact topics', async () => {
    const f = fixture(); const pending = f.start(); await vi.advanceTimersByTimeAsync(0);
    const calls = vi.mocked(f.hass.callService).mock.calls;
    expect(calls).toEqual([
      ['mqtt', 'publish', { topic: 'zigbee2mqtt/Hive Reciever/set', payload: '{"schedule_monday":"06:07/21 19:31/1"}', retain: false }],
      ['mqtt', 'publish', { topic: 'zigbee2mqtt/Hive Reciever/get', payload: '{"schedule_monday":""}', retain: false }]
    ]);
    expect(vi.mocked(f.hass.connection!.subscribeMessage).mock.invocationCallOrder[1]).toBeLessThan(vi.mocked(f.hass.callService).mock.invocationCallOrder[0]);
    f.emit({ schedule_monday: '06:07/21.0 19:31/1 19:31/1' });
    f.state('monday', ' 06:07/21  19:31/1 ');
    await vi.advanceTimersByTimeAsync(100);
    expect(await pending).toEqual({ status: 'success', daysUpdated: ['monday'] });
    expect(f.unsubscribe).toHaveBeenCalledTimes(2);
  });

  it.each(['cached', 'retained', 'wrong-day', 'wrong-value', 'malformed', 'entity-only', 'mqtt-only'])('does not accept %s as confirmation', async kind => {
    const f = fixture(); const pending = f.start(); await vi.advanceTimersByTimeAsync(0);
    if (kind !== 'mqtt-only') f.state('monday', '06:07/21 19:31/1');
    if (kind === 'retained') f.emit({ schedule_monday: '06:07/21 19:31/1' }, true);
    if (kind === 'wrong-day') f.emit({ schedule_tuesday: '06:07/21 19:31/1' });
    if (kind === 'wrong-value') f.emit({ schedule_monday: '06:07/22 19:31/1' });
    if (kind === 'malformed') f.emit({ schedule_monday: 'bad' });
    if (kind === 'mqtt-only') f.emit({ schedule_monday: '06:07/21 19:31/1' });
    await vi.advanceTimersByTimeAsync(30_000);
    expect(await pending).toMatchObject({ status: 'error', daysUpdated: [], error: expect.stringContaining('monday') });
    expect(vi.mocked(f.hass.callService).mock.calls.filter(call => String(call[2].topic).endsWith('/set'))).toHaveLength(1);
    expect(vi.mocked(f.hass.callService).mock.calls.filter(call => String(call[2].topic).endsWith('/get'))).toHaveLength(3);
    expect(f.draft.monday.transitions[0].temperature).toBe(21);
  });

  it('supports repeated MQTT feedback when HA suppresses an unchanged state update', async () => {
    const f = fixture(); const pending = f.start(); await vi.advanceTimersByTimeAsync(0);
    f.state('monday', '06:07/21 19:31/1');
    // Entity already matches; a fresh read response still completes verification.
    f.emit({ schedule_monday: '06:07/21 19:31/1' });
    await vi.advanceTimersByTimeAsync(100); expect((await pending).status).toBe('success');
  });

  it('does not count feedback received before the read request', async () => {
    const f = fixture(); const publish = vi.mocked(f.hass.callService);
    publish.mockImplementationOnce(async () => { f.state('monday', '06:07/21 19:31/1'); f.emit({ schedule_monday: '06:07/21 19:31/1' }); });
    const pending = f.start(); await vi.advanceTimersByTimeAsync(30_000);
    expect((await pending).status).toBe('error');
  });

  it('accepts late correct feedback after an out-of-order mismatch', async () => {
    const f = fixture(); const pending = f.start(); await vi.advanceTimersByTimeAsync(0);
    f.emit({ schedule_monday: '06:07/20 19:31/1' });
    await vi.advanceTimersByTimeAsync(10_000);
    f.emit({ schedule_monday: '06:07/21 19:31/1' }); f.state('monday', '06:07/21 19:31/1');
    await vi.advanceTimersByTimeAsync(100); expect((await pending).status).toBe('success');
  });

  it('retains confirmed-day progress on partial failure', async () => {
    const f = fixture(); f.draft.friday.transitions[0].temperature = 22;
    const pending = f.start(); await vi.advanceTimersByTimeAsync(0);
    f.emit({ schedule_monday: '06:07/21 19:31/1' }); f.state('monday', '06:07/21 19:31/1');
    await vi.advanceTimersByTimeAsync(30_000);
    expect(await pending).toMatchObject({ status: 'error', daysUpdated: ['monday'], error: expect.stringContaining('friday') });
  });

  it('reports a device-specific Zigbee2MQTT write rejection', async () => {
    const f = fixture(); const pending = f.start(); await vi.advanceTimersByTimeAsync(0);
    f.emit({ level: 'error', message: "Publish 'set' 'schedule_monday' to 'Hive Reciever' failed: rejected" }, false, 'zigbee2mqtt/bridge/logging');
    await vi.advanceTimersByTimeAsync(100); expect(await pending).toMatchObject({ status: 'error', error: expect.stringContaining('rejected') });
  });

  it('ignores errors for another device', async () => {
    const f = fixture(); const pending = f.start(); await vi.advanceTimersByTimeAsync(0);
    f.emit({ level: 'error', message: "'Other Hive Reciever' 'schedule_monday' failed" }, false, 'zigbee2mqtt/bridge/logging');
    f.emit({ schedule_monday: '06:07/21 19:31/1' }); f.state('monday', '06:07/21 19:31/1');
    await vi.advanceTimersByTimeAsync(100); expect((await pending).status).toBe('success');
  });

  it('rejects repeated saves and cancels listeners without accepting late messages', async () => {
    const f = fixture(); const pending = f.start(); await vi.advanceTimersByTimeAsync(0);
    expect(await f.start()).toMatchObject({ status: 'error', error: expect.stringContaining('already') });
    f.coordinator.cancel(); expect((await pending).status).toBe('error');
    f.emit({ schedule_monday: '06:07/21 19:31/1' }); expect(f.unsubscribe).toHaveBeenCalledTimes(2);
  });

  it.each(['permission', 'unavailable', 'service', 'subscription'])('handles %s failures without losing edits', async kind => {
    const f = fixture();
    if (kind === 'permission') f.hass.user!.is_admin = false;
    if (kind === 'unavailable') f.hass.states[f.config.entity].state = 'unavailable';
    if (kind === 'service') vi.mocked(f.hass.callService).mockRejectedValue(new Error('MQTT disconnected'));
    if (kind === 'subscription') vi.mocked(f.hass.connection!.subscribeMessage).mockRejectedValue(new Error('Unauthorized'));
    expect((await f.start()).status).toBe('error');
    expect(f.draft.monday.transitions[0].temperature).toBe(21);
    if (kind !== 'service') expect(f.hass.callService).not.toHaveBeenCalled();
  });

  it('bounds a stalled service call', async () => {
    const f = fixture(); vi.mocked(f.hass.callService).mockReturnValue(new Promise(() => {}));
    const pending = f.start(); await vi.advanceTimersByTimeAsync(5_000);
    expect(await pending).toMatchObject({ status: 'error', error: expect.stringContaining('timed out') });
    expect(f.unsubscribe).toHaveBeenCalledTimes(2);
  });

  it('cleans up subscriptions that finish after cancellation', async () => {
    const f = fixture(); let finish!: (value: () => void) => void;
    vi.mocked(f.hass.connection!.subscribeMessage).mockReturnValue(new Promise(resolve => { finish = resolve; }));
    const pending = f.start(); await vi.advanceTimersByTimeAsync(0); f.coordinator.cancel(); await pending;
    finish(f.unsubscribe); await vi.advanceTimersByTimeAsync(0); expect(f.unsubscribe).toHaveBeenCalledOnce();
  });

  it('publishes nothing when the schedule is unchanged', async () => {
    const f = fixture(); expect(await f.coordinator.save(f.hass, f.config, f.entities, f.original, structuredClone(f.original))).toEqual({ status: 'skipped' });
    expect(f.hass.callService).not.toHaveBeenCalled(); expect(f.hass.connection!.subscribeMessage).not.toHaveBeenCalled();
  });

  it('saves and verifies with only a climate entity configured', async () => {
    const f = fixture(); delete f.config.mqtt_device;
    f.hass.callWS = vi.fn().mockResolvedValueOnce([
      { entity_id: f.config.entity, platform: 'mqtt', device_id: 'receiver' },
    ]).mockResolvedValueOnce({ entities: [{ entity_id: f.config.entity, discovery_data: {
      payload: { current_temperature_topic: 'zigbee2mqtt/Hive Reciever' },
    } }] });
    const pending = f.start(); await vi.advanceTimersByTimeAsync(0);
    expect(f.hass.callService).toHaveBeenCalledWith('mqtt', 'publish', expect.objectContaining({ topic: 'zigbee2mqtt/Hive Reciever/set' }));
    f.emit({ schedule_monday: '06:07/21 19:31/1' }); f.state('monday', '06:07/21 19:31/1');
    await vi.advanceTimersByTimeAsync(100);
    expect(await pending).toEqual({ status: 'success', daysUpdated: ['monday'] });
  });

  it.each(['bad/name', 'bad+', 'bad#', 'bad\nname', ''])('rejects unsafe MQTT device %j', async name => {
    const f = fixture(); f.config.mqtt_device = name;
    expect((await f.start()).status).toBe('error'); expect(f.hass.callService).not.toHaveBeenCalled();
  });
});
