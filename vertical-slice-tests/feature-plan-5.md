# Feature Plan: Referral Reward System

This plan outlines the implementation of the Referral Reward System using Vertical Slice Architecture and Functional TypeScript.

## Architectural Friction

To protect the integrity of the vertical slices, we implement "Architectural Friction" using automated tools. This ensures that developers cannot accidentally violate the boundary rules without the build failing.

### 1. ESLint: Horizontal Import Blocking
We use `eslint-plugin-import` with `no-restricted-paths` to prevent "side-loading" logic between slices.
- **Rule**: A file in `modules/referrals/creation` cannot import from `modules/referrals/rewarding` or `modules/payments`.
- **Enforcement**:
```json
"import/no-restricted-paths": [
  "error",
  {
    "zones": [
      {
        "target": "./src/modules/referrals/**/*",
        "from": "./src/modules/payments/**/*",
        "message": "Referrals must only interact with Payments via the Event Bus or Service Contracts."
      }
    ]
  }
]
```

### 2. Dependency-Cruiser: Public API Enforcement
Dependency-Cruiser ensures that internal slice files are only reachable through the `public.ts` file.
- **Rule**: Any import from outside the `referrals` module that doesn't target `referrals.public.ts` or `index.ts` will fail.
- **Goal**: Prevent deep-linking into internal command logic.

---

## Folder Structure & Naming Conventions

### Structure
```
src/modules/referrals/
├── referrals.public.ts      <-- [Public API] Exports available actions
├── referrals.contract.ts    <-- [Service Contract] Shared types (e.g., ReferralStats)
├── index.ts                 <-- Re-exports Public API
├── creation/                <-- Slice: Generating referral links
│   ├── create-link.command.ts
│   └── create-link.schema.ts
├── rewarding/               <-- Slice: Processing rewards on purchase
│   ├── process-reward.command.ts
│   └── strategies/          <-- [Strategy Pattern]
│       ├── standard.ts      <-- $10 Credit
│       └── subscription.ts  <-- $25 Credit
└── tracking/                <-- Slice: Stats and Badges
    └── get-stats.command.ts
```

### Naming Standards
- **Public API**: `[module].public.ts` (e.g., `referrals.public.ts`).
- **Commands**: `[action].command.ts` (e.g., `process-reward.command.ts`).
- **Schemas**: `[action].schema.ts` (Zod validation).

---

## Junior Developer Guide: Implementing with CommandRunner

The `CommandRunner` is a utility that wraps your logic to provide automatic logging, performance tracking, and error handling. Follow these steps to implement the **Process Reward** logic.

### Step 1: Define the Command
Create an object that matches the `Command` interface. It must have a `name`, `data`, and an `execute` function.

```typescript
// modules/referrals/rewarding/process-reward.command.ts
import { Command } from '../../../shared/command-runner';
import { rewardSchema } from './reward.schema';

export const createProcessRewardCommand = (input: unknown): Command => {
  const data = rewardSchema.parse(input); // Validate immediately

  return {
    name: 'ProcessReferralReward',
    data,
    execute: async () => {
      // 1. Identify valid strategy (Standard vs Subscription)
      // 2. Apply Credit to Referrer
      // 3. Update Referral Status
      return { success: true };
    }
  };
};
```

### Step 2: Use the CommandRunner in the Composition Root
Never call `command.execute()` directly. Always pass the command to the `CommandRunner`.

```typescript
// src/main.ts (Composition Root)
import { createCommandRunner } from './shared/command-runner';
import { createProcessRewardCommand } from './modules/referrals/rewarding/process-reward.command';

const runCommand = createCommandRunner(console.log);

// Triggered by 'PAYMENT_SUCCESS' event
eventBus.on('PAYMENT_SUCCESS', async (payload) => {
  const command = createProcessRewardCommand({
    referralId: payload.referralId,
    purchaseType: payload.type
  });

  await runCommand(command); // Handles logging & errors automatically
});
```

### Step 3: Implement the Strategy Pattern for Reward Amounts
Don't use `if/else` for reward types. Use the Reward Strategies.
- `standard.ts`: Returns `$10`.
- `subscription.ts`: Returns `$25`.

The `process-reward.command.ts` should simply select the strategy based on the `purchaseType`.
