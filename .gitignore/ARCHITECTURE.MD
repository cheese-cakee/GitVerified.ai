# GitVerified Architecture

## Overview
GitVerified is a resume filtering system designed to prioritize **truthfulness** and **engineering passion** over keyword matching. It uses a multi-agent orchestrated pipeline to detect cheating (White Text), verify technical depth (Oumi DPO), and audit code quality (CodeRabbit).

## System Components

### 1. Orchestration Layer (Kestra)
- **Engine**: Kestra (Docker Runner)
- **Workflow**: `kestra/workflow.yml`
- **Role**:
    - Manages the ingestion of resume batches (PDFs).
    - Parallelizes the analysis agents for speed.
    - Aggregates scores into a final JSON payload for the UI.

### 2. Intelligence Core (Oumi)
- **Model**: Llama-3-8B-Instruct (Fine-tuned with LoRA)
- **Technique**: Direct Preference Optimization (DPO)
- **Training Data**: `data/resume_judge_dpo.jsonl`
- **Goal**: The "Iron Intelligence" agent. Trained to be "brutally honest" and detect misalignment between claimed skills and actual project timeline.

### 3. Code Audit (CodeRabbit)
- **Integration**: Python Script Simulation (mocking API)
- **Logic**: `agents/coderabbit_check.py`
- **Metrics**:
    - **Complexity**: Differentiates between "To-Do Apps" and "Systems Programming".
    - **Consistency**: Checks commit history for "Green Squares of Passion".

### 4. Application Layer (Next.js on Vercel)
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS (Resend.com aesthetic)
- **Dashboard**: `gitverified-web`
- **Data Flow**: Reads processed JSON outputs from the Kestra pipeline (simulated via `lib/api.ts`).

## Security & Anti-Cheat
- **White Text Detection**: `scripts/detect_white_text.py` analyzes PDF text color and size to flag invisible keyword stuffing attempts.

## Future Roadmap
- Real-time Kestra API integration (Webhooks).
- Full database persistence (Postgres/Supabase).
- Live CodeRabbit GitHub App integration.
