# Feature Idea: Smart Recurring Tasks / "Don't Guilt Trip Me" Mode

**The Problem:**
Right now in our app, if a user sets a task to repeat "Daily," and they go on vacation for a week, they come back to 7 overdue copies of that task. It's annoying and makes them hate the app. It feels like "task debt."

**The Fix:**
We need a better way to handle recurring tasks.
- If I miss a task, don't create a new one until I finish the old one? Or maybe just change the due date?
- We need a "flexible" recurrence option.
- Call it "Smart Recurrence" or "Relative Recurrence"?

**Rough Requirements:**
- User should be able to toggle this when creating a task.
- If the task is "Water the plants" (every 7 days) and I do it 3 days late, the NEXT one should be 7 days from *when I actually did it*, not 7 days from the *original due date*.
- If I completely ignore a daily task for 5 days, I shouldn't see 5 tasks. Just show me the one I missed.
- Maybe handle weekends? If a daily task falls on a Saturday, can we auto-move it to Monday?

**Open questions:**
- What happens to the "overdue" status?
- Do we keep history of the skipped ones for analytics?