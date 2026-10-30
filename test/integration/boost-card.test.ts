import { afterEach, describe, expect, it } from 'vitest';
import '../../src/boost-card.js';

type MqttMessage = { topic: string; payload: string; retain: boolean };
type Call = { domain: string; service: string; data: Record<string, unknown> };

async function mount(admin = true, currentTemperature: unknown = 20) {
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
          current_temperature: currentTemperature,
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

  it.each([[20,21],[20.5,21.5],[20.1,21.5],[20.6,22],[31,32],[31.5,32],[33,32],[0,5]])(
    'suggests a valid boost above room temperature %s°C (%s°C)', async (current, expected) => {
      const { card } = await mount(true, current);
      expect(card.shadowRoot.querySelector('#temperature').value).toBe(String(expected));
      expect(card.shadowRoot.textContent).toContain(`Room temperature: ${current.toFixed(1)}°C`);
    });

  it.each([undefined, null, 'unknown', '', false, Infinity])('uses the configured fallback for unavailable room temperature %s', async current => {
    const { card, hass } = await mount();
    hass.states['climate.hive_reciever'].attributes.current_temperature = current;
    card.hass = {...hass};
    card.setConfig({entity:'climate.hive_reciever',mqtt_device:'Hive Reciever',default_temperature:23});
    expect(card.shadowRoot.querySelector('#temperature').value).toBe('23');
    expect(card.shadowRoot.textContent).toContain('Room temperature unavailable');
  });

  it('uses room +1°C rather than the configured fallback when a room reading is available', async () => {
    const { card } = await mount(true, 20.5);
    card.setConfig({entity:'climate.hive_reciever',mqtt_device:'Hive Reciever',default_temperature:30});
    expect(card.shadowRoot.querySelector('#temperature').value).toBe('21.5');
  });

  it('updates an untouched suggestion from fresh HA or MQTT room readings', async () => {
    const { card, hass, emit } = await mount();
    hass.states['climate.hive_reciever'].attributes.current_temperature = 20.5;
    card.hass = {...hass};
    expect(card.shadowRoot.querySelector('#temperature').value).toBe('21.5');
    emit({local_temperature:18}, true);
    expect(card.shadowRoot.querySelector('#temperature').value).toBe('21.5');
    emit({local_temperature:22.1});
    expect(card.shadowRoot.querySelector('#temperature').value).toBe('23.5');
    emit({local_temperature:17}, true);
    expect(card.shadowRoot.querySelector('#temperature').value).toBe('23.5');
    card.hass = {...hass};
    expect(card.shadowRoot.querySelector('#temperature').value).toBe('23.5');
    hass.states['climate.hive_reciever'].attributes.current_temperature = 23;
    card.hass = {...hass};
    expect(card.shadowRoot.querySelector('#temperature').value).toBe('24');
  });

  it('preserves a manually selected temperature when room readings change', async () => {
    const { card, hass, emit } = await mount();
    const slider = card.shadowRoot.querySelector('#temperature');
    slider.value = '25'; slider.dispatchEvent(new Event('input'));
    emit({local_temperature:22});
    hass.states['climate.hive_reciever'].attributes.current_temperature = 24;
    card.hass = {...hass};
    expect(card.shadowRoot.querySelector('#temperature').value).toBe('25');
  });

  it('keeps the reviewed temperature stable through confirmation and publishing', async () => {
    const { card, click, emit, writes, flush } = await mount();
    click('#boost'); emit({local_temperature:24});
    expect(card.shadowRoot.querySelector('#summary').textContent).toContain('21.0°C');
    click('#confirm'); await flush();
    expect(JSON.parse(String(writes()[0].data.payload)).occupied_heating_setpoint).toBe(21);
    emit({temperature_setpoint_hold:true,temperature_setpoint_hold_duration:60,occupied_heating_setpoint:21,system_mode:'heat'});
    expect(card.shadowRoot.textContent).toContain('Boost confirmed by receiver');
  });

  it('preserves in-progress controls when HA reapplies identical config', async () => {
    const { card, hass } = await mount();
    const slider = card.shadowRoot.querySelector('#temperature');
    slider.value = '25'; slider.dispatchEvent(new Event('input'));
    hass.states['climate.hive_reciever'].attributes.current_temperature = 21.5;
    card.setConfig({type:'custom:hive-boost-card',entity:'climate.hive_reciever',mqtt_device:'Hive Reciever',default_temperature:21,default_duration:60});
    expect(card.shadowRoot.querySelector('#temperature').value).toBe('25');
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
    expect(card.shadowRoot.querySelector('#badge').textContent).toContain('Boost active');
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

  it('offers a 15-minute minimum boost and accepts a shorter remaining countdown', async () => {
    const { card, click, emit, writes, flush } = await mount();
    const input = card.shadowRoot.querySelector('#duration') as HTMLInputElement;
    expect(input.min).toBe('15');
    const preset = [...card.shadowRoot.querySelectorAll('#presets button')].find((button: any) => button.textContent === '15m') as HTMLButtonElement;
    expect(preset).toBeTruthy(); preset.click();
    click('#boost');
    expect(card.shadowRoot.querySelector('#summary').textContent).toContain('15 minutes');
    click('#confirm'); await flush();
    expect(JSON.parse(String(writes()[0].data.payload)).temperature_setpoint_hold_duration).toBe(15);
    emit({ temperature_setpoint_hold:true, temperature_setpoint_hold_duration:14, occupied_heating_setpoint:21, system_mode:'heat' });
    expect(card.shadowRoot.textContent).toContain('Boost confirmed by receiver');
    expect(card.shadowRoot.querySelector('#badge').textContent).toBe('Boost active');
  });

  it.each([1, 5, 14, 14.5, 65535])('rejects invalid or below-minimum duration %s', async value => {
    // Arrange: a receiver is connected and the duration input is available.
    const { card, writes } = await mount();
    const input = card.shadowRoot.querySelector('#duration') as HTMLInputElement;
    // Act: enter the not-used sentinel value.
    input.value = String(value);
    input.dispatchEvent(new Event('change'));
    // Assert: the request is rejected before sending a command.
    expect(card.shadowRoot.textContent).toContain('Duration must be');
    expect(writes()).toHaveLength(0);
    expect(() => card.setConfig({
      type: 'custom:hive-boost-card', entity: 'climate.hive_reciever', mqtt_device: 'Hive Reciever', default_duration: value,
    })).toThrow('15–360');
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


describe('Boost entity-only configuration', () => {
  it('accepts the climate entity without a manually entered friendly name', async () => {
    const card = document.createElement('hive-boost-card') as any;
    // Arrange - an entity ID is provided but no optional MQTT override.
    // Act - configure the Boost card.
    // Assert - no synchronous validation error is raised.
    expect(() => card.setConfig({type:'custom:hive-boost-card',entity:'climate.hive_reciever'})).not.toThrow();
  });
});
