import { log } from "../../../../shared/logger";
import type { PaymentStrategy } from "./stripe.strategy";

export const paypalPayment: PaymentStrategy = async (amount: number) => {
  log(`Processing PayPal payment of $${amount}...`);
  // Simulate API call
  return { success: true };
};
