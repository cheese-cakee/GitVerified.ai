export interface Candidate {
    id: string;
    name: string;
    p_score: number;
    truth: number;
    passion: number;
    code: number;
    status: "INTERVIEW" | "REJECT" | "WAITLIST";
    flag: string;
}

export interface EvaluationResult {
    status?: string;
    candidate: {
        resume_path: string;
        job_description: string;
        github_url?: string;
    };
    agents: {
        integrity?: { score: number; reasoning?: string; flags?: string[] };
        code_quality?: { score: number; verdict?: string; flags?: string[] };
        uniqueness?: { score: number; reasoning?: string };
        relevance?: { score: number; reasoning?: string };
    };
    final: {
        overall_score: number;
        recommendation: 'PASS' | 'WAITLIST' | 'REJECT';
        reasoning: string;
        score_breakdown: {
            integrity: number;
            code_quality: number;
            uniqueness: number;
            relevance: number;
        };
    };
}

export interface SystemStatus {
    backend: boolean;
    ollama: boolean;
    kestra: boolean;
    models: string[];
    ready: boolean;
}

/**
 * Check system status (backend, Ollama, Kestra)
 */
export async function getSystemStatus(): Promise<SystemStatus> {
    try {
        const res = await fetch('/api/status');
        if (res.ok) {
            return await res.json();
        }
    } catch (error) {
        console.error('Status check failed:', error);
    }
    return { backend: false, ollama: false, kestra: false, models: [], ready: false };
}

/**
 * Evaluate a candidate resume
 */
export async function evaluateCandidate(
    resumeFile: File,
    jobDescription: string,
    githubUrl?: string
): Promise<EvaluationResult> {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('job_description', jobDescription);
    if (githubUrl) {
        formData.append('github_url', githubUrl);
    }

    const res = await fetch('/api/evaluate', {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Evaluation failed');
    }

    return await res.json();
}

/**
 * Get leaderboard data (for batch mode)
 */
export async function getLeaderboardData(): Promise<Candidate[]> {
    // For batch processing, this would fetch from stored results
    // Currently returns sample data for UI demonstration
    return [
        { id: "c1", name: "Alex Builder", p_score: 98, truth: 100, passion: 95, code: 99, status: "INTERVIEW", flag: "Verified Open Source" },
        { id: "c2", name: "Sarah Systems", p_score: 94, truth: 100, passion: 98, code: 85, status: "INTERVIEW", flag: "Game Engine Dev" },
        { id: "c3", name: "Jordan Script", p_score: 72, truth: 80, passion: 60, code: 75, status: "INTERVIEW", flag: "Standard" },
        { id: "c4", name: "Pending Paul", p_score: 55, truth: 60, passion: 50, code: 55, status: "WAITLIST", flag: "Needs Review" },
        { id: "c5", name: "Keyword Karl", p_score: 35, truth: 40, passion: 20, code: 45, status: "REJECT", flag: "Low Proof-of-Work" },
    ];
}
