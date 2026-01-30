"""
Enhanced Uniqueness Agent - AI-Powered Project Analysis
"""

import json
import sys
import os
import re

current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

from hybrid_model import get_hybrid_client

def analyze_project_uniqueness(repo_url, use_ai_models=True, ollama_available=True):
    """Analyze project uniqueness using AI if available"""
    print(f"> [UniquenessEnhanced] Analyzing: {repo_url}", file=sys.stderr)
    
    # AI Analysis
    if use_ai_models and ollama_available:
        try:
            client = get_hybrid_client()
            prompt = f"""You are a startup CTO. Analyze this GitHub project URL and name to determine if it is a generic tutorial clone (like 'weather-app', 'todo-list', 'netflix-clone') or an original, complex engineering project.

Project: {repo_url}

Return ONLY a valid JSON object:
{{
    "score": <float 0-10, where 10 is highly original>,
    "reasoning": "<brief explanation>",
    "project_type": "<Tutorial|Original|Fork|Library>"
}}
"""
            response = client.chat(prompt, max_tokens=200, temperature=0.3)
            
            text = response.get('response', '{}')
            json_match = re.search(r'\{.*\}', text, re.DOTALL)
            if json_match:
                result = json.loads(json_match.group())
                result['agent'] = 'uniqueness'
                result['backend_used'] = response.get('backend', 'ollama')
                return result
                
        except Exception as e:
            print(f"> [UniquenessEnhanced] AI failed: {e}", file=sys.stderr)

    # Fallback Heuristics
    score = 6.0
    reasoning = "Moderate uniqueness (heuristic)"
    if "clone" in repo_url.lower() or "tutorial" in repo_url.lower():
        score = 3.0
        reasoning = "Likely tutorial clone"
        
    return {
        "agent": "uniqueness",
        "score": score,
        "reasoning": reasoning,
        "backend_used": "heuristics"
    }
