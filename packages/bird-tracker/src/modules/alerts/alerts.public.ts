// src/modules/alerts/alerts.public.ts (PUBLIC API)
import { setupAlerts } from './alert-handler';
import { emailStrategy, smsStrategy, NotificationStrategy } from './notify.strategy';

export const alertsApi = {
  setupAlerts
};

export const notificationStrategies = {
  email: emailStrategy,
  sms: smsStrategy
};

export type { NotificationStrategy };
