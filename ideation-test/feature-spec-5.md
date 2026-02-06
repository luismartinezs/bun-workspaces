# Logic Specification: Smart Recurring Tasks

This document defines the business logic and state transitions for the "Don't Guilt Trip Me" recurring task feature. The goal is to eliminate "task debt" by ensuring only one active instance exists and scheduling future instances relative to actual completion.

## Core Logic: Relative Recurrence
When a task marked as "Smart Recurrence" is completed, the next instance's due date is calculated as:
`NextDueDate = Max(ActualCompletionDate, ManualCompletionDate) + Interval`

---

## 1. The 'Friday' Problem (Weekend Skipping)
**Scenario:** A daily task with `skip_weekends: true` becomes overdue on Friday.
**Problem:** Does the next instance move to Saturday (invalid) or Monday?

### Correct System Behavior:
1.  **Overdue State:** If Friday 23:59 passes and the task is not completed, it remains overdue. It does *not* automatically roll its due date to Monday unless the user has an "auto-reschedule overdue" setting (out of scope for now).
2.  **Next Instance Calculation:**
    *   If the user completes the Friday task on Friday, Saturday, or Sunday:
        *   Intermediate calculation: `TargetDate = Today + 1 day`.
        *   **Validation Path:** If `TargetDate` is Saturday or Sunday, it moves to the **Next Monday**.
    *   **Result:** The user is never presented with a task due on a weekend if `skip_weekends` is enabled.

---

## 2. The 'Time Travel' Problem (Manual Date Overrides)
**Scenario:** A user completes a task today but sets the `completed_at` date to 3 days ago.
**Problem:** When does the next one appear if it's a daily task?

### Correct System Behavior:
1.  **Trust the User (with Safeguards):** We calculate the next due date based on the `ManualCompletionDate`.
2.  **Immediate Overdue Prevention:**
    *   If `ManualCompletionDate + Interval <= CurrentTime`, the next instance would be immediately overdue.
    *   To prevent "guilt-tripping," the system MUST check:
        `NextDueDate = Max(ActualTimeOfAction, ManualCompletionDate + Interval)`
    *   **Example 1 (Daily):** Today is Thursday. I mark Wednesday's task done *for* Wednesday. Next due = Wednesday + 1 day = Thursday (Today). This is acceptable as it matches the current day's requirement.
    *   **Example 2 (Daily):** Today is Thursday. I mark Monday's task done *for* Monday. Next due = Max(Thursday, Monday + 1) = Thursday.
    *   **Logic:** A "Smart" task can never spawn a new instance that is *already* overdue at the moment of creation.

---

## 3. The 'Un-check' Problem (State Reversal)
**Scenario:** User marks a task done, a new instance spawns, then the user un-checks the original.
**Problem:** What happens to the spawned instance?

### Correct System Behavior:
1.  **Atomic Reversal:** The completion and spawning are linked by a `parent_instance_id` or similar metadata.
2.  **Cleanup Path:**
    *   When a task is "un-checked" (status moved back to `PENDING`):
    *   Find any *incomplete* child instances spawned by this specific completion event.
    *   **Delete** the child instance.
3.  **Conflict Handling:**
    *   If the child instance has *already* been completed or modified by the user, the "un-check" of the parent is **blocked** or requires a confirmation: "Un-checking this will not remove the subsequent task you already started/finished. Proceed?"
    *   Recommended default for "Radical Simplicity": Delete the child only if it is in default `PENDING` state with no user modifications.

---

## Data Validation (Zod Schema approach)
```typescript
const RecurringTaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  intervalDays: z.number().int().positive(),
  skipWeekends: z.boolean(),
  mode: z.enum(['SMART', 'STRICT']),
  status: z.enum(['PENDING', 'COMPLETED']),
  dueDate: z.date(),
  completedAt: z.date().optional(),
  parentCompletionId: z.string().optional(), // For the Un-check Problem
});
```

## Functional Logic (Pseudo-code)
```typescript
/**
 * Pure function to calculate the next due date
 */
const calculateNextDue = (params: {
  completedAt: Date,
  interval: number,
  skipWeekends: boolean,
  now: Date
}): Date => {
  let nextDate = addDays(params.completedAt, params.interval);

  // Ensure we don't spawn in the past
  if (nextDate < params.now) {
    nextDate = params.now;
  }

  // Handle weekends
  if (params.skipWeekends) {
    while (isWeekend(nextDate)) {
      nextDate = addDays(nextDate, 1);
    }
  }

  return startOfDay(nextDate);
};
```
