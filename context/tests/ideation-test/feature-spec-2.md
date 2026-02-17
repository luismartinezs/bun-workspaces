Feature: Smart Recurring Tasks
  As a user who dislikes "task debt"
  I want my recurring tasks to adjust based on when I actually complete them
  So that I don't feel overwhelmed by overdue copies of the same task

  Background:
    Given a user has a task "Water the plants"
    And the task is set to "Smart Recurrence"
    And the recurrence interval is "7 days"

  Scenario: Happy Path (Completing on time)
    Given the task is due on "2026-02-06"
    When the user completes the task on "2026-02-06"
    Then the task should be marked as completed
    And a new instance of "Water the plants" should be created
    And the new task's due date should be "2026-02-13"

  Scenario: Late Completion (Relative Recurrence)
    Given the task is due on "2026-02-06"
    When the user completes the task on "2026-02-09" (3 days late)
    Then the task should be marked as completed
    And a new instance of "Water the plants" should be created
    And the new task's due date should be "2026-02-16" (7 days from actual completion)

  Scenario: Accumulation Prevention (Ignored Daily Task)
    Given a user has a task "Journaling"
    And the task is set to "Smart Recurrence"
    And the recurrence interval is "1 day" (Daily)
    And the task was due on "2026-02-01"
    And today is "2026-02-08" (7 days later)
    When the user views their task list
    Then they should see only 1 instance of "Journaling"
    And the task should be marked as 7 days overdue
    And no new instances should be created until the current one is completed
