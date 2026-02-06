# Feature Plan: Referral Reward System (v2)

This plan details the implementation of the Referral Reward System using **Vertical Slice Architecture** and the **Command Pattern**.

## 1. Slice Boundary & State
The `Referral` slice owns the lifecycle of a referral: from link generation to reward evaluation.

### Schema (Zod)
```ts
const ReferralCodeSchema = zod.string().min(5).max(10);
const PurchaseTypeSchema = zod.enum(['standard', 'subscription']);
```

### Persistence (Hypothetical)
- `referral_links`: `userId`, `code`
- `referrals`: `referrerId`, `refereeId`, `codeUsed`, `status` (pending | rewarded)

---

## 2. Command Pattern Implementation

### Command 1: `CreateReferralLinkCommand`
**Intent:** Generate a unique code for a user to share.
- **Input:** `userId`
- **Validation:** Ensure user exists; check if they already have a code.
- **Action:** Generate slug (e.g., `LUIS123`), save to `referral_links`.

### Command 2: `ApplyReferralLinkCommand`
**Intent:** Link a new user to their referrer during signup.
- **Input:** `refereeId`, `referralCode`
- **Validation:**
    - `referralCode` must exist.
    - `referrerId !== refereeId` (No self-referral).
- **Action:** Record mapping in `referrals` table with status `pending`.

### Command 3: `ProcessReferralRewardCommand`
**Intent:** Evaluate a completed purchase to trigger the reward.
- **Input:** `refereeId`, `purchaseType`
- **Logic:**
    - Find `pending` referral for `refereeId`.
    - Determine reward amount:
        - `standard` -> $10
        - `subscription` -> $25
    - **Action:**
        - Update status to `rewarded`.
        - Emit `ReferralRewardEarned { referrerId, amount, refereeId }`.
        - Check if Referrer total success > 10; if so, emit `ReferrerMilestoneReached { referrerId, milestone: 'TOP_REFERRER' }`.

---

## 3. Communication (Event Bus)
The slice maintains functional purity by not touching other domains (Billing, UI).

### Emitted Events
- `REFERRAL_REWARD_EARNED`: Consumed by `Billing` to add credits.
- `REFERRER_MILESTONE_REACHED`: Consumed by `Gamification/Profile` to award badges.

---

## 4. Public API
```ts
// modules/referral/referral.public.ts
export const referralApi = {
  createLink: createReferralLinkCommand,
  applyCode: applyReferralLinkCommand,
  processPurchase: processReferralRewardCommand,
};
```
