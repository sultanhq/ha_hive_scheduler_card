(function registerBoostCard() {
  'use strict';
  if (customElements.get('hive-boost-card')) return;
  const BASE = 'zigbee2mqtt';
  const MIN_TEMP = 5;
  const MAX_TEMP = 32;
  const MAX_DURATION = 360;
  const elapsed = (n) => n === 1 ? '1 minute' : `${n} minutes`;
  const validTemp = (n) => Number.isFinite(n) && n >= MIN_TEMP && n <= MAX_TEMP && Math.round(n * 2) === n * 2;
  const validDuration = (n) => Number.isInteger(n) && n >= 1 && n <= MAX_DURATION;
  const validDevice = (n) => typeof n === 'string' && n.trim().length > 0 && n.length <= 256 && !/[+/#\x00-\x1f\x7f]/.test(n);
  const validEntity = (n) => typeof n === 'string' && /^climate\.[a-z0-9_]+$/.test(n);
  const holdEnabled = (v) => v === true || v === 1 || v === 'true' || v === '1';
  const holdDisabled = (v) => v === false || v === 0 || v === 'false' || v === '0';
  const styles = `
    :host { display:block; color:var(--primary-text-color, #222); font:inherit; }
    ha-card { display:block; padding:20px; border-radius:var(--ha-card-border-radius, 12px); }
    .heading { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:16px; }
    h2 { font-size:20px; font-weight:500; margin:0; }
    .state { font-size:12px; border-radius:12px; background:var(--secondary-background-color,#eee); padding:5px 9px; }
    .active { background:var(--warning-color,#e8a317); color:#111; }
    .current { color:var(--secondary-text-color,#777); font-size:14px; margin:0 0 16px; }
    label { display:block; margin:16px 0 8px; font-weight:500; }
    .value { font-size:32px; text-align:center; font-variant-numeric:tabular-nums; padding:8px 0; }
    input[type=range] { width:100%; accent-color:var(--primary-color,#4934d4); }
    input[type=number] { box-sizing:border-box; width:100%; padding:10px 12px; border:1px solid var(--divider-color,#bbb); border-radius:8px; font:inherit; background:var(--card-background-color,#fff); color:inherit; }
    .presets { display:flex; flex-wrap:wrap; gap:8px; }
    button { border:1px solid var(--primary-color,#4934d4); border-radius:8px; background:transparent; color:var(--primary-color,#4934d4); font:inherit; padding:9px 12px; cursor:pointer; }
    button.selected, button.primary { color:var(--text-primary-color,#fff); background:var(--primary-color,#4934d4); }
    button.danger { color:var(--error-color,#c62828); border-color:var(--error-color,#c62828); }
    button:disabled { opacity:.45; cursor:not-allowed; }
    button:focus-visible, input:focus-visible { outline:2px solid var(--primary-color,#4934d4); outline-offset:2px; }
    .actions { display:flex; gap:10px; margin-top:20px; }
    .actions button { flex:1; }
    .notice { padding:10px 12px; margin:12px 0; border-radius:8px; background:var(--secondary-background-color,#eee); font-size:14px; }
    .error { color:var(--error-color,#c62828); }
    .summary { padding:20px 0; text-align:center; font-size:19px; }
    .small { color:var(--secondary-text-color,#777); font-size:13px; margin-top:10px; }
  `;

  class HiveBoostCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode:'open'});
      this._config = null;
      this._hass = null;
      this._temp = 21;
      this._duration = 60;
      this._data = null;
      this._confirm = false;
      this._status = '';
      this._error = '';
      this._working = false;
      this._pending = null;
      this._unsub = null;
      this._subscribing = false;
      this._subKey = '';
      this._generation = 0;
      this._timeout = null;
      this._refreshTimer = null;
    }
    set hass(hass) {
      this._hass = hass;
      this._ensureSubscription();
      this._render();
    }
    get hass() { return this._hass; }
    setConfig(config) {
      if (!validEntity(config.entity)) throw new Error('Select a valid climate entity.');
      if (!validDevice(config.mqtt_device)) throw new Error('Provide the exact Zigbee2MQTT friendly name (no /, +, # or control characters).');
      if (config.default_temperature !== undefined && !validTemp(Number(config.default_temperature))) throw new Error('Default temperature must be 5–32°C in 0.5°C steps.');
      if (config.default_duration !== undefined && !validDuration(Number(config.default_duration))) throw new Error('Default duration must be 1–360 minutes.');
      this._resetSubscription();
      this._clearPending();
      this._config = { ...config };
      this._temp = config.default_temperature === undefined ? 21 : Number(config.default_temperature);
      this._duration = config.default_duration === undefined ? 60 : Number(config.default_duration);
      this._data = null;
      this._confirm = false;
      this._status = '';
      this._error = '';
      this._ensureSubscription();
      this._render();
    }
    static getConfigElement() { return document.createElement('hive-boost-card-editor'); }
    static getStubConfig() { return { entity:'', mqtt_device:'' }; }
    getCardSize() { return 3; }
    connectedCallback() { this._ensureSubscription(); this._render(); }
    disconnectedCallback() {
      this._resetSubscription();
      this._clearPending();
    }
    _resetSubscription() {
      this._generation++;
      if (this._unsub) { this._unsub(); this._unsub = null; }
      this._subKey = '';
      this._subscribing = false;
    }
    async _ensureSubscription() {
      if (!this.isConnected || !this._config || !this._hass?.connection?.subscribeMessage) return;
      const key = this._config.mqtt_device;
      if (this._subKey === key || this._subscribing) return;
      this._resetSubscription();
      const generation = this._generation;
      this._subscribing = true;
      try {
        const topic = `${BASE}/${key}`;
        const unsub = await this._hass.connection.subscribeMessage(
          message => {
            if (generation === this._generation && message.topic === topic) this._receive(message);
          },
          {type:'mqtt/subscribe',topic}
        );
        if (generation !== this._generation || !this.isConnected) {
          unsub();
          return;
        }
        this._subKey = key;
        this._unsub = unsub;
        await this._requestState();
      } catch (error) {
        if (generation === this._generation) this._error = `MQTT subscription failed: ${String(error?.message || error)}`;
      } finally {
        if (generation === this._generation) { this._subscribing = false; this._render(); }
      }
    }
    async _requestState() {
      if (!this._config || !this._hass?.user?.is_admin) return;
      try {
        await this._hass.callService('mqtt','publish',{
          topic:`${BASE}/${this._config.mqtt_device}/get`,
          payload:JSON.stringify({
            occupied_heating_setpoint:'',temperature_setpoint_hold:'',temperature_setpoint_hold_duration:'',system_mode:''
          }),
          retain:false
        });
      } catch (error) {
        this._error = `Could not refresh receiver: ${String(error?.message || error)}`;
        this._render();
      }
    }
    _receive(message) {
      let update;
      try { update = JSON.parse(message.payload); } catch { return; }
      if (!update || typeof update !== 'object' || Array.isArray(update)) return;
      const keys = ['occupied_heating_setpoint','temperature_setpoint_hold','temperature_setpoint_hold_duration','system_mode','local_temperature'];
      if (!keys.some(key => Object.prototype.hasOwnProperty.call(update,key))) return;
      this._data = { ...(this._data || {}), ...Object.fromEntries(keys.filter(key => Object.prototype.hasOwnProperty.call(update,key)).map(key => [key,update[key]])) };
      if (this._pending && !message.retain) {
        // Display state may include cached/retained values. Verification belongs
        // to this command and only accumulates fresh receiver feedback.
        Object.assign(this._pending.feedback, Object.fromEntries(keys
          .filter(key => Object.prototype.hasOwnProperty.call(update,key))
          .map(key => [key,update[key]])));
        if (this._matchesPending(this._pending, this._pending.feedback)) {
          this._status = this._pending.kind === 'start' ? 'Boost confirmed by receiver.' : 'Boost cancelled; normal scheduling resumed.';
          this._error = '';
          this._clearPending();
        }
      }
      this._render();
    }
    _matchesPending(command,data) {
      const required = ['temperature_setpoint_hold','temperature_setpoint_hold_duration','system_mode'];
      if (command.kind === 'start') required.push('occupied_heating_setpoint');
      if (!required.every(key => Object.prototype.hasOwnProperty.call(data,key))) return false;
      const duration = Number(data.temperature_setpoint_hold_duration);
      if (command.kind === 'stop') return holdDisabled(data.temperature_setpoint_hold)
        && data.temperature_setpoint_hold_duration !== null && duration === 0 && data.system_mode === 'auto';
      return holdEnabled(data.temperature_setpoint_hold) && data.system_mode === 'heat'
        && Number.isFinite(duration) && duration > 0 && duration <= command.duration
        && Math.abs(Number(data.occupied_heating_setpoint)-command.temp) < .05;
    }
    _clearPending() {
      clearTimeout(this._timeout);
      clearTimeout(this._refreshTimer);
      this._timeout = null;
      this._refreshTimer = null;
      this._pending = null;
      this._working = false;
    }
    async _send(kind) {
      if (this._working || !this._config || !this._hass?.user?.is_admin || !this._subKey) return;
      if (kind === 'start' && (!validTemp(this._temp) || !validDuration(this._duration))) {
        this._error = 'Choose a temperature from 5 to 32°C in 0.5°C steps and a duration from 1 to 360 minutes.';
        this._render();
        return;
      }
      const pending = {kind,temp:this._temp,duration:this._duration,feedback:{}};
      // One atomic MQTT publish for all receiver settings; never split into separate commands.
      const payload = kind === 'start'
        ? {system_mode:'heat',occupied_heating_setpoint:this._temp,temperature_setpoint_hold_duration:this._duration,temperature_setpoint_hold:true}
        : {system_mode:'auto',temperature_setpoint_hold_duration:0,temperature_setpoint_hold:false};
      this._pending = pending;
      this._working = true;
      this._confirm = false;
      this._error = '';
      this._status = kind === 'start' ? 'Sending boost to Hive…' : 'Cancelling boost…';
      this._render();
      try {
        await this._hass.callService('mqtt','publish',{
          topic:`${BASE}/${this._config.mqtt_device}/set`,
          payload:JSON.stringify(payload),
          retain:false
        });
        if (this._pending !== pending) return;
        this._status = 'Command sent. Waiting for receiver confirmation…';
        this._refreshTimer = setTimeout(() => {
          if (this._pending === pending) void this._requestState();
        }, 3000);
        this._timeout = setTimeout(() => {
          if (this._pending === pending) {
            this._clearPending();
            this._error = 'Hive did not confirm the command. Check its status before retrying.';
            this._status = '';
            this._render();
          }
        }, 20000);
        this._render();
      } catch (error) {
        if (this._pending === pending) {
          this._clearPending();
          this._error = `Could not send command: ${String(error?.message || error)}`;
          this._status = '';
          this._render();
        }
      }
    }
    _render() {
      if (!this.shadowRoot) return;
      const root = this.shadowRoot;
      const climate = this._hass?.states?.[this._config?.entity];
      const enabled = !!this._config && !!climate && !['unknown','unavailable'].includes(climate.state)
        && !!this._hass?.user?.is_admin && this._subKey === this._config.mqtt_device && !this._working;
      const hold = this._data && Object.prototype.hasOwnProperty.call(this._data,'temperature_setpoint_hold')
        ? holdEnabled(this._data.temperature_setpoint_hold) : null;
      const reportedDuration = Number(this._data?.temperature_setpoint_hold_duration);
      const finite = hold && Number.isInteger(reportedDuration) && reportedDuration > 0 && reportedDuration <= MAX_DURATION;
      const current = Number(this._data?.local_temperature ?? climate?.attributes?.current_temperature);
      const title = this._config?.name || climate?.attributes?.friendly_name || 'Hive Boost';
      root.innerHTML = `
        <style>${styles}</style>
        <ha-card>
          <div class="heading"><h2 id="title"></h2><span class="state" id="badge"></span></div>
          <p class="current" id="current"></p>
          <div id="body"></div>
          <div class="notice" id="notice" role="status" aria-live="polite" hidden></div>
          <div class="notice error" id="error" role="alert" hidden></div>
        </ha-card>`;
      root.querySelector('#title').textContent = title;
      const badge = root.querySelector('#badge');
      badge.textContent = hold === null ? 'State unknown' : hold ? 'Hold active' : 'Schedule running';
      badge.classList.toggle('active',!!hold);
      root.querySelector('#current').textContent = Number.isFinite(current)
        ? `Room temperature: ${current.toFixed(1)}°C` : 'Room temperature unavailable';
      const body = root.querySelector('#body');
      if (!this._config) {
        body.textContent = 'Configure a climate entity and the Zigbee2MQTT receiver friendly name.';
      } else if (this._confirm) {
        body.innerHTML = `<div class="summary" id="summary"></div><div class="actions">
          <button id="back">Back</button><button class="primary" id="confirm" ${enabled ? '' : 'disabled'}>Confirm Boost</button></div>`;
        body.querySelector('#summary').textContent = `Boost to ${this._temp.toFixed(1)}°C for ${elapsed(this._duration)}?`;
        body.querySelector('#back').addEventListener('click',()=>{this._confirm=false;this._render();});
        body.querySelector('#confirm').addEventListener('click',()=>void this._send('start'));
      } else {
        body.innerHTML = `
          <label for="temperature">Boost temperature</label>
          <div class="value" id="temperature-value"></div>
          <input id="temperature" type="range" min="5" max="32" step="0.5" aria-label="Boost temperature">
          <label for="duration">Boost duration</label>
          <div class="presets" id="presets"></div>
          <div class="small">Or enter minutes (1–360)</div>
          <input id="duration" type="number" min="1" max="360" step="1" aria-label="Boost duration in minutes">
          <div id="receiver" class="notice" hidden></div>
          <div class="actions">
            <button class="primary" id="boost" ${enabled ? '' : 'disabled'}>Boost</button>
            <button class="danger" id="stop" ${enabled && hold ? '' : 'disabled'}>Cancel Boost</button>
          </div>`;
        body.querySelector('#temperature-value').textContent = `${this._temp.toFixed(1)}°C`;
        const input = body.querySelector('#temperature');
        input.value = String(this._temp);
        input.addEventListener('input',event => {
          this._temp = Number(event.target.value);
          body.querySelector('#temperature-value').textContent = `${this._temp.toFixed(1)}°C`;
        });
        const duration = body.querySelector('#duration');
        duration.value = String(this._duration);
        duration.addEventListener('change',event => {
          const value = Number(event.target.value);
          if (validDuration(value)) { this._duration = value; this._error = ''; }
          else { this._error = 'Duration must be an integer between 1 and 360 minutes.'; }
          this._render();
        });
        for (const value of [30,60,90,120,180,360]) {
          const button = document.createElement('button');
          button.textContent = `${value}m`;
          button.classList.toggle('selected',this._duration === value);
          button.addEventListener('click',()=>{this._duration=value;this._render();});
          body.querySelector('#presets').appendChild(button);
        }
        if (hold) {
          const receiver = body.querySelector('#receiver');
          receiver.hidden = false;
          receiver.textContent = finite
            ? `Receiver hold: ${this._data.occupied_heating_setpoint ?? '?'}°C, reported duration ${elapsed(reportedDuration)}.`
            : 'Receiver has a hold active without a confirmed finite duration.';
        }
        body.querySelector('#boost').addEventListener('click',()=>{this._confirm=true;this._error='';this._render();});
        body.querySelector('#stop').addEventListener('click',()=>void this._send('stop'));
      }
      if (this._status) {
        const notice = root.querySelector('#notice');
        notice.hidden = false; notice.textContent = this._status;
      }
      if (this._error) {
        const error = root.querySelector('#error');
        error.hidden = false; error.textContent = this._error;
      }
      if (this._config && !this._hass?.user?.is_admin && !this._error) {
        const notice = root.querySelector('#notice');
        notice.hidden = false;
        notice.textContent = 'Sign in as a Home Assistant administrator to control Hive via MQTT.';
      }
    }
  }

  class HiveBoostCardEditor extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode:'open'});
      this._config = {type:'custom:hive-boost-card',entity:'',mqtt_device:''};
      this._hass = null;
    }
    set hass(hass) { this._hass = hass; this._render(); }
    get hass() { return this._hass; }
    setConfig(config) { this._config = {...config,type:'custom:hive-boost-card'}; this._render(); }
    _changed(key,value) {
      this._config = {...this._config,[key]:value};
      this.dispatchEvent(new CustomEvent('config-changed',{
        detail:{config:this._config},bubbles:true,composed:true
      }));
    }
    connectedCallback() {this._render();}
    _render() {
      if (!this.shadowRoot) return;
      const root = this.shadowRoot;
      root.innerHTML = `<style>
        :host {display:block}
        label {display:block; margin:14px 0 5px}
        select,input {box-sizing:border-box;width:100%;padding:10px;font:inherit;border:1px solid var(--divider-color,#aaa);border-radius:7px;background:var(--card-background-color,#fff);color:var(--primary-text-color,#222)}
        small {color:var(--secondary-text-color,#777)}
      </style>
      <label for="entity">Climate entity</label><select id="entity"></select>
      <label for="mqtt">Zigbee2MQTT friendly name</label><input id="mqtt" placeholder="Hive Reciever">
      <small>Use the exact receiver name, including spaces and spelling.</small>
      <label for="name">Card title (optional)</label><input id="name" placeholder="Hive Boost">
      <label for="temp">Default temperature (5–32°C)</label><input id="temp" type="number" step=".5" min="5" max="32">
      <label for="duration">Default duration in minutes (1–360)</label><input id="duration" type="number" min="1" max="360">`;
      const entities = Object.keys(this._hass?.states || {}).filter(id=>id.startsWith('climate.'));
      const select = root.querySelector('#entity');
      const all = new Set([this._config.entity,...entities].filter(Boolean));
      select.appendChild(new Option('Select climate entity',''));
      for (const id of all) {
        const text = this._hass?.states?.[id]?.attributes?.friendly_name || id;
        select.appendChild(new Option(text,id));
      }
      select.value = this._config.entity || '';
      select.addEventListener('change',e=>this._changed('entity',e.target.value));
      for (const [id,key,fallback] of [['mqtt','mqtt_device',''],['name','name',''],['temp','default_temperature',21],['duration','default_duration',60]]) {
        const input = root.querySelector('#'+id);
        input.value = String(this._config[key] ?? fallback);
        input.addEventListener('change',e=>this._changed(key,id==='temp'||id==='duration'?Number(e.target.value):e.target.value));
      }
    }
  }
  customElements.define('hive-boost-card', HiveBoostCard);
  customElements.define('hive-boost-card-editor', HiveBoostCardEditor);
  window.customCards = window.customCards || [];
  if (!window.customCards.some(card => card.type === 'hive-boost-card')) {
    window.customCards.push({
      type:'hive-boost-card',
      name:'Hive Boost Card',
      description:'Timed heating boost for Hive SLR1c receivers using Zigbee2MQTT',
      preview:false,
      documentationURL:'https://github.com/sultanhq/ha_hive_scheduler_card'
    });
  }
})();
