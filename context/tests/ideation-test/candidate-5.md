I have a rough feature idea in draft-spec.md. I need you to write a Logic Specification that bullet-proofs this against user error and complex dates.

Please define the Business Logic for the following specific nightmare scenarios based on the draft:

The 'Friday' Problem: A daily task set to 'skip weekends' becomes overdue on Friday. Does it move to Saturday (invalid) or Monday?

The 'Time Travel' Problem: A user completes a task today, but manually sets the completion date to 3 days ago. When does the next one appear?

The 'Un-check' Problem: A user marks it done, the new task spawns, then they realize they didn't do it and un-check the first one. What happens to the new spawn?

Provide the 'Correct System Behavior' for each.

Write the output in a file named feature-spec-5.md
