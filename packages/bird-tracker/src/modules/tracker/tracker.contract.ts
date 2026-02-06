// src/modules/tracker/tracker.contract.ts
export type TrackerContract = {
  getRecentStats: () => { totalCount: number };
};
