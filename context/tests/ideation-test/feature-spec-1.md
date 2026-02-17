# Feature Specification: Smart Recurring Tasks

## Summary
Smart Recurring Tasks is a feature designed to eliminate "task debt" and provide a more human-centric approach to productivity. Instead of rigidly adhering to fixed calendar schedules that penalize users for being late, the system adapts to the user's actual behavior. It ensures that overdue tasks do not stack up and that the next interval is calculated from the moment of actual completion, maintaining a consistent rhythm without the guilt.

## User Stories
- **As a user**, I want my recurring tasks to not stack up if I miss them, so that I don't feel overwhelmed by "task debt" when returning from a break.
- **As a user**, I want the next due date of a "maintenance" task (like watering plants) to be based on when I last did it, so that the frequency remains correct regardless of my schedule.
- **As a user**, I want the option to automatically move weekend tasks to Monday, so that I can keep my personal time separate from work-related routines.

## Functional Logic

### 1. Recurrence Types
The system shall support two primary recurrence behaviors:
- **Fixed Recurrence:** (Standard) The next due date is calculated as `Original Due Date + Interval`.
- **Flexible (Smart) Recurrence:** (New) The next due date is calculated as `Completion Date + Interval`.

### 2. Single Instance Enforcement
For tasks with **Smart Recurrence** enabled:
- Only one instance (the current active task) shall exist at any time.
- If a task is overdue by multiple intervals (e.g., a daily task missed for 5 days), the system shall **not** create backlogged instances. The user sees only the current overdue task.

### 3. Completion Trigger & Calculation
When a user marks a Smart Recurring task as completed:
1. **Completion Capture:** Record the `ActualCompletionDate` (local user time).
2. **Interval Calculation:** Determine the `NextDueDate` by adding the recurrence interval (N days/weeks/months) to the `ActualCompletionDate`.
3. **Weekend Drift (Optional):** If the "Skip Weekends" toggle is active:
   - If `NextDueDate` falls on a Saturday, move it to the following Monday (+2 days).
   - If `NextDueDate` falls on a Sunday, move it to the following Monday (+1 day).
4. **Instantiation:** Create the next instance of the task with the newly calculated `NextDueDate`.

### 4. Recurrence Calculations
- **Daily:** Interval = 1 day.
- **Weekly:** Interval = 7 days (or N weeks).
- **Monthly:** Interval = Calendar month. *Note: If the completion date is the 31st and the next month has only 30 days, the due date shifts to the last day of that month.*

## Edge Cases

### Time Zones
- All completion timestamps must be normalized to the user's local time zone at the moment of completion.
- If a user completes a task at 11:55 PM and travel results in their local time shifting to 12:05 AM (next day), the calculation must use the date the user *perceived* they completed the task on, to avoid skipping an unintended day.

### Leap Years
- For yearly recurrence or monthly recurrence falling on the 29th:
  - If the `NextDueDate` calculation lands on February 29th in a non-leap year, the date shall default to February 28th.

### User Un-completing (Undo)
- If a user un-completes (reverts) a task completion:
  1. The system must **DELETE** the future instance created by the recurrence trigger.
  2. The original task instance must be restored to "Incomplete" status.
  3. The `OriginalDueDate` of the restored task must remain unchanged (it does not reset to today).

### Manual Due Date Overrides
- If a user manually changes the due date of an overdue smart task, the "Smart" logic remains dormant until the task is completed. The eventual completion will still use the `ActualCompletionDate` as the base for the next interval, regardless of the manual override.

### Modification of Recurrence Rule
- If a user changes a task from "Fixed" to "Smart" while it is overdue, the system should immediately collapse any stacked instances into a single overdue task.
