"""
GitVerified: Local Simulation Runner
Protocol: TRUST_BUT_VERIFY

This script simulates the Kestra Pipeline by running all agents sequentially 
and aggregating their results. Use this to verify the "Forensic Logic" 
without needing to spin up the full Docker container stack.
"""

import subprocess
import json
import sys
import os
import time

def run_agent(agent_name, script_path, args=None):
    print(f"\n[{agent_name}] Starting Forensic Scan...")
    cmd = [sys.executable, script_path]
    if args:
        cmd.extend(args)
        
    try:
        # Run agent and capture JSON output
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        try:
            # Parse JSON to verify it works
            data = json.loads(result.stdout)
            # Pretty print the JSON
            print(f"[{agent_name}] VERDICT RECEIVED:")
            print(json.dumps(data, indent=2))
            return data
        except json.JSONDecodeError:
            print(f"[{agent_name}] ERROR: Agent returned invalid JSON.")
            print("Raw Output:", result.stdout)
            return None
    except subprocess.CalledProcessError as e:
        print(f"[{agent_name}] CRASHED: {e}")
        print("Error Output:", e.stderr)
        return None

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    agents_dir = os.path.join(base_dir, "agents")
    
    print("="*60)
    print("      GITVERIFIED: FORENSIC PIPELINE SIMULATION")
    print("="*60)
    print(f"Agents Directory: {agents_dir}")
    
    # 1. INTEGRITY CHECK (PDF Scan)
    # Mock inputs
    integrity_res = run_agent("Agent:Integrity", os.path.join(agents_dir, "agent_integrity.py"))
    time.sleep(1)

    # 2. ALGO CHECK (LeetCode)
    algo_res = run_agent("Agent:Algo", os.path.join(agents_dir, "agent_algo.py"))
    time.sleep(1)

    # 3. OUMI CHECK (Project Uniqueness)
    oumi_res = run_agent("Agent:Oumi", os.path.join(agents_dir, "agent_oumi.py"))
    time.sleep(1)
    
    # 4. RABBIT CHECK (Code Quality)
    rabbit_res = run_agent("Agent:Rabbit", os.path.join(agents_dir, "agent_rabbit.py"))
    time.sleep(1)
    
    # 5. RELEVANCE CHECK (JD Match)
    relevance_res = run_agent("Agent:Relevance", os.path.join(agents_dir, "agent_relevance.py"))
    time.sleep(1)

    print("\n" + "="*60)
    print("      AGGREGATED DECISION ENGINE")
    print("="*60)
    
    # Simple Mock Aggregation
    final_score = 0
    count = 0
    
    if integrity_res: 
        final_score += integrity_res.get("integrity_score", 0)
        count += 1
    if relevance_res:
        final_score += (relevance_res.get("match_percent", 0))
        count += 1
        
    avg = final_score / max(count, 1)
    
    print(f"CANDIDATE: Mock Candidate")
    print(f"FINAL P-SCORE: {int(avg)} / 100")
    print(f"VERDICT: {'HIRE' if avg > 75 else 'REJECT'}")
    print("="*60)

if __name__ == "__main__":
    main()
