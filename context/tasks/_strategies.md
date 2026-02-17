# Cognitive Strategies Library
*Copy-paste these blocks into your Tasks to give the agent "superpowers".*
*Select only the strategies relevant to the specific task.*

---

## 1. Input & Validation (The "Gatekeeper")

### Strategy: The Gatekeeper (Stop & Ask)
*Use when:* The request might be vague, incomplete, or ambiguous.
*Placement:* Top of "Workflow Steps".

> **PROTOCOL: Gap Analysis & Inquiry**
> Before generating any plan or code, you must perform a **Gap Analysis**:
> 1.  Identify any missing requirements (e.g., edge cases, error handling, platform specifics).
> 2.  **IF** critical information is missing:
>     * **STOP** immediately.
>     * Output a list of 3-5 specific clarifying questions to the user.
>     * **DO NOT** proceed until these are answered.
> 3.  **ELSE**: Proceed with the workflow.

---

## 2. Design & Option Generation (The "Explorer")

### Strategy: The Explorer (Divergent Thinking)
*Use when:* Designing new features, architecture, or when the "best" way isn't obvious.
*Placement:* Before "Workflow Steps" or inside "Design Phase".

> **PROTOCOL: Divergent Thinking**
> Do not lock onto the first solution you find.
> 1.  Generate **3 Distinct Approaches** to solve this problem (e.g., "Fastest", "Safest", "Most Scalable").
> 2.  List the Pros/Cons of each approach.
> 3.  Select the best approach and explicitly justify why it wins.

---

## 3. Structural Planning (The "Architect")

### Strategy: The Architect (Decomposition)
*Use when:* The task involves multiple files, systems, or steps (Complexity > 5).
*Placement:* Before "Workflow Steps".

> **CONSTRAINT: Atomic Decomposition**
> You cannot execute a large plan at once.
> 1.  Break the solution into **Atomic Units** (steps that can be implemented and committed independently).
> 2.  Order them by dependency (Base -> Dependent).
> 3.  Execute only one unit at a time to minimize context drift.

---

## 4. Scoping & Filtering (The "Pareto Filter")

### Strategy: The Pareto Filter (80/20)
*Use when:* Refactoring, Optimization, or MVP planning.
*Placement:* Inside "Constraints".

> **CONSTRAINT: The Pareto Principle**
> You are forbidden from fixing/optimizing everything.
> 1.  Identify the **20% of the code** (the "Hot Path") that drives **80% of the complexity/value**.
> 2.  Focus your changes *only* on that critical 20%.
> 3.  Explicitly ignore low-value edge cases or stable legacy code unless critical.

---

## 5. Style & Consistency (The "Historian")

### Strategy: The Historian (Pattern Matching)
*Use when:* Adding code to an existing module or writing standard UI/Backend logic.
*Placement:* Inside "Constraints" or "Role".

> **CONSTRAINT: Precedent Adherence**
> Do not invent new patterns. "Do as the Romans do."
> 1.  Find 2 existing files in the codebase that solve a similar problem.
> 2.  Extract their patterns (naming, error handling, structure, library usage).
> 3.  Strictly mimic these patterns in your new code.

---

## 6. Logic Verification (The "Simulator")

### Strategy: The Simulator (Mental Sandbox)
*Use when:* Writing complex algorithms, state machines, or debugging tricky logic.
*Placement:* Middle of "Workflow Steps" (Before coding).

> **STEP: Mental Simulation**
> Before outputting the final code, run a **Step-by-Step Mental Simulation**:
> 1.  Initialize state with sample variables (e.g., `i=0`, `user=null`).
> 2.  Walk through your proposed logic line-by-line.
> 3.  **IF** the state drifts from the expected outcome, **discard** the plan and retry.

---

## 7. Safety & Risk (The "Red Team")

### Strategy: The Red Team (Adversarial)
*Use when:* Security reviews, Architecture proposals, or Critical infrastructure changes.
*Placement:* End of "Workflow Steps".

> **STEP: Self-Critique (Red Teaming)**
> Switch persona to "The Attacker." Try to break your own plan.
> 1.  Identify 3 potential failure modes (e.g., race conditions, scale limits, malicious input).
> 2.  Verify that your plan explicitly mitigates these risks.
> 3.  If unmitigated, revise the plan immediately.

---

## 8. Quality Measurement (The "Quantifier")

### Strategy: The Quantifier (Scoring)
*Use when:* Auditing code, Triaging issues, or assessing "readability".
*Placement:* Inside "Output Template".

> **OUTPUT: Confidence Score (0-100)**
> Provide a confidence score for your solution based on verification.
> * **< 70**: "I am guessing/inferring; manual review required."
> * **> 90**: "I have verified this against the codebase/docs."
> * **Metric Breakdown**: [Readability: X/100], [Safety: Y/100], [Performance: Z/100].