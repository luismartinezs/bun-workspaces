// src/modules/alerts/alert-handler.ts (CONSUMING THE CONTRACT)
import { TrackerContract } from '../tracker';
import { NotificationStrategy } from './notify.strategy';

export const setupAlerts = (tracker: TrackerContract, strategy: NotificationStrategy) => {
  // Logic: When a bird is spotted, check stats and notify
  return (data: { species: string; rarity: string }) => {
    if (data.rarity === 'rare') {
      const stats = tracker.getRecentStats();
      strategy(`RARE BIRD ALERT: ${data.species}! Total sightings today: ${stats.totalCount}`);
    }
  };
};
