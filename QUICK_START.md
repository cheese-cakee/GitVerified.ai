# CandidateAI Quick Start Guide

## 🚀 5-Minute Setup

### 1. Install Ollama (Local LLM Engine)
```bash
# Windows: Download from https://ollama.ai/download
# Mac: brew install ollama
# Linux: curl -fsSL https://ollama.ai/install.sh | sh
```

### 2. Download AI Models
```bash
# Start Ollama service
ollama serve

# Download lightweight models (works on any laptop)
ollama pull qwen2:1.5b    # 1GB - Primary model
ollama pull tinyllama     # 600MB - Fallback model
```

### 3. Setup CandidateAI
```bash
# Clone the repository
git clone https://github.com/yourorg/candidateai
cd candidateai

# Install Python dependencies
pip install -r requirements.txt

# Test the installation
python evaluate.py --help
```

## 🎯 Basic Usage

### Evaluate a Single Candidate
```bash
# Resume PDF + Job Description
python evaluate.py resume.pdf "Senior Python Developer position"

# Include GitHub analysis
python evaluate.py resume.pdf job_desc.txt --github https://github.com/user/project

# Include LeetCode analysis
python evaluate.py resume.pdf job_desc.txt --leetcode username

# Save results
python evaluate.py resume.pdf job_desc.txt --output results.json
```

### Job Description File Format
Create `job_desc.txt` with:
```
We are seeking a Senior Python Developer with:
- 5+ years Python experience
- Django/Flask web frameworks
- AWS cloud deployment
- Strong problem-solving skills
- Team collaboration experience
```

## 📊 Understanding Results

### Output Format
```
🎯 FINAL EVALUATION RESULTS
========================================
📊 Overall Score: 7.3/10
🏆 Recommendation: PASS
💭 Reasoning: Strong candidate with overall score of 7.3/10

📈 Score Breakdown:
   🛡️  Integrity: 8.0/10
   💻 Code Quality: 7.0/10
   🎨 Uniqueness: 6.5/10
   💪 Skills: 8.0/10
   🎯 Relevance: 7.5/10
========================================
```

### Scoring Guide
- **PASS**: Proceed with interviews - strong candidate
- **WAITLIST**: Consider for future roles or second-round screening
- **REJECT**: Not suitable for current position

### Individual Score Meanings
- **Integrity (0-10)**: Resume authenticity, no fraud
- **Code Quality (0-10)**: Security, best practices, cleanliness
- **Uniqueness (0-10)**: Original projects vs tutorial clones
- **Skills (0-10)**: Technical problem-solving ability
- **Relevance (0-10)**: Job requirements match

## 🛠️ Advanced Usage

### Batch Evaluation
```bash
# Evaluate multiple resumes
python batch_evaluate.py resumes_folder/ job_desc.txt

# Process CSV of candidates
python csv_evaluate.py candidates.csv output_folder/
```

### Custom Evaluation
```bash
# Disable AI (use heuristics only)
python evaluate.py resume.pdf job.txt --no-llm

# Custom model (if you have larger local models)
MODEL_NAME=qwen2:7b python evaluate.py resume.pdf job.txt
```

### Web Interface (Optional)
```bash
cd web
npm install
npm run dev
# Open http://localhost:3000
```

## 🔧 Configuration

### Environment Variables
```bash
# Optional: Custom model name
export CANDIDATEAI_MODEL=qwen2:1.5b

# Optional: Ollama server location
export OLLAMA_BASE_URL=http://localhost:11434

# Optional: Disable GitHub API (faster, less info)
export SKIP_GITHUB_API=true
```

### Custom Agents
Create `agents/custom_agent.py`:
```python
def evaluate_candidate(candidate_data):
    # Your custom evaluation logic
    return {
        "score": 8.5,
        "reasoning": "Strong technical skills demonstrated",
        "agent": "custom"
    }
```

## 📈 Tips for Best Results

### Resume Preparation
- Use standard PDF format
- Include relevant technical skills
- Provide GitHub links for code review
- Avoid templates and keyword stuffing

### Job Descriptions
- Be specific about required skills
- Include years of experience
- List technologies and frameworks
- Mention team/company culture

### Evaluation Strategy
- Use GitHub URLs for developer candidates
- Include LeetCode for technical roles
- Run multiple evaluations for consistency
- Review individual scores for insights

## 🚨 Troubleshooting

### Common Issues

**"Ollama not running"**
```bash
# Start Ollama service
ollama serve

# Check if running
ollama list
```

**"Model not found"**
```bash
# Download required models
ollama pull qwen2:1.5b
ollama pull tinyllama
```

**"PDF processing error"**
```bash
# Install PDF processing
pip install pymupdf
```

**"Memory usage high"**
```bash
# Use smaller model
ollama pull tinyllama
export CANDIDATEAI_MODEL=tinyllama
```

### Getting Help

1. **Check logs**: Run with `--verbose` flag
2. **Model status**: Use `ollama list` to verify models
3. **Memory check**: Ensure 4GB+ RAM available
4. **File paths**: Use absolute paths for resumes

## 🎓 Learning Resources

### Understanding AI Evaluation
- [Local vs Cloud LLMs](https://ollama.ai/blog/local-vs-cloud)
- [Ollama Documentation](https://github.com/ollama/ollama)
- [Model Selection Guide](https://ollama.ai/library)

### Improving Results
- Candidate evaluation best practices
- Resume analysis techniques
- Technical skill assessment methods

---

**Ready to revolutionize your hiring process? Start evaluating candidates in minutes!**