"""
Updated Uniqueness Agent - Standalone for Hybrid Architecture
"""

import json
import sys
import re
import requests

def analyze_project_uniqueness(repo_url):
    """Analyze project for originality vs tutorial clones"""
    print(f"> [Uniqueness] Analyzing project: {repo_url}", file=sys.stderr)
    
    try:
        # Extract repo info
        repo_name = "Unknown Project"
        description = "No description available"
        
        if "github.com" in repo_url:
            # Try to parse from URL
            match = re.search(r'github\.com/([^/]+/[^/]+)', repo_url)
            if match:
                repo_name = match.group(1)
        
        # Basic heuristic analysis based on repo name and URL
        repo_name_lower = repo_name.lower()
        score = 6.0
        reasoning = []
        
        # Tutorial clone indicators
        tutorial_patterns = [
            "todo", "weather", "calculator", "timer", "clock",
            "netflix", "spotify", "youtube", "instagram", "twitter",
            "clone", "tutorial", "starter", "template", "boilerplate"
        ]
        
        if any(pattern in repo_name_lower for pattern in tutorial_patterns):
            score = 3.0
            reasoning.append("Repository name suggests tutorial clone")
        
        # Novel project indicators
        novel_patterns = [
            "kernel", "compiler", "operating-system", "os", "framework",
            "engine", "algorithm", "protocol", "library", "sdk",
            "custom", "novel", "innovative", "unique"
        ]
        
        if any(pattern in repo_name_lower for pattern in novel_patterns):
            score = 8.5
            reasoning.append("Repository name suggests original work")
        
        # Try to get some basic info (without API key for public repos)
        try:
            # Parse owner/repo from URL
            if "github.com" in repo_url:
                match = re.search(r'github\.com/([^/]+/[^/]+)', repo_url)
                if match:
                    repo_path = match.group(1)
                    # Try simple API call (no auth needed for public repos)
                    api_url = f"https://api.github.com/repos/{repo_path}"
                    response = requests.get(api_url, timeout=5)
                    
                    if response.status_code == 200:
                        data = response.json()
                        description = data.get("description", "").lower()
                        stars = data.get("stargazers_count", 0)
                        forks = data.get("forks_count", 0)
                        
                        # Adjust score based on actual project data
                        if stars > 100:
                            score += 0.5
                            reasoning.append("Popular project with significant stars")
                        
                        if forks > 50:
                            score += 0.3
                            reasoning.append("Project has been forked multiple times")
                        
                        if len(description) > 100 and "tutorial" not in description:
                            score += 0.2
                            reasoning.append("Detailed project description")
                        
                        elif "tutorial" in description or "learning" in description:
                            score -= 1.0
                            reasoning.append("Description mentions tutorial/learning")
                        
        except Exception as e:
            print(f"> [Uniqueness] GitHub API check failed: {e}", file=sys.stderr)
            reasoning.append("Unable to fetch project details from GitHub")
        
        # Final scoring
        score = max(0, min(10, score))
        
        result = {
            "agent": "uniqueness",
            "score": score,
            "reasoning": "; ".join(reasoning) if reasoning else "Project analysis complete",
            "backend_used": "heuristics",
            "repo_name": repo_name,
            "analysis_indicators": {
                "tutorial_indicators": any(pattern in repo_name_lower for pattern in tutorial_patterns),
                "novel_indicators": any(pattern in repo_name_lower for pattern in novel_patterns)
            }
        }
        
        print(f"> [Uniqueness] Score: {score}/10", file=sys.stderr)
        return result
        
    except Exception as e:
        print(f"> [Uniqueness] Error: {e}", file=sys.stderr)
        return {
            "agent": "uniqueness",
            "score": 5.0,
            "error": str(e),
            "reasoning": "Analysis failed - using neutral score"
        }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        repo_url = "https://github.com/example/project"
    else:
        repo_url = sys.argv[1]
    
    result = analyze_project_uniqueness(repo_url)
    print(json.dumps(result, indent=2))