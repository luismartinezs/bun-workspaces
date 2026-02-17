# Feature Plan: Referral Reward System

This plan outlines the implementation of the Referral Reward System using Vertical Slice Architecture. The goal is to incentivize users via a decoupled, event-driven system where the referral slice can be completely removed from `main.ts` without affecting other modules.

## User Review Required

> [!IMPORTANT]
> **Event Bus Expansion**: We will need to add `PURCHASE_COMPLETED` and `REFERRAL_CREATED` events to the global `event-bus.ts`.
> **State Persistence**: This plan assumes a simple internal state for tracking referrals in this demo. In a production app, this would use a database slice.

## Proposed Changes

### Composition Root (main.ts)
We will wire the referral system by passing the required contracts and setting up event listeners.

#### [MODIFY] [main.ts](file:///home/luis/APPS/vertical-slice-patterns/packages/subscription-master/src/main.ts)
- Import `setupReferralListeners` from the referrals module.
- Initialize the referral system after billing and other core services.

```ts
// src/main.ts
import { setupReferralListeners } from "./modules/referrals";

// inside main()
setupReferralListeners(billingService);
```

---

### Internal Slice: Referrals
Location: `packages/subscription-master/src/modules/referrals`

#### [NEW] [referrals.contract.ts](file:///home/luis/APPS/vertical-slice-patterns/packages/subscription-master/src/modules/referrals/referrals.contract.ts)
Defines what the referral system provides to the outside world (usually for the UI or other slices to check stats).

#### [NEW] [referrals.public.ts](file:///home/luis/APPS/vertical-slice-patterns/packages/subscription-master/src/modules/referrals/referrals.public.ts)
The entry point for the module.
- Exports `setupReferralListeners`.
- Exports `referralService` (to check badge status).

#### [NEW] [create-link/](file:///home/luis/APPS/vertical-slice-patterns/packages/subscription-master/src/modules/referrals/create-link/)
- `create-link.command.ts`: Handles the creation of a referral link when a user provides a code during signup.
- `create-link.schema.ts`: Zod validation for the referral code.

#### [NEW] [process-reward/](file:///home/luis/APPS/vertical-slice-patterns/packages/subscription-master/src/modules/referrals/process-reward/)
- `process-reward.command.ts`: Internal logic to credit the referrer when a referee completes their first purchase.
- Subscribes to `PURCHASE_COMPLETED` via the event bus (wired in `setupReferralListeners`).

---

### Shared Infrastructure

#### [MODIFY] [event-bus.ts](file:///home/luis/APPS/vertical-slice-patterns/packages/subscription-master/src/shared/event-bus.ts)
- Add new event types:
  - `PURCHASE_COMPLETED`: `{ userId: string; purchaseType: 'standard' | 'subscription'; amount: number }`
  - `REFERRAL_CREATED`: `{ referrerId: string; refereeId: string }`

## Verification Plan

### Automated Tests
- Run `bun test` to ensure all existing slices still pass.
- Create `packages/subscription-master/src/modules/referrals/referrals.spec.ts` to test:
  1. Referral link creation.
  2. Reward calculation ($10 vs $25).
  3. Badge status (Top Referrer after 10).

### Manual Verification
1. Open `main.ts` and ensure the referral module can be commented out without compiler errors.
2. Emit a `PURCHASE_COMPLETED` event via a mock in `main.ts` and verify logs show the reward being processed.
