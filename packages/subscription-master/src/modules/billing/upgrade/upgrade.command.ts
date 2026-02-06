import { eventBus } from "../../../shared/event-bus";
import { log } from "../../../shared/logger";
import { PaymentStrategy } from "./strategies/stripe.strategy";
import { upgradeSchema } from "./upgrade.schema";

// Internal "Database"
const userPlans: Record<string, string> = {
  "user-1": "free",
};

export const createUpgradeCommand = (userId: string, plan: string, strategy: PaymentStrategy) => {
  // Validate input using Zod as required by the patterns
  const validation = upgradeSchema.safeParse({ userId, plan });

  if (!validation.success) {
    throw new Error(`Validation failed: ${validation.error.issues.map(e => e.message).join(", ")}`);
  }

  const data = validation.data;

  return {
    name: "UpgradeUser",
    data: data,
    execute: async () => {
      log(`Executing UpgradeUser command for user ${data.userId} to plan ${data.plan}...`);

      const price = data.plan === "pro" ? 20 : 50;
      const result = await strategy(price);

      if (result.success) {
        userPlans[data.userId] = data.plan;
        log(`Database updated: User ${data.userId} is now on ${data.plan} plan.`);
        eventBus.emit("SUBSCRIPTION_UPGRADED", { userId: data.userId, plan: data.plan });
      } else {
        log(`Upgrade failed for user ${userId}.`);
      }
    },
  };
};

export const getSubscriptionStatusInternal = (userId: string) => {
  return userPlans[userId] || "none";
};
