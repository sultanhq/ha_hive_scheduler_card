import { LitElement, html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { editorStyles } from './styles/card-styles';
import { DAYS_OF_WEEK, type DayOfWeek, type HomeAssistant, type HiveSchedulerCardConfig } from './models/types';

/**
 * Configuration editor for Hive Scheduler Card
 *
 * Provides a graphical interface for configuring the card:
 * - Entity picker (climate entities only)
 * - Name input (optional card title override)
 * - Default view mode selector (week/graph)
 */
@customElement('hive-scheduler-card-editor')
export class HiveSchedulerCardEditor extends LitElement {
  static styles = editorStyles;

  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: HiveSchedulerCardConfig;
  @state() private _entityPickerAvailable = true;
  private readonly _climateDomains = ['climate'];

  /**
   * Set configuration
   * Called by Home Assistant when the card is configured
   */
  public setConfig(config: HiveSchedulerCardConfig): void {
    this._config = {
      ...config,
      type: 'custom:hive-scheduler-card',
    };
  }

  /**
   * Dispatch config-changed event to Home Assistant
   * This notifies HA that the configuration has been updated
   */
  private _configChanged(): void {
    const event = new CustomEvent('config-changed', {
      bubbles: true,
      composed: true,
      detail: { config: this._config },
    });
    this.dispatchEvent(event);
  }

  /**
   * Handle entity picker change
   */
  private _entityChanged(e: Event): void {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    const value = (e as CustomEvent).detail?.value ?? (target as any).value;

    if (typeof value !== 'string') return;

    if (value === this._config.entity) {
      return;
    }

    this._config = {
      ...this._config,
      entity: value,
    };
    delete this._config.mqtt_device;

    this._configChanged();
  }

  /**
   * Handle name input change
   */
  private _nameChanged(e: Event): void {
    const target = e.target as HTMLInputElement;
    const value = target.value;

    if (value === this._config.name) {
      return;
    }

    this._config = {
      ...this._config,
      name: value || undefined,
    };

    this._configChanged();
  }

  /**
   * Handle view mode select change
   */
  private _viewModeChanged(e: Event): void {
    const target = e.target as HTMLSelectElement;
    const value = target.value as 'week' | 'graph';

    if (value === this._config.view_mode) {
      return;
    }

    this._config = {
      ...this._config,
      view_mode: value,
    };

    this._configChanged();
  }

  private _scheduleEntityChanged(day: DayOfWeek, e: Event): void {
    const entities = { ...this._config.schedule_entities };
    const value = (e.target as HTMLInputElement).value;
    if (value) entities[day] = value; else delete entities[day];
    this._config = { ...this._config, schedule_entities: entities };
    this._configChanged();
  }

  /**
   * Handle fallback entity select change (when ha-entity-picker is not available)
   */
  private _entitySelectChanged(e: Event): void {
    const target = e.target as HTMLSelectElement;
    this._entityChanged(e);
  }

  /**
   * Get all climate entities
   * Used for fallback entity picker
   */
  private _getClimateEntities(): Array<{ id: string; name: string }> {
    if (!this.hass) {
      return [];
    }

    return Object.keys(this.hass.states)
      .filter((entityId) => entityId.startsWith('climate.'))
      .map((entityId) => {
        const state = this.hass.states[entityId];
        const friendlyName = state.attributes.friendly_name;
        return {
          id: entityId,
          name: (typeof friendlyName === 'string' ? friendlyName : entityId) as string,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Render entity picker (with fallback)
   */
  private _renderEntityPicker(): TemplateResult {
    // Try to use ha-entity-picker if available
    if (this._entityPickerAvailable) {
      return html`
        <ha-entity-picker
          .hass=${this.hass}
          .value=${this._config.entity}
          .includeDomains=${this._climateDomains}
          @value-changed=${this._entityChanged}
          allow-custom-entity
        ></ha-entity-picker>
      `;
    }

    // Fallback to standard select
    const climateEntities = this._getClimateEntities();

    if (climateEntities.length === 0) {
      return html`
        <input
          type="text"
          class="editor-input"
          .value=${this._config.entity || ''}
          @input=${this._entityChanged}
          placeholder="climate.your_hive"
        />
        <div class="editor-description">
          No climate entities found. Enter the entity ID manually.
        </div>
      `;
    }

    return html`
      <select
        class="editor-select"
        .value=${this._config.entity || ''}
        @change=${this._entitySelectChanged}
      >
        <option value="">Select an entity...</option>
        ${climateEntities.map(
          (entity) => html`
            <option value=${entity.id} ?selected=${entity.id === this._config.entity}>
              ${entity.name}
            </option>
          `
        )}
      </select>
    `;
  }

  /**
   * Handle entity picker error (fallback to select)
   */
  protected firstUpdated(): void {
    // Check if ha-entity-picker is available
    if (!customElements.get('ha-entity-picker')) {
      this._entityPickerAvailable = false;
    }
  }

  protected render(): TemplateResult {
    if (!this.hass || !this._config) {
      return html``;
    }

    return html`
      <div class="editor-container">
        <!-- Entity Picker -->
        <div class="editor-row">
          <label class="editor-label">
            Entity
          </label>
          ${this._renderEntityPicker()}
          <div class="editor-description">
            Select the Hive SLR1c climate entity. The Zigbee2MQTT receiver is discovered automatically.
          </div>
        </div>

        <!-- Name Input -->
        <div class="editor-row">
          <label class="editor-label">
            Name (optional)
          </label>
          <input
            type="text"
            class="editor-input"
            .value=${this._config.name || ''}
            @input=${this._nameChanged}
            placeholder="Living Room Heating"
          />
          <div class="editor-description">
            Override the card title. Leave empty to use the entity name.
          </div>
        </div>

        <!-- View Mode Selector -->
        <div class="editor-row">
          <label class="editor-label">
            Default View Mode
          </label>
          <select
            class="editor-select"
            .value=${this._config.view_mode || 'week'}
            @change=${this._viewModeChanged}
          >
            <option value="week">Week View</option>
            <option value="graph">Graph View</option>
          </select>
          <div class="editor-description">
            Choose the default view when the card loads. Week view shows a calendar grid,
            graph view shows an interactive temperature chart.
          </div>
        </div>

        <details>
          <summary>Schedule entity overrides (optional)</summary>
          <div class="editor-description">Automatically discovered on the climate device. Set overrides for renamed or ambiguous entities.</div>
          ${DAYS_OF_WEEK.map(day => html`<div class="editor-row">
            <label class="editor-label">${day}</label>
            <input class="editor-input" .value=${this._config.schedule_entities?.[day] || ''}
              @input=${(e: Event) => this._scheduleEntityChanged(day, e)} placeholder=${`text.hive_schedule_${day}`} />
          </div>`)}
        </details>
      </div>
    `;
  }
}

/**
 * Register the card in window.customCards for card picker
 * This allows Home Assistant to discover the card in the UI
 */
declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
      documentationURL?: string;
    }>;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'hive-scheduler-card',
  name: 'Hive Scheduler Card',
  description: 'Manage weekly heating schedules for Hive SLR1c thermostats',
  preview: false,
  documentationURL: 'https://github.com/sultanhq/ha_hive_scheduler_card',
});
