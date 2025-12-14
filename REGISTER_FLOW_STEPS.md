# Step-by-Step: Register GitVerified Pipeline in Kestra

## Option 1: Import via Kestra UI (EASIEST) ✅

1. **In Kestra UI**, click the **"Import"** button (top right, next to "Create")

2. **Select the flow file:**
   - Navigate to: `C:\Users\lenovo\RealEngineers.ai\gitverified-backend\flows\gitverified_pipeline.yaml`
   - Or copy the file path and paste it

3. **Click "Import"** - The flow will be registered automatically

4. **Verify:**
   - You should see `gitverified-main-pipeline` in the flows list
   - Namespace: `ai.gitverified`

---

## Option 2: Manual Copy-Paste

1. **Open the flow file:**
   - File: `gitverified-backend/flows/gitverified_pipeline.yaml`

2. **Copy ALL the content** (Ctrl+A, Ctrl+C)

3. **In Kestra UI:**
   - Click **"+ Create"** button
   - Select **"Flow"**
   - Paste the YAML content
   - Click **"Save"**

---

## Option 3: Via API (If you have Python)

Run this command:
```bash
cd gitverified-backend
python3 register_flow.py
```

Or if that doesn't work:
```bash
py register_flow.py
```

---

## After Registration:

1. **Find your flow:**
   - Search for: `gitverified-main-pipeline`
   - Or filter by namespace: `ai.gitverified`

2. **Test it:**
   - Click on the flow
   - Click "Execute" or "Play" button
   - Fill in the inputs:
     - `candidate_name`: Test Candidate
     - `pdf_path`: /app/agents/data/test.pdf
     - `github_reponame`: owner/repo
     - `leetcode_username`: test_user
     - `job_description`: Senior Developer

3. **Verify it runs:**
   - Check the execution logs
   - All agents should run in parallel
   - Kestra AI task should generate summary

---

## Quick Check:

After importing, you should see:
- **Flow ID:** `gitverified-main-pipeline`
- **Namespace:** `ai.gitverified`
- **Status:** Ready to execute

