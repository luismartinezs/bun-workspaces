import { eventBus } from "../../shared/event-bus";
import { log } from "../../shared/logger";
import { BillingService } from "../billing";

export const setupNotificationListener = (billingService: BillingService) => {
  eventBus.on("SUBSCRIPTION_UPGRADED", async ({ userId, plan }) => {
    log(`Notification Listener: Received SUBSCRIPTION_UPGRADED for user ${userId}.`);

    // Use the contract to fetch the new status
    const status = await billingService.getSubscriptionStatus(userId);

    log(`Notification: User ${userId} is now ${status}! (Plan: ${plan})`);
  });
};
