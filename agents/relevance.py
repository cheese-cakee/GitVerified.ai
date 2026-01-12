"""
Updated Relevance Agent - Standalone for Hybrid Architecture
"""

import json
import sys
import re

def evaluate_job_relevance(resume_text, job_description):
    """Match candidate skills to job requirements"""
    print(f"> [Relevance] Evaluating job match...", file=sys.stderr)
    
    try:
        # Text processing
        resume_lower = resume_text.lower()
        job_lower = job_description.lower()
        
        # Extract key terms from job description
        job_keywords = []
        skill_patterns = [
            r'\bpython\b', r'\bjavascript\b', r'\breact\b', r'\bnode\.?js\b',
            r'\bdjango\b', r'\bflask\b', r'\baws\b', r'\bdocker\b',
            r'\bpostgresql\b', r'\bmongodb\b', r'\bredis\b',
            r'\bgit\b', r'\bapi\b', r'\brest\b', r'\bgraphql\b',
            r'\bcss\b', r'\bhtml\b', r'\btypescript\b'
        ]
        
        for pattern in skill_patterns:
            matches = re.findall(pattern, job_lower)
            if matches:
                job_keywords.extend(matches)
        
        # Remove duplicates
        job_keywords = list(set(job_keywords))
        
        # Count matches in resume
        matches_found = 0
        matched_keywords = []
        for keyword in job_keywords:
            if keyword in resume_lower:
                matches_found += 1
                matched_keywords.append(keyword)
        
        # Calculate base relevance score
        total_keywords = len(job_keywords)
        if total_keywords == 0:
            score = 5.0  # Neutral if no keywords found
        else:
            match_percentage = matches_found / total_keywords
            score = 2.0 + (match_percentage * 8.0)  # Scale to 0-10
        
        # Experience indicators
        years_experience = 0
        year_matches = re.findall(r'(\d+)\+?\s*years?', resume_lower)
        if year_matches:
            try:
                years_experience = max(int(match) for match in year_matches)
            except:
                years_experience = 0
        
        # Education indicators
        education_keywords = ['bachelor', 'master', 'phd', 'degree', 'university', 'college']
        education_score = 1.0 if any(keyword in resume_lower for keyword in education_keywords) else 0.0
        
        # Seniority indicators
        senior_keywords = ['senior', 'lead', 'principal', 'architect', 'manager', 'director']
        seniority_score = 1.0 if any(keyword in resume_lower for keyword in senior_keywords) else 0.0
        
        # Adjust score based on additional factors
        if years_experience >= 5:
            score += 0.5
        if years_experience >= 10:
            score += 0.5
        score += education_score * 0.3
        score += seniority_score * 0.2
        
        # Cap score
        score = max(0, min(10, score))
        
        # Generate reasoning
        reasoning_parts = []
        reasoning_parts.append(f"Found {matches_found}/{total_keywords} required skills")
        
        if matches_found > 0:
            reasoning_parts.append(f"Matched skills: {', '.join(matched_keywords[:5])}")
        
        if years_experience >= 5:
            reasoning_parts.append(f"Strong experience: {years_experience} years")
        
        if education_score > 0:
            reasoning_parts.append("Relevant education detected")
        
        if seniority_score > 0:
            reasoning_parts.append("Senior level experience indicated")
        
        reasoning = "; ".join(reasoning_parts)
        
        result = {
            "agent": "relevance",
            "score": round(score, 1),
            "reasoning": reasoning,
            "backend_used": "heuristics",
            "analysis_details": {
                "job_keywords_found": matches_found,
                "total_job_keywords": total_keywords,
                "matched_keywords": matched_keywords,
                "years_experience": years_experience,
                "education_indicated": education_score > 0,
                "seniority_indicated": seniority_score > 0
            }
        }
        
        print(f"> [Relevance] Score: {score}/10, Match: {matches_found}/{total_keywords}", file=sys.stderr)
        return result
        
    except Exception as e:
        print(f"> [Relevance] Error: {e}", file=sys.stderr)
        return {
            "agent": "relevance",
            "score": 5.0,
            "error": str(e),
            "reasoning": "Analysis failed - using neutral score"
        }

if __name__ == "__main__":
    if len(sys.argv) < 3:
        resume_text = "Experienced Python developer with 5 years of experience in Django and AWS"
        job_desc = "Looking for Senior Python Developer with Django and AWS experience"
    else:
        resume_text = sys.argv[1]
        job_desc = sys.argv[2]
    
    result = evaluate_job_relevance(resume_text, job_desc)
    print(json.dumps(result, indent=2))