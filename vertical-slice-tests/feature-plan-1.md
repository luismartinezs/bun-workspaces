# Feature Plan: Referral Reward System

This plan outlines the implementation of the Referral Reward System using Vertical Slice Architecture (VSA). The focus is on a decoupled design where the `referrals` module reacts to events from `auth` and `payments` without direct horizontal coupling.

## Service Contract (`referrals.contract.ts`)

The `ReferralContract` defines what the `referrals` module exposes to the rest of the application.

```typescript
import { z } from 'zod';

export const ReferralStatsSchema = z.object({
  userId: z.string(),
  successfulReferrals: z.number(),
  isTopReferrer: z.boolean(), // true if > 10
});

export type ReferralStats = z.infer<typeof ReferralStatsSchema>;

export type ReferralContract = {
  getStats: (userId: string) => Promise<ReferralStats>;
  /**
   * Internal logic might use this, but typically links are created
   * via events. This is exposed for manual overrides or admin tools.
   */
  trackReferral: (referrerId: string, refereeId: string) => Promise<void>;
};
```

## Public API (`referrals.public.ts`)

Only these functions/types are accessible from other modules.

```typescript
import { ReferralContract } from './referrals.contract';

export const referralApi = {
  // Publicly exposed commands/queries
  getStats: async (userId: string) => { /* ... */ },
};

export type { ReferralContract };
```

## Event Bus Integration

The `referrals` module communicates primarily through the global `event-bus`.

### Consumed Events
The module listens for these to trigger its logic:

1. **`USER_SIGNED_UP`**
   - **Data**: `{ userId: string, referralCode?: string }`
   - **Action**: If `referralCode` is present, look up the `referrerId` and create a pending referral link.

2. **`PAYMENT_SUCCESS`**
   - **Data**: `{ userId: string, amount: number, type: 'standard' | 'subscription', isFirstPurchase: boolean }`
   - **Action**: If `isFirstPurchase` is true, check if this user has a pending referral link. If yes, grant `Bonus Credit` to the Referrer based on the `type`.

### Emitted Events
The module emits these when its internal state changes:

1. **`REFERRAL_REWARD_GRANTED`**
   - **Data**: `{ referrerId: string, refereeId: string, creditAmount: number }`
   - **Purpose**: Allows the billing system to apply credit.

2. **`TOP_REFERRER_STATUS_REACHED`**
   - **Data**: `{ userId: string }`
   - **Purpose**: Triggers badge assignment or special UI alerts.

## Example Slice: `track-signup`

This slice demonstrates functional purity, Zod validation, and zero side-effects.

### `track-signup.schema.ts`
```typescript
import { z } from 'zod';

export const TrackSignupSchema = z.object({
  userId: z.string().uuid(),
  referralCode: z.string().optional(),
});
```

### `track-signup.command.ts`
```typescript
import { TrackSignupSchema } from './track-signup.schema';

export const createTrackSignupCommand = (input: unknown) => {
  return {
    execute: async () => {
      const data = TrackSignupSchema.parse(input);
      if (data.referralCode) {
        // Internal logic to look up referrer and link users
      }
    }
  };
};
```

## Zero Horizontal Coupling Strategy

- **No Imports from Auth/Payments**: The `referrals` module will NOT import `authApi` or `paymentApi`. It relies purely on data provided in events.
- **Dependency Inversion**: If `referrals` needs to "apply credit", it doesn't call `paymentApi.applyCredit()`. Instead, it emits `REFERRAL_REWARD_GRANTED`, and the billing system listens.
- **Composition Root**: Wiring the event listeners happens in `src/main.ts`.

## Verification Plan

### Automated Tests
1. **Unit Tests for Slices**: Each command will have a `.spec.ts` using mocked data.
2. **Integration Test**: Simulate `USER_SIGNED_UP` and `PAYMENT_SUCCESS` events and verify `REFERRAL_REWARD_GRANTED` is emitted.

### Manual Verification
- Trigger a mock signup with a referral code.
- Trigger a mock first purchase (standard and subscription).
- Verify the correct credits are calculated.
