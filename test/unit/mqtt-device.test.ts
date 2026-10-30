import { afterEach, describe, expect, it, vi } from 'vitest';
import { resolveMqttDevice } from '../../src/services/mqtt-device.js';

function fixture(payload: unknown = { current_temperature_topic: 'zigbee2mqtt/Hive Reciever' }) {
  const config = { entity: 'climate.renamed' };
  const entry = { entity_id: config.entity, platform: 'mqtt', device_id: 'receiver' };
  const info = { entities: [
    { entity_id: 'climate.other', discovery_data: { payload: { current_temperature_topic: 'zigbee2mqtt/Wrong Receiver' } } },
    { entity_id: config.entity, discovery_data: { payload } },
  ] };
  const hass = { states: {}, callService: vi.fn(), callWS: vi.fn().mockResolvedValueOnce([entry]).mockResolvedValueOnce(info) };
  return { config, entry, hass, info };
}

afterEach(() => vi.useRealTimers());

describe('receiver MQTT discovery', () => {
  it('uses the selected climate metadata despite renamed entities and unrelated device entities', async () => {
    const f = fixture();
    expect(await resolveMqttDevice(f.hass, f.config)).toBe('Hive Reciever');
    expect(f.hass.callWS.mock.calls).toEqual([
      [{ type: 'config/entity_registry/list' }], [{ type: 'mqtt/device/debug_info', device_id: 'receiver' }],
    ]);
    expect(f.hass.callService).not.toHaveBeenCalled();
  });

  it.each([
    { '~': 'zigbee2mqtt/Hive Reciever', curr_temp_t: '~', temp_stat_t: '~' },
    JSON.stringify({ temperature_state_topic: 'zigbee2mqtt/Hive Reciever' }),
  ])('supports HA discovery abbreviations, base topics and JSON payloads', async payload => {
    const f = fixture(payload); expect(await resolveMqttDevice(f.hass, f.config)).toBe('Hive Reciever');
  });

  it('preserves explicit YAML overrides without a registry lookup', async () => {
    const f = fixture();
    expect(await resolveMqttDevice(f.hass, { ...f.config, mqtt_device: 'Exact Receiver Name' })).toBe('Exact Receiver Name');
    expect(f.hass.callWS).not.toHaveBeenCalled();
  });

  it.each([
    {}, { current_temperature_topic: 'zigbee2mqtt/Bad#' },
    { current_temperature_topic: 'zigbee2mqtt/A', temperature_state_topic: 'zigbee2mqtt/B' },
    { current_temperature_topic: 'other/Receiver' },
  ])('requires an override for missing, unsafe or ambiguous topics', async payload => {
    const f = fixture(payload);
    await expect(resolveMqttDevice(f.hass, f.config)).rejects.toThrow('mqtt_device');
    expect(f.hass.callService).not.toHaveBeenCalled();
  });

  it('rejects a non-MQTT climate entity', async () => {
    const f = fixture(); f.entry.platform = 'hive';
    await expect(resolveMqttDevice(f.hass, f.config)).rejects.toThrow('Zigbee2MQTT climate');
  });

  it('bounds stalled discovery', async () => {
    vi.useFakeTimers();
    const f = fixture(); f.hass.callWS.mockReset().mockReturnValue(new Promise(() => {}));
    const pending = expect(resolveMqttDevice(f.hass, f.config)).rejects.toThrow('timed out');
    await vi.advanceTimersByTimeAsync(5000); await pending;
  });
});
