import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import axios from "axios";

// Kestra URL (Local Docker)
const KESTRA_API = "http://localhost:8080/api/v1/executions/ai.gitverified/gitverified-main-pipeline";
const KESTRA_AUTH = {
    username: process.env.KESTRA_USERNAME || "admin@gitverified.local",
    password: process.env.KESTRA_PASSWORD || "testpassword"
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const jd = formData.get("jd") as string || "Generic Engineer";
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. Save file to Shared Volume (Backend Agents Data)
    // Host Path: c:\Users\lenovo\RealEngineers.ai\gitverified-backend\agents\data\
    // We assume this API runs on the SAME HOST as the gitverified-backend folder.
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = file.name.replace(/\s+/g, "_"); // Sanitize
    
    // Construct Absolute Path to the Backend Agents Data folder
    // Navigate up from: web/app/api/trigger -> web -> root -> backend -> agents -> data
    const backendDataDir = path.resolve(process.cwd(), "..", "gitverified-backend", "agents", "data");
    
    if (!fs.existsSync(backendDataDir)) {
        console.log(`> [API] Creating missing data directory: ${backendDataDir}`);
        fs.mkdirSync(backendDataDir, { recursive: true });
    }
    
    const hostFilePath = path.join(backendDataDir, filename);
    await fs.promises.writeFile(hostFilePath, buffer);
    
    console.log(`> [API] Saved file to shared volume: ${hostFilePath}`);

    // 2. Trigger Kestra
    // Docker Path: /app/agents/data/${filename}
    const dockerFilePath = `/app/agents/data/${filename}`;
    
    const kestraPayload = {
        candidate_name: "Candidate_" + Date.now(),
        pdf_path: dockerFilePath,
        game_log: "1,2,3", // Mock algo data
        job_description: jd,
        github_reponame: "mock/repo", // Integrity agent will find the real one, this is initial input
        leetcode_username: "mock_user"
    };

    console.log("> [API] Triggering Kestra Flow...", kestraPayload);

    // Kestra API trigger
    // Need multipart/form-data for inputs if sending files, but we are sending inputs as JSON/FormData fields?
    // Kestra inputs: multipart/form-data with key 'inputs' as JSON string? Or just simple form fields.
    // For Trigger with Inputs, documentation says keys as form parts.
    
    const kestraForm = new FormData();
    // For each input, append to form
    Object.entries(kestraPayload).forEach(([key, value]) => {
        kestraForm.append(key, value);
    });

    // NOTE: Node's FormData might need specific headers if using 'axios' with 'form-data' lib,
    // but here we are using standard fetch or axios. 
    // Let's use fetch to be safe with FormData handling in Next.js environment
    
    // 2. TRIGGER KESTRA VIA API (Direct - No Python needed!)
    try {
        const authHeader = 'Basic ' + Buffer.from(`${KESTRA_AUTH.username}:${KESTRA_AUTH.password}`).toString('base64');
        
        const kestraRes = await fetch(KESTRA_API, {
            method: "POST",
            body: kestraForm,
            headers: { 
                'Authorization': authHeader
            }
        });

        if (!kestraRes.ok) {
            const errorText = await kestraRes.text();
            console.error(`> [API] Kestra API Error: ${kestraRes.status} - ${errorText}`);
            throw new Error(`Kestra API returned ${kestraRes.status}: ${errorText}`);
        }
        
        const executionData = await kestraRes.json();
        console.log(`> [API] Kestra execution started: ${executionData.id}`);
        
        return NextResponse.json({
            success: true,
            execution_id: executionData.id,
            filename: filename,
            link: `http://localhost:8080/ui/executions/ai.gitverified/gitverified-main-pipeline/${executionData.id}`
        });
    } catch (apiError: any) {
        console.error(`> [API] Kestra API call failed: ${apiError.message}`);
        // Fallback to Python script if API fails
        console.log(`> [API] Falling back to Python script...`);
    }

    // 3. FALLBACK: TRIGGER VIA PYTHON SCRIPT (if API fails)
    // Try python, python3, then py as fallback
    // Auth: admin:hackathon123 (Inside script)
    
    // Clean Inputs
    const cleanJd = jd.replace(/"/g, "'").substring(0, 500);
    const scriptPath = path.resolve(process.cwd(), "..", "gitverified-backend", "agents", "trigger_kestra.py");
    
    // Python Command - Try multiple Python commands
    // Usage: python trigger_kestra.py <pdf_path> <jd>
    const pythonCommands = ['python', 'python3', 'py'];
    const cmd = `${pythonCommands[0]} "${scriptPath}" "${dockerFilePath}" "${cleanJd}"`;

    const { exec } = require("child_process");
    
    // Try each Python command until one works
    const tryPythonCommand = (index: number): Promise<NextResponse> => {
        return new Promise((resolve) => {
            if (index >= pythonCommands.length) {
                resolve(NextResponse.json({ 
                    success: false, 
                    execution_id: `failed_no_python`, 
                    filename: filename, 
                    error: "Python not found. Tried: " + pythonCommands.join(", ")
                }));
                return;
            }
            
            const pythonCmd = pythonCommands[index];
            const tryCmd = `${pythonCmd} "${scriptPath}" "${dockerFilePath}" "${cleanJd}"`;
            
            console.log(`> [API] Trying Python command: ${pythonCmd}...`);
            exec(tryCmd, (error: any, stdout: string, stderr: string) => {
                const output = stdout.trim();
                console.log(`> [API] Python Output (${pythonCmd}): ${output}`);
                
                // If command not found, try next one
                if (error && (error.message?.includes('not recognized') || error.message?.includes('not found'))) {
                    console.log(`> [API] ${pythonCmd} not found, trying next...`);
                    resolve(tryPythonCommand(index + 1));
                    return;
                }
                
                if (output.includes("[FATAL]") || output.includes("[ERROR]") || (error && output.length === 0)) {
                    // If it's a command error, try next. Otherwise it's a script error.
                    if (error && (error.message?.includes('not recognized') || error.message?.includes('not found'))) {
                        resolve(tryPythonCommand(index + 1));
                    } else {
                        console.error(`> [API] Trigger Failed: ${stderr} ${output}`);
                        resolve(NextResponse.json({ 
                            success: true, 
                            execution_id: `failed_trigger`, 
                            filename: filename, 
                            error: output || stderr || "Unknown Python Error" 
                        }));
                    }
                } else if (output.includes("[SUCCESS] Workflow ID:")) {
                    const parts = output.split("Workflow ID: ");
                    const execId = parts.length > 1 ? parts[1].trim() : "unknown_id";
                    console.log(`> [API] Success ID: ${execId}`);
                    resolve(NextResponse.json({ 
                        success: true, 
                        execution_id: execId, 
                        filename: filename 
                    }));
                } else {
                    console.log(`> [API] Unexpected Output: ${output}`);
                    resolve(NextResponse.json({ 
                        success: true, 
                        execution_id: "failed_parse", 
                        filename: filename,
                        error: output
                    }));
                }
            });
        });
    };
    
    return tryPythonCommand(0);

  } catch (error) {
    console.error("Trigger Logic Failed:", error);
    return NextResponse.json({ error: "Failed to trigger pipeline" }, { status: 500 });
  }
}
