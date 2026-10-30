/**
 * Hive Scheduler Card - Entry Point
 *
 * This file imports and registers all custom elements for the Hive Scheduler Card.
 * Components automatically register themselves via the @customElement decorator.
 */

// Import main card and editor (these also import their dependencies)
import { HiveSchedulerCard } from './card';
import { HiveSchedulerCardEditor } from './editor';
import './boost-card.js';

// Import all child components (auto-register via @customElement decorator)
import './components/schedule-week-view';
import './components/schedule-graph-view';
import './components/day-schedule-editor';
import './components/transition-editor';
import './components/copy-schedule-dialog';



// Export main card class for potential external use
export { HiveSchedulerCard, HiveSchedulerCardEditor };
