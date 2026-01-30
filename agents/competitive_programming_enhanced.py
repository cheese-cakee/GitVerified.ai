"""
Enhanced Competitive Programming Agent - AI-Powered Analysis
"""

import json
import sys
import os
import re

current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

from hybrid_model import get_hybrid_client
from competitive_programming import evaluate_cp_profile

def analyze_cp_enhanced(leetcode_user, codeforces_user=None, use_ai_models=True, ollama_available=True):
    """Analyze CP profile and generate AI reasoning"""
    print(f"> [CPEnhanced] Analyzing LC:{leetcode_user} CF:{codeforces_user}", file=sys.stderr)
    
    # 1. Get deterministic stats
    stats_result = evaluate_cp_profile(leetcode_user, codeforces_user)
    
    # 2. AI Synthesis
    if use_ai_models and ollama_available:
        try:
            client = get_hybrid_client()
            
            prompt = f"""You are a Competitive Programming Coach. Analyze these stats and provide a verdict on the candidate's algorithmic ability.
            
            Stats:
            {json.dumps(stats_result['details'], indent=2)}
            
            Note: Codeforces > 1600 (Expert) is considered very strong. LeetCode Hards matter more than Easies.
            
            Return ONLY a valid JSON object:
            {{
                "score": <float 0-10, match the input score unless you see a reason to adjust>,
                "reasoning": "<professional assessment of algorithmic skills>",
                "verdict": "<Strong|Competent|Weak|Unknown>"
            }}
            """
            
            response = client.chat(prompt, max_tokens=200, temperature=0.3)
            text = response.get('response', '{}')
            json_match = re.search(r'\{.*\}', text, re.DOTALL)
            
            if json_match:
                ai_result = json.loads(json_match.group())
                
                # Merge AI reasoning with deterministic stats
                stats_result['reasoning'] = ai_result.get('reasoning', stats_result['reasoning'])
                stats_result['verdict'] = ai_result.get('verdict', 'Unknown')
                stats_result['backend_used'] = 'hybrid (stats+ai)'
                return stats_result
                
        except Exception as e:
            print(f"> [CPEnhanced] AI failed: {e}", file=sys.stderr)
            
    stats_result['backend_used'] = 'heuristics'
    return stats_result

if __name__ == "__main__":
    lc = sys.argv[1] if len(sys.argv) > 1 else "neal_wu"
    cf = sys.argv[2] if len(sys.argv) > 2 else "neal"
    print(json.dumps(analyze_cp_enhanced(lc, cf), indent=2))
