"""
GitVerified Agent: Sentinel (The Security Auditor)
Protocol: TRUST_BUT_VERIFY
Logic: Code Quality & Security Scan -> INTERNAL LLMA-3 ENGINE

Dependency: groq (Python SDK)
"""

import json
import sys
import os
from groq import Groq

def scan_code_quality(code_snippet):
    print(f"> [Agent:Sentinel] Scanning code snippet for security flaws...", file=sys.stderr)
    
    # SYSTEM: Internal Security Scanner (Powered by Llama 3)
    # We use this to scan the candidate's code for vulnerabilities entirely locally/via Groq.
    # The official CodeRabbit bot will be attached to the repo separately.
    
    groq_api_key = os.environ.get("GROQ_API_KEY")
    if not groq_api_key:
        return {
            "agent": "sentinel",
            "score": 0,
            "verdict": "FAIL",
            "flags": ["Missing API Key (Groq)."]
        }
        
    client = Groq(api_key=groq_api_key)
    
    prompt = f"""
    You are 'CodeRabbit', an automated Code Reviewer.
    Analyze the following code for:
    1. Security Vulnerabilities (Injection, Secrets, XSS)
    2. Code Quality (Spaghetti code, massive complexity)
    3. Performance Bottlenecks
    
    Code:
    {code_snippet[:4000]}
    
    Output JSON ONLY: {{ "score": number (0-100), "flags": ["string"], "verdict": "string" }}
    """
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama3-8b-8192",
            response_format={"type": "json_object"},
        )
        
        result = json.loads(chat_completion.choices[0].message.content)
        return {
            "agent": "sentinel",
            "score": result.get("score", 70),
            "flags": result.get("flags", []),
            "verdict": result.get("verdict", "Review Complete"),
            "model": "Llama-3-8B-Instruct (GitVerified Engine)"
        }
    except Exception as e:
        return {"agent": "sentinel", "error": str(e)}

def main():
    try:
        if len(sys.argv) < 2:
            code = "function test() { const password = '123'; }"
        else:
            code = sys.argv[1]
            
        result = scan_code_quality(code)
        print(json.dumps(result, indent=2))
    except:
        sys.exit(1)

if __name__ == "__main__":
    main()
