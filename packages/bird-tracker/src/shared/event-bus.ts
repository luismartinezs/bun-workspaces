// src/shared/event-bus.ts
type AppEvents = {
  BIRD_SPOTTED: { species: string; location: string; rarity: 'common' | 'rare' };
};

const listeners: Record<string, ((data: any) => void)[]> = {};

export const eventBus = {
  on: <K extends keyof AppEvents>(event: K, cb: (data: AppEvents[K]) => void) => {
    listeners[event] = [...(listeners[event] || []), cb];
  },
  emit: <K extends keyof AppEvents>(event: K, data: AppEvents[K]) => {
    listeners[event]?.forEach((cb) => cb(data));
  }
};
