import { BillingService } from "./billing.contract";
import { createUpgradeCommand, getSubscriptionStatusInternal } from "./upgrade/upgrade.command";

export { createUpgradeCommand };
export type { BillingService };

export const billingService: BillingService = {
  getSubscriptionStatus: async (userId: string) => {
    return getSubscriptionStatusInternal(userId);
  },
};
