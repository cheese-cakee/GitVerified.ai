# CandidateAI - Local AI-Powered Candidate Evaluation

## 🎯 Mission
**Empowering companies with free, private, local AI to distinguish exceptional candidates from tutorial followers.**

## 🏗️ Local-First Architecture
```
Resume Upload → Local AI Analysis → Comprehensive Evaluation
                  ↓
        ┌─────────────────────────┐
        │  Local AI Agents        │
        ├─────────────────────────┤
        │  Integrity Scanner      │  ← PDF fraud detection
        │  Code Quality Analyzer  │  ← Security & best practices  
        │  Project Uniqueness Judge│  ← Tutorial clone detection
        │  Skills Evaluator       │  ← Job matching
        │  Final Synthesis Engine │  ← Hiring recommendation
        └─────────────────────────┘
```

## 🚀 What Makes Us Different

### ❌ Traditional SaaS (Expensive)
- $0.10+ per evaluation
- Sends data to third parties
- Monthly subscriptions
- Privacy concerns

### ✅ CandidateAI (Free & Local)
- **$0 forever** - No recurring costs
- **100% private** - Data never leaves your machine
- **Works offline** - No internet required
- **Unlimited evaluations** - No usage limits

## 💡 Core Technology

### Local LLM Stack
- **Ollama** - Free local inference engine
- **Qwen2:1.5B** - 1GB model, runs on any laptop
- **Heuristics** - Fallback analysis for edge cases
- **No external dependencies** - Complete self-reliance

### Evaluation Capabilities

✅ **What We Detect Well**
- Tutorial clones (Todo apps, Weather apps, Netflix clones)
- Plagiarized code patterns
- Basic security vulnerabilities
- Resume fraud (hidden text, keyword stuffing)
- Poor project complexity

⚠️ **Advanced Features**
- Nuanced architecture analysis
- Domain-specific expertise
- Complex problem-solving assessment
- Cultural fit evaluation

## 🛠️ Quick Start

### Prerequisites
- **Any laptop** (8GB+ RAM recommended)
- **Python 3.9+**
- **Node.js 18+** (for web interface)

### 5-Minute Setup

1. **Install Ollama**
   ```bash
   # Windows: https://ollama.ai/download
   # Mac/Linux: curl -fsSL https://ollama.ai/install.sh | sh
   ```

2. **Download Models**
   ```bash
   ollama pull qwen2:1.5b    # 1GB model
   ollama pull tinyllama     # 600MB fallback
   ```

3. **Start Evaluation**
   ```bash
   git clone https://github.com/yourorg/candidateai
   cd candidateai
   python evaluate.py resume.pdf job_description.txt
   ```

## 📊 Evaluation Results

Each candidate receives:
- **Integrity Score** (0-10) - Resume authenticity
- **Code Quality Score** (0-100) - Security & best practices
- **Project Uniqueness Score** (0-10) - Tutorial vs novel work
- **Relevance Score** (0-10) - Job matching
- **Overall Recommendation** - PASS/WAITLIST/REJECT

## 🎯 Use Cases

### Perfect For
- **Tech startups** hiring junior developers
- **Hackathon candidate screening**
- **University recruiting programs**
- **Bootcamp graduate evaluation**
- **Remote hiring** (no data sharing concerns)

### Not Ideal For
- Senior architect roles (needs nuanced assessment)
- Highly specialized domains (ML, aerospace, etc.)
- Enterprise compliance requirements

## 🔧 Development

### Project Structure
```
candidateai/
├── agents/              # Local AI evaluation agents
│   ├── integrity.py     # Resume fraud detection
│   ├── code_quality.py # Security analysis
│   ├── uniqueness.py   # Project originality
│   └── relevance.py     # Job matching
├── web/                 # Optional web interface
│   ├── upload/         # Resume upload page
│   └── dashboard/      # Results display
├── models/             # Downloaded AI models
├── data/               # Sample resumes & results
└── evaluate.py         # CLI evaluation tool
```

### Adding New Agents
```python
# Create custom evaluation agent
class CustomAgent:
    def evaluate(self, candidate_data):
        # Your custom logic here
        return {"score": 7.5, "reasoning": "Strong candidate"}
```

## 🤝 Contributing

We welcome contributions! Focus areas:
- **Model improvements** - Better local models
- **New evaluation criteria** - Industry-specific needs
- **Performance optimization** - Faster inference
- **UI enhancements** - Better user experience

## 📄 License

MIT License - Use freely in your hiring process.

## 🌟 Why This Matters

- **Democratizes access** to AI-powered hiring
- **Protects candidate privacy** - data stays local
- **Reduces hiring costs** - eliminates SaaS fees
- **Enables fair evaluation** - consistent, unbiased scoring

---

**Built with ❤️ for the community of builders and innovators**