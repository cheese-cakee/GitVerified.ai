"""
GitVerified Agent: Relevance (The Vector Matcher)
Protocol: TRUST_BUT_VERIFY
Logic: Semantic Similarity (Cosine) -> REAL IMPLEMENTATION

Dependency: sentence-transformers
"""

import json
import sys
# from sentence_transformers import SentenceTransformer, util

def calculate_relevance(resume_text, job_description):
    print("> [Agent:Relevance] Loading Embedding Model...", file=sys.stderr)
    
    try:
        from sentence_transformers import SentenceTransformer, util
        # Load lightweight model for fast inference
        # 'all-MiniLM-L6-v2' is fast and effective
        model = SentenceTransformer('all-MiniLM-L6-v2') 
        
        embeddings1 = model.encode(resume_text, convert_to_tensor=True)
        embeddings2 = model.encode(job_description, convert_to_tensor=True)
        
        # Compute Cosine Similarity
        cosine_scores = util.cos_sim(embeddings1, embeddings2)
        score = float(cosine_scores[0][0]) * 100
        
        return {
            "agent": "relevance",
            "score": round(score, 2),
            "match_level": "HIGH" if score > 75 else "MEDIUM" if score > 50 else "LOW"
        }
    except ImportError:
        return {
            "agent": "relevance",
            "score": 0,
            "error": "sentence-transformers not installed"
        }
    except Exception as e:
        # Fallback heuristic if model fails to load
        return {
            "agent": "relevance",
            "score": 50.0,
            "error": str(e),
            "note": "Model inference failed."
        }

def main():
    try:
        if len(sys.argv) < 3:
            r = "Python Expert"
            jd = "Looking for Python Expert"
        else:
            r = sys.argv[1]
            jd = sys.argv[2]
            
        result = calculate_relevance(r, jd)
        print(json.dumps(result, indent=2))
    except:
        sys.exit(1)

if __name__ == "__main__":
    main()
