"""
Updated Code Quality Agent - Standalone for Hybrid Architecture
"""

import json
import sys
import re

def scan_code_quality(code_snippet):
    """Analyze code for security vulnerabilities and quality"""
    print(f"> [CodeQuality] Analyzing code snippet...", file=sys.stderr)
    
    try:
        code_lower = code_snippet.lower()
        flags = []
        score = 85
        
        # Security vulnerability checks
        if "password" in code_lower and ("'" in code_snippet or '"' in code_snippet):
            flags.append("Hardcoded password")
            score -= 25
        
        if "select *" in code_lower and not "limit" in code_lower:
            flags.append("Unrestricted SELECT statement")
            score -= 20
        
        if "eval(" in code_snippet:
            flags.append("Use of eval() function")
            score -= 30
        
        if "document.write" in code_lower or "innerhtml" in code_lower:
            flags.append("Potential XSS vulnerability")
            score -= 15
        
        # Quality checks
        if code_snippet.count("var ") > 10:
            flags.append("Too many variables in short snippet")
            score -= 5
        
        if len(code_snippet.split('\n')) < 3:
            flags.append("Very short code sample")
            score -= 5
        
        # Positive indicators
        if "try" in code_lower and "catch" in code_lower:
            flags.append("Good error handling")
            score += 5
        
        if "function" in code_lower or "def " in code_lower:
            flags.append("Proper function structure")
            score += 5
        
        if code_snippet.strip().endswith("}"):
            flags.append("Proper code formatting")
            score += 3
        
        score = max(0, min(100, score))
        verdict = "BAD" if score < 60 else "GOOD" if score < 80 else "EXCELLENT"
        
        result = {
            "agent": "code_quality",
            "score": score,
            "verdict": verdict,
            "flags": flags,
            "backend_used": "heuristics",
            "code_lines": len(code_snippet.split('\n')),
            "security_score": max(0, score - 15)  # Separate security focus
        }
        
        print(f"> [CodeQuality] Score: {score}/100, Verdict: {verdict}", file=sys.stderr)
        return result
        
    except Exception as e:
        print(f"> [CodeQuality] Error: {e}", file=sys.stderr)
        return {
            "agent": "code_quality",
            "score": 0,
            "error": str(e)
        }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        code = "function test() { const password = '123'; return password; }"
    else:
        code = sys.argv[1]
    
    result = scan_code_quality(code)
    print(json.dumps(result, indent=2))