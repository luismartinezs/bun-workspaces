# Product Requirements Document: Smart Recurring Tasks

## 1. Executive Summary
Traditional recurrence models create "task debt" by blindly generating new instances regardless of user progress. This PRD defines **Smart Recurrence**, a system designed to respect User Intent by preventing task accumulation and providing flexible interval math.

## 2. Rules of Engagement

### Trigger Mechanics
The system supports two distinct calculation triggers:

1.  **Temporal Trigger (Absolute)**: The recurrence is calculated based on the system clock. Once `NOW >= SCHEDULED_TIME`, a new instance is valid for creation.
2.  **Event Trigger (Relative)**: The recurrence is calculated only upon the `COMPLETION` of the previous instance. The next due date is `COMPLETION_TIME + OFFSET`.

### Constraint: Max Active Instances
To prevent "task piling," the system enforces a concurrency limit.

*   **Logic**: A new instance $N+1$ cannot be created if the number of active instances (status `Pending` or `Overdue`) for that task definition is equal to `MAX_ACTIVE_INSTANCES`.
*   **Behavior**: For most users, `MAX_ACTIVE_INSTANCES` defaults to `1`. If a user misses a daily task for 5 days, they still only see **one** overdue task. The system "suppresses" the 4 missed instances.

---

## 3. State Machine Description

A recurring task instance follows this lifecycle:

1.  **Pending**: The instance is active and awaiting action. The `DueDate` is in the future.
2.  **Overdue**: Transition occurs when `SystemClock > DueDate` and the task is not yet `Completed`.
3.  **Completed (Terminal)**: The user marks the task as finished.
4.  **New Instance Created (Regeneration)**:
    *   In **Relative Recurrence**, the transition to `Completed` immediately triggers the calculation and creation of a new `Pending` instance.
    *   In **Absolute Recurrence**, the system clock triggers the creation of a new `Pending` instance at the next interval, *provided the Max Active Instances constraint is not violated*.

---

## 4. Recurrence Models: Absolute vs. Relative

| Feature | Absolute Recurrence (Calendar-based) | Relative Recurrence (Completion-based) |
| :--- | :--- | :--- |
| **Intent** | Synchronization with external events. | Maintenance of a specific interval. |
| **Calculation Root** | `Pivot Date` (Original Start Date) | `Last Completion Date` |
| **Example** | Tuesday Trash Pickup | Watering the Plants (every 7 days) |
| **Drift Behavior** | Fixed. If you are 2 days late, the next one is still on the original schedule. | Floating. If you are 2 days late, the next one pushes out by 2 days. |
| **Catch-up** | May result in a short interval to return to the anchor date. | Always maintains the full interval. |

## 5. User Intent Logic
The core "Don't Guilt Trip Me" feature relies on:
*   **Relative Recurrence** for personal habits.
*   **Max Active Instances = 1** for both modes to ensure a clean UI and zero "task debt."
