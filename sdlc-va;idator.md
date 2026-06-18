You are upgrading an existing SDLC automation system into:

    SCC-v3 (Semantic Completeness Compiler – Enterprise Reasoning Layer)

Your task is to REFRACTOR and EXTEND the system into a production-grade semantic reasoning engine that operates on Jira Epics, Stories, and existing repositories.

You MUST NOT create pseudo-code. You MUST produce production-grade architecture + implementable code.

========================================================
PRIMARY OBJECTIVE
========================================================

Transform the current SDLC system into a semantic compiler that:

1. Understands full system context across ALL stories
2. Detects contradictions between stories (cross-story reasoning)
3. Synthesizes missing API/DATA/CONFIG contracts automatically
4. Optimizes execution order (dependency + parallelism)
5. Predicts execution risk before runtime
6. Validates system-wide feasibility (not just per story)

========================================================
CORE OUTPUTS REQUIRED
========================================================

Generate a fully working Python module:

    /sdlc_factory/validation/semantic_v3/

It must include:

- compiler_v3.py
- global_context_graph.py
- system_reasoner.py
- contradiction_engine.py
- contract_synthesizer.py
- execution_optimizer.py
- risk_predictor.py
- models.py

========================================================
INPUT MODEL
========================================================

System must accept:

- Jira Epic
- Jira Stories
- Dependencies between stories
- Existing system context (services, DB schema, APIs)

Example:

{
  "epic": {...},
  "stories": [
    {
      "id": "ST-101",
      "type": "API | UI | DATA | INFRA | CONFIG | TEST",
      "intent": "...",
      "description": "...",
      "acceptance_criteria": [],
      "dependencies": [],
      "entities": [],
      "contracts": {}
    }
  ]
}

========================================================
SCC-v3 CAPABILITIES (MANDATORY)
========================================================

1. GLOBAL SYSTEM GRAPH
- Build unified graph of all stories
- Detect cycles across entire system
- Resolve dependency structure globally

2. CROSS-STORY SEMANTIC REASONING
- Detect entity-level conflicts between stories
- Identify overlapping or contradictory intents
- Flag lifecycle conflicts (create vs delete conflicts)

3. CONTRADICTION ENGINE
- Detect logical contradictions across:
  - API vs DATA vs UI stories
  - conflicting business intent
  - invalid system assumptions

4. CONTRACT SYNTHESIS ENGINE
- Auto-generate missing:
  - API request/response schemas
  - Data models / tables
  - Integration contracts
- Ensure system is execution-ready even if input is incomplete

5. EXECUTION OPTIMIZER
- Convert dependency graph into optimized execution plan
- Identify parallel execution groups
- Reduce critical path length

6. RISK PREDICTION ENGINE
- Assign risk score (0–100)
- Detect:
  - high dependency complexity
  - ambiguous requirements
  - missing contracts
  - unstable system structure

========================================================
DECISION MODEL
========================================================

System output MUST include:

- status: PASS | ENRICH | REJECT
- risk_score (0–100)
- contradictions list
- cycles list
- semantic_conflicts list
- execution_plan (optimized DAG layers)

Rules:

- If cycles OR contradictions exist → REJECT
- If risk_score > 70 → ENRICH
- Else → PASS

========================================================
ARCHITECTURE REQUIREMENTS
========================================================

- Pure Python 3.11+
- Modular design
- No placeholders
- No mock logic for core engines
- Deterministic outputs preferred
- Graph-based processing mandatory
- Must be extensible for LLM integration but NOT dependent on it

========================================================
QUALITY REQUIREMENTS
========================================================

- Must include logging
- Must include typed models (dataclasses or pydantic)
- Must support large-scale Jira datasets
- Must handle 1000+ stories in graph
- Must be production-ready, not demo code

========================================================
CRITICAL DESIGN RULE
========================================================

This is NOT a validator.

This is a:

    "Semantic Compiler for Software Delivery Systems"

Meaning:
- Jira = source code
- Stories = AST nodes
- SCC-v3 = compiler + linker + optimizer + static analyzer

========================================================
FINAL INSTRUCTION
========================================================

Generate complete repository code for SCC-v3 semantic reasoning layer.
Ensure all modules are fully implemented and integrated.

Begin now.
