"""
GitVerified Agent: Oumi (The Uniqueness Judge)
Protocol: TRUST_BUT_VERIFY
Logic: LLM-based Project Novelty Analysis -> REAL IMPLEMENTATION

Uses Oumi library for LLM-based project uniqueness analysis.
Supports DPO fine-tuning for specialized models (see oumi/train_config.yaml).
Distinguishes tutorial clones from novel engineering projects.

Dependency: oumi, requests
"""

import json
import sys
import os
import requests
import re

# Try to import Oumi library for inference
try:
    from oumi.inference import LlamaPredictor
    OUMI_AVAILABLE = True
except ImportError:
    try:
        # Alternative import path
        from oumi import LlamaPredictor
        OUMI_AVAILABLE = True
    except ImportError:
        OUMI_AVAILABLE = False
        print("> [Agent:Oumi] WARNING: Oumi library not found. Install with: pip install oumi", file=sys.stderr)

def fetch_github_repo_content(repo_name):
    """Fetch README and basic repo info from GitHub API"""
    print(f"> [Agent:Oumi] Fetching GitHub repo: {repo_name}", file=sys.stderr)
    
    # Parse repo name (handle both full URL and owner/repo format)
    if "github.com" in repo_name:
        match = re.search(r'github\.com/([^/]+/[^/]+)', repo_name)
        if match:
            repo_path = match.group(1)
        else:
            return None
    else:
        repo_path = repo_name
    
    # Remove .git suffix if present
    repo_path = repo_path.rstrip('.git')
    
    try:
        # Fetch README
        readme_url = f"https://api.github.com/repos/{repo_path}/readme"
        headers = {}
        if os.environ.get("GITHUB_TOKEN"):
            headers["Authorization"] = f"token {os.environ.get('GITHUB_TOKEN')}"
        
        readme_resp = requests.get(readme_url, headers=headers, timeout=10)
        readme_content = ""
        if readme_resp.status_code == 200:
            import base64
            readme_data = readme_resp.json()
            readme_content = base64.b64decode(readme_data.get('content', '')).decode('utf-8', errors='ignore')
        
        # Fetch repo info
        repo_url = f"https://api.github.com/repos/{repo_path}"
        repo_resp = requests.get(repo_url, headers=headers, timeout=10)
        repo_info = {}
        if repo_resp.status_code == 200:
            repo_data = repo_resp.json()
            repo_info = {
                "description": repo_data.get("description", ""),
                "language": repo_data.get("language", ""),
                "stars": repo_data.get("stargazers_count", 0),
                "forks": repo_data.get("forks_count", 0)
            }
        
        # Fetch package.json if exists (for Node projects)
        package_url = f"https://api.github.com/repos/{repo_path}/contents/package.json"
        package_resp = requests.get(package_url, headers=headers, timeout=10)
        package_info = ""
        if package_resp.status_code == 200:
            import base64
            package_data = package_resp.json()
            package_content = base64.b64decode(package_data.get('content', '')).decode('utf-8', errors='ignore')
            try:
                package_json = json.loads(package_content)
                package_info = f"Dependencies: {', '.join(list(package_json.get('dependencies', {}).keys())[:10])}"
            except:
                pass
        
        context = f"""
        Repository: {repo_path}
        Description: {repo_info.get('description', 'N/A')}
        Language: {repo_info.get('language', 'N/A')}
        Stars: {repo_info.get('stars', 0)}
        
        README:
        {readme_content[:2000]}
        
        {package_info}
        """
        
        return context
        
    except Exception as e:
        print(f"> [Agent:Oumi] GitHub API Error: {e}", file=sys.stderr)
        return f"Repository: {repo_path}\n(Unable to fetch full details from GitHub API)"

def analyze_project_uniqueness(repo_url, context_text=None):
    print(f"> [Agent:Oumi] Initializing Oumi library for: {repo_url}", file=sys.stderr)
    
    # Fetch repo content if not provided
    if not context_text:
        context_text = fetch_github_repo_content(repo_url)
        if not context_text:
            context_text = f"Repository: {repo_url}\n(Unable to fetch details)"
    
    # Use Oumi library for inference
    if OUMI_AVAILABLE:
        try:
            print("> [Agent:Oumi] Loading Oumi LlamaPredictor...", file=sys.stderr)
            
            # Initialize Oumi predictor
            # Model can be specified via env var or use default
            # For hackathon: Can use fine-tuned model from oumi/train_config.yaml training
            model_name = os.environ.get("OUMI_MODEL", "meta-llama/Meta-Llama-3-8B-Instruct")
            # If fine-tuned model exists, use it: "./models/gitverified-judge-v1" (from oumi_train.yaml)
            fine_tuned_path = os.environ.get("OUMI_FINETUNED_PATH", None)
            if fine_tuned_path and os.path.exists(fine_tuned_path):
                print(f"> [Agent:Oumi] Using fine-tuned model from: {fine_tuned_path}", file=sys.stderr)
                predictor = LlamaPredictor(model_name=fine_tuned_path)
            else:
                predictor = LlamaPredictor(model_name=model_name)
            
            prompt = f"""You are the 'Oumi Uniqueness Engine'.
Analyze this project context (User README/Code/Description).

Project: {repo_url}
Context:
{context_text[:3000]}

Criteria:
1. Tutorial Clones (Todo/Weather/Netflix) = LOW SCORE (1-4)
2. Standard Apps (E-commerce, CRM) = MEDIUM SCORE (4-7)
3. Novel Engineering (Compilers, Kernels, AI, Complex Systems) = HIGH SCORE (8-10)

Output JSON ONLY: {{ "score": float, "reasoning": "string" }}"""
            
            print("> [Agent:Oumi] Running Oumi inference...", file=sys.stderr)
            response = predictor.predict(prompt)
            
            # Parse response (Oumi may return string or dict)
            if isinstance(response, str):
                # Try to extract JSON from response
                try:
                    result = json.loads(response)
                except:
                    # If not JSON, try to find JSON in the response
                    import re
                    json_match = re.search(r'\{[^{}]*"score"[^{}]*\}', response)
                    if json_match:
                        result = json.loads(json_match.group())
                    else:
                        # Fallback: extract score from text
                        score_match = re.search(r'score["\s:]+([0-9.]+)', response, re.IGNORECASE)
                        score = float(score_match.group(1)) if score_match else 5.0
                        result = {"score": score, "reasoning": response[:200]}
            else:
                result = response if isinstance(response, dict) else {"score": 5.0, "reasoning": str(response)}
            
            return {
                "agent": "oumi",
                "score": float(result.get("score", 5.0)),
                "reasoning": result.get("reasoning", "Analysis complete."),
                "model": f"Oumi-Llama-3-8B-Instruct",
                "library": "oumi"
            }
            
        except Exception as e:
            print(f"> [Agent:Oumi] Oumi inference error: {e}", file=sys.stderr)
            # Fallback to heuristic if Oumi fails
            return {
                "agent": "oumi",
                "score": 5.0,
                "reasoning": f"Oumi inference failed: {str(e)}. Using fallback analysis.",
                "error": str(e),
                "library": "oumi (fallback)"
            }
    else:
        # Fallback: Heuristic analysis if Oumi not available
        print("> [Agent:Oumi] Oumi library not available. Using heuristic fallback.", file=sys.stderr)
        
        # Simple heuristic based on keywords
        context_lower = context_text.lower()
        score = 5.0
        
        # Tutorial indicators
        tutorial_keywords = ["todo", "weather app", "netflix clone", "tutorial", "starter", "template"]
        if any(kw in context_lower for kw in tutorial_keywords):
            score = 2.0
        
        # Novel engineering indicators
        novel_keywords = ["kernel", "compiler", "os", "operating system", "custom protocol", "embedded"]
        if any(kw in context_lower for kw in novel_keywords):
            score = 8.5
        
        return {
            "agent": "oumi",
            "score": score,
            "reasoning": "Heuristic analysis (Oumi library not installed). Install with: pip install oumi",
            "library": "heuristic (oumi not available)"
        }

def main():
    try:
        # Args: [1] = repo_url or name
        if len(sys.argv) < 2:
            repo = "github.com/test/project"
        else:
            repo = sys.argv[1]
            
        result = analyze_project_uniqueness(repo)
        print(json.dumps(result, indent=2))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
