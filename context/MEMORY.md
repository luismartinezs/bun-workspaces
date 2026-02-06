# PROJECT MEMORY
**Last Updated:** 2026-02-06

## 1. The "North Star" (Current Focus)
*Context: What are we actually building right now?*
- Implementing and validating **Vertical Slice Architecture** patterns across monorepo packages (e.g., `subscription-master`, `bird-tracker`). Ensuring strict enforcement of Public API boundaries.

## 2. Architectural Decisions (The "Why")
*Context: Immutable decisions.*
- **Public API Standardization:** Every module folder must have an `index.ts` or `[foldername].public.ts` to act as a gatekeeper. Consumers (like `main.ts`) are **forbidden** from importing internal module files directly. This prevents leaky abstractions and coupling to internals.

## 3. "Lessons Learned" (The Anti-Pattern List)
*Context: Mistakes we made that we must never repeat.*
- **2026-02-06** [Tooling]: `check-architecture.sh` must be targeted at `src/modules` and explicitly ignore `node_modules`. Running it on a package root without these filters leads to false positives (flagging `src` and `node_modules` as missing public APIs).
- **2026-02-06** [Patterns]: Do not export implementation details (like strategies) as internal files to be imported by `main.ts`. Instead, expose them via the Module's Public API to maintain slice integrity as verified by `depcruise`.

## 4. Key Constants & Dictionary
*Context: Magic strings and business logic values.*