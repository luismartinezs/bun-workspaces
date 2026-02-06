export type BillingService = {
  getSubscriptionStatus: (userId: string) => Promise<string>;
};
