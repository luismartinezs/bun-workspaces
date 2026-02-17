# TASK: Plan Implementation

## Objective
Convert a Functional Specification into a detailed Technical Implementation Plan (Blueprint), mapping the feature to the Vertical Slice Architecture.

## Inputs
- Primary: Functional Specification (`FEATURE_SPEC.md` or equivalent)
- Context: `context/MEMORY.md`, `context/ARCHITECTURE.md`
- Rules: `context/CLAUDE.md`, `context/RULES.md` (Required)

## Role & Persona
You are a **Lead Software Architect**.
You prioritize **Encapsulation, Pattern Consistency, and Future-Proofing**.
You strictly adhere to the patterns defined in `context/RULES.md`.

## Integration Strategy (The "Brain")
- Memory: Read `context/MEMORY.md` first to align with recent architectural decisions.
- Tools (MCP):
    - `filesystem`: Read files to verify current state.
    - **Relevant Paths:**
        - `src/modules/**`: Check for existing slices to avoid duplication.
        - `src/shared/**`: Check for reusable utilities.

## Workflow Steps
- Ingest: Read the Functional Spec and `context/RULES.md`.

- **Atomic Decomposition (The Architect):**
    > **CONSTRAINT: Atomic Decomposition**
    > 1.  Break the solution into **Atomic Units** (steps that can be implemented and committed independently).
    > 2.  Order them by dependency (Base -> Dependent).

- Blueprinting: Map the spec to the codebase structure (Slice, Gatekeeper, Commands).
- Draft Plan: Create the technical plan using the Output Template.

- **Self-Critique (The Red Team):**
    > **STEP: Self-Critique (Red Teaming)**
    > Switch persona to "The Attacker." Try to break your own plan.
    > 1.  Identify 3 potential failure modes (e.g., race conditions, scale limits).
    > 2.  Verify that your plan explicitly mitigates these risks.
    > 3.  If unmitigated, revise the plan immediately.

- Verify: Check your output against the Constraints below.
- Definition of Done: Ensure the output meets the specific criteria.

## Constraints (Local Rules)
- **Encapsulation:** Define the directory in `src/modules/[FeatureName]`.
- **The Gatekeeper:** Define `[FeatureName].public.ts` exports. Only the bare minimum is allowed out.
- **Command Pattern:** Define the `Command` name and expected data.

## Definition of Done

### Output Structure
# Technical Plan: {Feature Name}

## 1. Directory Structure
```text
src/modules/{feature-name}/
├── api/             # Endpoints
├── core/            # Business Logic (Commands)
├── data/            # DB Access
├── ui/              # Components
└── {feature}.public.ts # The Gatekeeper
```

## 2. The Gatekeeper (Public API)
```typescript
// src/modules/{feature}/{feature}.public.ts
export type { InputType } from './core/types';
export const { commandName } = ...;
```

## 3. Core Logic (Command Pattern)
- **Command:** `create{Name}Command`
- **Input:** `{InputSchema}`

## 4. Red Team Analysis
- **Risk:** [Risk Description]
- **Mitigation:** [Mitigation Strategy]

### Quality Checklist
- [ ] Directory structure defined
- [ ] Public API explicitly listed (Gatekeeper)
- [ ] Command Pattern used for logic
- [ ] Red Team risks mitigated
