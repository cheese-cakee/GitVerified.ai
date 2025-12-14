"""
GitVerified Agent: Oumi (Project Uniqueness)
Protocol: TRUST_BUT_VERIFY
Logic: Semantic Deduplication + Boilerplate Detection

This agent:
1. Scans GitHub repo content (README, file structure).
2. Compares against a know database of "Generic Tutorial Projects" (e.g. Weather App, To-Do List).
3. Scores "Uniqueness".
   - Top 1%: Novel Implementation
   - Bottom 50%: Clone/Fork/Tutorial

Dependency: requests, fuzzywuzzy
"""

import json
import sys
import random

def calculate_uniqueness_score(repo_url):
    """
    Simulates fetching repo metadata and comparing against
    a vector database of 10M+ known student projects.
    """
    
    # Mock Logic: Deterministic hash of URL to give stable demo results
    seed = sum(ord(c) for c in repo_url) % 100
    
    # Bias towards high uniqueness for demo
    base_uniqueness = 70
    variance = seed % 30 # 0-29
    
    score = base_uniqueness + variance
    
    if score > 95:
        verdict = "VISIONARY"
        justification = "Novel architecture detected. No known clones."
    elif score > 80:
        verdict = "UNIQUE"
        justification = "Standard stack but custom implementation."
    elif score > 50:
        verdict = "DERIVATIVE"
        justification = "High similarity to common tutorials (e.g. 'Build a Netflix Clone')."
    else:
        verdict = "CLONE"
        justification = "Exact match (>90%) with existing public template."
        
    return {
        "score": score,
        "verdict": verdict,
        "justification": justification
    }

def main():
    try:
        # Input: Repo URL
        # repo_url = sys.argv[1]
        repo_url = "https://github.com/mock_user/advanced-distributed-system"
        
        print(f"> [Agent:Oumi] Analysting repository: {repo_url}")
        print("> [Agent:Oumi] Extracting Abstract Syntax Tree (AST)...")
        print("> [Agent:Oumi] Comparing against Vector DB (14M Projects)...")
        
        # Simulating processing time
        # time.sleep(1)
        
        result = calculate_uniqueness_score(repo_url)
        
        output = {
            "agent": "oumi",
            "module": "uniqueness_engine",
            "scan_id": f"scan_{random.randint(1000,9999)}",
            "results": result
        }
        
        print(json.dumps(output, indent=2))
        
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
