/**
 * Main Hive Scheduler Card Component
 * A Home Assistant custom card for managing Hive SLR1c thermostat schedules
 */

import { LitElement, html, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, HiveSchedulerCardConfig, WeeklySchedule, DayOfWeek, ScheduleEntities, DaySchedule, DAYS_OF_WEEK } from './models/types';
import { getScheduleFromSensor, resolveScheduleEntities, resolveMqttDevice, SaveCoordinator, getEntityInfo } from './services/ha-service';
import { copyDaySchedule, serializeDaySchedule } from './models/schedule';
import { validateMqttDevice } from './services/mqtt-sanitizer';
import { validateWeeklySchedule } from './utils/validation';
import { cardStyles } from './styles/card-styles';

// Import child components (they will be registered separately)
import './components/schedule-week-view';
import './components/schedule-graph-view';
import './components/day-schedule-editor';
import './components/copy-schedule-dialog';

@customElement('hive-scheduler-card')
export class HiveSchedulerCard extends LitElement {
  // Static styles
  static styles = cardStyles;

  // Static methods for Home Assistant integration
  public static getConfigElement() {
    return document.createElement('hive-scheduler-card-editor');
  }

  public static getStubConfig() {
    return { entity: '' };
  }

  // Public properties (set by Home Assistant)
  @property({ attribute: false }) public hass!: HomeAssistant;

  // Card configuration
  @state() private config!: HiveSchedulerCardConfig;

  // Internal state
  @state() private _schedule: WeeklySchedule | null = null;
  @state() private _originalSchedule: WeeklySchedule | null = null;
  @state() private _viewMode: 'week' | 'graph' = 'week';
  @state() private _editingDay: DayOfWeek | null = null;
  @state() private _showCopyDialog: boolean = false;
  @state() private _copySourceDay: DayOfWeek | null = null;
  @state() private _saving: boolean = false;
  @state() private _error: string | null = null;
  @state() private _hasUnsavedChanges: boolean = false;

  @state() private _loadError: string | null = null;
  @state() private _message: string | null = null;
  @state() private _conflicts: DayOfWeek[] = [];
  private _entities: ScheduleEntities | null = null;
  private _resolving = false;
  private _generation = 0;
  private _receiverSignature = '';
  private _coordinator = new SaveCoordinator();
  private _latestHass?: HomeAssistant;
  private _resolvedDevice: string | null = null;

  private _sameDay(a: DaySchedule, b: DaySchedule): boolean {
    try { return serializeDaySchedule(a) === serializeDaySchedule(b); }
    catch { return JSON.stringify(a.transitions.map(({ time, temperature }) => ({ time, temperature }))) ===
      JSON.stringify(b.transitions.map(({ time, temperature }) => ({ time, temperature }))); }
  }

  private _updateDirty(): void {
    this._hasUnsavedChanges = !!this._schedule && !!this._originalSchedule &&
      DAYS_OF_WEEK.some(day => !this._sameDay(this._schedule![day], this._originalSchedule![day]));
  }

  /**
   * Create a deep copy of a weekly schedule
   * Used to create immutable snapshots for change tracking
   */
  private _deepCopySchedule(schedule: WeeklySchedule): WeeklySchedule {
    const copy: Partial<WeeklySchedule> = {};
    for (const day of DAYS_OF_WEEK) {
      copy[day] = { transitions: schedule[day].transitions.map(t => ({ ...t })) };
    }
    return copy as WeeklySchedule;
  }

  /**
   * Set card configuration
   * Called by Home Assistant when the card is configured
   */
  public setConfig(config: HiveSchedulerCardConfig): void {
    if (!config.entity || !/^climate\.[a-z0-9_]+$/.test(config.entity)) throw new Error('You must specify a climate entity');
    if (config.mqtt_device) validateMqttDevice(config.mqtt_device);
    if (config.view_mode && !['week', 'graph'].includes(config.view_mode)) throw new Error('view_mode must be week or graph');
    const nextViewMode = config.view_mode || 'week';
    // HA may reapply the same configuration during live state updates. Never
    // discard a schedule draft, active editor or in-flight save in that case.
    if (this.config && JSON.stringify([this.config.entity, this.config.mqtt_device || '', this.config.schedule_entities || {}]) ===
      JSON.stringify([config.entity, config.mqtt_device || '', config.schedule_entities || {}])) {
      const previousViewMode = this.config.view_mode || 'week';
      this.config = { ...config, schedule_entities: { ...config.schedule_entities }, view_mode: nextViewMode };
      // Update the visible view only when the editor changed the configured
      // default. Reapplying unchanged config must not override a manual toggle.
      if (previousViewMode !== nextViewMode) this._viewMode = nextViewMode;
      return;
    }
    this._resolvedDevice = null;
    this._generation++;
    this._coordinator.cancel();
    this._entities = null;
    this._receiverSignature = '';
    this._resolving = false;
    this._schedule = this._originalSchedule = null;
    this._conflicts = [];
    this._error = this._loadError = this._message = null;
    this._saving = this._hasUnsavedChanges = false;
    this._editingDay = null;
    this._showCopyDialog = false;
    this.config = { ...config, schedule_entities: { ...config.schedule_entities }, view_mode: config.view_mode || 'week' };
    this._viewMode = this.config.view_mode!;
  }

  public getCardSize(): number { return 4; }

  connectedCallback(): void {
    super.connectedCallback();
    this.requestUpdate('hass');
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._generation++;
    this._resolving = false;
    this._coordinator.cancel();
    if (this._saving) this._error = 'Save interrupted. Edits were preserved; refresh receiver schedules before retrying.';
    this._saving = false;
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    if (!this.hass || !this.config || !(changedProps.has('hass') || changedProps.has('config'))) return;
    // Entity snapshots can arrive out of order. Never replace newer values with older ones.
    const states = { ...this.hass.states };
    for (const [id, previous] of Object.entries(this._latestHass?.states || {})) {
      const next = states[id];
      if (next?.last_updated && previous.last_updated && next.last_updated < previous.last_updated) states[id] = previous;
    }
    this._latestHass = { ...this.hass, states };
    this._coordinator.updateHass(this._latestHass);
    if (!this._saving) void this._loadSchedule();
  }

  private async _loadSchedule(): Promise<void> {
    if (!this.hass || !this.config || this._resolving) return;
    const generation = this._generation;
    try {
      if (!this.hass.states[this.config.entity]) throw new Error(`Climate entity not found: ${this.config.entity}`);
      if (!this._entities) {
        this._resolving = true;
        let timeout: ReturnType<typeof setTimeout> | undefined;
        try {
          const entities = await Promise.race([
            resolveScheduleEntities(this.hass, this.config),
            new Promise<never>((_, reject) => { timeout = setTimeout(() => reject(new Error('Entity discovery timed out. Configure schedule_entities explicitly.')), 5000); })
          ]);
          if (generation !== this._generation) return;
          this._entities = entities;
        } finally { clearTimeout(timeout); if (generation === this._generation) this._resolving = false; }
      }
      const hass = this._latestHass || this.hass;
      if (!hass.states[this.config.entity]) throw new Error(`Climate entity not found: ${this.config.entity}`);
      const signature = JSON.stringify([hass.states[this.config.entity]?.state, ...DAYS_OF_WEEK.map(day => hass.states[this._entities![day]]?.state)]);
      if (signature === this._receiverSignature && this._schedule && this._originalSchedule && !this._loadError) return;
      const incoming = getScheduleFromSensor(hass, this._entities);
      this._receiverSignature = signature;
      if (!this._schedule || !this._originalSchedule) {
        this._schedule = this._deepCopySchedule(incoming);
        this._originalSchedule = this._deepCopySchedule(incoming);
      } else {
        const draft = this._deepCopySchedule(this._schedule);
        const baseline = this._deepCopySchedule(this._originalSchedule);
        for (const day of DAYS_OF_WEEK) {
          if (this._sameDay(draft[day], baseline[day])) {
            draft[day] = incoming[day]; baseline[day] = incoming[day];
          } else if (!this._sameDay(incoming[day], baseline[day])) {
            if (!this._conflicts.includes(day)) this._conflicts = [...this._conflicts, day];
          }
        }
        this._schedule = draft;
        this._originalSchedule = baseline;
      }
      this._loadError = null;
      this._updateDirty();
    } catch (error) {
      if (generation === this._generation) this._loadError = error instanceof Error ? error.message : String(error);
    }
  }

  /** Discover and cache the actual Zigbee2MQTT topic segment before any publish. */
  private async _getMqttDevice(): Promise<string> {
    if (this.config.mqtt_device) return this.config.mqtt_device;
    if (this._resolvedDevice) return this._resolvedDevice;
    const generation = this._generation;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    try {
      const name = await Promise.race([
        resolveMqttDevice(this.hass, this.config),
        new Promise<never>((_, reject) => {
          timeout = setTimeout(() => reject(new Error('MQTT topic discovery timed out. Set mqtt_device explicitly.')), 5000);
        })
      ]);
      if (generation !== this._generation) throw new Error('Card configuration changed while identifying the receiver.');
      this._resolvedDevice = name;
      return name;
    } finally { clearTimeout(timeout); }
  }

  private async _reloadSchedule(): Promise<void> {
    if (this._saving) return;
    let mqttDevice: string;
    try { mqttDevice = await this._getMqttDevice(); }
    catch (error) { this._error = error instanceof Error ? error.message : String(error); return; }
    this._schedule = this._originalSchedule = null;
    this._conflicts = [];
    this._error = this._message = null;
    this._hasUnsavedChanges = false;
    await this._loadSchedule();
    try {
      await this.hass.callService('mqtt', 'publish', {
        topic: `zigbee2mqtt/${mqttDevice}/get`,
        payload: JSON.stringify(Object.fromEntries(DAYS_OF_WEEK.map(day => [`schedule_${day}`, '']))), retain: false
      });
    } catch { this._error = 'Could not request receiver schedules. Check the MQTT integration and permissions.'; }
  }

  /**
   * Handle day selected from week/list view
   */
  private _handleDaySelected(e: CustomEvent<{ day: DayOfWeek }>): void {
    if (!this._saving) this._editingDay = e.detail.day;
  }

  /**
   * Handle schedule changed in day editor
   */
  private _handleScheduleChanged(e: CustomEvent<{ day: DayOfWeek; schedule: any }>): void {
    if (!this._schedule || this._saving) {
      return;
    }

    // Update the schedule for the specific day
    this._schedule = {
      ...this._schedule,
      [e.detail.day]: e.detail.schedule
    };

    // Mark as having unsaved changes
    this._message = null;
    this._updateDirty();
  }

  /**
   * Handle copy requested from day editor
   */
  private _handleCopyRequested(e: CustomEvent<{ day: DayOfWeek }>): void {
    if (this._saving) return;
    this._copySourceDay = e.detail.day;
    this._showCopyDialog = true;
  }

  /**
   * Handle copy confirmed from copy dialog
   */
  private _handleCopyConfirmed(e: CustomEvent<{ targetDays: DayOfWeek[] }>): void {
    if (!this._schedule || !this._copySourceDay || this._saving) {
      return;
    }

    // Get source day schedule
    const sourceSchedule = this._schedule[this._copySourceDay];

    // Copy to target days
    const updatedSchedule = { ...this._schedule };
    for (const day of e.detail.targetDays) {
      updatedSchedule[day] = {
        transitions: sourceSchedule.transitions.map(t => ({
          time: t.time,
          temperature: t.temperature
        }))
      };
    }

    this._schedule = updatedSchedule;
    this._message = null;
    this._updateDirty();

    // Close dialog
    this._handleDialogClosed();
  }

  /**
   * Handle day editor closed
   */
  private _handleEditorClosed(): void {
    this._editingDay = null;
  }

  /**
   * Handle copy dialog closed
   */
  private _handleDialogClosed(): void {
    this._showCopyDialog = false;
    this._copySourceDay = null;
  }

  /**
   * Save schedule to device - updated to use bulk update
   */
  private async _saveSchedule(): Promise<void> {
    if (this._saving || !this._schedule || !this._originalSchedule || !this._entities) return;
    if (this._conflicts.length || this._loadError) { this._error = 'Resolve receiver errors or reload conflicting schedules before saving.'; return; }
    const validation = validateWeeklySchedule(this._schedule);
    if (!validation.valid) { this._error = validation.errors.join('; '); return; }
    const generation = this._generation;
    const pending = this._deepCopySchedule(this._schedule);
    this._saving = true;
    this._editingDay = null;
    this._showCopyDialog = false;
    this._error = this._message = null;
    try {
      const mqttDevice = await this._getMqttDevice();
      // Discovery is asynchronous: a disconnected/reconfigured card must never publish.
      if (generation !== this._generation || !this.isConnected) return;
      const result = await this._coordinator.save(this._latestHass || this.hass, { ...this.config, mqtt_device: mqttDevice }, this._entities, this._originalSchedule, pending);
      if (generation !== this._generation) return;
      if (result.status !== 'skipped') {
        const baseline = this._deepCopySchedule(this._originalSchedule);
        for (const day of result.daysUpdated) baseline[day] = copyDaySchedule(pending[day]);
        this._originalSchedule = baseline;
      }
      if (result.status === 'error') this._error = result.error;
      else this._message = result.status === 'success' ? 'Saved and verified with Hive receiver.' : 'No schedule changes to save.';
      this._updateDirty();
    } catch (error) {
      if (generation === this._generation) this._error = error instanceof Error ? error.message : String(error);
    } finally {
      if (generation === this._generation) { this._saving = false; await this._loadSchedule(); }
    }
  }

  /**
   * Toggle view mode between week and graph
   */
  private _toggleViewMode(): void {
    this._viewMode = this._viewMode === 'week' ? 'graph' : 'week';
  }

  /**
   * Render the schedule view based on current state
   */
  private _renderScheduleView() {
    if (!this._schedule) {
      return this._loadError ? html`` : html`<div class="loading-spinner"><div class="spinner"></div></div>`;
    }

    if (this._viewMode === 'week') {
      return html`
        <hive-schedule-week-view
          .schedule=${this._schedule}
          .disabled=${this._saving}
          @day-selected=${this._handleDaySelected}
        ></hive-schedule-week-view>
      `;
    }

    return html`
      <hive-schedule-graph-view
        .schedule=${this._schedule}
        .disabled=${this._saving}
        @schedule-changed=${this._handleScheduleChanged}
        @copy-requested=${this._handleCopyRequested}
      ></hive-schedule-graph-view>
    `;
  }

  /**
   * Render the card
   */
  protected render() {
    if (!this.config) {
      return html`<ha-card>
        <div class="message message-error">
          Configuration required
        </div>
      </ha-card>`;
    }

    // Get entity info for display
    const entityInfo = this.hass ? getEntityInfo(this.hass, this.config.entity) : null;
    const cardTitle = this.config.name || entityInfo?.name || this.config.entity;

    return html`
      <ha-card>
        <div class="card-header">
          <span class="card-title">${cardTitle}</span>
          <div class="card-actions">
            <button class="button" ?disabled=${this._saving} @click=${this._reloadSchedule}>${this._hasUnsavedChanges ? 'Discard edits and reload' : 'Refresh'}</button>
            <button
              class="button button-icon"
              @click=${this._toggleViewMode}
              title="Toggle view mode"
            >
              ${this._viewMode === 'week' ? '📅' : '📊'}
            </button>
            <button
              class="button button-primary save-button ${this._saving ? 'loading' : ''}"
              @click=${this._saveSchedule}
              ?disabled=${!this._hasUnsavedChanges || this._saving || !this._originalSchedule || !!this._loadError || this._conflicts.length > 0 || !this.hass?.user?.is_admin}
            >
              ${this._saving ? 'Verifying...' : 'Save'}
            </button>
          </div>
        </div>

        <div class="card-content">
          ${this._error
            ? html`<div class="message message-error">${this._error}</div>`
            : ''}

          ${this._loadError ? html`<div class="message message-error">${this._loadError}</div>` : ''}
          ${this._conflicts.length ? html`<div class="message message-error">Receiver changed ${this._conflicts.join(', ')} while you were editing. Your edits are preserved. Reload before saving.</div>` : ''}
          ${!this.hass?.user?.is_admin ? html`<div class="message">Sign in as an administrator to verify and save schedules.</div>` : ''}
          ${this._message ? html`<div class="message" role="status">${this._message}</div>` : ''}
          ${this._renderScheduleView()}
        </div>
      </ha-card>

      ${this._schedule && this._editingDay
        ? html`
            <hive-day-schedule-editor
              .day=${this._editingDay}
              .schedule=${this._schedule[this._editingDay]}
              .open=${true}
              @schedule-changed=${this._handleScheduleChanged}
              @copy-requested=${this._handleCopyRequested}
              @editor-closed=${this._handleEditorClosed}
            ></hive-day-schedule-editor>
          `
        : ''}

      ${this._showCopyDialog && this._copySourceDay
        ? html`
            <hive-copy-schedule-dialog
              .sourceDay=${this._copySourceDay}
              .open=${true}
              @copy-confirmed=${this._handleCopyConfirmed}
              @dialog-closed=${this._handleDialogClosed}
            ></hive-copy-schedule-dialog>
          `
        : ''}
    `;
  }
}

// Declare custom element for TypeScript
declare global {
  interface HTMLElementTagNameMap {
    'hive-scheduler-card': HiveSchedulerCard;
  }
}
