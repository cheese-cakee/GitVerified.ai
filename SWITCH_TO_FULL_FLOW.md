# Switch to Full Flow (With Kestra AI Task)

## ✅ YES - You Need the Full Flow for Demo!

The **simple flow** works, but for the **Wakanda Data Award**, you need to show the **Kestra AI Task**.

## Quick Steps:

### Option 1: Replace in Kestra UI (Easiest)

1. **In Kestra UI**, find your flow: `gitverified-main-pipeline`
2. **Click on it** to edit
3. **Delete all content**
4. **Open:** `gitverified-backend/flows/gitverified_pipeline.yaml`
5. **Copy ALL content** (Ctrl+A, Ctrl+C)
6. **Paste into Kestra editor** (Ctrl+V)
7. **Click "Save"**

Done! ✅

---

### Option 2: Delete and Re-import

1. **In Kestra UI**, find `gitverified-main-pipeline`
2. **Delete it** (three dots menu → Delete)
3. **Click "Import"**
4. **Select:** `gitverified-backend/flows/gitverified_pipeline.yaml`
5. **Import**

---

## What's Different?

**Simple Flow:**
- ✅ All agents run
- ✅ Calculates scores
- ❌ No Kestra AI Task (missing for prize)

**Full Flow:**
- ✅ All agents run
- ✅ Calculates scores
- ✅ **Kestra AI Task** (line 139-151) - **REQUIRED FOR PRIZE**

---

## After Switching:

The trigger is now fixed to use Kestra API directly (no Python needed), so it should work immediately!

**Test it:**
1. Upload a resume
2. It should trigger via API
3. Check Kestra UI for execution
4. You should see the `kestra-ai-decision` task run

---

**The full flow is ready - just switch it in Kestra UI!** 🚀

