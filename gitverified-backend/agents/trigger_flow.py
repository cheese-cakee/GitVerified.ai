
import sys
import requests
import os
import json

import sys
import urllib.request
import urllib.parse
import os
import io
import uuid
import base64

# Internal Trigger Script (Standard Lib Only - No PIP Deps needed)
# Runs INSIDE the Docker Network (Python Worker -> Kestra)

KESTRA_API = "http://kestra:8080/api/v1/executions/ai.gitverified/gitverified-main-pipeline"

import subprocess

def trigger(pdf_path, jd):
    print(f"> Internal Trigger (CURL): {pdf_path}")
    
    filename = os.path.basename(pdf_path)
    candidate_name = filename.replace(".pdf", "").replace("_", " ")
    
    # CURL Command Construction (Safe list-based, no shell quoting issues)
    cmd = [
        "curl",
        "-X", "POST",
        KESTRA_API,
        "-u", "kestra:kestra",
        "-F", f"candidate_name={candidate_name}",
        "-F", f"pdf_path={pdf_path}",
        "-F", f"job_description={jd[:500]}", # Truncate JD
        "-F", "github_reponame=mock/pending",
        "-F", "leetcode_username=mock/pending"
    ]
    
    try:
        # Run CURL
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
        
        if result.returncode == 0:
            # Parse Success format usually JSON
            if "id" in result.stdout:
                import json
                try:
                    data = json.loads(result.stdout)
                    print(f"SUCCESS: {data.get('id')}")
                except:
                    # Fallback if text response
                    print(f"SUCCESS: {result.stdout[:50]}")
            else:
                 print(f"ERROR: {result.stdout} {result.stderr}")
        else:
            print(f"ERROR: CURL Failed code={result.returncode}")
            print(f"STDOUT: {result.stdout}")
            print(f"STDERR: {result.stderr}")
            
    except FileNotFoundError:
        print("EXCEPTION: 'curl' not found in container. Fallback failed.")
    except Exception as e:
        print(f"EXCEPTION: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: trigger_flow.py <pdf_path> [jd]")
        sys.exit(1)
        
    pdf = sys.argv[1]
    jd = sys.argv[2] if len(sys.argv) > 2 else "Standard Engineer"
    trigger(pdf, jd)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: trigger_flow.py <pdf_path> [jd]")
        sys.exit(1)
        
    pdf = sys.argv[1]
    jd = sys.argv[2] if len(sys.argv) > 2 else "Standard Engineer"
    trigger(pdf, jd)
