export type AppEvents = {
  'USER_LOGGED_IN': { username: string };
};

type Listener<K extends keyof AppEvents> = (data: AppEvents[K]) => void;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const listeners: Record<string, Listener<any>[]> = {};

export const eventBus = {
  on: <K extends keyof AppEvents>(event: K, callback: Listener<K>) => {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(callback);
  },
  emit: <K extends keyof AppEvents>(event: K, data: AppEvents[K]) => {
    listeners[event]?.forEach(cb => cb(data));
  }
};
