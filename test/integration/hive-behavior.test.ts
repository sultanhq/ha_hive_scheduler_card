import { afterEach, describe, expect, it } from 'vitest';
import { HiveSchedulerCard } from '../../src/card';
import '../../src/card';
import { createTestScenario } from '../mocks/hass-mock';
import { DAYS_OF_WEEK } from '../../src/models/types';
import { serializeDaySchedule } from '../../src/models/schedule';

const tick = async (element: any) => { await element.updateComplete; await new Promise(resolve => setTimeout(resolve, 0)); await element.updateComplete; };
const event = (target: Element, type: string, detail: unknown) => target.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
async function mount(view: 'week' | 'graph' = 'week') {
  const scenario = createTestScenario();
  for (const sensor of Object.values(scenario.daySensors)) sensor.state = '06:07/20.5 19:31/1 19:31/1 19:31/1 19:31/1 19:31/1';
  const card = document.createElement('hive-scheduler-card') as HiveSchedulerCard;
  card.setConfig({ type: 'custom:hive-scheduler-card', entity: scenario.entityId, mqtt_device: 'Hive Reciever', view_mode: view });
  card.hass = scenario.hass; document.body.append(card); await tick(card);
  return { card, scenario, root: card.shadowRoot!, week: card.shadowRoot!.querySelector('hive-schedule-week-view')! };
}
afterEach(() => document.body.replaceChildren());

describe('Hive UI regressions', () => {
  it('displays seven native days without inserting midnight or keeping padding', async () => {
    const { card, week } = await mount();
    for (const day of DAYS_OF_WEEK) {
      expect((week as any).schedule[day].transitions).toHaveLength(2);
      expect((week as any).schedule[day].transitions[0].time).toBe('06:07');
    }
    expect(card.shadowRoot!.textContent).not.toContain('default schedule');
  });

  it('edits the first transition at minute precision and offers explicit heating off', async () => {
    const { card, week, root } = await mount(); event(week, 'day-selected', { day: 'monday' }); await tick(card);
    const editor = root.querySelector('hive-day-schedule-editor') as any; await tick(editor);
    const transition = editor.shadowRoot.querySelector('hive-transition-editor'); await tick(transition);
    const selects = transition.shadowRoot.querySelectorAll('.time-select');
    expect(selects[0].disabled).toBe(false); expect(selects[1].value).toBe('07');
    expect(selects[1].options).toHaveLength(60);
    selects[1].value = '09'; selects[1].dispatchEvent(new Event('change')); await tick(card);
    expect(serializeDaySchedule((root.querySelector('hive-schedule-week-view') as any).schedule.monday)).toBe('06:09/20.5 19:31/1');
    const mode = transition.shadowRoot.querySelector('[aria-label="Heating mode"]');
    expect(mode.textContent).toContain('Heating off (1°C)');
    mode.value = 'off'; mode.dispatchEvent(new Event('change')); await tick(card);
    expect((root.querySelector('hive-schedule-week-view') as any).schedule.monday.transitions[0].temperature).toBe(1);
  });

  it('draws inferred midnight only as a display segment, including weekly wraparound', async () => {
    const { card, root } = await mount('graph'); const graph = root.querySelector('hive-schedule-graph-view') as any; await tick(graph);
    expect(graph.shadowRoot.querySelector('.inferred-line')).toBeTruthy();
    expect(graph.shadowRoot.querySelectorAll('.point-group')).toHaveLength(2);
    expect(graph.shadowRoot.querySelector('.inferred-line').textContent).toContain('Sunday');
    const sun = [...graph.shadowRoot.querySelectorAll('button')].find((button: any) => button.textContent.trim() === 'Sun') as HTMLButtonElement;
    sun.click(); await tick(graph);
    expect(graph.shadowRoot.querySelector('.inferred-line').textContent).toContain('Saturday');
    expect(graph.shadowRoot.querySelector('.inferred-line title').textContent).toContain('carried over from Saturday');
    expect(graph.schedule.sunday.transitions[0].time).toBe('06:07');
    expect(card.shadowRoot!.querySelector('.save-button')!.hasAttribute('disabled')).toBe(true);
  });

  it('includes the previous final setpoint in graph bounds without changing native data', async () => {
    const { card, root } = await mount('graph'); const graph = root.querySelector('hive-schedule-graph-view') as any;
    graph.schedule = { ...graph.schedule, monday: { transitions: [{ time: '06:00', temperature: 1 }] }, sunday: { transitions: [{ time: '06:00', temperature: 32 }] } };
    await tick(graph); expect(graph.getTempRange()).toEqual({ min: 1, max: 32 });
    expect(graph.schedule.monday.transitions).toHaveLength(1); expect(card).toBeTruthy();
  });

  it('matches each graph period to its temperature point colour for hot, mild and off settings', async () => {
    const { root } = await mount('graph');
    const graph = root.querySelector('hive-schedule-graph-view') as any;
    graph.schedule = { ...graph.schedule, monday: { transitions: [
      { time: '06:07', temperature: 19.5 }, { time: '08:00', temperature: 20 },
      { time: '10:00', temperature: 20.5 }, { time: '12:00', temperature: 32 },
      { time: '16:00', temperature: 19 }, { time: '19:31', temperature: 1 }
    ] } };
    await tick(graph);
    const segments = [...graph.shadowRoot.querySelectorAll('.temperature-line')] as SVGPathElement[];
    const points = [...graph.shadowRoot.querySelectorAll('.temperature-point')] as SVGCircleElement[];
    expect(segments).toHaveLength(6);
    expect(segments.map(segment => segment.getAttribute('stroke'))).toEqual(points.map(point => point.getAttribute('fill')));
    expect(new Set(segments.map(segment => segment.getAttribute('stroke'))).size).toBe(6);
    for (const point of points.slice(0, 4)) {
      const [red, green, blue] = point.getAttribute('fill')!.match(/\d+/g)!.map(Number);
      expect(red).toBeGreaterThan(green * 2);
      expect(red).toBeGreaterThan(blue * 2);
    }
  });

  it('uses the off point colour for the carried-over off period and its open start marker', async () => {
    const { root } = await mount('graph');
    const graph = root.querySelector('hive-schedule-graph-view') as any;
    await tick(graph);
    const offColour = graph.shadowRoot.querySelectorAll('.temperature-point')[1].getAttribute('fill');
    expect(graph.shadowRoot.querySelector('.inferred-line').getAttribute('stroke')).toBe(offColour);
    expect(graph.shadowRoot.querySelector('.inferred-start').getAttribute('stroke')).toBe(offColour);
    expect(graph.shadowRoot.querySelector('.inferred-hover-target').getAttribute('stroke')).toBe('transparent');
    expect(graph.shadowRoot.querySelector('.carry-over-note')).toBeNull();
  });

  it('places time and temperature labels beside vertical steps and keeps late-day labels inside the graph', async () => {
    const { root } = await mount('graph');
    const graph = root.querySelector('hive-schedule-graph-view') as any;
    graph.schedule = { ...graph.schedule, monday: { transitions: [
      { time: '06:07', temperature: 20.5 }, { time: '12:00', temperature: 12 }, { time: '23:59', temperature: 1 }
    ] } };
    await tick(graph);
    const groups = [...graph.shadowRoot.querySelectorAll('.point-group')] as SVGGElement[];
    for (const [index, group] of groups.entries()) {
      const pointX = Number(group.querySelector('circle')!.getAttribute('cx'));
      const labels = [...group.querySelectorAll('.point-label')];
      for (const label of labels) {
        const labelX = Number(label.getAttribute('x'));
        expect(index === 2 ? labelX < pointX : labelX > pointX).toBe(true);
        expect(label.getAttribute('text-anchor')).toBe(index === 2 ? 'end' : 'start');
      }
    }
    expect(groups[0].querySelector('.time-label')!.textContent).toContain('06:07');
    expect(groups[2].querySelector('.time-label')!.textContent).toContain('23:59');
    const offPointY = Number(groups[2].querySelector('circle')!.getAttribute('cy'));
    expect(Number(groups[2].querySelector('.time-label')!.getAttribute('y'))).toBeLessThan(offPointY);
  });

  it.each([1, 12, 32])('provides Sunday’s final %s°C setting on hover at the start of Monday', async temperature => {
    const { root } = await mount('graph');
    const graph = root.querySelector('hive-schedule-graph-view') as any;
    graph.schedule = {
      ...graph.schedule,
      sunday: { transitions: [{ time: '06:00', temperature: 20 }, { time: '22:00', temperature }] }
    };
    const before = serializeDaySchedule(graph.schedule.monday);
    await tick(graph);
    const note = graph.shadowRoot.querySelector('.inferred-line title').textContent;
    expect(graph.shadowRoot.querySelector('.carry-over-note')).toBeNull();
    expect(graph.shadowRoot.querySelector('.inferred-hover-target title').textContent).toBe(note);
    expect(note).toContain('00:00–06:07');
    expect(note).toContain(temperature === 1 ? 'Heating off (1°C)' : `${temperature}°C`);
    expect(note).toContain('carried over from Sunday');
    expect(note).toContain('Display only');
    expect(graph.shadowRoot.querySelector('.inferred-start').closest('.point-group')).toBeNull();
    expect(graph.shadowRoot.querySelectorAll('.point-group')).toHaveLength(2);
    expect(serializeDaySchedule(graph.schedule.monday)).toBe(before);
  });

  it('does not infer a start value when a native midnight transition exists', async () => {
    const { root } = await mount('graph');
    const graph = root.querySelector('hive-schedule-graph-view') as any;
    graph.schedule = { ...graph.schedule, monday: { transitions: [{ time: '00:00', temperature: 12 }, { time: '06:00', temperature: 20 }] } };
    await tick(graph);
    expect(graph.shadowRoot.querySelector('.carry-over-note')).toBeNull();
    expect(graph.shadowRoot.querySelector('.inferred-start')).toBeNull();
    expect(graph.shadowRoot.querySelector('.inferred-line')).toBeNull();
    expect(graph.shadowRoot.querySelectorAll('.point-group')).toHaveLength(2);
  });

  it('does not invent a start value if the previous schedule is missing', async () => {
    const { root } = await mount('graph');
    const graph = root.querySelector('hive-schedule-graph-view') as any;
    graph.schedule = { ...graph.schedule, sunday: { transitions: [] } };
    await tick(graph);
    expect(graph.shadowRoot.querySelector('.carry-over-note')).toBeNull();
    expect(graph.shadowRoot.querySelector('.inferred-start')).toBeNull();
    expect(graph.schedule.monday.transitions[0].time).toBe('06:07');
  });

  it('saves only native transitions after displaying the carried-over off period', async () => {
    const { card, scenario, root } = await mount('graph');
    const graph = root.querySelector('hive-schedule-graph-view') as any;
    await tick(graph);
    expect(graph.shadowRoot.querySelector('.inferred-line title').textContent).toContain('Heating off (1°C)');
    event(graph, 'schedule-changed', { day: 'monday', schedule: { transitions: [{ time: '06:07', temperature: 21 }, { time: '19:31', temperature: 1 }] } });
    await tick(card);
    await (card as any)._saveSchedule();
    const writes = scenario.recorder.calls.filter(call => String(call.data.topic).endsWith('/set'));
    expect(writes).toHaveLength(1);
    expect(JSON.parse(String(writes[0].data.payload))).toEqual({ schedule_monday: '06:07/21 19:31/1' });
  });

  it('preserves dirty drafts and blocks saves on external edited-day conflicts', async () => {
    const { card, scenario, week, root } = await mount();
    event(week, 'day-selected', { day: 'monday' }); await tick(card);
    event(root.querySelector('hive-day-schedule-editor')!, 'schedule-changed', { day: 'monday', schedule: { transitions: [{ time: '06:07', temperature: 21 }] } }); await tick(card);
    const id = 'text.living_room_hive_schedule_monday';
    card.hass = { ...scenario.hass, states: { ...scenario.hass.states, [id]: { ...scenario.hass.states[id], state: '06:07/22' } } }; await tick(card);
    expect((root.querySelector('hive-schedule-week-view') as any).schedule.monday.transitions[0].temperature).toBe(21);
    expect(root.textContent).toContain('Receiver changed monday');
    expect((root.querySelector('.save-button') as HTMLButtonElement).disabled).toBe(true);
    expect(scenario.recorder.calls).toHaveLength(0);
  });

  it('merges untouched-day changes while retaining the edited day', async () => {
    const { card, scenario, week, root } = await mount();
    event(week, 'day-selected', { day: 'monday' }); await tick(card);
    event(root.querySelector('hive-day-schedule-editor')!, 'schedule-changed', { day: 'monday', schedule: { transitions: [{ time: '06:07', temperature: 21 }] } }); await tick(card);
    const id = 'text.living_room_hive_schedule_tuesday';
    card.hass = { ...scenario.hass, states: { ...scenario.hass.states, [id]: { ...scenario.hass.states[id], state: '06:07/23' } } }; await tick(card);
    const shown = (root.querySelector('hive-schedule-week-view') as any).schedule;
    expect(shown.monday.transitions[0].temperature).toBe(21); expect(shown.tuesday.transitions[0].temperature).toBe(23);
    expect(root.textContent).not.toContain('Receiver changed');
  });

  it('ignores an older entity snapshot', async () => {
    const { card, scenario, root } = await mount(); const id = 'text.living_room_hive_schedule_monday';
    card.hass = { ...scenario.hass, states: { ...scenario.hass.states, [id]: { ...scenario.hass.states[id], state: '06:07/22', last_updated: '2026-10-29T12:00:00Z' } } }; await tick(card);
    card.hass = { ...scenario.hass, states: { ...scenario.hass.states, [id]: { ...scenario.hass.states[id], state: '06:07/20', last_updated: '2026-10-29T11:59:00Z' } } }; await tick(card);
    expect((root.querySelector('hive-schedule-week-view') as any).schedule.monday.transitions[0].temperature).toBe(22);
  });

  it('keeps schedules viewable but blocks non-admin saves', async () => {
    const { card, scenario, week, root } = await mount();
    card.hass = { ...scenario.hass, user: { is_admin: false } }; await tick(card);
    event(week, 'day-selected', { day: 'monday' }); await tick(card);
    event(root.querySelector('hive-day-schedule-editor')!, 'schedule-changed', { day: 'monday', schedule: { transitions: [{ time: '06:07', temperature: 21 }] } }); await tick(card);
    expect(root.querySelector('hive-schedule-week-view')).toBeTruthy();
    expect(root.textContent).toContain('administrator');
    expect((root.querySelector('.save-button') as HTMLButtonElement).disabled).toBe(true);
  });

  it('never writes malformed drafts and preserves the edits', async () => {
    const { card, scenario, week, root } = await mount();
    event(week, 'day-selected', { day: 'monday' }); await tick(card);
    event(root.querySelector('hive-day-schedule-editor')!, 'schedule-changed', { day: 'monday', schedule: { transitions: [{ time: '06:07', temperature: 20.25 }] } }); await tick(card);
    (root.querySelector('.save-button') as HTMLButtonElement).click(); await tick(card);
    expect(root.textContent).toContain('0.5°C steps'); expect(scenario.recorder.calls).toHaveLength(0);
    expect((root.querySelector('hive-schedule-week-view') as any).schedule.monday.transitions[0].temperature).toBe(20.25);
  });
  it('does not leave a disconnected card permanently locked in saving state', async () => {
    const { card, scenario, week, root } = await mount();
    event(week, 'day-selected', { day: 'monday' }); await tick(card);
    event(root.querySelector('hive-day-schedule-editor')!, 'schedule-changed', { day: 'monday', schedule: { transitions: [{ time: '06:07', temperature: 21 }] } }); await tick(card);
    const pending = (card as any)._saveSchedule();
    card.remove(); await pending;
    expect((card as any)._saving).toBe(false);
    document.body.append(card); await tick(card);
    expect((root.querySelector('hive-schedule-week-view') as any).schedule.monday.transitions[0].temperature).toBe(21);
    expect(scenario.recorder.calls.filter(call => String(call.data.topic).endsWith('/set'))).toHaveLength(0);
  });

});
