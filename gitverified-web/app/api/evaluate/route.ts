import { NextRequest, NextResponse } from 'next/server';

// Local backend URL - Python API server
const BACKEND_URL = 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const resumeFile = formData.get('resume') as File | null;
    const jobDescription = formData.get('job_description') as string;
    const githubUrl = formData.get('github_url') as string;
    const leetcodeUsername = formData.get('leetcode_username') as string;

    if (!resumeFile) {
      return NextResponse.json(
        { error: 'Resume file required' },
        { status: 400 }
      );
    }

    // Forward to local Python backend
    const backendFormData = new FormData();
    backendFormData.append('resume', resumeFile);
    backendFormData.append('job_description', jobDescription || '');
    backendFormData.append('github_url', githubUrl || '');
    backendFormData.append('leetcode_username', leetcodeUsername || '');

    const response = await fetch(`${BACKEND_URL}/api/evaluate`, {
      method: 'POST',
      body: backendFormData,
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error) {
    console.error('Evaluation error:', error);
    return NextResponse.json(
      { 
        error: 'Backend not available', 
        message: 'Make sure Python backend is running: python api_server.py',
        details: String(error)
      },
      { status: 503 }
    );
  }
}
