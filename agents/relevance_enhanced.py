"""
Enhanced Relevance Agent - AI-Powered Job Matching
"""

import json
import sys
import os
import re

current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

from hybrid_model import get_hybrid_client

def evaluate_job_relevance(resume_text, job_description, use_ai_models=True, ollama_available=True):
    """Evaluate job relevance using AI if available"""
    print(f"> [RelevanceEnhanced] Evaluating match...", file=sys.stderr)
    
    # AI Analysis
    if use_ai_models and ollama_available:
        try:
            client = get_hybrid_client()
            prompt = f"""You are a Technical Recruiter. Compare the candidate's resume to the job description.

Job Description:
{job_description[:800]}

Resume Excerpt:
{resume_text[:800]}

Return ONLY a valid JSON object:
{{
    "score": <float 0-10>,
    "reasoning": "<brief analysis of the match>",
    "key_skills_match": ["<list of matched skills>"],
    "missing_skills": ["<list of missing critical skills>"]
}}
"""
            response = client.chat(prompt, max_tokens=300, temperature=0.2)
            
            text = response.get('response', '{}')
            json_match = re.search(r'\{.*\}', text, re.DOTALL)
            if json_match:
                result = json.loads(json_match.group())
                result['agent'] = 'relevance'
                result['backend_used'] = response.get('backend', 'ollama')
                return result
                
        except Exception as e:
            print(f"> [RelevanceEnhanced] AI failed: {e}", file=sys.stderr)

    # Fallback Heuristics
    score = 5.0
    reasoning = "Neutral match (heuristic)"
    
    return {
        "agent": "relevance",
        "score": score,
        "reasoning": reasoning,
        "backend_used": "heuristics"
    }
