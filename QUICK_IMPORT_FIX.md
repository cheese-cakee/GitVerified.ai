# Quick Fix: Import the Flow

## Try This First (Simplified Version):

1. **In Kestra UI**, click **"Import"**
2. **Select this file:** `gitverified-backend/flows/gitverified_pipeline_simple.yaml`
3. This version **removes the AI task** temporarily so it can import
4. Once imported, we can add the AI task back

---

## OR: Manual Creation (Guaranteed to Work)

1. Click **"+ Create"** → **"Flow"**
2. **Set these fields:**
   - **ID:** `gitverified-main-pipeline`
   - **Namespace:** `ai.gitverified`
3. **Copy the ENTIRE content** from `gitverified_pipeline_simple.yaml`
4. **Paste it** into the editor
5. **Click "Save"**

---

## After Import Works:

Once the basic flow is imported and working, we can add the Kestra AI task back. The AI task might need a different plugin or syntax.

**For now, the simplified version will:**
- ✅ Run all agents
- ✅ Calculate scores
- ✅ Generate summary (via Python script)
- ✅ Save final results

**The AI task can be added later** once we confirm the flow structure works.

---

## Why "Flows imported 0"?

Most likely the `io.kestra.plugin.ai.LLMSummarize` task syntax or plugin availability issue. The simplified version removes that to get you working first.

