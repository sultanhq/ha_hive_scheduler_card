import { afterEach, describe, expect, it } from 'vitest';
import '../../src/boost-card.js';

type MqttMessage = { topic: string; payload: string; retain: boolean };
type Call = { domain: string; service: string; data: Record<string, unknown> };

async function mount(admin = true) {
  const calls: Call[] = [];
  const listeners = new Set<(message: MqttMessage) => void>();
  const hass = {
    user: { is_admin: admin },
    states: {
      'climate.hive_reciever': {
        entity_id: 'climate.hive_reciever',
        state: 'heat',
        attributes: {
          friendly_name: 'Hive Heating',
          current_temperature: 20.5,
          temperature: 21,
        },
      },
    },
    connection: {
      subscribeMessage: async (callback: (message: MqttMessage) => void) => {
        listeners.add(callback);
        return () => listeners.delete(callback);
      },
    },
    callService: async (domain: string, service: string, data: Record<string, unknown>) => {
      calls.push({ domain, service, data });
    },
  };
  const card = document.createElement('hive-boost-card') as any;
  card.setConfig({
    type: 'custom:hive-boost-card',
    entity: 'climate.hive_reciever',
    mqtt_device: 'Hive Reciever',
    default_temperature: 21,
    default_duration: 60,
  });
  card.hass = hass;
  document.body.appendChild(card);
  await new Promise(resolve => setTimeout(resolve, 0));
  const emit = (data: Record<string, unknown>, retain = false) => {
    const msg = {
      topic: 'zigbee2mqtt/Hive Reciever',
      payload: JSON.stringify(data),
      retain,
    };
    for (const listener of listeners) listener(msg);
  };
  const writes = () => calls.filter(call => String(call.data.topic).endsWith('/set'));
  const click = (id: string) => {
    const button = card.shadowRoot.querySelector(id) as HTMLButtonElement;
    expect(button).toBeTruthy();
    button.click();
  };
  const flush = async () => {
    await Promise.resolve();
    await new Promise(resolve => setTimeout(resolve, 0));
  };
  return { card, hass, calls, emit, writes, click, flush, listeners };
}

afterEach(() => document.body.replaceChildren());

describe('Hive Boost Card in same HACS resource', () => {
  it('registers a separately selectable card and its visual editor', () => {
    // Arrange: the standalone Boost module has been loaded.
    // Act: inspect the card registry.
    const cards = (window as any).customCards || [];
    // Assert: users can select Boost without replacing the scheduler card.
    expect(customElements.get('hive-boost-card')).toBeDefined();
    expect(customElements.get('hive-boost-card-editor')).toBeDefined();
    expect(cards.some((card: { type: string }) => card.type === 'hive-boost-card')).toBe(true);
  });

  it('requires explicit confirmation before any MQTT write', async () => {
    // Arrange: a receiver is connected with administrator access.
    const { card, click, writes } = await mount();
    // Act: select Boost, but do not confirm.
    click('#boost');
    // Assert: the summary is visible and nothing was sent.
    expect(card.shadowRoot.querySelector('#summary').textContent).toContain('21.0°C for 60 minutes');
    expect(writes()).toHaveLength(0);
  });

  it('sends a single finite hold MQTT command when confirmed', async () => {
    // Arrange: a configured receiver and an explicit confirmation.
    const { click, writes, flush } = await mount();
    click('#boost');
    // Act: confirm the Boost.
    click('#confirm');
    await flush();
    // Assert: only one write carries all settings, with no schedule change.
    expect(writes()).toHaveLength(1);
    expect(writes()[0].data.topic).toBe('zigbee2mqtt/Hive Reciever/set');
    const payload = JSON.parse(String(writes()[0].data.payload));
    expect(payload).toEqual({
      system_mode: 'heat',
      occupied_heating_setpoint: 21,
      temperature_setpoint_hold_duration: 60,
      temperature_setpoint_hold: true,
    });
    expect(Object.keys(payload).some(key => key.startsWith('schedule_'))).toBe(false);
    expect(writes()[0].data.retain).toBe(false);
  });

  it('acknowledges only a fresh receiver response with matching hold fields', async () => {
    // Arrange: start a timed boost and receive feedback.
    const { card, click, emit, flush } = await mount();
    click('#boost');
    click('#confirm');
    await flush();
    // Act: a stale retained message should not confirm, a fresh response should.
    emit({ temperature_setpoint_hold: true, temperature_setpoint_hold_duration: 60, occupied_heating_setpoint: 21, system_mode: 'heat' }, true);
    expect(card.shadowRoot.textContent).toContain('Waiting for receiver confirmation');
    emit({ temperature_setpoint_hold: true, temperature_setpoint_hold_duration: 60, occupied_heating_setpoint: 21, system_mode: 'heat' });
    // Assert: receiver verification changes the status.
    expect(card.shadowRoot.textContent).toContain('Boost confirmed by receiver');
    expect(card.shadowRoot.querySelector('#badge').textContent).toContain('Hold active');
  });

  it.each([false, true])('does not confirm from pre-command cached settings (retained: %s) and a fresh room temperature', async retained => {
    const { card, click, emit, flush } = await mount();
    emit({ temperature_setpoint_hold: true, temperature_setpoint_hold_duration: 60, occupied_heating_setpoint: 21, system_mode: 'heat' }, retained);
    click('#boost'); click('#confirm'); await flush();
    emit({ local_temperature: 20 });
    expect(card.shadowRoot.textContent).toContain('Waiting for receiver confirmation');
    expect(card.shadowRoot.textContent).not.toContain('Boost confirmed by receiver');
  });

  it('does not combine post-command retained settings with an unrelated fresh update', async () => {
    const { card, click, emit, flush } = await mount();
    click('#boost'); click('#confirm'); await flush();
    emit({ temperature_setpoint_hold: true, temperature_setpoint_hold_duration: 60, occupied_heating_setpoint: 21, system_mode: 'heat' }, true);
    emit({ local_temperature: 20 });
    expect(card.shadowRoot.textContent).toContain('Waiting for receiver confirmation');
  });

  it('accumulates fresh command fields and waits until every field is reported', async () => {
    const { card, click, emit, flush } = await mount();
    click('#boost'); click('#confirm'); await flush();
    emit({ temperature_setpoint_hold: true });
    emit({ occupied_heating_setpoint: 21 });
    emit({ temperature_setpoint_hold_duration: 59 });
    expect(card.shadowRoot.textContent).toContain('Waiting for receiver confirmation');
    emit({ system_mode: 'heat' });
    expect(card.shadowRoot.textContent).toContain('Boost confirmed by receiver');
  });

  it.each(['off', 'auto'])('does not confirm a boost while the receiver stays in %s mode', async system_mode => {
    const { card, click, emit, flush } = await mount();
    click('#boost'); click('#confirm'); await flush();
    emit({ temperature_setpoint_hold: true, temperature_setpoint_hold_duration: 60, occupied_heating_setpoint: 21, system_mode });
    expect(card.shadowRoot.textContent).toContain('Waiting for receiver confirmation');
    emit({ system_mode: 'heat' });
    expect(card.shadowRoot.textContent).toContain('Boost confirmed by receiver');
  });

  it('requires fresh cleared hold, zero duration and auto mode before confirming cancellation', async () => {
    const { card, click, emit, flush } = await mount();
    emit({ temperature_setpoint_hold: true, temperature_setpoint_hold_duration: 45, occupied_heating_setpoint: 22, system_mode: 'heat' });
    click('#stop'); await flush();
    emit({ temperature_setpoint_hold: false });
    expect(card.shadowRoot.textContent).toContain('Waiting for receiver confirmation');
    emit({ system_mode: 'auto' });
    expect(card.shadowRoot.textContent).toContain('Waiting for receiver confirmation');
    emit({ temperature_setpoint_hold_duration: 0 });
    expect(card.shadowRoot.textContent).toContain('Boost cancelled; normal scheduling resumed');
  });

  it('ignores retained cancellation fields and requires the receiver to return to auto', async () => {
    const { card, click, emit, flush } = await mount();
    emit({ temperature_setpoint_hold: true, temperature_setpoint_hold_duration: 45, system_mode: 'heat' });
    click('#stop'); await flush();
    emit({ temperature_setpoint_hold: false, temperature_setpoint_hold_duration: 0, system_mode: 'auto' }, true);
    emit({ local_temperature: 20 });
    expect(card.shadowRoot.textContent).toContain('Waiting for receiver confirmation');
    emit({ temperature_setpoint_hold: false, temperature_setpoint_hold_duration: 0, system_mode: 'heat' });
    expect(card.shadowRoot.textContent).toContain('Waiting for receiver confirmation');
    emit({ system_mode: 'auto' });
    expect(card.shadowRoot.textContent).toContain('Boost cancelled; normal scheduling resumed');
  });

  it('abandons pending verification when the card configuration changes', async () => {
    const { card, click, emit, flush } = await mount();
    click('#boost'); click('#confirm'); await flush();
    card.setConfig({ entity: 'climate.hive_reciever', mqtt_device: 'Hive Reciever' });
    await flush();
    emit({ temperature_setpoint_hold: true, temperature_setpoint_hold_duration: 60, occupied_heating_setpoint: 21, system_mode: 'heat' });
    expect(card.shadowRoot.textContent).not.toContain('Boost confirmed by receiver');
    expect(card.shadowRoot.querySelector('#boost').disabled).toBe(false);
  });

  it('cancels a hold by returning the receiver to auto, without editing the timetable', async () => {
    // Arrange: feedback shows an active timed hold.
    const { card, emit, click, writes, flush } = await mount();
    emit({ temperature_setpoint_hold: true, temperature_setpoint_hold_duration: 45, occupied_heating_setpoint: 22 });
    expect((card.shadowRoot.querySelector('#stop') as HTMLButtonElement).disabled).toBe(false);
    // Act: cancel Boost.
    click('#stop');
    await flush();
    // Assert: release hold and restore automatic schedule mode in one write.
    expect(writes()).toHaveLength(1);
    expect(JSON.parse(String(writes()[0].data.payload))).toEqual({
      system_mode: 'auto',
      temperature_setpoint_hold_duration: 0,
      temperature_setpoint_hold: false,
    });
  });

  it('rejects invalid and indefinite durations', async () => {
    // Arrange: a receiver is connected and the duration input is available.
    const { card, writes } = await mount();
    const input = card.shadowRoot.querySelector('#duration') as HTMLInputElement;
    // Act: enter the not-used sentinel value.
    input.value = '65535';
    input.dispatchEvent(new Event('change'));
    // Assert: the request is rejected before sending a command.
    expect(card.shadowRoot.textContent).toContain('Duration must be');
    expect(writes()).toHaveLength(0);
    expect(() => card.setConfig({
      type: 'custom:hive-boost-card', entity: 'climate.hive_reciever', mqtt_device: 'Hive Reciever', default_duration: 65535,
    })).toThrow('1–360');
  });

  it('disables the write controls for non-admin users', async () => {
    // Arrange: viewer-level Home Assistant account.
    const { card, writes } = await mount(false);
    // Act: inspect and click Boost.
    const button = card.shadowRoot.querySelector('#boost') as HTMLButtonElement;
    button.click();
    // Assert: no writes are permitted.
    expect(button.disabled).toBe(true);
    expect(writes()).toHaveLength(0);
  });

  it('exposes an editable climate entity and MQTT device name', async () => {
    // Arrange: the boost visual editor.
    const editor = document.createElement('hive-boost-card-editor') as any;
    const changes: any[] = [];
    editor.addEventListener('config-changed', (event: Event) => changes.push((event as CustomEvent).detail.config));
    editor.setConfig({ type: 'custom:hive-boost-card', entity: 'climate.hive_reciever', mqtt_device: 'Hive Reciever' });
    document.body.append(editor);
    // Act: rename the MQTT device.
    const input = editor.shadowRoot.querySelector('#mqtt') as HTMLInputElement;
    input.value = 'Hive Receiver 2';
    input.dispatchEvent(new Event('change'));
    // Assert: Home Assistant receives updated configuration.
    expect(changes.at(-1).mqtt_device).toBe('Hive Receiver 2');
  });
});
