const validDevice = value => typeof value === 'string' && value.trim().length > 0
  && value.length <= 256 && !/[+/#\x00-\x1f\x7f]/.test(value);

/** Resolve the receiver from HA's MQTT metadata, never from its display name. */
export async function resolveMqttDevice(hass, config) {
  if (config.mqtt_device !== undefined && config.mqtt_device !== '') {
    if (!validDevice(config.mqtt_device)) throw new Error('Invalid Zigbee2MQTT friendly name override.');
    return config.mqtt_device;
  }
  const discover = async () => {
    if (!hass.callWS) throw new Error('MQTT discovery unavailable.');
    const entries = await hass.callWS({ type: 'config/entity_registry/list' });
    const climate = entries.find(entry => entry.entity_id === config.entity);
    if (climate?.platform !== 'mqtt' || !climate.device_id) throw new Error('Select a Zigbee2MQTT climate entity.');
    const info = await hass.callWS({ type: 'mqtt/device/debug_info', device_id: climate.device_id });
    const entity = info.entities?.find(entry => entry.entity_id === config.entity);
    let payload = entity?.discovery_data?.payload;
    if (typeof payload === 'string') payload = JSON.parse(payload);
    const candidates = new Set();
    // Z2M climate state topics use the receiver's base topic. Accept long and
    // abbreviated HA discovery keys, including the optional ~ substitution.
    for (const key of ['current_temperature_topic', 'curr_temp_t', 'temperature_state_topic', 'temp_stat_t', 'mode_state_topic', 'mode_stat_t', 'json_attributes_topic', 'json_attr_t']) {
      let topic = payload?.[key];
      if (typeof topic !== 'string') continue;
      if (typeof payload['~'] === 'string') {
        if (topic.startsWith('~')) topic = payload['~'] + topic.slice(1);
        else if (topic.endsWith('~')) topic = topic.slice(0, -1) + payload['~'];
      }
      const prefix = 'zigbee2mqtt/';
      if (topic.startsWith(prefix) && validDevice(topic.slice(prefix.length))) candidates.add(topic.slice(prefix.length));
    }
    if (candidates.size !== 1) throw new Error('Receiver MQTT topic missing or ambiguous.');
    return [...candidates][0];
  };
  let timer;
  try {
    return await Promise.race([
      discover(),
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('MQTT discovery timed out.')), 5000); }),
    ]);
  } catch (error) {
    throw new Error(`${error.message} Set mqtt_device in YAML if automatic discovery is unavailable.`);
  } finally { clearTimeout(timer); }
}
