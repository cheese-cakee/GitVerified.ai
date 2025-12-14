import requests
import sys
import os

def trigger_workflow(pdf_path, jd):
    # 1. URL for your Flow ID
    url = "http://localhost:8080/api/v1/executions/ai.gitverified/gitverified-main-pipeline"
    
    # 2. Credentials from environment or config
    auth = (os.environ.get('KESTRA_USERNAME', 'admin@gitverified.local'), 
            os.environ.get('KESTRA_PASSWORD', 'ChangeMe123!'))
    
    filename = os.path.basename(pdf_path)
    # Sanitize name
    candidate_name = filename.replace(".pdf", "").replace("_", " ")

    # 3. Inputs (Modified to match Flow Requirements)
    # Kestra accepts 'files' (multipart) for inputs if the input type is used
    # But strictly, we used STRING inputs in the flow for Paths.
    # We send inputs as Multipart Form Data.
    
    # We are NOT uploading the file content to Kestra input (unless flow changed).
    # We are passing the PATH string (which agents use to find the file in the volume).
    
    payload = {
        'candidate_name': candidate_name,
        'pdf_path': pdf_path,
        'job_description': jd[:500],
        'github_reponame': 'mock/pending',
        'leetcode_username': 'mock_pending'
    }

    try:
        # Note: 'data' sets multipart form fields. 'files' sets file uploads.
        # We use 'data' for our string inputs.
        response = requests.post(url, data=payload, auth=auth, timeout=10)
        
        # DEBUGGING: If it fails, print the RAW text
        if response.status_code != 200:
            print(f"[FATAL] Kestra returned {response.status_code}")
            print(f"[FATAL] Response: {response.text}") 
            return None
        
        print(f"[SUCCESS] Workflow ID: {response.json()['id']}")
        return response.json()

    except Exception as e:
        print(f"[ERROR] Connection Failed: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: trigger_kestra.py <pdf_path> [jd]")
    else:
        p = sys.argv[1]
        j = sys.argv[2] if len(sys.argv) > 2 else "Standard"
        trigger_workflow(p, j)
