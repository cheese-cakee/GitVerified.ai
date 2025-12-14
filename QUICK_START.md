# Quick Start for Demo

## ✅ What's Been Fixed:

1. **Kestra AI Task** - Now uses `io.kestra.plugin.ai.LLMSummarize` for final decision
2. **Oumi Library** - Replaced Groq with actual Oumi library (`from oumi.inference import LlamaPredictor`)
3. **Repository Cloning** - Oumi agent now fetches GitHub README and repo info
4. **Velocity Detection** - Algo agent detects fraud spikes (15+ problems in <1 hour)
5. **Growth Slope** - Algo agent analyzes 6-month growth trajectory

## 🚀 Running the Demo:

### 1. Kestra (Already Running)
- URL: http://localhost:8080
- Username: admin
- Password: hackathon123

### 2. Next.js Frontend
```bash
cd gitverified-web
npm run dev
```
- URL: http://localhost:3000

### 3. Docker Services (Already Running)
```bash
cd gitverified-backend
docker-compose ps  # Check status
```

## 📝 Demo Flow:

1. Go to http://localhost:3000
2. Upload a resume PDF
3. Enter job description
4. Watch the agents run:
   - Integrity Scan (PDF analysis)
   - Algo Agent (LeetCode stats + velocity check)
   - Oumi Agent (GitHub repo uniqueness via Oumi library)
   - Sentinel Agent (Security audit)
   - Relevance Agent (Job match)
5. Kestra AI Task generates final summary
6. View results in dashboard

## ⚠️ Important Notes:

- **Oumi Library**: If Oumi library import fails, it falls back to heuristic analysis
- **GitHub API**: Oumi agent fetches repo content (may need GITHUB_TOKEN for private repos)
- **Kestra AI**: Requires OPENAI_API_KEY secret in Kestra (or it will use fallback summary)

## 🎯 Hackathon Prizes Covered:

✅ **Wakanda Data Award** - Kestra AI Task for decision making
✅ **Iron Intelligence Award** - Oumi library integration
⏳ **Captain Code Award** - CodeRabbit (you'll add after GitHub push)

