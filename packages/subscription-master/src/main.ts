import { log } from "./shared/logger";
import { billingService, createUpgradeCommand, stripePayment, paypalPayment } from "./modules/billing";
import { setupNotificationListener } from "./modules/notifications";
import { createCommandRunner } from "./shared/command-runner";

async function main() {
  log("Starting Subscription Master...");

  // Setup global infrastructure
  const run = createCommandRunner(console.log);

  // 1. Setup Notification Listener with the Billing Contract
  setupNotificationListener(billingService);

  // 2. Choose a Strategy (Stripe or PayPal)
  const strategy = paypalPayment; // Toggle this to paypalPayment to demonstrate Strategy Pattern

  log(`Selected strategy: ${strategy === stripePayment ? "Stripe" : "PayPal"}`);

  // 3. Create a Command for a specific user
  const userId = "user-1";
  const targetPlan = "pro";

  const upgradeCommand = createUpgradeCommand(userId, targetPlan, strategy);

  // 4. Execute the Command
  log(`Executing command: ${upgradeCommand.name}`);
  await run(upgradeCommand);

  log("Subscription Master demo completed.");
}

main().catch(console.error);
