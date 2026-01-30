"""
Enhanced Integrity Agent - AI-Powered Resume Analysis
"""

import json
import sys
import os
import re

# Add current directory to path to find hybrid_model
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

from hybrid_model import get_hybrid_client

def scan_resume_integrity(resume_path, use_ai_models=True, ollama_available=True):
    """Scan resume for integrity using AI if available"""
    print(f"> [IntegrityEnhanced] Scanning resume: {resume_path}", file=sys.stderr)
    
    # 1. Extract Text
    resume_text = ""
    try:
        import pymupdf as fitz
        doc = fitz.open(resume_path)
        for page in doc:
            resume_text += page.get_text()
        resume_text_excerpt = resume_text[:2000]
    except Exception as e:
        print(f"> [IntegrityEnhanced] Extraction failed: {e}", file=sys.stderr)
        return {"agent": "integrity", "score": 0, "error": str(e)}

    # 2. AI Analysis
    if use_ai_models and ollama_available:
        try:
            client = get_hybrid_client()
            prompt = f"""You are a professional hiring integrity officer. Analyze this resume excerpt for authenticity, hidden text, keyword stuffing, or inconsistencies.

Resume Excerpt:
{resume_text_excerpt}

Return ONLY a valid JSON object with this structure:
{{
    "score": <float 0-10>,
    "reasoning": "<string explanation>",
    "flags": ["<list of specific suspicious findings>"]
}}
"""
            response = client.chat(prompt, max_tokens=300, temperature=0.2)
            
            # Parse JSON from response
            text = response.get('response', '{}')
            # Extract JSON block
            json_match = re.search(r'\{.*\}', text, re.DOTALL)
            if json_match:
                result = json.loads(json_match.group())
                result['agent'] = 'integrity'
                result['backend_used'] = response.get('backend', 'ollama')
                result['model'] = response.get('model', 'unknown')
                return result
                
        except Exception as e:
            print(f"> [IntegrityEnhanced] AI failed: {e}", file=sys.stderr)

    # 3. Fallback to Heuristics (importing from simple agent logic or re-implementing)
    # Re-implementing basic logic here for standalone stability
    flags = []
    score = 8.0
    text_lower = resume_text.lower()
    
    if "confidential" in text_lower and "company" not in text_lower:
        flags.append("Suspicious confidentiality language")
        score -= 2
    if len(resume_text) < 500:
        flags.append("Very short resume")
        score -= 1
        
    return {
        "agent": "integrity",
        "score": score,
        "reasoning": "Heuristic analysis (AI unavailable)",
        "flags": flags,
        "backend_used": "heuristics"
    }

if __name__ == "__main__":
    scan_resume_integrity("test.pdf")
