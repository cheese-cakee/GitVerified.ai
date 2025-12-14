# GitVerified - Fresher Prodigy Engine 🚀

**AI Agents Assemble Hackathon Entry** | WeMakeDevs | December 2025

GitVerified uses advanced AI Agents to distinguish "Tutorial Spammers" from "High Potential Juniors" - helping startups find the best fresher talent.

---

## 🏆 Hackathon Prizes Targeted

### 1. Wakanda Data Award ($4,000) ✅

**Kestra AI Agent for Data Summarization & Decision-Making**

- **Implementation:** `io.kestra.plugin.ai.LLMSummarize` task in `gitverified_pipeline.yaml`
- **Location:** `gitverified-backend/flows/gitverified_pipeline.yaml` (lines 139-151)
- **Function:**
  - Aggregates JSON from all agents (Integrity, Algo, Oumi, Sentinel, Relevance)
  - Uses Kestra's built-in AI Agent to generate recruiter summary
  - **Makes decisions:** PASS, WAITLIST, or REJECT with reasoning
- **Evidence:** See execution logs showing AI-generated summaries with recommendations

### 2. Iron Intelligence Award ($3,000) ✅

**Oumi Library for RL Fine-Tuning & LLM-as-a-Judge**

- **Implementation:**
  - **Agent:** `gitverified-backend/agents/agent_oumi.py` uses `from oumi.inference import LlamaPredictor`
  - **Training Config:** `oumi/train_config.yaml` - DPO (Direct Preference Optimization) fine-tuning
  - **Dataset:** `data/resume_judge_dpo.jsonl` - Preference pairs for training
- **Function:**
  - LLM-as-a-Judge: Scores projects 1-10 for uniqueness
  - Distinguishes tutorial clones (1-4) from novel engineering (8-10)
  - Fine-tuning configured for specialized model
- **Evidence:** Training configs, dataset, and agent using Oumi library

### 3. Captain Code Award ($1,000) ⏳

**CodeRabbit Integration for Code Quality**

- **Status:** Will be integrated post-submission via GitHub App
- **Plan:** CodeRabbit will review all PRs automatically
- **Evidence:** PR comments and code quality reports visible in GitHub
- testing if it actually works here

---

## 🏗️ Architecture

```
PDF Upload → Integrity Scan → Parallel Agents → Kestra AI Task → Final Decision
                ↓                    ↓
         Extract Links      Algo | Oumi | Sentinel | Relevance
                ↓                    ↓
         GitHub/LeetCode    JSON Signals → AI Summary
```

### Key Components:

1. **Integrity Engine** - PDF fraud detection (white text, keyword stuffing)
2. **Algo Engine** - LeetCode analysis with velocity anomaly detection
3. **Oumi Judge** - Project uniqueness scoring (1-10)
4. **Sentinel** - Security audit (code vulnerabilities)
5. **Relevance Engine** - Semantic job matching
6. **Kestra AI** - Final decision-making with reasoning

---

## 🚀 Quick Start

### Prerequisites:

- Docker & Docker Compose
- Node.js 18+
- Python 3.9+ (for local development)

### 1. Start Services:

```bash
cd gitverified-backend
docker-compose up -d
```

This starts:

- **Kestra** on http://localhost:8080
- **PostgreSQL** on port 5432
- **Python Worker** container

### 2. Configure Kestra:

Login to Kestra UI: http://localhost:8080

- **Username:** `yourname`
- **Password:** `********`

### 3. Register Flow:

**Option A: Import via UI**

1. Click "Import" in Kestra UI
2. Select: `gitverified-backend/flows/gitverified_pipeline.yaml`

**Option B: Create Manually**

1. Click "+ Create" → "Flow"
2. Copy-paste content from `gitverified_pipeline.yaml`
3. Save

### 4. Start Frontend:

```bash
cd gitverified-web
npm install
npm run dev
```

Frontend runs on: http://localhost:3000

### 5. Run Demo:

1. Go to http://localhost:3000/engine
2. Upload a resume PDF
3. Enter job description
4. Click "START ANALYSIS"
5. Watch agents run in parallel
6. View final decision with Kestra AI summary

---

## 📁 Project Structure

```
RealEngineers.ai/
├── gitverified-backend/
│   ├── flows/
│   │   └── gitverified_pipeline.yaml    # Main Kestra pipeline
│   ├── agents/
│   │   ├── agent_integrity.py           # PDF fraud detection
│   │   ├── agent_algo.py                # LeetCode analysis
│   │   ├── agent_oumi.py                # Oumi uniqueness judge
│   │   ├── agent_sentinel.py            # Security audit
│   │   └── agent_relevance.py           # Job matching
│   ├── docker-compose.yml               # Service orchestration
│   └── kestra.yml                       # Kestra configuration
├── gitverified-web/
│   ├── app/                             # Next.js frontend
│   └── package.json
├── oumi/
│   └── train_config.yaml                # Oumi DPO training config
└── data/
    └── resume_judge_dpo.jsonl           # Training dataset
```

---

## 🎯 Key Features

### 1. Integrity Engine

- Detects white text injection
- Keyword stuffing detection
- PDF metadata analysis
- Extracts GitHub/LeetCode links

### 2. Algo Engine

- LeetCode stats analysis
- **Velocity anomaly detection** (15+ problems in <1 hour = fraud)
- **Growth slope analysis** (6-month trajectory)
- Genius vs Grinder classification

### 3. Oumi Uniqueness Judge

- **Uses Oumi library** (`from oumi.inference import LlamaPredictor`)
- Fetches GitHub repo content (README, package.json)
- Scores projects 1-10 for uniqueness
- Distinguishes tutorial clones from novel engineering

### 4. Security Audit (Sentinel)

- Code vulnerability scanning
- Hardcoded secrets detection
- Code quality assessment

### 5. Relevance Engine

- Semantic job matching using sentence-transformers
- Cosine similarity scoring
- Match level classification

### 6. Kestra AI Decision

- **Uses Kestra's built-in AI Agent** (`io.kestra.plugin.ai.LLMSummarize`)
- Aggregates all agent outputs
- Generates critical recruiter summary
- **Makes hiring decisions** (PASS/WAITLIST/REJECT)

---

## 🔧 Configuration

### Environment Variables:

**Kestra:**

- Configured in `gitverified-backend/kestra.yml`
- Basic auth: `farzanaman99@gmail.com` / `Enough_349`

**Oumi:**

- Set `GROQ_API_KEY` for Oumi inference (optional, has fallback)
- Set `OUMI_MODEL` to use custom model
- Set `OUMI_FINETUNED_PATH` to use fine-tuned model

**Agents:**

- All agents run in Docker containers
- Shared volume: `gitverified-backend/agents:/app/agents`

---

## 📊 Demo Flow

1. **Upload Resume** → PDF saved to shared volume
2. **Integrity Scan** → Extracts links, detects fraud
3. **Parallel Agents Run:**
   - Algo: Fetches LeetCode stats, checks velocity
   - Oumi: Analyzes GitHub repo uniqueness
   - Sentinel: Security audit
   - Relevance: Job matching
4. **Kestra AI Task** → Generates summary with decision
5. **Final Score** → Weighted average + AI reasoning
6. **Dashboard** → View results with all agent outputs

## 🛠️ Development

### Running Agents Locally:

```bash
cd gitverified-backend/agents
python agent_integrity.py data/resume.pdf
python agent_algo.py leetcode_username
python agent_oumi.py github.com/owner/repo
```

### Testing Pipeline:

1. Register flow in Kestra
2. Execute with test inputs
3. Check execution logs
4. Verify JSON outputs in `agents/data/`

---
## 🤝 Contributing

This is a hackathon project. For production use:

1. Add proper error handling
2. Implement rate limiting
3. Add authentication
4. Set up monitoring
5. Integrate CodeRabbit GitHub App

---

## 📄 License

See LICENSE file

---

## 👥 Team

Built for **AI Agents Assemble Hackathon** by WeMakeDevs

**Contact:** farzanaman99@gmail.com

---

## 🎉 Acknowledgments

- **Kestra** - Workflow orchestration
- **Oumi** - LLM fine-tuning framework
- **CodeRabbit** - Code quality (planned integration)
- **WeMakeDevs** - Hackathon organizers
