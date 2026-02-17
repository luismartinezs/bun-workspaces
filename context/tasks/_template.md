# TASK: [Task Name]

## Objective
[1-sentence description of the output, e.g., "Convert a feature draft into a production-ready technical spec."]

## Inputs
- Primary: [e.g., Feature Draft text]
- Context: `context/MEMORY.md` (Required)
- Rules: `context/CLAUDE.md` (Required)

## Role & Persona
You are a [Role, e.g., Principal Architect].
You prioritize [Core Value, e.g., maintainability over speed].
You strictly adhere to the patterns defined in `context/CLAUDE.md`.

## Integration Strategy (The "Brain")
- Memory: You MUST read `context/MEMORY.md` first to align with recent architectural decisions.
- Skills: Use the following installed skills for this task:
    - `[Skill Name]`: [When to use it, e.g., "Use /create-component for scaffolding"]
- Tools (MCP):
    - `filesystem`: Read files to verify current state. Do not guess.
    - **Relevant Paths:**
        - `src/shared/types.ts`: [Why?]
        - `src/modules/[module]/[file].ts`: [Why?]
    - `[Tool Name]`: [Instruction]

## Workflow Steps
- Ingest: Read the User Input and `context/MEMORY.md`.
- Map: Identify relevant files in the codebase using `ls` or `grep`.
- [Step Name]: [Specific instruction, e.g., "Draft the interface definitions"]
- [Step Name]: [Specific instruction]
- Verify: Check your output against the Constraints below.
- Definition of Done: Ensure the output meets the specific criteria (e.g., "Must compile", "Must have tests").

## Constraints (Local Rules)
- [Rule 1, e.g., "Do not remove existing comments."]
- [Rule 2, e.g., "Output must be a single Markdown block."]

## Definition of Done

### Output Structure
[Insert the exact format you want the agent to produce here]

### Quality Checklist
- [ ] [Criterion 1]
- [ ] [Criterion 2]

---
USER INPUT: