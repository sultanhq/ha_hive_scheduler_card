import { DayOfWeek, HiveSchedulerCardConfig, HomeAssistant, MqttMessage, SaveScheduleResult, ScheduleEntities, WeeklySchedule } from '../models/types';
import { buildPartialPayload, computeScheduleDiff, parseDaySchedule, serializeDaySchedule } from '../models/schedule';
import { validateMqttDevice } from './mqtt-sanitizer';

/** One transaction per card. A service acknowledgement is never a save confirmation. */
export class SaveCoordinator {
  private hass?: HomeAssistant;
  private controller?: AbortController;

  updateHass(hass: HomeAssistant): void { this.hass = hass; }
  cancel(): void { this.controller?.abort(); }

  async save(hass: HomeAssistant, config: HiveSchedulerCardConfig, entities: ScheduleEntities,
    original: WeeklySchedule, draft: WeeklySchedule): Promise<SaveScheduleResult> {
    if (this.controller) return { status: 'error', error: 'A save is already in progress.', daysUpdated: [] };
    const controller = new AbortController();
    this.controller = controller;
    this.hass = hass;
    const signal = controller.signal;
    const unsubscribers: (() => void)[] = [];
    const confirmed = new Set<DayOfWeek>();
    let changed: readonly DayOfWeek[] = [];
    let reading = false;
    let rejection: string | undefined;
    const fresh = new Map<DayOfWeek, string>();
    try {
      validateMqttDevice(config.mqtt_device);
      const diff = computeScheduleDiff(original, draft);
      changed = diff.changedDays;
      if (!diff.hasChanges) return { status: 'skipped' };
      if (!hass.user?.is_admin || !hass.connection) throw new Error('Sign in as a Home Assistant administrator to verify and save schedules.');
      const topic = `zigbee2mqtt/${config.mqtt_device}`;
      const subscribe = async (mqttTopic: string, callback: (message: MqttMessage) => void) => {
        const pending = hass.connection!.subscribeMessage<MqttMessage>(message => {
          if (!signal.aborted) callback(message);
        }, { type: 'mqtt/subscribe', topic: mqttTopic });
        // Even if setup times out/cancels, dispose of a subscription that resolves later.
        pending.then(unsubscribe => { if (signal.aborted) unsubscribe(); }, () => {});
        unsubscribers.push(await this.bounded(pending, signal));
      };
      await subscribe(topic, message => {
        if (!reading || message.retain || message.topic !== topic) return;
        try {
          const payload = JSON.parse(message.payload);
          for (const day of changed) {
            if (!(Object.prototype.hasOwnProperty.call(payload, `schedule_${day}`))) continue;
            try { fresh.set(day, serializeDaySchedule(parseDaySchedule(payload[`schedule_${day}`]))); }
            catch { fresh.delete(day); }
          }
        } catch { /* Ignore unrelated/non-JSON feedback. */ }
      });
      await subscribe('zigbee2mqtt/bridge/logging', message => {
        if (message.retain) return;
        try {
          const log = JSON.parse(message.payload);
          // Require the exact quoted device name and an affected key. Unrelated errors cannot fail a save.
          if (log.level === 'error' && typeof log.message === 'string'
            && (log.message.includes(`'${config.mqtt_device}'`) || log.message.includes(`\"${config.mqtt_device}\"`))
            && changed.some(day => log.message.includes(`schedule_${day}`))) rejection = log.message;
        } catch { /* Not a Zigbee2MQTT log record. */ }
      });
      this.assertAvailable(config, entities, changed);
      await this.bounded(hass.callService('mqtt', 'publish', {
        topic: `${topic}/set`, payload: JSON.stringify(buildPartialPayload(diff)), retain: false
      }), signal);
      const start = Date.now();
      let attempt = 0;
      while (Date.now() - start < 30_000) {
        if (signal.aborted) throw new Error('Save cancelled. Edits were preserved; reload receiver schedules before retrying.');
        if (rejection) throw new Error(`Zigbee2MQTT rejected the update: ${rejection}`);
        this.assertAvailable(config, entities, changed);
        if (attempt < 3 && Date.now() - start >= attempt * 10_000) {
          const request = Object.fromEntries(changed.filter(day => !confirmed.has(day)).map(day => [`schedule_${day}`, '']));
          reading = true;
          await this.bounded(hass.callService('mqtt', 'publish', {
            topic: `${topic}/get`, payload: JSON.stringify(request), retain: false
          }), signal);
          attempt++;
        }
        for (const day of changed) {
          try {
            const actual = serializeDaySchedule(parseDaySchedule(this.hass!.states[entities[day]].state));
            if (fresh.get(day) === diff.changes.get(day) && actual === diff.changes.get(day)) confirmed.add(day);
            else confirmed.delete(day);
          } catch { confirmed.delete(day); }
        }
        if (confirmed.size === changed.length) return { status: 'success', daysUpdated: [...confirmed] };
        await this.pause(signal);
      }
      throw new Error(`Read-back timed out or differs for ${changed.filter(day => !confirmed.has(day)).join(', ')}. Check receiver connectivity and Zigbee2MQTT logs, then retry or reload.`);
    } catch (error) {
      return { status: 'error', error: error instanceof Error ? error.message : String(error), daysUpdated: [...confirmed] };
    } finally {
      controller.abort();
      for (const unsubscribe of unsubscribers) { try { unsubscribe(); } catch { /* Already disconnected. */ } }
      if (this.controller === controller) this.controller = undefined;
    }
  }

  private assertAvailable(config: HiveSchedulerCardConfig, entities: ScheduleEntities, days: readonly DayOfWeek[]): void {
    if (!this.hass?.states[config.entity] || ['unknown', 'unavailable'].includes(this.hass.states[config.entity].state)
      || days.some(day => !this.hass?.states[entities[day]] || ['unknown', 'unavailable'].includes(this.hass.states[entities[day]].state))) {
      throw new Error('Hive or a schedule entity is unavailable. Edits were preserved; reconnect before retrying.');
    }
  }

  private pause(signal: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
      const abort = () => { clearTimeout(timer); signal.removeEventListener('abort', abort); reject(new Error('Save cancelled. Edits were preserved.')); };
      const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve(); }, 100);
      signal.addEventListener('abort', abort, { once: true });
      if (signal.aborted) abort();
    });
  }

  private bounded<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
    return new Promise((resolve, reject) => {
      const cleanup = () => { clearTimeout(timer); signal.removeEventListener('abort', abort); };
      const abort = () => { cleanup(); reject(new Error('Save cancelled. Edits were preserved.')); };
      const timer = setTimeout(() => { cleanup(); reject(new Error('Home Assistant request timed out. Check connectivity before retrying.')); }, 5_000);
      signal.addEventListener('abort', abort, { once: true });
      if (signal.aborted) { abort(); return; }
      promise.then(value => { cleanup(); resolve(value); }, error => { cleanup(); reject(error); });
    });
  }
}
