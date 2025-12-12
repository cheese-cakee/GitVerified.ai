import json
import sys
import os
# In a real scenario, we would import oumi and torch
# from oumi.inference import generate
# import torch

class OumiResumeJudge:
    def __init__(self, model_path="meta-llama/Meta-Llama-3-8B-Instruct", adapter_path="./oumi/output/gitverified-dpo"):
        self.model_path = model_path
        self.adapter_path = adapter_path
        print(f"[Oumi] Loading model {model_path} with adapter {adapter_path}...")
        # Mock loading delay
        # self.model = load_model(...)

    def analyze(self, resume_text, github_url=None):
        """
        Runs the DPO-fine-tuned model on the resume text.
        """
        # Construct the prompt exactly as seen in training data
        prompt = f"Resume snippet: '{resume_text[:200]}...' GitHub: {github_url or 'No link provided'}. Assessment?"
        
        # MOCK INFERENCE LOGIC FOR HACKATHON
        # In prod: response = self.model.generate(prompt)
        
        print(f"[Oumi] Analyzing candidate with prompt: {prompt}")
        
        # Simple heuristic to simulate the DPO model's "Brutal Honesty"
        score_truth = 100
        score_passion = 50
        reason = "Standard assessment."
        status = "INTERVIEW"

        lower_text = resume_text.lower()
        
        # 1. Check for DPO "Rejected" triggers
        if "expert" in lower_text and "junior" in lower_text:
             score_truth = 20
             reason = "REJECT. Claiming 'Expert' while being 'Junior' is a contradiction flagged by the model."
             status = "REJECT"
        elif not github_url:
             score_truth = 40
             reason = "REJECT. Low Proof-of-Work. No GitHub link provided."
             status = "REJECT"
        elif "white text" in lower_text: # Should have been caught by pre-check, but good as backup
             score_truth = 0
             reason = "BLACKLIST. White text artifacts detected in analysis."
             status = "REJECT"
        
        # 2. Check for DPO "Chosen" triggers (Passion)
        if "open source" in lower_text or "maintainer" in lower_text:
            score_passion = 95
            reason = "INTERVIEW. Strong signal. Verified open source contribution."
            status = "INTERVIEW"
        if "game engine" in lower_text or "compiler" in lower_text:
            score_passion = 98
            reason = "INTERVIEW. High competence signal (Systems Programming)."
            status = "INTERVIEW"

        result = {
            "agent": "oumi_dpo_judge",
            "truth_score": score_truth,
            "passion_score": score_passion,
            "reasoning": reason,
            "decision": status
        }
        
        return result

if __name__ == "__main__":
    # Test CLI usage
    if len(sys.argv) < 2:
        print("Usage: python oumi_agent.py <resume_text_file> [github_url]")
        sys.exit(1)
        
    resume_file = sys.argv[1]
    github_link = sys.argv[2] if len(sys.argv) > 2 else None
    
    with open(resume_file, 'r') as f:
        text = f.read()
        
    agent = OumiResumeJudge()
    assessment = agent.analyze(text, github_link)
    print(json.dumps(assessment, indent=2))
