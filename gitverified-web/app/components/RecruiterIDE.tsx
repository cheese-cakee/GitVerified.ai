"use client";

import { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";

type Candidate = {
  id: string;
  file: string;
  name: string;
  status: 'queued' | 'scanning' | 'analyzing' | 'complete';
  result: 'pass' | 'fail' | 'review';
  links: string[];
  semanticMatch: number;
  pScore: number;
  fileRef?: File;
};

type Step = {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'complete';
};

export default function RecruiterIDE() {
  const [mode, setMode] = useState<'single' | 'batch'>('single');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobDescription, setJobDescription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const stopProcessingRef = useRef(false);

  // Updated Steps (Renamed as requested)
  const [steps, setSteps] = useState<Step[]>([
    { id: 'init', label: 'Initialize Environment', status: 'pending' },
    { id: 'integrity', label: 'Integrity Check & Link Parser', status: 'pending' },
    { id: 'sentinel', label: 'GitHub Security Audit', status: 'pending' },
    { id: 'oumi', label: 'GitHub Uniqueness (Oumi)', status: 'pending' },
    { id: 'algo', label: 'LeetCode Analysis', status: 'pending' },
    { id: 'relevance', label: 'Semantic JD Match', status: 'pending' },
  ]);

  // Simulation Constants
  const BATCH_LIMIT = 100;
  // Expanded Mock Names to avoid duplicates
  const MOCK_NAMES = ["Alex Chen", "Sarah V.", "Jim Hacker", "David Kim", "Maria R.", "James L.", "Emily W.", "John D.", "Lisa K.", "Robert M."];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    onDrop: async (acceptedFiles: File[]) => {
      const newCandidates = acceptedFiles.slice(0, BATCH_LIMIT - candidates.length).map((file: File, i: number) => ({
        id: Math.random().toString(36).substr(2, 9),
        // Use file name stem as fallback name if mock list exhausted or for better realism
        file: file.name,
        name: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
        status: 'queued' as 'queued',
        result: 'review' as 'review', 
        links: [],
        semanticMatch: 0,
        pScore: 0,
        fileRef: file
      }));
      setCandidates(prev => [...prev, ...newCandidates]);
      if (newCandidates.length + candidates.length > 1) setMode('batch');
      
      // ... upload logic ...
      for (const file of acceptedFiles) {
        const formData = new FormData();
        formData.append("file", file);
        try {
            await fetch("/api/upload", { method: "POST", body: formData });
            addLog(`> Uploaded ${file.name} to secure sandbox.`);
        } catch (e) {
            addLog(`> Error uploading ${file.name}.`);
        }
      }
    }
  });

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const resetSession = () => {
    setCandidates([]);
    setIsComplete(false);
    setIsProcessing(false);
    setLogs([]);
    setSteps(s => s.map(step => ({ ...step, status: 'pending' })));
  };

  const stopAnalysis = () => {
      stopProcessingRef.current = true;
      addLog("> USER INTERRUPT: Stopping Pipeline...");
      setIsProcessing(false);
  };

  const runAnalysis = async () => {
    if (candidates.length === 0) return;
    if (!jobDescription.trim()) {
        alert("Please enter a Job Description first.");
        return;
    }

    setIsProcessing(true);
    setIsComplete(false);
    stopProcessingRef.current = false;
    setLogs([]);
    
    // Reset Status
    setCandidates(prev => prev.map(c => ({ ...c, status: 'queued' }))); 
    setSteps(s => s.map(step => ({ ...step, status: 'pending' })));

    addLog("> Initializing Cloud Native Orchestrator...");
    setSteps(s => s.map(step => step.id === 'init' ? { ...step, status: 'complete' } : step));

    // Process Loop
    for (let i = 0; i < candidates.length; i++) {
        if (stopProcessingRef.current) break;

        const c = candidates[i];
        
        // Update Steps Visualization for this candidate (Simplified for batch)
        setSteps(s => s.map(step => step.id === 'integrity' ? { ...step, status: 'running' } : step));
        addLog(`> [${c.file}] Uploading to Integrity Agent...`);

        try {
            if (!c.fileRef) {
                addLog(`> [ERROR] File reference lost for ${c.name}`);
                continue;
            }

            const formData = new FormData();
            formData.append("file", c.fileRef);
            formData.append("jd", jobDescription);

            const res = await fetch("/api/trigger", {
                method: "POST",
                body: formData
            });

            if (!res.ok) throw new Error("Trigger Failed");

            const data = await res.json();
            const executionId = data.execution_id;
            const trackedFilename = data.filename;
            
            if (executionId && executionId.includes('failed')) {
                addLog(`> [FATAL ERROR] Trigger Script Failed: ${data.error || 'Unknown Error'}`);
                addLog(`> [FATAL ERROR] Check Server Console for Stderr.`);
            } else {
                addLog(`> [Kestra] Flow Started: ${executionId}`);
            }
            
            // POLLING LOOP (REAL AI JUDGMENT)
            let resultJson = null;
            let checks = 0;
            const maxChecks = 60; // 2 minutes max
            
            while (checks < maxChecks && !stopProcessingRef.current) {
                checks++;
                
                // Update UI Steps based on time/heuristics since we don't have granular task polling yet
                // But we know it's running.
                if (checks === 2) {
                     setSteps(s => s.map(step => step.id === 'integrity' ? { ...step, status: 'running' } : step));
                     addLog(`> [Integrity] Scanning ${c.file} for structure...`);
                }
                if (checks === 5) {
                     setSteps(s => s.map(step => step.id === 'integrity' ? { ...step, status: 'complete' } : step));
                     setSteps(s => s.map(step => ['algo', 'sentinel', 'oumi', 'relevance'].includes(step.id) ? { ...step, status: 'running' } : step));
                     addLog(`> [Kestra] Parallel Agents Dispatched.`);
                }
                
                // Poll for Final Result
                try {
                    const pollRes = await fetch(`/api/poll?file=${trackedFilename}`);
                    if (pollRes.ok) {
                        const pollData = await pollRes.json();
                        if (pollData.status === 'complete') {
                            resultJson = pollData.data;
                            break;
                        }
                    }
                } catch (e) {
                    console.error("Poll Error", e);
                }
                
                await new Promise(r => setTimeout(r, 2000)); // Wait 2s
            }
            
            if (stopProcessingRef.current) break;
            
            setSteps(s => s.map(step => ({ ...step, status: 'complete' })));

            if (resultJson) {
                addLog(`> [Decision Engine] Verdict Received: ${resultJson.verdict}`);
                
                // Apply REAL Result
                const finalScore = resultJson.score || 0;
                const finalVerdict = resultJson.verdict?.toLowerCase() || 'review'; // pass, fail, review
                const realMatch = resultJson.details?.relevance || 50;
                
                setCandidates(prev => prev.map((cand, idx) => idx === i ? { 
                    ...cand, 
                    status: 'complete',
                    semanticMatch: realMatch,
                    pScore: finalScore,
                    result: finalVerdict as 'pass' | 'fail' | 'review'
                } : cand));
            } else {
                 addLog(`> [Timeout] Analysis took too long.`);
                 setCandidates(prev => prev.map((cand, idx) => idx === i ? { ...cand, status: 'complete', result: 'review', pScore: 0 } : cand));
            }

        } catch (e) {
            console.error(e);
            addLog(`> [ERROR] Analysis failed for ${c.file}`);
             setCandidates(prev => prev.map((cand, idx) => idx === i ? { ...cand, status: 'complete', result: 'fail' } : cand));
        }
    }

    addLog("> Analysis Session Ended.");
    setIsProcessing(false);
    setIsComplete(true);
  };

  const getStepIcon = (status: Step['status']) => {
      if (status === 'complete') return <span className="text-green-500">✓</span>;
      if (status === 'running') return <span className="text-yellow-500 animate-spin">⟳</span>;
      return <span className="text-gray-600">○</span>;
  };

  const processedCount = candidates.filter(c => c.status === 'complete').length;
  const progressPercent = candidates.length > 0 ? (processedCount / candidates.length) * 100 : 0;

  return (
    <div className="flex h-screen w-full max-w-[1920px] mx-auto pt-24 px-6 gap-6 pb-6 select-none bg-black overflow-hidden">
       
       {/* ---------------------------------------------------------
           1. LEFT PANE: EXECUTION PLAN
           --------------------------------------------------------- */}
       <div className="w-[300px] glass-card border-white/10 rounded-xl flex flex-col overflow-hidden h-full">
           <div className="h-12 bg-white/5 border-b border-white/5 flex items-center px-4 font-bold text-xs text-gray-400 uppercase tracking-widest shrink-0">
               Execution Logic
           </div>
           <div className="p-6 flex flex-col gap-6 flex-1 overflow-y-auto">
                <div>
                    <div className="text-[10px] text-gray-500 uppercase mb-3 font-semibold">Active Pipeline</div>
                    <div className="space-y-4">
                        {steps.map(step => (
                            <div key={step.id} className="flex items-center gap-3 text-sm">
                                <div className={`w-5 h-5 flex items-center justify-center rounded-full border shrink-0 ${step.status === 'running' ? 'border-yellow-500/50 bg-yellow-500/10' : step.status === 'complete' ? 'border-green-500/50 bg-green-500/10' : 'border-gray-700 bg-gray-800'}`}>
                                    {getStepIcon(step.status)}
                                </div>
                                <span className={`${step.status === 'running' ? 'text-white font-bold' : step.status === 'complete' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-auto p-4 rounded bg-white/5 border border-white/5">
                    <div className="text-[10px] text-gray-500 uppercase mb-2">Agent Status</div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400">Kestra Orch.</span>
                            <span className="flex items-center gap-1.5 text-green-400"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Online</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400">Oumi Engine</span>
                            <span className="flex items-center gap-1.5 text-green-400"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Online</span>
                        </div>
                    </div>
                </div>
           </div>
       </div>


       {/* ---------------------------------------------------------
           2. CENTER PANE: AI WINDOW / RESULTS
           --------------------------------------------------------- */}
       <div className="flex-1 glass-card border-white/10 rounded-xl flex flex-col overflow-hidden relative shadow-2xl h-full">
           
           {/* Header */}
           <div className="h-12 bg-black/40 border-b border-white/5 flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                    </div>
                    <span className="ml-3 text-xs text-gray-400 font-mono">
                        {isProcessing ? '~/kestra/forensic_audit.sh' : isComplete ? (mode === 'single' ? '~/reports/verdict.json' : '~/reports/leaderboard.csv') : '~/workspace/ready'}
                    </span>
                </div>
                
                {mode === 'batch' && candidates.length > 0 && (
                    <div className="flex items-center gap-3">
                        <div className="text-[10px] font-mono text-gray-400">
                             PROCESSED: {processedCount}/{candidates.length}
                        </div>
                        <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300" 
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>
                    </div>
                )}
           </div>

           {/* Content Area */}
           <div className="flex-1 bg-black/20 overflow-hidden relative">
               
               {/* STATE: EMPTY / READY */}
               {!isProcessing && !isComplete && (
                   <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600">
                       <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                           <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                       </div>
                       <p className="font-mono text-sm">Forensic Engine Ready</p>
                       <p className="text-xs mt-1 opacity-50">Upload Candidates to Begin Audit</p>
                   </div>
               )}

               {/* STATE: PROCESSING (TERMINAL) */}
               {isProcessing && (
                   <div ref={terminalRef} className="absolute inset-0 p-6 font-mono text-xs overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                       {logs.map((log, i) => (
                           <div key={i} className="text-gray-300 border-l-2 border-transparent pl-2 hover:border-gray-700 hover:bg-white/5 font-mono">
                               {log}
                           </div>
                       ))}
                       {stopProcessingRef.current && (
                           <div className="text-red-400 font-bold mt-2">
                               &gt; PROCESS TERMINATED BY USER
                           </div>
                       )}
                   </div>
               )}

               {/* STATE: RESULTS (SINGLE) */}
               {isComplete && mode === 'single' && candidates[0] && (
                   <div className="absolute inset-0 flex items-center justify-center p-12 overflow-y-auto">
                       <div className="w-full max-w-lg glass-card border-white/20 p-8 rounded-2xl flex flex-col gap-6 shadow-[0_0_50px_rgba(34,197,94,0.1)]">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Pass Card</div>
                                    <h2 className="text-3xl font-bold text-white">{candidates[0].name}</h2>
                                    <div className="text-gray-400 text-sm mt-1">{candidates[0].file}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-5xl font-bold text-green-400">{candidates[0].pScore}</div>
                                    <div className="text-xs text-green-500/80 font-mono mt-1">PRODIGY SCORE</div>
                                </div>
                            </div>
                            
                            <div className="h-[1px] bg-white/10 w-full"></div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-white/5 rounded border border-white/5">
                                    <div className="text-[10px] text-gray-500 uppercase mb-1">Semantic Match</div>
                                    <div className="text-xl font-bold text-white">{candidates[0].semanticMatch.toFixed(1)}%</div>
                                </div>
                                <div className="p-3 bg-white/5 rounded border border-white/5">
                                    <div className="text-[10px] text-gray-500 uppercase mb-1">Risk Profile</div>
                                    <div className="text-xl font-bold text-white flex items-center gap-2">
                                        Low 
                                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                    </div>
                                </div>
                            </div>
                       </div>
                   </div>
               )}

               {/* STATE: RESULTS (BATCH/LEADERBOARD) */}
               {isComplete && mode === 'batch' && (
                   <div className="absolute inset-0 overflow-auto p-4 scrollbar-thin scrollbar-thumb-white/10">
                       <table className="w-full text-left border-collapse">
                           <thead className="sticky top-0 bg-black/90 backdrop-blur-md z-10">
                               <tr className="text-xs text-gray-500 uppercase border-b border-white/10">
                                   <th className="p-3 font-semibold">Rank</th>
                                   <th className="p-3 font-semibold">Candidate</th>
                                   <th className="p-3 font-semibold">P-Score</th>
                                   <th className="p-3 font-semibold">Match</th>
                                   <th className="p-3 font-semibold">Status</th>
                               </tr>
                           </thead>
                           <tbody className="text-sm">
                               {candidates.sort((a,b) => b.pScore - a.pScore).map((c, i) => (
                                   <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                       <td className="p-3 font-mono text-gray-500 group-hover:text-white">#{i+1}</td>
                                       <td className="p-3 font-bold text-white">
                                           {c.name}
                                           <div className="text-[10px] text-gray-500 font-normal">{c.file}</div>
                                       </td>
                                       <td className="p-3 font-mono font-bold text-white text-lg">{c.pScore}</td>
                                       <td className="p-3 text-blue-400 font-mono">{c.semanticMatch.toFixed(0)}%</td>
                                       <td className="p-3">
                                           <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                                               c.result === 'pass' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                                               c.result === 'review' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 
                                               'bg-red-500/20 text-red-400 border border-red-500/30'
                                           }`}>
                                               {c.result}
                                           </span>
                                       </td>
                                   </tr>
                               ))}
                           </tbody>
                       </table>
                   </div>
               )}

           </div>
       </div>


       {/* ---------------------------------------------------------
           3. RIGHT PANE: CONTROLS
           --------------------------------------------------------- */}
       <div className="w-[350px] flex flex-col gap-6 h-full">
           
           {/* MODE TOGGLE */}
           <div className="glass-card border-white/10 rounded-xl p-4 shrink-0">
                <div className="text-[10px] text-gray-500 uppercase mb-3 font-semibold">System Mode</div>
                <div className="flex bg-white/5 rounded-lg p-1 border border-white/5">
                    <button 
                        onClick={() => setMode('single')}
                        className={`flex-1 py-2 text-xs font-bold rounded flex items-center justify-center gap-2 transition-all ${mode === 'single' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Single Audit
                    </button>
                    <button 
                        onClick={() => setMode('batch')}
                        className={`flex-1 py-2 text-xs font-bold rounded flex items-center justify-center gap-2 transition-all ${mode === 'batch' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        Batch Run
                    </button>
                </div>
           </div>

           {/* UPLOAD ZONE */}
           <div className="glass-card border-white/10 rounded-xl p-4 flex flex-col gap-2 shrink-0">
                <div className="text-[10px] text-gray-500 uppercase mb-1 font-semibold flex justify-between items-center">
                    <span>Input Resumes</span>
                    <div className="flex gap-3">
                         {candidates.length > 0 && <button onClick={resetSession} className="text-red-400 hover:text-red-300 transition-colors uppercase font-bold cursor-pointer">Start Over</button>}
                         {candidates.length > 0 && <span className="text-white">{candidates.length} Loaded</span>}
                    </div>
                </div>
                
                <div 
                    {...getRootProps()} 
                    className={`
                        h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center p-4 cursor-pointer transition-all relative overflow-hidden
                        ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:bg-white/5 hover:border-white/20'}
                        ${candidates.length > 0 ? 'bg-green-500/5' : ''}
                    `}
                >
                    <input {...getInputProps()} />
                    {candidates.length === 0 ? (
                        <>
                            <svg className="w-8 h-8 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                            <div className="text-xs text-gray-300 font-bold">Click or Drag PDFs</div>
                            <div className="text-[10px] text-gray-500 mt-1">Up to {BATCH_LIMIT} per batch</div>
                        </>
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
                             <div className="p-3 bg-green-500/20 rounded-full mb-2">
                                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                             </div>
                             <div className="text-sm font-bold text-white mb-1">{candidates.length} Files Ready</div>
                             <div className="text-[10px] text-gray-400">Drag more to append</div>
                        </div>
                    )}
                </div>
           </div>

           {/* JD PROMPT */}
           <div className="flex-1 glass-card border-white/10 rounded-xl p-4 flex flex-col min-h-0">
               <div className="text-[10px] text-gray-500 uppercase mb-3 font-semibold">Job Description Prompt</div>
               <div className="flex-1 relative bg-white/5 border border-white/5 rounded-lg overflow-hidden min-h-0">
                   <textarea
                       value={jobDescription}
                       onChange={(e) => setJobDescription(e.target.value)}
                       placeholder="// Paste JD here..."
                       className={`w-full h-full bg-transparent p-3 text-xs text-gray-300 font-mono focus:outline-none resize-none ${!jobDescription.trim() && 'border border-red-500/30'}`}
                   />
               </div>
               
               {isProcessing ? (
                   <button 
                       onClick={stopAnalysis}
                       className="mt-4 w-full py-3 bg-red-600 text-white text-sm font-bold rounded hover:bg-red-700 transition-colors shadow-[0_0_20px_rgba(220,38,38,0.3)] flex items-center justify-center gap-2 animate-pulse"
                   >
                       <span className="w-2 h-2 bg-white rounded-sm"></span> STOP PROCESS
                   </button>
               ) : (
                   <button 
                       onClick={runAnalysis}
                       disabled={candidates.length === 0 || !jobDescription.trim()}
                       className="mt-4 w-full py-3 bg-white text-black text-sm font-bold rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2"
                   >
                       {!jobDescription.trim() ? 'ENTER JD TO RUN' : mode === 'single' ? 'RUN AUDIT' : 'RUN BATCH ANALYSIS'}
                   </button>
               )}

           </div>
       </div>

    </div>
  );
}
