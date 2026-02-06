// src/main.ts
import { eventBus } from './shared/event-bus';
import { trackerApi, createRecordSightingCommand } from './modules/tracker';
import { alertsApi, notificationStrategies } from './modules/alerts';

const main = async () => {
  console.log('--- Bird Tracker Starting ---');

  // 1. COMPOSITION: Wire the Alert system to the Tracker via the Contract
  // We choose the SMS strategy here.
  const trackerService = trackerApi.getRecentStats();
  const onBirdSpotted = alertsApi.setupAlerts(trackerService, notificationStrategies.sms);

  // 2. OBSERVER: Connect the alert handler to the global event bus
  eventBus.on('BIRD_SPOTTED', onBirdSpotted);

  // 3. EXECUTION: Run a command
  // This could be triggered by a UI button or an API call
  const sighting = createRecordSightingCommand({ species: 'Golden Eagle', rarity: 'rare' });
  await sighting.execute();

  console.log('--- Bird Tracker Execution Finished ---');
};

main();
