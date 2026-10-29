import { afterEach, describe, expect, it, vi } from 'vitest';
import '../../src/boost-card.js';

type Message = { topic: string; payload: string; retain: boolean };
async function mount(admin = true) {
  const listeners = new Set<(message: Message) => void>();
  const calls: any[] = [];
  const hass = {
    user:{is_admin:admin},
    states:{'climate.hive':{state:'auto',attributes:{current_temperature:20.5,friendly_name:'Heating'}}},
    connection:{subscribeMessage:vi.fn(async (callback: (message: Message) => void) => {
      listeners.add(callback); return () => listeners.delete(callback);
    })},
    callService:async (domain: string, service: string, data: any) => {calls.push({domain,service,data});}
  };
  const badge = document.createElement('hive-boost-badge') as any;
  badge.setConfig({type:'custom:hive-boost-badge',entity:'climate.hive',mqtt_device:'Hive Reciever',name:'Heating',default_duration:15});
  badge.hass = hass; document.body.append(badge);
  await new Promise(resolve=>setTimeout(resolve,0));
  const root = badge.shadowRoot as ShadowRoot;
  const dialog = root.querySelector('dialog') as HTMLDialogElement;
  // jsdom has no browser top layer; keep the native open/close contract for these tests.
  dialog.showModal = () => {dialog.setAttribute('open','');};
  dialog.close = () => {dialog.removeAttribute('open');};
  const click = (id: string) => (root.querySelector(id) as HTMLButtonElement).click();
  const emit = (data: Record<string,unknown>, retain = false) => {
    for (const callback of listeners) callback({topic:'zigbee2mqtt/Hive Reciever',payload:JSON.stringify(data),retain});
  };
  const flush = async () => {await Promise.resolve();await Promise.resolve();};
  const writes = () => calls.filter(call=>call.data.topic.endsWith('/set'));
  const value = () => root.querySelector('#boost-value')!.textContent;
  return {badge,root,dialog,hass,listeners,click,emit,flush,writes,value};
}
afterEach(()=>{document.body.replaceChildren();vi.useRealTimers();});

describe('Hive Boost dashboard badge',()=>{
  it('registers in the badge picker separately from the card picker',()=>{
    expect((window as any).customBadges.some((badge: any)=>badge.type === 'hive-boost-badge')).toBe(true);
    expect((window as any).customCards.some((card: any)=>card.type === 'hive-boost-badge')).toBe(false);
    const Badge = customElements.get('hive-boost-badge') as any;
    expect(Badge.getConfigElement().tagName.toLowerCase()).toBe('hive-boost-badge-editor');
  });

  it('shows the room temperature and opens the shared controls without writing',async()=>{
    const {root,dialog,hass,click,writes,value} = await mount();
    expect(value()).toBe('20.5°C');
    expect(root.querySelector('#boost-label')!.textContent).toBe('Heating');
    expect(dialog.open).toBe(false);
    click('#boost-pill');
    expect(dialog.open).toBe(true);
    expect(root.querySelector('#boost-pill')!.getAttribute('aria-expanded')).toBe('true');
    expect((root.querySelector('#temperature') as HTMLInputElement).value).toBe('21.5');
    expect((root.querySelector('#duration') as HTMLInputElement).min).toBe('15');
    expect(writes()).toHaveLength(0);
    click('#boost-close');click('#boost-pill');
    expect(hass.connection.subscribeMessage).toHaveBeenCalledTimes(1);
  });

  it('requires explicit confirmation and fresh matching receiver fields',async()=>{
    const {click,emit,flush,writes,value,dialog} = await mount();
    click('#boost-pill');click('#boost');
    expect(writes()).toHaveLength(0);
    click('#confirm');await flush();
    expect(writes()).toHaveLength(1);
    expect(writes()[0].data.retain).toBe(false);
    expect(JSON.parse(writes()[0].data.payload)).toEqual({system_mode:'heat',occupied_heating_setpoint:21.5,temperature_setpoint_hold_duration:15,temperature_setpoint_hold:true});
    click('#boost-close');expect(dialog.open).toBe(false);
    emit({system_mode:'heat',occupied_heating_setpoint:21.5,temperature_setpoint_hold_duration:15,temperature_setpoint_hold:true},true);
    emit({local_temperature:20.6});
    expect(value()).toBe('Verifying…');
    emit({occupied_heating_setpoint:21.5,temperature_setpoint_hold_duration:14,temperature_setpoint_hold:true,system_mode:'off'});
    expect(value()).toBe('Verifying…');
    emit({system_mode:'heat'});
    expect(value()).toBe('Boost active · 14m');
  });

  it('verifies cancellation before showing the idle temperature again',async()=>{
    const {click,emit,flush,writes,value} = await mount();
    emit({temperature_setpoint_hold:true,temperature_setpoint_hold_duration:14,system_mode:'heat'});
    click('#boost-pill');click('#stop');await flush();
    expect(JSON.parse(writes()[0].data.payload)).toEqual({system_mode:'auto',temperature_setpoint_hold_duration:0,temperature_setpoint_hold:false});
    emit({temperature_setpoint_hold:false,temperature_setpoint_hold_duration:0,system_mode:'heat'});
    expect(value()).toBe('Verifying…');
    emit({system_mode:'auto'});
    expect(value()).toBe('20.5°C');
  });

  it.each([1,14,15])('shows a receiver countdown of %s minutes',async duration=>{
    const {emit,value} = await mount();
    emit({temperature_setpoint_hold:true,temperature_setpoint_hold_duration:duration});
    expect(value()).toBe(`Boost active · ${duration}m`);
  });

  it('keeps the dialog open and preserves slider focus and choice across updates',async()=>{
    const {badge,root,dialog,hass,click,emit} = await mount();
    click('#boost-pill');
    const slider = root.querySelector('#temperature') as HTMLInputElement;
    slider.value='25';slider.dispatchEvent(new Event('input'));slider.focus();
    emit({local_temperature:22});badge.hass={...hass};
    expect(root.querySelector('dialog')).toBe(dialog);
    expect(dialog.open).toBe(true);
    expect((root.querySelector('#temperature') as HTMLInputElement).value).toBe('25');
    expect(root.activeElement?.id).toBe('temperature');
  });

  it.each(['button','escape','backdrop'])('closes with %s without sending a command',async method=>{
    const {root,dialog,click,writes} = await mount();
    click('#boost-pill');
    if(method === 'button')click('#boost-close');
    else dialog.dispatchEvent(new Event(method === 'escape'?'cancel':'click',{bubbles:true,cancelable:true}));
    expect(dialog.open).toBe(false);
    expect(root.querySelector('#boost-pill')!.getAttribute('aria-expanded')).toBe('false');
    expect(root.activeElement?.id).toBe('boost-pill');
    expect(writes()).toHaveLength(0);
  });

  it('allows viewers to open disabled controls without an admin MQTT subscription',async()=>{
    const {root,dialog,hass,click,writes,value} = await mount(false);
    expect(value()).toBe('20.5°C');click('#boost-pill');
    expect(dialog.open).toBe(true);
    expect((root.querySelector('#boost') as HTMLButtonElement).disabled).toBe(true);
    expect(root.textContent).toContain('administrator');
    expect(hass.connection.subscribeMessage).not.toHaveBeenCalled();
    expect(writes()).toHaveLength(0);
  });

  it('shows an unavailable entity and prevents writes',async()=>{
    const {badge,hass,root,click,value,writes} = await mount();
    hass.states['climate.hive'].state='unavailable';badge.hass={...hass};
    expect(value()).toBe('Unavailable');click('#boost-pill');
    expect((root.querySelector('#boost') as HTMLButtonElement).disabled).toBe(true);
    expect(writes()).toHaveLength(0);
  });

  it('closes and disposes subscriptions and pending timers on disconnect',async()=>{
    const {badge,dialog,listeners,click,flush} = await mount();
    vi.useFakeTimers();click('#boost-pill');click('#boost');click('#confirm');await flush();
    expect(vi.getTimerCount()).toBe(2);
    badge.remove();
    expect(dialog.open).toBe(false);
    expect(listeners.size).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('closes controls on reconfiguration',async()=>{
    const {badge,dialog,click,root} = await mount();click('#boost-pill');
    badge.setConfig({type:'custom:hive-boost-badge',entity:'climate.hive',mqtt_device:'Other Receiver',name:'Other heating'});
    expect(dialog.open).toBe(false);
    expect(root.querySelector('#boost-label')!.textContent).toBe('Other heating');
  });

  it('preserves the custom badge type in visual-editor changes',()=>{
    const editor = document.createElement('hive-boost-badge-editor') as any;
    const changes:any[]=[];editor.addEventListener('config-changed',(event:any)=>changes.push(event.detail.config));
    editor.setConfig({type:'custom:hive-boost-badge',entity:'climate.hive',mqtt_device:'Hive Reciever'});document.body.append(editor);
    const input=editor.shadowRoot.querySelector('#duration') as HTMLInputElement;
    expect(input.min).toBe('15');input.value='30';input.dispatchEvent(new Event('change'));
    expect(changes.at(-1)).toMatchObject({type:'custom:hive-boost-badge',default_duration:30});
  });
});
