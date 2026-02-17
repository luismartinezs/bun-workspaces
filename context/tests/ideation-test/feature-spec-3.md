# Functional Specification: Smart Recurring Tasks ("Don't Guilt Trip Me" Mode)

## 1. Overview
Smart Recurrence is a behavioral modification for recurring tasks designed to eliminate "task debt" and maintain healthy habits by adjusting future due dates based on actual completion performance rather than a rigid calendar schedule.

## 2. Core Behavioral Rules

### 2.1. Relative Recurrence Anchor
When Smart Recurrence is enabled, the next occurrence of a task is calculated relative to the **Actual Completion Date** of the previous instance.
- **Formula:** `NextDueDate = Date(ActualCompletionDate) + RecurrenceInterval`
- **Time Preservation:** The system MUST preserve the original `Time` component of the task. If a task was created for 09:00 AM, all subsequent instances MUST be set to 09:00 AM, regardless of what time the user clicked "complete."

### 2.2. Single Instance Policy (Debt Suppression)
The system will never allow more than **one** instance of a specific Smart Recurring task to be in a non-terminal state (`PENDING` or `OVERDUE`) at any time.
- If a user misses 5 days of a "Daily" task, they see exactly **one** task.
- Completion of this task triggers the creation of the *next* instance based on Rule 2.1.

### 2.3. Weekend Consolidation
If a calculated `NextDueDate` falls on a Saturday or Sunday, the system automatically shifts the date to the following Monday.
- **Merge Logic:** If an instance already exists for that Monday (e.g., a "Daily" task where Friday's completion pushes Saturday to Monday, but Monday already has its own instance), the weekend instance is marked as `SYSTEM_SKIPPED` and consolidated into the Monday task.

## 3. State Transitions

### 3.1. Activation (Toggle ON)
When a user enables Smart Recurrence on an existing task with multiple overdue instances:
1. Identify all `OVERDUE` instances.
2. Mark all but the **most recent** instance as `SKIPPED`.
3. Set the remaining instance as the current active target.

### 3.2. Termination States
- **Completed:** Triggers Rule 2.1 (Relative Anchor).
- **Skipped (Manual):** Triggers Rule 2.1 as if it were a completion (pushes the schedule forward to maintain the interval).
- **Deleted:** Terminates the recurrence series.

## 4. Edge Cases & Constraints

| Scenario | Behavior |
| :--- | :--- |
| **Early Completion** | If completed before the `DueDate`, the next instance is anchored to the `ActualCompletionDate` (maintaining the relative interval). |
| **Leap Years/Months** | Standard calendar library math applies (e.g., Feb 28th + 1 month = March 28th). |
| **Timezone Shift** | The `Time` component remains local to the user's primary timezone set at the time of task creation. |

## 5. Analytics & History
While UI clutter is suppressed (Rule 2.2), the system MUST log `SYSTEM_SKIPPED` events for skipped occurrences to allow for "Consistency Score" analytics, ensuring users can see which days were missed even if they weren't "billed" for them in the UI.
