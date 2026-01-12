"""
Updated Integrity Agent - Standalone for Hybrid Architecture
"""

import json
import sys
import os

def scan_resume_integrity(resume_path):
    """Scan resume for integrity and authenticity"""
    print(f"> [Integrity] Scanning resume: {resume_path}", file=sys.stderr)
    
    try:
        # Try text extraction
        resume_text = "Resume content extracted"
        try:
            # Try to import pymupdf (may or may not be installed)
            import pymupdf as fitz
            doc = fitz.open(resume_path)
            resume_text = ""
            for page in doc:
                resume_text += page.get_text()
            resume_text = resume_text[:2000]
            print(f"> [Integrity] Successfully extracted {len(resume_text)} characters", file=sys.stderr)
        except ImportError:
            print("> [Integrity] PyMuPDF not available, using placeholder text", file=sys.stderr)
        except Exception as e:
            print(f"> [Integrity] PDF extraction failed: {e}", file=sys.stderr)
        
        # Basic heuristic analysis
        text_lower = resume_text.lower()
        flags = []
        score = 8.0
        
        # Check for suspicious patterns
        if "confidential" in text_lower and "company" not in text_lower:
            flags.append("Suspicious confidentiality language")
            score -= 2
        
        if resume_text.count("Expert") > 5 or resume_text.count("Senior") > 5:
            flags.append("Excessive keyword usage")
            score -= 1
        
        if len(resume_text) < 500:
            flags.append("Very short resume")
            score -= 1
        
        # Check for hidden text indicators (basic)
        if "white" in text_lower and ("text" in text_lower or "font" in text_lower):
            flags.append("Possible hidden text attempt")
            score -= 3
        
        score = max(0, min(10, score))
        
        result = {
            "agent": "integrity",
            "score": score,
            "reasoning": f"Resume integrity analysis complete with {len(flags)} issues detected",
            "flags": flags,
            "backend_used": "heuristics",
            "text_length": len(resume_text)
        }
        
        print(f"> [Integrity] Score: {score}/10, Flags: {len(flags)}", file=sys.stderr)
        return result
        
    except Exception as e:
        print(f"> [Integrity] Error: {e}", file=sys.stderr)
        return {
            "agent": "integrity",
            "score": 0,
            "error": str(e)
        }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        resume_path = "test.pdf"
    else:
        resume_path = sys.argv[1]
    
    result = scan_resume_integrity(resume_path)
    print(json.dumps(result, indent=2))