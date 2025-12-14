
import os
import sys
import requests
import json
import time

# Robust Registration Script
# 1. Reads YAML from file (Source of Truth)
# 2. Tries API (Auth/No-Auth)
# 3. Failover to Docker CLI? (Not implemented here, but we ensure API works)

KESTRA_URL = "http://localhost:8080/api/v1/flows"
FLOW_FILE = os.path.join(os.path.dirname(__file__), "../flows/gitverified_pipeline.yaml")

def register_flow():
    print(f"> Reading Flow Definition: {FLOW_FILE}")
    if not os.path.exists(FLOW_FILE):
        print("Error: Flow file not found.")
        sys.exit(1)

    with open(FLOW_FILE, 'r') as f:
        flow_yaml = f.read()

    print("> Attempting Registration via API...")
    
    # Try 1: Basic Auth (Default)
    try:
        r = requests.post(
            KESTRA_URL, 
            data=flow_yaml, 
            headers={"Content-Type": "application/x-yaml"},
            auth=('kestra', 'kestra')
        )
        if r.status_code == 200:
            print(f"SUCCESS: Flow registered! {r.json().get('id', 'Unknown ID')}")
            return
        else:
            print(f"Auth Method 1 Failed: {r.status_code} {r.text}")
    except Exception as e:
        print(f"Connection Error: {e}")

    # Try 2: No Auth
    try:
        r = requests.post(
            KESTRA_URL, 
            data=flow_yaml, 
            headers={"Content-Type": "application/x-yaml"}
        )
        if r.status_code == 200:
            print(f"SUCCESS: Flow registered (No Auth)! {r.json().get('id')}")
            return
    except:
        pass

    print("FATAL: Could not register flow via API.")
    print("Manual fix: Run 'docker restart gitverified-backend-kestra-1'")
    # Note: Kestra auto-loads from /app/flows if configured, and we saw './flows:/app/flows' in compose!
    # So restarting the container WILL register it.
    
if __name__ == "__main__":
    register_flow()
