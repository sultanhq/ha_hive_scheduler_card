(function registerBoostCard() {
  'use strict';
  if (customElements.get('hive-boost-card')) return;
  const BASE = 'zigbee2mqtt';
  const MIN_TEMP = 5;
  const MAX_TEMP = 32;
  const MIN_DURATION = 15;
  const MAX_DURATION = 360;
  const elapsed = (n) => n === 1 ? '1 minute' : `${n} minutes`;
  const validTemp = (n) => Number.isFinite(n) && n >= MIN_TEMP && n <= MAX_TEMP && Math.round(n * 2) === n * 2;
  const validDuration = (n) => Number.isInteger(n) && n >= MIN_DURATION && n <= MAX_DURATION;
  const validDevice = (n) => typeof n === 'string' && n.trim().length > 0 && n.length <= 256 && !/[+/#\x00-\x1f\x7f]/.test(n);
  const validEntity = (n) => typeof n === 'string' && /^climate\.[a-z0-9_]+$/.test(n);
  const parseRoomTemperature = value => {
    if (typeof value !== 'number' && (typeof value !== 'string' || !value.trim())) return null;
    const temperature = Number(value);
    return Number.isFinite(temperature) ? temperature : null;
  };

  // Never derive MQTT topics from the climate friendly_name or entity ID.
  // MQTT/device/debug_info identifies the exact advertised receiver state topic.
  const resolveDevice = async (hass, entity, override) => {
    if (override) {
      if (!validDevice(override)) throw new Error('Invalid MQTT topic override.');
      return override;
    }
    if (!hass?.user?.is_admin || !hass?.callWS)
      throw new Error('Sign in as an administrator or set the exact MQTT topic override.');
    const registry = await hass.callWS({type:'config/entity_registry/list'});
    const deviceId = registry.find(entry => entry.entity_id === entity)?.device_id;
    if (!deviceId) throw new Error('Climate entity has no discoverable MQTT device. Set the MQTT topic override.');
    const info = await hass.callWS({type:'mqtt/device/debug_info',device_id:deviceId});
    const matches = new Set();
    const add = topic => {
      if (typeof topic !== 'string') return;
      const found = /^zigbee2mqtt\/([^/+#\x00-\x1f\x7f]+)$/.exec(topic);
      if (found) matches.add(found[1]);
    };
    for (const item of info?.entities || []) {
      if (item.entity_id !== entity) continue;
      for (const sub of item.subscriptions || []) add(sub.topic);
      let payload = item.discovery_data?.payload;
      if (typeof payload === 'string') {
        try { payload = JSON.parse(payload); } catch { payload = null; }
      }
      if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
        const base = typeof payload['~'] === 'string' ? payload['~'] : '';
        for (const key of ['state_topic','stat_t']) {
          if (typeof payload[key] === 'string') add(payload[key].replace(/^~/,base));
        }
      }
    }
    if (matches.size !== 1) throw new Error(matches.size
      ? 'Multiple receiver topics found. Set the exact MQTT topic override.'
      : 'No receiver state topic found. Set the exact MQTT topic override.');
    const name = [...matches][0];
    if (!validDevice(name)) throw new Error('Discovered MQTT topic is invalid. Set the exact override.');
    return name;
  };

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
      this._roomTemp = null;
      this._lastClimateTemp = null;
      this._temperatureEdited = false;
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
      this._syncClimateTemperature();
      this._ensureSubscription();
      this._render();
    }
    get hass() { return this._hass; }
    setConfig(config) {
      if (!validEntity(config.entity)) throw new Error('Select a valid climate entity.');
      if (config.mqtt_device && !validDevice(config.mqtt_device)) throw new Error('Invalid Zigbee2MQTT topic name override.');
      if (this._config && JSON.stringify(this._config) === JSON.stringify(config)) return;
      if (config.default_temperature !== undefined && !validTemp(Number(config.default_temperature))) throw new Error('Default temperature must be 5–32°C in 0.5°C steps.');
      if (config.default_duration !== undefined && !validDuration(Number(config.default_duration))) throw new Error('Default duration must be 15–360 minutes.');
      this._resetSubscription();
      this._clearPending();
      this._config = { ...config };
      this._temp = config.default_temperature === undefined ? 21 : Number(config.default_temperature);
      this._duration = config.default_duration === undefined ? 60 : Number(config.default_duration);
      this._data = null;
      this._roomTemp = null;
      this._lastClimateTemp = null;
      this._temperatureEdited = false;
      this._syncClimateTemperature();
      this._confirm = false;
      this._status = '';
      this._error = '';
      this._ensureSubscription();
      this._render();
    }
    _syncClimateTemperature() {
      const temperature = parseRoomTemperature(this._hass?.states?.[this._config?.entity]?.attributes?.current_temperature);
      // Unchanged HA state must not overwrite a newer MQTT room reading.
      if (temperature !== this._lastClimateTemp || this._roomTemp === null) {
        this._lastClimateTemp = temperature;
        this._roomTemp = temperature ?? parseRoomTemperature(this._data?.local_temperature);
      }
    }
    static getConfigElement() { return document.createElement('hive-boost-card-editor'); }
    static getStubConfig() { return { entity:'' }; }
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
      if (!this._hass?.user?.is_admin) { this._resetSubscription(); return; }
      if (!this.isConnected || !this._config || !this._hass?.connection?.subscribeMessage) return;
      if (this._subscribing || this._subKey) return;
      this._resetSubscription();
      const generation = this._generation;
      this._subscribing = true;
      try {
        const key = await Promise.race([
          resolveDevice(this._hass, this._config.entity, this._config.mqtt_device),
          new Promise((_, reject) => setTimeout(() => reject(new Error('MQTT topic discovery timed out. Use the topic override.')), 5000))
        ]);
        if (generation !== this._generation || !this.isConnected) return;
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
          topic:`${BASE}/${this._subKey}/get`,
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
      if (Object.prototype.hasOwnProperty.call(update,'local_temperature') && (!message.retain || this._roomTemp === null)) {
        this._roomTemp = parseRoomTemperature(update.local_temperature)
          ?? parseRoomTemperature(this._hass?.states?.[this._config?.entity]?.attributes?.current_temperature);
      }
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
        this._error = 'Choose a temperature from 5 to 32°C in 0.5°C steps and a duration from 15 to 360 minutes.';
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
          topic:`${BASE}/${this._subKey}/set`,
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
    _getContentRoot() { return this.shadowRoot; }
    _render() {
      const root = this._getContentRoot();
      if (!root) return;
      if (this._config && !this._temperatureEdited && !this._confirm && !this._working) {
        this._temp = this._roomTemp === null
          ? (this._config.default_temperature === undefined ? 21 : Number(this._config.default_temperature))
          : Math.min(MAX_TEMP, Math.max(MIN_TEMP, Math.ceil((this._roomTemp + 1) * 2) / 2));
      }
      const climate = this._hass?.states?.[this._config?.entity];
      const enabled = !!this._config && !!climate && !['unknown','unavailable'].includes(climate.state)
        && !!this._hass?.user?.is_admin && !!this._subKey && !this._working;
      const hold = this._data && Object.prototype.hasOwnProperty.call(this._data,'temperature_setpoint_hold')
        ? holdEnabled(this._data.temperature_setpoint_hold) : null;
      const reportedDuration = Number(this._data?.temperature_setpoint_hold_duration);
      const finite = hold && Number.isInteger(reportedDuration) && reportedDuration > 0 && reportedDuration <= MAX_DURATION;
      const current = this._roomTemp;
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
      badge.textContent = hold === null ? 'State unknown' : hold ? 'Boost active' : 'Schedule running';
      badge.classList.toggle('active',!!hold);
      root.querySelector('#current').textContent = Number.isFinite(current)
        ? `Room temperature: ${current.toFixed(1)}°C` : 'Room temperature unavailable';
      const body = root.querySelector('#body');
      if (!this._config) {
        body.textContent = 'Configure a climate entity ID. The receiver MQTT topic will be discovered automatically.';
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
          <div class="small" id="temperature-hint"></div>
          <label for="duration">Boost duration</label>
          <div class="presets" id="presets"></div>
          <div class="small">Or enter minutes (15–360)</div>
          <input id="duration" type="number" min="${MIN_DURATION}" max="360" step="1" aria-label="Boost duration in minutes">
          <div id="receiver" class="notice" hidden></div>
          <div class="actions">
            <button class="primary" id="boost" ${enabled ? '' : 'disabled'}>Boost</button>
            <button class="danger" id="stop" ${enabled && hold ? '' : 'disabled'}>Cancel Boost</button>
          </div>`;
        body.querySelector('#temperature-value').textContent = `${this._temp.toFixed(1)}°C`;
        const input = body.querySelector('#temperature');
        input.value = String(this._temp);
        const hint = body.querySelector('#temperature-hint');
        hint.hidden = this._temperatureEdited;
        hint.textContent = this._roomTemp === null
          ? 'Room temperature unavailable; using the fallback temperature.'
          : 'Suggested: room temperature +1°C, rounded up to 0.5°C (maximum 32°C).';
        input.addEventListener('input',event => {
          this._temp = Number(event.target.value);
          this._temperatureEdited = true;
          hint.hidden = true;
          body.querySelector('#temperature-value').textContent = `${this._temp.toFixed(1)}°C`;
        });
        const duration = body.querySelector('#duration');
        duration.value = String(this._duration);
        duration.addEventListener('change',event => {
          const value = Number(event.target.value);
          if (validDuration(value)) { this._duration = value; this._error = ''; }
          else { this._error = 'Duration must be an integer between 15 and 360 minutes.'; }
          this._render();
        });
        for (const value of [MIN_DURATION,30,60,90,120,180,360]) {
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
      this._config = {type:this._configType,entity:'',mqtt_device:''};
      this._hass = null;
    }
    set hass(hass) {
      this._hass = hass;
      const ids = Object.keys(hass?.states || {}).filter(id => id.startsWith('climate.')).sort().join('|');
      if (ids !== this._entityIds) { this._entityIds = ids; this._render(); }
    }
    get hass() { return this._hass; }
    get _configType() { return 'custom:hive-boost-card'; }
    setConfig(config) {
      const next = {...config,type:this._configType};
      if (JSON.stringify(this._config) === JSON.stringify(next)) return;
      this._config = next; this._render();
    }
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
      <label for="entity">Climate entity ID (required)</label><select id="entity"></select>
      <label for="mqtt">Zigbee2MQTT topic name (optional override)</label><input id="mqtt" placeholder="Auto-discover from climate entity">
      <small>Automatically discovered from MQTT metadata. Enter an exact topic name only if discovery fails.</small>
      <label for="name">Name (optional)</label><input id="name" placeholder="Hive Boost">
      <label for="temp">Fallback temperature when room temperature is unavailable (5–32°C)</label><input id="temp" type="number" step=".5" min="5" max="32">
      <label for="duration">Default duration in minutes (15–360)</label><input id="duration" type="number" min="${MIN_DURATION}" max="360">`;
      const entities = Object.keys(this._hass?.states || {}).filter(id=>id.startsWith('climate.'));
      const select = root.querySelector('#entity');
      const all = new Set([this._config.entity,...entities].filter(Boolean));
      select.appendChild(new Option('Select climate entity',''));
      for (const id of all) {
        select.appendChild(new Option(id,id));
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
  class HiveBoostBadge extends HiveBoostCard {
    static getConfigElement() { return document.createElement('hive-boost-badge-editor'); }
    setConfig(config) {
      if (this._config && JSON.stringify(this._config) === JSON.stringify(config)) return;
      this._closeControls(false); super.setConfig(config);
    }
    disconnectedCallback() { this._closeControls(false); super.disconnectedCallback(); }
    _getContentRoot() { return this.shadowRoot?.querySelector('#boost-controls'); }
    _ensureBadge() {
      if (this.shadowRoot.querySelector('#boost-pill')) return;
      this.shadowRoot.innerHTML = `<style>
        :host {display:inline-flex !important;max-width:100%;vertical-align:middle;}
        .boost-pill {display:inline-flex;align-items:center;gap:8px;max-width:100%;min-height:40px;padding:5px 12px;border:1px solid var(--divider-color,#ddd);border-radius:24px;background:var(--ha-card-background,var(--card-background-color,#fff));color:var(--primary-text-color,#222);font:inherit;cursor:pointer;box-shadow:var(--ha-card-box-shadow,0 1px 2px #0001);}
        .boost-pill:focus-visible,.dialog-close:focus-visible {outline:2px solid var(--primary-color,#087f8c);outline-offset:2px;}
        .boost-pill:disabled {opacity:.6;cursor:default;}
        .boost-pill svg {width:22px;height:22px;flex-shrink:0;color:var(--primary-color,#087f8c);fill:currentColor;}
        .boost-pill.active svg {color:var(--state-climate-heat-color,var(--warning-color,#ef5350));}
        .badge-text {display:grid;text-align:left;min-width:0;}
        .badge-label {font-size:10px;line-height:13px;color:var(--secondary-text-color,#777);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .badge-value {font-size:14px;line-height:18px;font-weight:500;white-space:nowrap;}
        .boost-dialog {box-sizing:border-box;width:min(480px,calc(100vw - 24px));max-width:calc(100vw - 24px);max-height:calc(100dvh - 32px);padding:0;border:1px solid var(--divider-color,#ddd);border-radius:var(--ha-card-border-radius,12px);background:var(--card-background-color,#fff);color:var(--primary-text-color,#222);font:inherit;box-shadow:0 8px 32px #0004;}
        .boost-dialog::backdrop {background:#0006;}
        .dialog-heading {position:sticky;top:0;z-index:1;background:var(--card-background-color,#fff);display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--divider-color,#ddd);font-weight:500;}
        .dialog-close {border:0;border-radius:50%;background:transparent;color:inherit;font:inherit;font-size:26px;padding:0;width:40px;height:40px;cursor:pointer;}
      </style>
      <button id="boost-pill" class="boost-pill" type="button" aria-haspopup="dialog" aria-expanded="false">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c1 5-5 6-5 11a5 5 0 0 0 10 0c0-3-2-5-3-6 0 3-2 3-2 5-3-3 1-6 0-10Z"/></svg>
        <span class="badge-text"><span id="boost-label" class="badge-label"></span><span id="boost-value" class="badge-value" aria-live="polite"></span></span>
      </button>
      <dialog id="boost-dialog" class="boost-dialog" aria-labelledby="boost-dialog-title">
        <div class="dialog-heading"><span id="boost-dialog-title">Boost controls</span><button id="boost-close" class="dialog-close" type="button" aria-label="Close boost controls">×</button></div>
        <div id="boost-controls"></div>
      </dialog>`;
      this.shadowRoot.querySelector('#boost-pill').addEventListener('click',()=>this._openControls());
      this.shadowRoot.querySelector('#boost-close').addEventListener('click',()=>this._closeControls());
      const dialog = this.shadowRoot.querySelector('#boost-dialog');
      dialog.addEventListener('cancel',event=>{event.preventDefault();this._closeControls();});
      dialog.addEventListener('click',event=>{if(event.target === dialog)this._closeControls();});
    }
    _openControls() {
      const dialog = this.shadowRoot.querySelector('#boost-dialog');
      if (!dialog || dialog.open) return;
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open','');
      this.shadowRoot.querySelector('#boost-pill').setAttribute('aria-expanded','true');
      this._getContentRoot().querySelector('#temperature, #confirm')?.focus();
    }
    _closeControls(restoreFocus = true) {
      const dialog = this.shadowRoot.querySelector('#boost-dialog');
      if (!dialog?.open) return;
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
      const pill = this.shadowRoot.querySelector('#boost-pill');
      pill.setAttribute('aria-expanded','false');
      if (restoreFocus && this.isConnected) pill.focus();
    }
    _render() {
      if (!this.shadowRoot) return;
      this._ensureBadge();
      const previousFocus = this.shadowRoot.activeElement;
      const focusId = previousFocus?.closest('#boost-controls') ? previousFocus.id : null;
      super._render();
      const root = this.shadowRoot;
      const pill = root.querySelector('#boost-pill');
      const climate = this._hass?.states?.[this._config?.entity];
      const active = holdEnabled(this._data?.temperature_setpoint_hold);
      const duration = Number(this._data?.temperature_setpoint_hold_duration);
      const name = this._config?.name || 'Hive Boost';
      let value = Number.isFinite(this._roomTemp) ? `${this._roomTemp.toFixed(1)}°C` : 'State unknown';
      if (!climate || ['unknown','unavailable'].includes(climate.state)) value = 'Unavailable';
      else if (this._working) value = 'Verifying…';
      else if (this._error) value = 'Check Boost';
      else if (active) value = 'Boost active' + (Number.isInteger(duration) && duration > 0 && duration <= MAX_DURATION ? ` · ${duration}m` : '');
      root.querySelector('#boost-label').textContent = name;
      root.querySelector('#boost-value').textContent = value;
      pill.classList.toggle('active',active);
      pill.disabled = !this._config || !this._hass;
      pill.setAttribute('aria-label',`${name}: ${value}. Open Boost controls.`);
      pill.title = this._error || `${name}: ${value}`;
      if (focusId && root.querySelector('#boost-dialog').open) {
        (this._getContentRoot().querySelector(`[id="${focusId}"]`) || this._getContentRoot().querySelector('#confirm') || root.querySelector('#boost-close'))?.focus({preventScroll:true});
      }
    }
  }
  class HiveBoostBadgeEditor extends HiveBoostCardEditor {
    get _configType() { return 'custom:hive-boost-badge'; }
  }
  customElements.define('hive-boost-card', HiveBoostCard);
  customElements.define('hive-boost-card-editor', HiveBoostCardEditor);
  customElements.define('hive-boost-badge', HiveBoostBadge);
  customElements.define('hive-boost-badge-editor', HiveBoostBadgeEditor);
  window.customBadges = window.customBadges || [];
  if (!window.customBadges.some(badge => badge.type === 'hive-boost-badge')) {
    window.customBadges.push({type:'hive-boost-badge',name:'Hive Boost Badge',description:'Hive Boost status with timed boost controls on tap',preview:true,documentationURL:'https://github.com/sultanhq/ha_hive_scheduler_card#hive-boost-badge'});
  }
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
