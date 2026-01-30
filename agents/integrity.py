"""
Integrity Agent - Resume authenticity and cheater detection.

Analyzes resumes for:
- Text extraction and validation
- Hidden text detection (white-on-white)
- Keyword stuffing
- Impossible experience claims
- Integration with cheater detection module
"""

import json
import sys
import os
import re
from typing import Optional

import structlog

logger = structlog.get_logger(__name__)


def extract_pdf_text(resume_path: str) -> tuple[str, Optional[str]]:
    """
    Extract text from PDF resume.
    
    Returns:
        Tuple of (extracted_text, error_message)
    """
    if not resume_path or not os.path.exists(resume_path):
        return "", "File not found"
    
    try:
        import fitz  # PyMuPDF
        doc = fitz.open(resume_path)
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return text[:5000], None
    except ImportError:
        return "", "PyMuPDF not installed"
    except Exception as e:
        return "", str(e)


def scan_resume_integrity(
    resume_path: Optional[str] = None,
    resume_text: Optional[str] = None,
    github_analysis: Optional[dict] = None
) -> dict:
    """
    Scan resume for integrity, authenticity, and cheating indicators.
    
    Args:
        resume_path: Path to PDF resume
        resume_text: Pre-extracted resume text
        github_analysis: Pre-fetched GitHub analysis dict
        
    Returns:
        Integrity analysis result with cheater flags
    """
    logger.info("Starting integrity analysis")
    
    # Extract text if needed
    if not resume_text and resume_path:
        resume_text, error = extract_pdf_text(resume_path)
        if error:
            logger.warning("PDF extraction failed", error=error)
    
    if not resume_text:
        return {
            "agent": "integrity",
            "score": 0,
            "error": "No resume text available",
            "flags": [],
            "backend_used": "none"
        }
    
    # Basic integrity checks
    flags = []
    score = 8.5  # Start optimistic
    text_lower = resume_text.lower()
    
    # Length check
    if len(resume_text) < 200:
        flags.append("Very short resume (< 200 chars)")
        score -= 2.0
    elif len(resume_text) < 500:
        flags.append("Short resume (< 500 chars)")
        score -= 1.0
    
    # Excessive self-promotion
    if resume_text.count("Expert") > 5:
        flags.append("Excessive 'Expert' claims")
        score -= 1.0
    if resume_text.count("Senior") > 5:
        flags.append("Excessive 'Senior' titles")
        score -= 0.5
    
    # Run comprehensive cheater detection
    try:
        from cheater_detector import analyze_for_cheating, get_cheater_score_penalty
        
        cheater_flags = analyze_for_cheating(
            resume_text=resume_text,
            github_analysis=github_analysis
        )
        
        # Add cheater flags to our flags list
        if cheater_flags.white_text:
            flags.append("⚠️ WHITE TEXT DETECTED - Possible hidden keyword injection")
        if cheater_flags.keyword_stuffing:
            flags.append("⚠️ KEYWORD STUFFING - Unnatural keyword density")
        if cheater_flags.impossible_claims:
            flags.append("⚠️ IMPOSSIBLE CLAIMS - Experience timeline doesn't add up")
        if cheater_flags.github_gaming:
            flags.append("⚠️ GITHUB GAMING - Suspicious repository patterns")
        if cheater_flags.lc_farming:
            flags.append("⚠️ CP FARMING - Suspicious competitive programming patterns")
        
        # Add detailed findings
        for detail in cheater_flags.details:
            flags.append(f"  • {detail}")
        
        # Apply score penalty
        penalty = get_cheater_score_penalty(cheater_flags)
        score -= penalty
        
        cheater_severity = cheater_flags.severity
        
    except ImportError:
        logger.warning("Cheater detector not available")
        cheater_severity = "unknown"
    except Exception as e:
        logger.error("Cheater detection failed", error=str(e))
        cheater_severity = "error"
    
    # Clamp score
    score = max(0.0, min(10.0, score))
    
    # Determine verdict
    if score >= 7.0:
        verdict = "AUTHENTIC"
    elif score >= 4.0:
        verdict = "SUSPICIOUS"
    else:
        verdict = "LIKELY_FRAUDULENT"
    
    result = {
        "agent": "integrity",
        "score": round(score, 1),
        "verdict": verdict,
        "reasoning": f"Integrity check complete. {len(flags)} issues detected.",
        "flags": flags,
        "cheater_severity": cheater_severity,
        "text_length": len(resume_text),
        "backend_used": "cheater_detector"
    }
    
    logger.info(
        "Integrity analysis complete",
        score=score,
        verdict=verdict,
        flags_count=len(flags)
    )
    
    return result


if __name__ == "__main__":
    if len(sys.argv) < 2:
        # Test with inline text
        test_text = """
        John Doe - Senior Software Engineer
        10 years of Python experience, 8 years of Kubernetes experience.
        Expert in Machine Learning, AI, Deep Learning, NLP, Computer Vision.
        """
        result = scan_resume_integrity(resume_text=test_text)
    else:
        result = scan_resume_integrity(resume_path=sys.argv[1])
    
    print(json.dumps(result, indent=2))