# GitVerified - The 100% Honest Resume Filter

## Mission
To build a recruiting system that strictly filters for **competence, passion, and truthfulness**. We reject keyword stuffers, "LinkedIn inflators", and "white text" cheaters effectively, finding strictly builders who love computer science.

## The Problem
Recruiters are overwhelmed with 100s of resumes. Many candidates lie about their skills, exaggerate their contributions, or use tricks like hidden "white text" to game ATS systems. Keyword filters miss "passionate" engineers who might have significant open source contributions but lack the perfect buzzwords.

## The Solution: The "P-Score" (Passion & Proof Score)
We rank candidates based on a deep, multi-modal analysis of their digital footprint and stated experience.

### Architecture & Tech Stack (Hackathon Requirements)
1.  **Orchestration: Kestra**
    - **Logic**: Defined in [`kestra/workflow.yml`](file:///c:/Users/lenovo/RealEngineers.ai/kestra/workflow.yml).
    - Manages the batch ingestion of 100 resumes.
    - Triggers parallel agents for analysis.
    - Aggregates scores and produces the final leaderboard.
    
2.  **Intelligence Core: Oumi (Targeting 'Iron Intelligence' Prize)**
    - **Role**: The "BS Detector" & "Passion Analyst".
    - **Implementation**: We fine-tune a model (Llama-3-8B or Qwen-2-7B) using **Reinforcement Learning (DPO)** on a custom dataset (`resume_judge_dpo.jsonl`).
    - **Behavior**: The model is trained to be brutally honest, rejecting fluff and flagging "white text" cheats, while rewarding meaningful open source work.

3.  **Data Summarization: Kestra AI (Targeting 'Wakanda Data' Prize)**
    - **Role**: The "Chief of Staff".
    - **Implementation**: A final Kestra Agent step that aggregates all 100 candidate profiles.
    - **Task**: Summarizes the batch (e.g., "Found 3 verified 'Game Engine' developers. 12 Cheaters blocked.").
    - **Decision**: Makes the final "Hiring Recommendation" based on P-Scores.

3.  **Code Verification: Coderabbit**
    - **Role**: The "Code Auditor".
    - **Usage**: For every candidate with a GitHub/GitLab link:
        - We scan their top repositories.
        - Coderabbit analyzes code quality, architecture patterns, and commit history.
        - Checks for "Green Squares of Passion" (consistency) vs. "School Assignment" patterns.

4.  **Deployment: Vercel**
    - Hosting the Recruiter Dashboard.
    - Fast, edge-deployed UI to view the leaderboard and "Deep Dive" reports.

## Workflow
1.  **Batch Upload**: Recruiter uploads 100 PDFs.
2.  **Anti-Cheat Pre-check**: Detect hidden "white text" used to trick ATS.
3.  **The "Truth Filter" (Oumi DPO Agent)**: 
    - Analyzes resume text vs. extracted real signals.
    - **DPO Trained Behavior**: "Brutally honest" evaluation. Flags dishonesty or low proof-of-work.
    - **Bias**: explicitly boosts candidates with verified Open Source contributions.
4.  **The "Build Check" (Coderabbit)**:
    - Scans actual code.
    - Scores: Readability, Complexity, Engineering Standards.
5.  **P-Score Calculation**:
    - **Truth Score** (0-100)
    - **Code Quality** (0-100)
    - **Passion Metric** (0-100) (Side projects, blogs, open source).
    - **Final P-Score** = Weighted Average.
6.  **Selection**: 
    - System sorts by P-Score (Descending).
    - Top N (e.g., 10) are flagged for interview.
    - "Fakes" are auto-rejected with reasons.