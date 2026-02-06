import type { BillingService } from "./billing.contract";
import { createUpgradeCommand, getSubscriptionStatusInternal } from "./upgrade/upgrade.command";
import { stripePayment } from "./upgrade/strategies/stripe.strategy";
import { paypalPayment } from "./upgrade/strategies/paypal.strategy";

export { createUpgradeCommand, stripePayment, paypalPayment };
export type { BillingService };

export const billingService: BillingService = {
  getSubscriptionStatus: async (userId: string) => {
    return getSubscriptionStatusInternal(userId);
  },
};
