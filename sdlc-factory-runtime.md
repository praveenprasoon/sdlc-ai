You are an Enterprise Software Delivery AI Factory.

Your task is to generate a COMPLETE production-grade local system called:

    sdlc-factory-runtime

This system must run locally (Python-based) and act as an autonomous SDLC execution engine.

It must ingest Jira Epics and Stories and transform them into:

- Fully implemented source code (API/UI/DATA/INFRA/CONFIG)
- Infrastructure as code (Terraform/AWS)
- Database schemas and migrations
- Integration code
- Unit + integration + E2E tests
- Documentation
- Figma-like UI specification outputs (JSON DSL)
- GitHub Pull Requests with full change sets
- Validation reports aligned to Acceptance Criteria and Definition of Done

========================================================
CORE REQUIREMENT
========================================================

The system MUST be fully executable locally:

- Python 3.11+
- Modular architecture
- No placeholders
- No pseudo-code
- Real runnable code
- Docker optional but supported
- CLI entrypoint required

========================================================
INPUT FORMAT
========================================================

The system must accept:

1. Jira Epic JSON
2. Jira Stories JSON
3. Optional existing repository context (git clone path)
4. Optional architecture rules

Example input:

{
  "epic": {...},
  "stories": [
    {
      "id": "ST-101",
      "type": "API|UI|DATA|INFRA|CONFIG|TEST",
      "description": "...",
      "acceptance_criteria": [],
      "dependencies": []
    }
  ]
}

========================================================
CORE PIPELINE (MUST IMPLEMENT ALL STAGES)
========================================================

Stage 1: Jira Ingestion Engine
- Fetch epic + stories
- Normalize into internal schema
- Validate story completeness

Stage 2: Context Builder
- Load repo structure
- Extract existing APIs, DB schemas, configs
- Build "Execution Context Pack"

Stage 3: Dependency DAG Engine
- Build directed acyclic graph of stories
- Enforce execution order:

    INFRA → DATA → API → INT → UI → TEST → RELEASE
    CONFIG → SECURITY → WORKFLOW → TEST

- Detect cycles
- Identify blockers

Stage 4: Planning Agent
- Convert stories into execution plans
- Map each Acceptance Criteria → executable tasks

Stage 5: Multi-Agent Code Generation System

Must implement agents:

- api-agent (FastAPI or Node.js)
- ui-agent (React components)
- data-agent (ETL + SQL + schemas)
- infra-agent (Terraform AWS)
- config-agent (SaaS configs)
- security-agent (IAM / RBAC policies)
- test-agent (unit + integration + e2e)

Each agent MUST generate:
- source code
- tests
- documentation
- validation hooks

Stage 6: Validation Engine (MANDATORY GATES)

Implement strict validators:

1. Acceptance Criteria Validator
   - Every AC must map to at least one test

2. Definition of Done Validator
   - Tests pass
   - Coverage >= 90% (simulate enforcement if needed via pytest-cov)
   - No lint errors

3. Security Validator
   - No secrets in code
   - Basic OWASP checks

4. Schema Validator
   - DB schema consistency

If validation fails → regeneration loop must occur.

Stage 7: GitHub PR Generator

System must:
- Create branch per story
- Commit generated artifacts
- Create Pull Request
- Attach:
  - Summary
  - AC coverage mapping
  - Test results
  - Dependency graph
  - Risk score

Use GitHub REST API or CLI abstraction.

Stage 8: Human-in-the-Loop Gate System

Must implement approval checkpoints:

- Design approval gate
- Code review gate
- Security gate
- QA gate
- Release gate

System must STOP execution until approval is received.

========================================================
ARCHITECTURE REQUIREMENTS
========================================================

Generate full production architecture:

- CLI entrypoint: `python -m sdlc_factory`
- Modular Python package
- Async execution where possible
- DAG-based orchestration
- Agent registry pattern
- Plugin-based architecture for new story types

========================================================
OUTPUT REQUIREMENTS
========================================================

Generate a FULL repository:

Must include:

/sdlc_factory
  /orchestrator
  /agents
  /context
  /dependency_engine
  /validation
  /github
  /jira
  /prompts
  /cli

/.github/workflows
/docs
/docker
/config

========================================================
AGENT DESIGN RULES
========================================================

Each agent must define:

- Purpose
- Inputs
- Outputs
- Decision logic
- Quality gates
- Failure handling
- Retry strategy

========================================================
DEPENDENCY ENGINE RULES
========================================================

- Must build DAG from Jira dependencies
- Must detect circular dependencies
- Must block execution on unmet dependencies
- Must compute critical path

========================================================
TESTING REQUIREMENTS (CRITICAL)
========================================================

- Every generated module must include tests
- Use pytest
- Include integration tests for APIs
- Include schema validation tests
- Include mock Jira + GitHub tests

========================================================
PRIORITY OUTPUT FORMAT
========================================================

You MUST output:

1. Complete folder structure
2. Full code for every file
3. No placeholders
4. No "TODO"
5. No pseudo-code
6. No missing modules

If output is too large:
- Continue automatically in multiple parts
- Never stop mid-module

========================================================
FINAL GOAL
========================================================

Build a system that can:

INPUT:
- Jira Epic + Stories

OUTPUT:
- Fully implemented software system
- Fully tested
- Fully documented
- PR automatically created
- Ready for human approval and merge

This is an autonomous SDLC execution engine.

Begin generation now.
