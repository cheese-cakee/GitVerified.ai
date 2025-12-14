# Architecture V9: The "Agent Assemble" Pipeline

This architecture is optimized to demonstrate the specific capabilities required by the WeMakeDevs Hackathon prizes.

## System Topology

```mermaid
graph TD
    ATS[Greenhouse] -->|Webhook| Kestra[Kestra Orchestrator]

    subgraph "Phase 1: Feature Extraction Agents"
        Kestra -->|Trigger| Algo[Algo Agent (Velocity/Slope)]
        Kestra -->|Trigger| Rabbit[CodeRabbit Audit (Quality)]
        Kestra -->|Trigger| Oumi[Oumi Judge (Uniqueness)]
    end

    subgraph "Phase 2: The Kestra Intelligence Layer"
        Algo & Rabbit & Oumi -->|JSON Signals| Kestra_AI[Kestra AI Task (LLM)]
        Kestra_AI -->|Reasoning| Decision[Final Verdict]
    end

    Decision -->|Write| Dashboard
```

## detailed Agent Specifications

### 1. Kestra Orchestrator ("The Brain")

**Prize Target:** Wakanda Data Award.

- **Type:** `io.kestra.core.models.flows.Flow`
- **Key Task:** `io.kestra.plugin.ai.LLMSummarize`
- **Logic:**
  1.  **Wait** for parallel tasks (`Algo`, `Rabbit`, `Oumi`) to complete.
  2.  **Ingest** JSON outputs.
  3.  **Prompt:** _"You are a Hiring Manager. Based on these 3 signals, write a 2-sentence summary of this candidate's potential. Be critical."_
  4.  **Action:** Store the _reasoning_ in the database, not just the score.

### 2. Oumi Uniqueness Agent

**Prize Target:** Iron Intelligence Award.

- **Type:** Python Script + Oumi Library.
- **Model:** `Llama-3-8B-Instruct` (Available via Oumi).
- **Logic:**
  1.  Clone Candidate Repo.
  2.  Extract `README.md`, `package.json`, and `src` structure.
  3.  **Oumi Inference:**
      - _Input:_ Project Metadata.
      - _Context:_ Database of "Common Tutorial Projects" (Weather App, Todo List).
      - _Output:_ `uniqueness_score` (0.0 - 1.0).

### 3. CodeRabbit Quality Agent

**Prize Target:** Captain Code Award.

- **Type:** API Integration.
- **Logic:**
  1.  Trigger specific CodeRabbit review on the repo.
  2.  **Filter:** Ignore syntax errors. Focus on **"High Severity"** design issues.
  3.  **Metric:** `Maintainability Index`. A "working" project with massive technical debt gets a low P-Score.

### 4. Algo Velocity Agent

**Core Logic:**

- **Spike Detection:**
  ```python
  def check_velocity(submissions):
      sorted_subs = sort_by_time(submissions)
      for i in range(len(sorted_subs) - 15):
          # Check window of 15 submissions
          time_diff = sorted_subs[i+15].time - sorted_subs[i].time
          if time_diff < 3600 (1 hour):
              return "FRAUD_SPIKE_DETECTED"
      return "PASS"
  ```

## Data Model (The "Signals")

```json
{
  "candidate": "Alex",
  "kestra_summary": "High potential. Algo growth is consistent (+200 pts/6mo). Project is a unique CLI tool (Oumi Score: 8.5). CodeRabbit noted minor security issues but excellent structure.",
  "p_score": 91,
  "details": {
    "algo_velocity": "PASS",
    "project_uniqueness": 8.5,
    "quality_grade": "A-"
  }
}
```
