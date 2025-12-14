import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // In a real scenario, we would validate the Greenhouse signature here.
    const { candidate_name, github_url } = body;

    console.log(`[*] Webhook received for: ${candidate_name} (${github_url})`);
    
    // Trigger Kestra Flow
    // URL would be the Kestra Container URL in production
    const KESTRA_API = "http://localhost:8080/api/v1/executions/audit_candidate";
    
    // Mocking the call for the Hackathon demo if Kestra isn't running
    // await fetch(KESTRA_API, { method: 'POST', body: ... })

    return NextResponse.json({ 
      status: 'success', 
      message: 'Forensic Audit Triggered',
      execution_id: 'exec_' + Math.random().toString(36).substr(2, 9)
    });

  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'Invalid payload' }, { status: 400 });
  }
}
