import { afterEach, describe, expect, it, vi } from 'vitest';
import '../../src/boost-card.js';
import '../../src/editor';

const hass = () => ({ states: {
  'climate.hive': { attributes: { friendly_name: 'Hive Heating' } },
  'climate.other': { attributes: { friendly_name: 'Other Heating' } },
} });

afterEach(() => document.body.replaceChildren());

describe.each(['hive-boost-card-editor', 'hive-boost-badge-editor'])('%s stability', tag => {
  it('preserves an open picker and uncommitted typing across HA state and config updates', () => {
    const editor = document.createElement(tag) as any;
    const config = { entity: 'climate.hive' };
    editor.setConfig(config); editor.hass = hass(); document.body.append(editor);
    const changed = vi.fn(); editor.addEventListener('config-changed', changed);
    const select = editor.shadowRoot.querySelector('#entity');
    const option = select.options[1];
    select.focus();
    for (let i = 0; i < 5; i++) editor.hass = hass();
    expect(editor.shadowRoot.querySelector('#entity')).toBe(select);
    expect(select.options[1]).toBe(option);
    expect(editor.shadowRoot.activeElement).toBe(select);
    const name = editor.shadowRoot.querySelector('#name');
    name.focus(); name.value = 'In-progress name'; name.setSelectionRange(3, 5);
    editor.hass = hass(); editor.setConfig(config);
    expect(editor.shadowRoot.querySelector('#name')).toBe(name);
    expect(name.value).toBe('In-progress name');
    expect(name.selectionStart).toBe(3);
    expect(editor.shadowRoot.activeElement).toBe(name);
    expect(changed).not.toHaveBeenCalled();
  });
});

it('keeps HA picker filters stable and reads value-changed event details', async () => {
  if (!customElements.get('ha-entity-picker')) customElements.define('ha-entity-picker', class extends HTMLElement {});
  const editor = document.createElement('hive-scheduler-card-editor') as any;
  editor.setConfig({ entity: 'climate.hive', mqtt_device: 'Old Receiver' });
  editor.hass = hass(); document.body.append(editor); await editor.updateComplete;
  const picker = editor.shadowRoot.querySelector('ha-entity-picker');
  const domains = picker.includeDomains;
  editor.hass = hass(); await editor.updateComplete;
  expect(editor.shadowRoot.querySelector('ha-entity-picker')).toBe(picker);
  expect(picker.includeDomains).toBe(domains);
  const changed = vi.fn(); editor.addEventListener('config-changed', changed);
  picker.dispatchEvent(new CustomEvent('value-changed', { detail: { value: 'climate.other' }, bubbles: true, composed: true }));
  expect(changed).toHaveBeenCalledOnce();
  expect(changed.mock.calls[0][0].detail.config).toEqual({ type: 'custom:hive-scheduler-card', entity: 'climate.other' });
});
