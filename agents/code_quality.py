"""
Code Quality Agent - Analyzes actual code from GitHub repositories.

This agent fetches real code from GitHub and performs:
- Security vulnerability detection
- Code quality assessment  
- Best practices analysis
"""

import json
import sys
import re
from typing import Optional
from dataclasses import dataclass

import structlog

logger = structlog.get_logger(__name__)


@dataclass
class CodeQualityResult:
    """Result of code quality analysis."""
    score: int
    verdict: str
    security_score: int
    flags: list[str]
    positive_indicators: list[str]
    files_analyzed: int
    primary_language: str
    backend_used: str


def analyze_code_content(code: str, filename: str = "") -> tuple[list[str], list[str], int]:
    """
    Analyze a single code file for quality issues.
    
    Returns:
        Tuple of (issues, positives, score_delta)
    """
    issues = []
    positives = []
    score_delta = 0
    
    code_lower = code.lower()
    lines = code.split('\n')
    
    # Security checks
    if re.search(r'password\s*=\s*["\'][^"\']+["\']', code, re.IGNORECASE):
        issues.append("Hardcoded password detected")
        score_delta -= 25
    
    if re.search(r'api[_-]?key\s*=\s*["\'][^"\']+["\']', code, re.IGNORECASE):
        issues.append("Hardcoded API key detected")
        score_delta -= 25
    
    if "eval(" in code and ".py" in filename:
        issues.append("Dangerous eval() usage")
        score_delta -= 20
    
    if re.search(r'exec\s*\(', code) and ".py" in filename:
        issues.append("Dangerous exec() usage")
        score_delta -= 20
    
    if "document.write" in code_lower:
        issues.append("Potential XSS (document.write)")
        score_delta -= 15
    
    if re.search(r'innerHTML\s*=', code):
        issues.append("Potential XSS (innerHTML)")
        score_delta -= 10
    
    if re.search(r'SELECT\s+\*\s+FROM', code, re.IGNORECASE) and "LIMIT" not in code.upper():
        issues.append("Unbounded SQL SELECT")
        score_delta -= 10
    
    if re.search(r'os\.system\s*\(', code):
        issues.append("Shell command execution (os.system)")
        score_delta -= 15
    
    if re.search(r'subprocess\.(call|run|Popen)\s*\([^)]*shell\s*=\s*True', code):
        issues.append("Shell injection risk (shell=True)")
        score_delta -= 20
    
    # Quality checks - Python
    if ".py" in filename:
        if re.search(r'^def \w+\([^)]*\)\s*:\s*$', code, re.MULTILINE):
            # Function without docstring on next line
            func_matches = list(re.finditer(r'def \w+\([^)]*\):\s*\n\s*(?!""")', code))
            if func_matches and len(lines) > 20:
                issues.append("Functions missing docstrings")
                score_delta -= 5
        
        if re.search(r'except:', code):
            issues.append("Bare except clause")
            score_delta -= 10
        
        if re.search(r'from \w+ import \*', code):
            issues.append("Star import used")
            score_delta -= 5
    
    # Quality checks - JavaScript/TypeScript
    if any(ext in filename for ext in [".js", ".ts", ".jsx", ".tsx"]):
        if code.count("var ") > 5:
            issues.append("Using 'var' instead of 'let/const'")
            score_delta -= 5
        
        if "===" in code:
            positives.append("Using strict equality")
            score_delta += 3
    
    # Generic positive indicators
    if re.search(r'try\s*[:{]', code) and re.search(r'(catch|except)', code):
        positives.append("Error handling present")
        score_delta += 5
    
    if re.search(r'(test_|_test\.py|\.test\.|spec\.)', filename, re.IGNORECASE):
        positives.append("Test file detected")
        score_delta += 10
    
    if '"""' in code or "'''" in code or "/**" in code:
        positives.append("Documentation present")
        score_delta += 5
    
    if "logging" in code_lower or "logger" in code_lower:
        positives.append("Logging implemented")
        score_delta += 3
    
    if re.search(r'(typing|Type\[|Optional\[|List\[|Dict\[)', code):
        positives.append("Type hints used")
        score_delta += 5
    
    # Code organization
    if len(lines) > 10:
        avg_line_length = sum(len(line) for line in lines) / len(lines)
        if avg_line_length > 120:
            issues.append("Lines too long (avg > 120 chars)")
            score_delta -= 5
    
    return issues, positives, score_delta


def scan_code_quality(
    github_url: Optional[str] = None,
    code_snippet: Optional[str] = None,
    github_analysis: Optional[dict] = None
) -> dict:
    """
    Analyze code quality from GitHub repo or code snippet.
    
    Args:
        github_url: GitHub repository URL (will fetch code)
        code_snippet: Direct code string to analyze
        github_analysis: Pre-fetched GitHubAnalysis dict
        
    Returns:
        Code quality analysis result
    """
    logger.info("Starting code quality analysis")
    
    all_issues = []
    all_positives = []
    total_score = 75  # Base score
    files_analyzed = 0
    primary_language = "Unknown"
    
    # If we have pre-fetched GitHub analysis
    if github_analysis:
        content = github_analysis.get("content", {})
        metadata = github_analysis.get("metadata", {})
        
        if metadata:
            primary_language = metadata.get("language", "Unknown")
        
        # Analyze main files
        main_files = content.get("main_files", {})
        for filename, code in main_files.items():
            if code:
                issues, positives, delta = analyze_code_content(code, filename)
                all_issues.extend(issues)
                all_positives.extend(positives)
                total_score += delta
                files_analyzed += 1
        
        # Bonus for having tests
        file_tree = content.get("file_tree", [])
        test_files = [f for f in file_tree if "test" in f.lower()]
        if test_files:
            all_positives.append(f"Test suite present ({len(test_files)} test files)")
            total_score += 10
        
        # Bonus for CI/CD
        ci_files = [f for f in file_tree if any(ci in f.lower() for ci in [".github/workflows", "jenkinsfile", ".gitlab-ci", ".travis"])]
        if ci_files:
            all_positives.append("CI/CD configuration present")
            total_score += 5
        
        # Bonus for documentation
        doc_files = [f for f in file_tree if any(d in f.lower() for d in ["docs/", "documentation/", "wiki/"])]
        if doc_files:
            all_positives.append("Documentation directory present")
            total_score += 5
        
        # Analyze README quality
        readme = content.get("readme", "")
        if readme:
            files_analyzed += 1
            if len(readme) > 500:
                all_positives.append("Comprehensive README")
                total_score += 5
            if "## Installation" in readme or "## Setup" in readme:
                all_positives.append("README has installation instructions")
                total_score += 3
            if "## Usage" in readme or "## Examples" in readme:
                all_positives.append("README has usage examples")
                total_score += 3
    
    # If we have a direct code snippet (fallback)
    elif code_snippet:
        issues, positives, delta = analyze_code_content(code_snippet, "snippet.py")
        all_issues.extend(issues)
        all_positives.extend(positives)
        total_score += delta
        files_analyzed = 1
    
    # If we have a GitHub URL but no pre-fetched data, fetch it
    elif github_url:
        try:
            from agents.github_fetcher import analyze_github_repo
            analysis = analyze_github_repo(github_url)
            
            if analysis.error:
                return {
                    "agent": "code_quality",
                    "score": 0,
                    "error": f"GitHub fetch failed: {analysis.error}",
                    "backend_used": "github_api"
                }
            
            # Convert to dict and recurse
            github_dict = {
                "metadata": analysis.metadata.__dict__ if analysis.metadata else {},
                "content": analysis.content.__dict__ if analysis.content else {}
            }
            return scan_code_quality(github_analysis=github_dict)
            
        except ImportError:
            logger.warning("GitHub fetcher not available, using fallback")
            all_issues.append("Could not fetch GitHub code")
    
    # No input provided
    else:
        return {
            "agent": "code_quality",
            "score": 0,
            "error": "No code provided for analysis",
            "backend_used": "none"
        }
    
    # Calculate final scores
    total_score = max(0, min(100, total_score))
    security_score = max(0, total_score - len([i for i in all_issues if any(s in i.lower() for s in ["password", "xss", "sql", "eval", "exec", "shell"])]) * 10)
    
    if total_score >= 80:
        verdict = "EXCELLENT"
    elif total_score >= 60:
        verdict = "GOOD"
    elif total_score >= 40:
        verdict = "FAIR"
    else:
        verdict = "POOR"
    
    # Remove duplicates while preserving order
    all_issues = list(dict.fromkeys(all_issues))
    all_positives = list(dict.fromkeys(all_positives))
    
    result = {
        "agent": "code_quality",
        "score": total_score,
        "verdict": verdict,
        "security_score": security_score,
        "flags": all_issues,
        "positive_indicators": all_positives,
        "files_analyzed": files_analyzed,
        "primary_language": primary_language,
        "backend_used": "github_api" if github_analysis or github_url else "heuristics"
    }
    
    logger.info(
        "Code quality analysis complete",
        score=total_score,
        verdict=verdict,
        files_analyzed=files_analyzed
    )
    
    return result


if __name__ == "__main__":
    if len(sys.argv) < 2:
        # Test with a GitHub URL
        test_url = "https://github.com/psf/requests"
        print(f"Testing with: {test_url}")
        result = scan_code_quality(github_url=test_url)
    else:
        # CLI argument could be URL or code
        arg = sys.argv[1]
        if arg.startswith("http"):
            result = scan_code_quality(github_url=arg)
        else:
            result = scan_code_quality(code_snippet=arg)
    
    print(json.dumps(result, indent=2))