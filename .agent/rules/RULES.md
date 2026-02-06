---
trigger: always_on
---

# Architectural Rules: Vertical Slice & Functional Patterns

## 1. Directory Structure
- All business logic MUST live in `src/modules/{slice-name}`.
- Each slice MUST be self-contained.
- Global utilities MUST live in `src/shared` and remain "business-logic-blind."

## 2. Cross-Slice Communication
- **NO DEEP IMPORTS:** You are strictly forbidden from importing files from the internals of another slice.
- **GATEKEEPER:** You may only import from another slice via its `{slice}.public.ts` file.
- **SYNC:** Use "Service Contracts" (Interfaces) for synchronous data needs.
- **ASYNC:** Use the `eventBus` for side effects (e.g., Auth emitting `USER_CREATED`).

## 3. Coding Patterns (Functional Only)
- **NO CLASSES:** Use pure functions, type aliases, and interfaces.
- **COMMAND PATTERN:** Every feature entry point must follow the Command pattern:
  `const create[Name]Command = (input) => ({ name, data, execute: async () => { ... } })`
- **STRATEGY PATTERN:** If a process has multiple vendors (e.g., Stripe/PayPal), use a Strategy type and pass the specific function implementation at runtime.
- **COMPOSITION ROOT:** Only `src/main.ts` is allowed to "wire" slices together. Do not perform dependency injection or wiring inside the slice folders.

## 4. Friction & Enforcement
- If you need to add a field to a "User," update the `Contract` first, then the `Command`, then the `Slice` internal logic.
- If you find yourself importing a module into `shared`, STOP. Move that logic into a specific slice.
- Before completing a task, verify that no circular dependencies have been created.