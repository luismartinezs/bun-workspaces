# Implementation Plan: Referral Reward System

## Overview
We are implementing a Referral Reward System that grants "Bonus Credits" to referrers when their referees make their first purchase.

## Design Patterns

### 1. Observer Pattern (Purchase Trigger)
The system will listen for a `PURCHASE_COMPLETED` event via a central `eventBus`. This ensures the referral module is decoupled from the purchase module.

### 2. Strategy Pattern (Variable rewards)
Different purchase types result in different reward amounts. We use a functional Strategy pattern to handle this:
- `standardRewardStrategy`: $10 credit.
- `subscriptionRewardStrategy`: $25 credit.

### 3. Command Pattern (Referral Execution)
The actual rewarding process is encapsulated in an `ExecuteReferralCommand`. This command groups validation, reward calculation (using a strategy), and persistence.

## Proposed Structure (Vertical Slice)

```
packages/referral-system/src/
├── shared/
│   └── event-bus.ts         <-- [Observer]
├── referral.contract.ts     <-- [Service Contract]
├── referral.public.ts       <-- [Public API]
├── execute-referral/        <-- Vertical Slice
│   ├── execute-referral.command.ts <-- [Command]
│   ├── execute-referral.schema.ts  <-- [Zod Validation]
│   └── strategies/          <-- [Strategy]
│       ├── reward.strategy.ts
│       ├── standard.ts
│       └── subscription.ts
└── main.ts                  <-- [Composition Root]
```

## Functional TypeScript Rules
- **No classes**: Use factory functions and closures.
- **Pure Functions**: Strategies will be pure functions mapping input to reward amount.
- **Zod**: All command inputs will be validated using Zod schemas.

## Verification
- **Unit tests**: Individual strategies and command logic.
- **Integration**: `main.ts` simulation emitting events and verifying state changes.
