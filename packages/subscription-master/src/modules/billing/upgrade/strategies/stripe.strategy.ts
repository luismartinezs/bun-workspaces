import { log } from "../../../../shared/logger";

export type PaymentStrategy = (amount: number) => Promise<{ success: boolean }>;

export const stripePayment: PaymentStrategy = async (amount: number) => {
  log(`Processing Stripe payment of $${amount}...`);
  // Simulate API call
  return { success: true };
};
