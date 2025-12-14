"use client";

import { useState, useEffect, useRef } from "react";
import CheckItem from "./CheckItem";
import Leaderboard from "./Leaderboard";

type Step = {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'pass' | 'failed';
  logs: string[];
};

export default function MainEngine() {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [mode, setMode] = useState<'single' | 'batch'>('single');
  const [uploadedFiles, setUploadedFiles] = useState<number>(0);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const [steps, setSteps] = useState<Step[]>([
    { id: 'kestra_init', label: 'Booting Kestra Orchestrator...', status: 'pending', logs: [] },
    { id: 'leetcode_scan', label: 'Algo Velocity Check (LeetCode)', status: 'pending', logs: [] },
    { id: 'github_audit', label: 'CodeRabbit Security Audit', status: 'pending', logs: [] },
    { id: 'oumi_analysis', label: 'Oumi Semantic Uniqueness', status: 'pending', logs: [] },
    { id: 'score', label: 'Calculating P-Score', status: 'pending', logs: [] },
  ]);

  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [batchProgress, setBatchProgress] = useState(0);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [consoleOutput]);

  const handleSimulatedUpload = (count: number) => {
      setUploadedFiles(count);
      setMode(count > 1 ? 'batch' : 'single');
      setConsoleOutput([]);
      setIsComplete(false);
      setIsEvaluating(false);
      
      // Reset steps
      setSteps(s => s.map(step => ({ ...step, status: 'pending' })));
  };

  const runAnalysis = () => {
    setIsEvaluating(true);
    setIsComplete(false);
    setConsoleOutput([`> Initializing GitVerified Engine v2.1 (${mode.toUpperCase()} MODE)...`]);
    
    if (mode === 'single') {
        runSingleAnalysis();
    } else {
        runBatchAnalysis();
    }
  };

  const runSingleAnalysis = () => {
    let currentStep = 0;
    const processStep = () => {
      if (currentStep >= steps.length) {
        setIsEvaluating(false);
        setIsComplete(true);
        setConsoleOutput(prev => [...prev, "> Analysis Complete."]);
        return;
      }

      setSteps(prev => prev.map((s, i) => i === currentStep ? { ...s, status: 'running' } : s));
      setConsoleOutput(prev => [...prev, `> Starting ${steps[currentStep].label}...`]);

      setTimeout(() => {
         setConsoleOutput(prev => [...prev, `  [${steps[currentStep].id}] Fetching data...`, `  [${steps[currentStep].id}] Analyzing patterns...`]);
         setTimeout(() => {
            setSteps(prev => prev.map((s, i) => i === currentStep ? { ...s, status: 'pass' } : s));
            currentStep++;
            processStep();
         }, 1000); 
      }, 500);
    };
    processStep();
  }

  const runBatchAnalysis = () => {
      setBatchProgress(0);
      const total = uploadedFiles;
      let processed = 0;
      
      const interval = setInterval(() => {
          processed += 1;
          const pct = Math.round((processed / total) * 100);
          setBatchProgress(pct);
          setConsoleOutput(prev => [...prev, `> Processed candidate #${processed}/${total}... OK`]);
          
          if (processed >= total) {
              clearInterval(interval);
              setIsEvaluating(false);
              setIsComplete(true);
              setConsoleOutput(prev => [...prev, "> Batch Analysis Complete. Generaing Leaderboard..."]);
          }
      }, 800);
  }

  return (
    <section className="w-full h-screen bg-black flex flex-col pt-20">
       <div className="flex-1 max-w-[1600px] w-full mx-auto p-6 flex gap-6">
          
          {/* LEFT: Checks Panel (Visible in Single Mode or as simplified status in Batch) */}
          <div className="w-80 flex flex-col gap-4">
             <div className="glass-card rounded-xl p-4 flex-1 flex flex-col border-white/10">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${isEvaluating ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                   {mode === 'single' ? 'Execution Plan' : 'Batch Processor'}
                </div>
                
                {mode === 'single' ? (
                    <div className="space-y-1">
                        {steps.map(step => (
                            <CheckItem key={step.id} status={step.status} label={step.label} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center flex-1 space-y-4">
                         <div className="text-4xl font-bold text-white">{batchProgress}%</div>
                         <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                             <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${batchProgress}%` }}></div>
                         </div>
                         <p className="text-xs text-gray-400 text-center">Orchestrating Kestra Parallel Workers...</p>
                    </div>
                )}
             </div>
             
             <div className="glass-card rounded-xl p-4 h-48 border-white/10">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">System Resources</div>
                <div className="space-y-3 pt-2">
                   <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1"><span>CPU (Kestra Worker)</span><span>{isEvaluating ? '89%' : '12%'}</span></div>
                      <div className="w-full bg-gray-800 h-1 rounded-full"><div className={`bg-blue-500 h-full rounded-full transition-all duration-500`} style={{ width: isEvaluating ? '89%' : '12%'}}></div></div>
                   </div>
                   <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Memory</span><span>{isEvaluating ? '64%' : '25%'}</span></div>
                      <div className="w-full bg-gray-800 h-1 rounded-full"><div className={`bg-purple-500 h-full rounded-full transition-all duration-500`} style={{ width: isEvaluating ? '64%' : '25%'}}></div></div>
                   </div>
                </div>
             </div>
          </div>

          {/* CENTRE: Output / Thinking / Result */}
          <div className="flex-1 glass-card rounded-xl border-white/10 flex flex-col overflow-hidden relative">
              
              {/* Conditional Render: Leaderboard vs Log Viewer */}
              {isComplete && mode === 'batch' ? (
                  <Leaderboard />
              ) : (
                <>
                    {/* Header */}
                    <div className="h-12 border-b border-white/5 flex items-center px-4 bg-white/5 justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span className="text-gray-600">~/analysis/</span>
                            <span className="text-white">{mode === 'batch' ? 'batch_report.csv' : 'candidate_report.json'}</span>
                        </div>
                        {isEvaluating && <span className="text-xs text-yellow-500 animate-pulse">● Processing {mode === 'batch' ? 'Queue' : 'Item'}...</span>}
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-black/40 p-6 font-mono text-sm overflow-y-auto custom-scrollbar">
                        {!isEvaluating && !isComplete && (
                            <div className="h-full flex flex-col items-center justify-center text-gray-600">
                                <p>Ready to analyze. Upload resumes to begin.</p>
                                <p className="text-xs mt-2 opacity-50">Mode: {uploadedFiles > 0 ? (mode === 'single' ? 'Single Candidate' : 'Batch Processing') : 'Waiting for Input'}</p>
                            </div>
                        )}

                        {(isEvaluating || (isComplete && mode === 'single')) && (
                            <div className="space-y-1">
                                {consoleOutput.map((log, i) => (
                                    <div key={i} className={`${log.startsWith('>') ? 'text-gray-400' : 'text-gray-600 pl-4'}`}>
                                        {log}
                                    </div>
                                ))}
                                
                                {isComplete && mode === 'single' && (
                                    <div className="mt-8 p-6 rounded-lg border border-green-500/20 bg-green-900/10 animate-fade-in-up">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-full bg-green-500 text-black flex items-center justify-center font-bold text-xl">98</div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">Top 1% Engineer</h3>
                                                <p className="text-green-400 text-sm">Verdict: Hire Immediately</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={logsEndRef}></div>
                            </div>
                        )}
                    </div>
                </>
              )}
          </div>

          {/* RIGHT: Input */}
          <div className="w-80 glass-card rounded-xl p-6 border-white/10 flex flex-col gap-6">
               <div>
                   <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Target Repository</h3>
                   
                   <div className="space-y-3">
                       <input 
                          type="text" 
                          placeholder="https://github.com/username/repo" 
                          className="w-full bg-white/5 border border-white/10 rounded p-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                       />
                       <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="LeetCode Username" 
                            className="flex-1 bg-white/5 border border-white/10 rounded p-3 text-sm text-white focus:outline-none focus:border-yellow-500 transition-colors"
                          />
                       </div>
                   </div>

                   </div>

               <div>
                 <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Config</h3>
                 <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                       <div className="w-4 h-4 rounded border border-white/20 flex items-center justify-center group-hover:border-white/40">
                          <div className="w-2 h-2 bg-blue-500 rounded-sm"></div>
                       </div>
                       <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Include Private Repos</span>
                    </label>
                 </div>
               </div>
               
               <button 
                  onClick={runAnalysis}
                  disabled={isEvaluating || uploadedFiles === 0}
                  className="mt-auto w-full py-3 bg-white text-black text-sm font-bold rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  {isEvaluating ? 'Analyzing...' : 'Run Analysis'}
               </button>
          </div>

       </div>
    </section>
  );
}
