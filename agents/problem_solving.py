"""
Competitive Programming Agent - LeetCode & Codeforces Analysis

Trust-based scoring:
- With verified links: 100% credit
- With resume claims only: 80% credit
"""

import json
import sys
import re
import requests
import time

def fetch_leetcode_stats(username):
    """Fetch user stats from LeetCode GraphQL API"""
    if not username:
        return None

    url = "https://leetcode.com/graphql"
    query = """
    query userProblemsSolved($username: String!) {
        matchedUser(username: $username) {
            submitStats {
                acSubmissionNum {
                    difficulty
                    count
                }
            }
            profile {
                ranking
                reputation
            }
        }
    }
    """
    
    try:
        response = requests.post(url, json={'query': query, 'variables': {'username': username}}, timeout=5)
        if response.status_code == 200:
            data = response.json()
            if "errors" in data:
                print(f"> [CP Agent] LeetCode error: {data['errors']}", file=sys.stderr)
                return None
            
            stats = data.get("data", {}).get("matchedUser", {})
            if not stats:
                return None
                
            submissions = stats.get("submitStats", {}).get("acSubmissionNum", [])
            solved = {item['difficulty']: item['count'] for item in submissions}
            
            return {
                "platform": "leetcode",
                "username": username,
                "total_solved": solved.get("All", 0),
                "easy": solved.get("Easy", 0),
                "medium": solved.get("Medium", 0),
                "hard": solved.get("Hard", 0),
                "ranking": stats.get("profile", {}).get("ranking", 0),
                "verified": True
            }
    except Exception as e:
        print(f"> [CP Agent] LeetCode fetch failed: {e}", file=sys.stderr)
    return None

def fetch_codeforces_stats(username):
    """Fetch user info from Codeforces API"""
    if not username:
        return None
        
    url = f"https://codeforces.com/api/user.info?handles={username}"
    
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            if data["status"] == "OK":
                user = data["result"][0]
                return {
                    "platform": "codeforces",
                    "username": username,
                    "rating": user.get("rating", 0),
                    "rank": user.get("rank", "unrated"),
                    "maxRating": user.get("maxRating", 0),
                    "maxRank": user.get("maxRank", "unrated"),
                    "verified": True
                }
    except Exception as e:
        print(f"> [CP Agent] Codeforces fetch failed: {e}", file=sys.stderr)
    return None


def extract_cp_claims_from_resume(resume_text):
    """
    Extract CP claims from resume text when no links provided.
    Returns estimated stats based on claims.
    """
    if not resume_text:
        return None, None
    
    text_lower = resume_text.lower()
    
    lc_claim = None
    cf_claim = None
    
    # Look for problem count claims
    # Pattern: "300+ problems", "solved 500", "1000+ questions", etc.
    problem_patterns = [
        r'(\d+)\+?\s*(?:problems?|questions?)\s*(?:on|across|in)?\s*(?:leetcode|lc)',
        r'leetcode[:\s]*(\d+)\+?\s*(?:problems?|questions?|solved)?',
        r'solved\s*(\d+)\+?\s*(?:problems?|questions?)?\s*(?:on|across|in)?\s*(?:leetcode)?',
        r'(\d+)\+?\s*(?:algorithmic|dsa|data structure)\s*(?:problems?|questions?)',
    ]
    
    for pattern in problem_patterns:
        match = re.search(pattern, text_lower)
        if match:
            count = int(match.group(1))
            if count >= 50:  # Reasonable threshold
                # Estimate distribution: 40% easy, 45% medium, 15% hard
                lc_claim = {
                    "platform": "leetcode",
                    "username": "claimed",
                    "total_solved": count,
                    "easy": int(count * 0.40),
                    "medium": int(count * 0.45),
                    "hard": int(count * 0.15),
                    "ranking": 0,
                    "verified": False,
                    "source": "resume_claim"
                }
                print(f"> [CP Agent] Found LC claim: ~{count} problems", file=sys.stderr)
                break
    
    # Look for Codeforces rating claims - MUST have codeforces context
    cf_patterns = [
        r'codeforces[:\s]+(\d{3,4})',  # "codeforces: 1500" or "codeforces 1500"
        r'(?:cf|codeforces)\s+rating[:\s]+(\d{3,4})',  # "cf rating: 1500"
        r'(\d{3,4})\s+(?:rating\s+)?(?:on|in|at)\s+codeforces',  # "1500 on codeforces"
        r'codeforces[:\s]+(specialist|expert|candidate master|master|grandmaster)',  # rank with context
    ]
    
    for pattern in cf_patterns:
        match = re.search(pattern, text_lower)
        if match:
            value = match.group(1)
            
            # If it's a rank name, convert to approximate rating
            rank_to_rating = {
                "specialist": 1400,
                "expert": 1600,
                "candidate master": 1900,
                "master": 2100,
                "grandmaster": 2400,
            }
            
            if value in rank_to_rating:
                rating = rank_to_rating[value]
                rank = value
            else:
                rating = int(value)
                # Filter out years (2020-2030)
                if 2020 <= rating <= 2030:
                    continue  # Skip, likely a year
                    
                if rating >= 2400:
                    rank = "grandmaster"
                elif rating >= 2100:
                    rank = "master"
                elif rating >= 1900:
                    rank = "candidate master"
                elif rating >= 1600:
                    rank = "expert"
                elif rating >= 1400:
                    rank = "specialist"
                else:
                    rank = "pupil"
            
            cf_claim = {
                "platform": "codeforces",
                "username": "claimed",
                "rating": rating,
                "rank": rank,
                "maxRating": rating,
                "maxRank": rank,
                "verified": False,
                "source": "resume_claim"
            }
            print(f"> [CP Agent] Found CF claim: ~{rating} rating", file=sys.stderr)
            break
    
    return lc_claim, cf_claim


def evaluate_cp_profile(leetcode_user=None, codeforces_user=None, resume_text=None):
    """
    Calculate CP score based on stats.
    
    Trust model:
    - Verified (with links): 100% credit
    - Unverified (resume claims): 80% credit
    """
    print(f"> [CP Agent] Analyzing: LC={leetcode_user}, CF={codeforces_user}", file=sys.stderr)
    
    # Try to fetch verified stats
    lc_stats = fetch_leetcode_stats(leetcode_user)
    cf_stats = fetch_codeforces_stats(codeforces_user)
    
    # If no verified stats, try to extract claims from resume
    if not lc_stats and not cf_stats and resume_text:
        print("> [CP Agent] No verified profiles, checking resume claims...", file=sys.stderr)
        lc_claim, cf_claim = extract_cp_claims_from_resume(resume_text)
        if lc_claim:
            lc_stats = lc_claim
        if cf_claim:
            cf_stats = cf_claim
    
    score = 0.0
    flags = []
    reasoning = []
    
    # Determine credit multiplier
    verified = (lc_stats and lc_stats.get("verified", False)) or (cf_stats and cf_stats.get("verified", False))
    credit_multiplier = 1.0 if verified else 0.80
    
    if not verified and (lc_stats or cf_stats):
        flags.append("⚠️ Unverified claims (80% credit)")
        reasoning.append("Claims from resume - not verified via API")
    
    # 1. LeetCode Evaluation
    if lc_stats:
        # Weighted score: Easy=1, Med=3, Hard=5
        raw_score = (lc_stats['easy'] * 1) + (lc_stats['medium'] * 3) + (lc_stats['hard'] * 5)
        
        # Normalize to 0-6 range (assuming ~500 raw points is "good")
        lc_score = min(6.0, raw_score / 100)
        
        score += lc_score * credit_multiplier
        
        status = "✓ Verified" if lc_stats.get("verified") else "⚠ Claimed"
        reasoning.append(f"LeetCode ({status}): {lc_stats['total_solved']} solved")
        
        if lc_stats['hard'] > 10:
            flags.append("Good grasp of complex algorithms")
        if lc_stats['hard'] > 50:
            flags.append("Strong algorithmic problem solver")
            
    else:
        reasoning.append("No LeetCode data available")
        
    # 2. Codeforces Evaluation (Bonus)
    if cf_stats:
        rating = cf_stats['rating']
        cf_bonus = 0.0
        
        if rating >= 2400:  # Grandmaster
            cf_bonus = 4.0
            flags.append("CP: GRANDMASTER")
        elif rating >= 2100:  # Master
            cf_bonus = 3.5
            flags.append("CP: MASTER")
        elif rating >= 1900:  # Candidate Master
            cf_bonus = 3.0
            flags.append("CP: CANDIDATE MASTER")
        elif rating >= 1600:  # Expert
            cf_bonus = 2.5
            flags.append("CP: EXPERT (High Value)")
        elif rating >= 1400:  # Specialist
            cf_bonus = 1.5
        elif rating >= 1200:  # Pupil
            cf_bonus = 0.5
            
        score += cf_bonus * credit_multiplier
        
        status = "✓ Verified" if cf_stats.get("verified") else "⚠ Claimed"
        reasoning.append(f"Codeforces ({status}): {rating} ({cf_stats['rank']})")
    
    # Cap score at 10
    score = min(10.0, score)
    
    return {
        "agent": "competitive_programming",
        "score": round(score, 1),
        "reasoning": "; ".join(reasoning),
        "flags": flags,
        "verified": verified,
        "credit_applied": f"{int(credit_multiplier * 100)}%",
        "details": {
            "leetcode": lc_stats,
            "codeforces": cf_stats
        }
    }

if __name__ == "__main__":
    # Test with sample resume text
    sample_resume = """
    Achievements:
    - Problem Solving: Solved 300+ algorithmic problems across LeetCode, Codeforces, and GeeksForGeeks
    - Codeforces rating: 1033
    """
    
    result = evaluate_cp_profile(resume_text=sample_resume)
    print(json.dumps(result, indent=2))
