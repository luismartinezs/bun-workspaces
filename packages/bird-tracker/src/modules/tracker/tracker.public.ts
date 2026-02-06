// src/modules/tracker/tracker.public.ts (PUBLIC API)
import { TrackerContract } from './tracker.contract';
export { createRecordSightingCommand } from './record-sighting.command';

export const trackerApi = {
  getRecentStats: (): TrackerContract => ({
    getRecentStats: () => ({ totalCount: 42 })
  })
};
