"""
Enhanced Code Quality Agent - AI-Powered Code Analysis
"""

import json
import sys
import os
import re
import base64

current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

from hybrid_model import get_hybrid_client

def scan_code_quality(code_sample, use_ai_models=True, ollama_available=True):
    """Analyze code quality using AI if available"""
    print(f"> [CodeQualityEnhanced] Analyzing code...", file=sys.stderr)
    
    # AI Analysis
    if use_ai_models and ollama_available and len(code_sample) > 10:
        try:
            client = get_hybrid_client()
            prompt = f"""You are a Senior Principal Engineer. Analyze this code snippet for security vulnerabilities, best practices, and maintainability.

Code Snippet:
{code_sample[:1500]}

Return ONLY a valid JSON object:
{{
    "score": <int 0-100>,
    "verdict": "<GOOD|BAD|EXCELLENT|ACCEPTABLE>",
    "flags": ["<list of specific issues>"],
    "security_risk": "<LOW|MEDIUM|HIGH>"
}}
"""
            response = client.chat(prompt, max_tokens=300, temperature=0.2)
            
            text = response.get('response', '{}')
            json_match = re.search(r'\{.*\}', text, re.DOTALL)
            if json_match:
                result = json.loads(json_match.group())
                result['agent'] = 'code_quality'
                result['backend_used'] = response.get('backend', 'ollama')
                return result
                
        except Exception as e:
            print(f"> [CodeQualityEnhanced] AI failed: {e}", file=sys.stderr)

    # Fallback Heuristics
    score = 75
    flags = []
    if "password" in code_sample.lower():
        score -= 20
        flags.append("Possible hardcoded secret")
    if "eval(" in code_sample:
        score -= 30
        flags.append("Dangerous eval usage")
        
    return {
        "agent": "code_quality",
        "score": score,
        "verdict": "ACCEPTABLE",
        "flags": flags,
        "backend_used": "heuristics"
    }
