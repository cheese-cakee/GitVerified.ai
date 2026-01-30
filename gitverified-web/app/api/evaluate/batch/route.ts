import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    // Forward the multipart form data to the Python backend
    const formData = await request.formData();
    
    const response = await fetch(`${BACKEND_URL}/api/evaluate/batch`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Backend error' }));
      return NextResponse.json(error, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Batch evaluation error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to backend. Is the Python server running?' },
      { status: 503 }
    );
  }
}
