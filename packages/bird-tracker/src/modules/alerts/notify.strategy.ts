// src/modules/alerts/notify.strategy.ts (STRATEGY PATTERN)
export type NotificationStrategy = (message: string) => void;

export const emailStrategy: NotificationStrategy = (msg) => console.log(`[Email] Sending: ${msg}`);
export const smsStrategy: NotificationStrategy = (msg) => console.log(`[SMS] Sending: ${msg}`);
