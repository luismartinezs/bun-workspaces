This is the critical integration step. You are effectively building a **"Context Container"** that standardizes how the agent thinks, what tools it uses, and what past decisions it respects.

Here is how each of those 5 components maps directly into your flat **Task** file structure.

### The Unified Task Map

We map your concepts to specific Markdown sections within the `tasks/my-task.md` file.

| Concept | Markdown Section | Purpose |
| --- | --- | --- |
| **System Prompt** | `## Role & Objective` | Defines *who* the agent is and *what* success looks like. |
| **RULES** | `## Constraints` | Hard boundaries (dos and don'ts). |
| **SKILLS** | `## Reference Patterns` | "How-to" snippets (e.g., your specific Zod schema pattern). |
| **MCP** | `## Tooling Strategy` | Instructions on *which* tools to use and *when*. |
| **MEMORY** | `## Context Injection` | A pointer to read `MEMORY.md` or a slot to paste it. |

---

### The Master Template: `tasks/task-template.md`

This is the "Super-Lego." Copy this. It integrates all 5 elements into a single, readable flow.

```markdown
# TASK: [Task Name]

## Role & Objective
You are a **[Role Name]**. Your goal is to **[Objective]**.
You prioritize **[Core Value, e.g., speed, safety, readability]**.

## Tooling Strategy
* **Context Gathering:** You must use `grep` or file search to locate relevant files. Do not guess file paths.
* **Verification:** You must use `run_terminal_command` to run tests after making changes.
* **Browsing:** Use `search_google` only if the library documentation is missing from the context.

## Memory & Context
> **CRITICAL:** Before proceeding, you must read/consider the project's `MEMORY.md` file to align with past architectural decisions.

* **Project Phase:** [e.g., Early Prototyping / Production Hardening]
* **Recent Learnings:** [e.g., "We moved away from Redux last week."]

## Constraints
1.  **No Any:** Never use the `any` type in TypeScript.
2.  **Functional:** Prefer functional composition over class inheritance.
3.  **Localization:** All user-facing text must be wrapped in `t()`.

## Reference Patterns (Skills)
**How we write Zod Schemas:**
```typescript
// Good
export const UserSchema = z.object({
  id: z.string().uuid(),
});

```

**How we handle Errors:**

* Always wrap async calls in `try/catch` and log to Sentry.

## Workflow Steps

1. **Ingest:** Read the `MEMORY.md` and User Input.
2. **Map:** Search for related files using MCP tools.
3. **Execute:** Perform the task following the **Reference Patterns**.
4. **Verify:** Check your output against the **Constraints**.

---

**USER INPUT:**
[Paste specific instructions here]

```

---

### Deep Dive: How each piece works in practice

#### 1. System Prompt → `## Role & Objective`
Since you are pasting this file into an existing chat (or sending it via API), this section "overrides" or "focuses" the agent's vague general instructions into your specific persona.

#### 2. RULES → `## Constraints`
These must be **negative constraints** (what *not* to do) or **hard requirements**.
* *Why here?* Placing them before the workflow ensures the agent has "read" the laws before it starts "thinking" about the solution.

#### 3. SKILLS → `## Reference Patterns`
This is the most powerful part. Instead of hoping the model knows your coding style, you **show it**.
* *Lego Tip:* If a Skill is too long (e.g., "Company API Standard"), don't paste the whole text. Instead, write: `* **Reference:** Read 'docs/api-standards.md' before writing code.` This leverages the MCP (File Read) to load the skill *on demand*.

#### 4. MCP → `## Tooling Strategy`
MCP tools (like Chrome DevTools or File System) are "capabilities," but the agent often forgets to use them or uses them lazily.
* *The Fix:* Explicitly command the usage.
* *Example:* "Do not hallucinate file contents. You **MUST** use `read_file` on 'package.json' to see installed versions."

#### 5. MEMORY → `## Context Injection`
`MEMORY.md` should be a real file in your repo root.
* *The Integration:* The Task file acts as a pointer. The instruction "Read `MEMORY.md`" forces the agent to ground itself in your project's history.
* *Auto-Update:* You can add a step in the **Workflow**: "Step X: If you made a major architectural decision, propose an update to `MEMORY.md`."

### Implementation Strategy

1.  **Create `tasks/_template.md`** with the structure above.
2.  **Create `docs/MEMORY.md`** in your project root (if you haven't already).
3.  **Build one Lego:** Start with `tasks/refactor.md`. Fill in the Constraints and Patterns specific to refactoring (e.g., "Preserve variable names", "Add comments").

Does this unified template capture all the moving parts for you?

```