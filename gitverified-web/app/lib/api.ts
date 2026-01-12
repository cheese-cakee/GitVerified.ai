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

// In a real implementation, this would fetch from a database or storage bucket 
// where Kestra writes the 'result.json' files.
export async function getLeaderboardData(): Promise<Candidate[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return [
        { id: "c1", name: "Alex Builder", p_score: 98, truth: 100, passion: 95, code: 99, status: "INTERVIEW", flag: "Verified Open Source" },
        { id: "c2", name: "Sarah Systems", p_score: 94, truth: 100, passion: 98, code: 85, status: "INTERVIEW", flag: "Game Engine Dev" },
        { id: "c3", name: "Jordan Script", p_score: 72, truth: 80, passion: 60, code: 75, status: "INTERVIEW", flag: "Standard" },
        { id: "c4", name: "Fake Frank", p_score: 12, truth: 0, passion: 10, code: 25, status: "REJECT", flag: "White Text Detected" },
        { id: "c5", name: "Keyword Karl", p_score: 35, truth: 40, passion: 20, code: 45, status: "REJECT", flag: "Low Proof-of-Work" },
        { id: "c6", name: "Prompt Patty", p_score: 15, truth: 20, passion: 10, code: 0, status: "REJECT", flag: "No Coding Ability" },
        { id: "c7", name: "Llama Learner", p_score: 88, truth: 100, passion: 90, code: 70, status: "INTERVIEW", flag: "Self Taught" },
    ];
}
