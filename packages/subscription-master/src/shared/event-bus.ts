type Events = {
  SUBSCRIPTION_UPGRADED: { userId: string; plan: string };
};

type Handler<T> = (data: T) => void | Promise<void>;

const listeners: { [K in keyof Events]?: Handler<Events[K]>[] } = {};

export const eventBus = {
  on: <K extends keyof Events>(event: K, handler: Handler<Events[K]>) => {
    if (!listeners[event]) {
      listeners[event] = [];
    }
    listeners[event]?.push(handler);
  },

  emit: <K extends keyof Events>(event: K, data: Events[K]) => {
    listeners[event]?.forEach((handler) => handler(data));
  },
};
