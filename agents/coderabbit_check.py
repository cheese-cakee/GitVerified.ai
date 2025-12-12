import json
import sys
import random

class CoderabbitAuditor:
    def __init__(self):
        print("[Coderabbit] Initializing Code Auditor...")

    def audit_repo(self, repo_url):
        """
        Simulates Coderabbit's deep analysis of a repo.
        """
        if not repo_url or "github" not in repo_url:
            return {
                "score": 0,
                "summary": "No valid repository provided."
            }

        print(f"[Coderabbit] Scanning repository: {repo_url}")
        
        # Mock Logic based on URL patterns for demo
        score = 70
        findings = []
        
        if "school" in repo_url or "assignment" in repo_url:
            score = 30
            findings.append("Pattern detected: 'School Assignment'. Low engineering complexity.")
        elif "bot" in repo_url or "scraper" in repo_url:
             score = 60
             findings.append("Scripting/Automation project. Good utility, low architectural depth.")
        elif "engine" in repo_url or "compiler" in repo_url:
             score = 95
             findings.append("High Complexity: Systems programming detected.")
        else:
             score = random.randint(60, 90)
             findings.append("Standard web/app project. Code quality is acceptable.")

        return {
            "agent": "coderabbit_auditor",
            "code_quality_score": score,
            "complexity_rating": "High" if score > 80 else "Medium",
            "findings": findings
        }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python coderabbit_check.py <repo_url>")
        sys.exit(1)
        
    url = sys.argv[1]
    auditor = CoderabbitAuditor()
    report = auditor.audit_repo(url)
    print(json.dumps(report, indent=2))
