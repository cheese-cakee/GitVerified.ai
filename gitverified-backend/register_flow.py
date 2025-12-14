import requests
import os
import time

FLOW_FILE = "flows/gitverified_pipeline.yaml"
API_URL = "http://localhost:8080/api/v1/flows"

# Credentials - Set via environment variables or config
AUTH = (os.environ.get('KESTRA_USERNAME', 'admin@gitverified.local'), 
        os.environ.get('KESTRA_PASSWORD', 'ChangeMe123!'))

def register_flow():
    print(f"Reading flow from {FLOW_FILE}...")
    if not os.path.exists(FLOW_FILE):
        print(f"ERROR: Flow file not found at {FLOW_FILE}")
        print(f"Current directory: {os.getcwd()}")
        return
    
    with open(FLOW_FILE, 'r', encoding='utf-8') as f:
        yaml_content = f.read()

    headers = {'Content-Type': 'application/x-yaml'}
    
    # Retry loop since Kestra might be starting
    for i in range(5):
        try:
            print(f"Attempt {i+1}: POST to {API_URL}")
            resp = requests.post(API_URL, data=yaml_content, headers=headers, auth=AUTH, timeout=10)
            
            if resp.status_code == 200:
                print("✅ SUCCESS: Flow registered/updated!")
                result = resp.json()
                print(f"Flow ID: {result.get('id', 'Unknown')}")
                print(f"Namespace: {result.get('namespace', 'Unknown')}")
                return True
            elif resp.status_code == 401:
                print(f"❌ Authentication failed. Check credentials.")
                print(f"Response: {resp.text}")
            else:
                print(f"⚠️ Failed: {resp.status_code}")
                print(f"Response: {resp.text[:500]}")
                
        except requests.exceptions.ConnectionError:
            print("⚠️ Connection error... Kestra starting?")
        except Exception as e:
            print(f"❌ Error: {e}")
            
        if i < 4:
            time.sleep(2)

    print("❌ ERROR: Could not register flow after retries.")
    print("\n💡 Alternative: Import via Kestra UI:")
    print("   1. Go to http://localhost:8080/ui/main/flows")
    print("   2. Click 'Import' button")
    print("   3. Select: gitverified-backend/flows/gitverified_pipeline.yaml")
    return False

if __name__ == "__main__":
    register_flow()
