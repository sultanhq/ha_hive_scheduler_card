import type { HomeAssistant } from '../models/types';
export function resolveMqttDevice(hass: HomeAssistant, config: { entity: string; mqtt_device?: string }): Promise<string>;
